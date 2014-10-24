'use strict';

define(['d3', 'topojson', 'utils/utils'], function(d3, topojson, utils) {

  var zoom = {};

  zoom.init = function(aView) {

    var map     = {};
    var options = {};
    var mapDataLink;
    var zoomParameters;
    map.view        = aView;
    map.graphElem   = map.view.querySelector('.code-zoom-map');
    map.wrapperElem = map.view.querySelector('.code-zoom-wrapper');
    map.onEvent     = onEvent;
    mapDataLink     = "/js/components/code/maps/japan.topo.json";
    garhammar.registerListener('resize', 'code/maps/zoom');

    d3.json(mapDataLink, function(error, mapData) {
      if (error) {
        console.error(error);
        return;
      }

      var innerWidth = map.graphElem.parentNode.offsetWidth;
      var innerHeight = innerWidth * 0.9;

      var d3chart = d3.select(map.graphElem)
        .attr('width', innerWidth)
        .attr('height', innerHeight);

      var d3container = d3chart
        .append('g')
        .attr('class', 'map zoom-container')
        .attr('width', innerWidth)
        .attr('height', innerHeight);

      d3container
        .append('circle')
        .attr('class', 'background')
        .attr('cx', 1 * (innerWidth / 2))
        .attr('cy', 1 * (innerHeight / 2))
        .attr('r', .95 * (innerHeight / 2));

      var zoomContainer = d3container.node();

      var projection = d3.geo.mercator()
        .scale(1)
        .translate([0, 0]);

      var path = d3.geo.path()
          .projection(projection);

      var subunits = topojson.feature(mapData, mapData.objects.japan);

      function getZoomParameters(paths) {

        var bounds;
        var scale;
        var translate;
        
        var top     = Number.MAX_VALUE;
        var bottom  = -Number.MAX_VALUE;
        var left    = Number.MAX_VALUE;
        var right   = -Number.MAX_VALUE;
        var i       = 0;
        var len     = paths.length;

        for (; i < len; i++) {
          bounds = paths[i].getBBox();

          if (bounds.y < top) {
            top = bounds.y;
          }
          if ((bounds.y + bounds.height) > bottom) {
            
            bottom = (bounds.y + bounds.height);
          }
          if (bounds.x < left) {
            left = bounds.x;
          }
          if ((bounds.x + bounds.width) > right) {
            right = (bounds.x + bounds.width);
          }
        }

        scale = .95 / Math.max((right - left) / innerWidth, (bottom - top) / innerHeight);
        translate = [(innerWidth - scale * (right + left)) / 2, (innerHeight - scale * (top + bottom)) / 2];

        return { translate: translate, scale: scale };
        
      }

      var d3Boundry = d3container
        .append("path")
        .datum(topojson.mesh(mapData, mapData.objects.japan, function(a, b) { return a === b }))
        .attr("d", path)
        .attr("class", "water-boundry");

      var boundry = d3Boundry.node();

      var areas = d3container
        .selectAll('g')
        .data(subunits.features)
        .enter();

      areas
        .append("path")
        .attr("d", path)
        .attr("class", function(d) {
          return "japan-area unit-" + d.properties.name;
        })
        .on("click", function(d) {
          var self = this;
          var isZoomed = this.classList.contains('is-zoomed');
          utils.each(map.graphElem.querySelectorAll('.is-zoomed'), function(elem) {
              elem.classList.remove('is-zoomed');
          });
          if (isZoomed) {
            setZoom(zoomContainer, 'translate(0, 0) scale(1)');
            setTimeout(function() {
              map.graphElem.classList.remove('is-zoomed');
              zoomContainer.style.strokeWidth = '1px';
            }, 300);
            return;
          }
          map.graphElem.classList.add('is-zoomed');
          this.classList.add('is-zoomed');
          zoomParameters = getZoomParameters([this]);
          setZoom(zoomContainer, 'translate(' + zoomParameters.translate[0] + 'px,' + zoomParameters.translate[1] + 'px) scale(' + zoomParameters.scale + ')');
          zoomContainer.style.strokeWidth = (1 / zoomParameters.scale) + 'px';
        });


      zoomParameters = getZoomParameters([map.graphElem.querySelector('.unit-Kagoshima'), map.graphElem.querySelector('.unit-Hokkaido')]);
      projection.scale(zoomParameters.scale)
        .translate(zoomParameters.translate);

      d3container
        .selectAll('path')
        .attr("d", path);

      var tokyoCoordinates = convertCoordinates(35.654980, 139.718354);
      var tokyoProjection = projection(tokyoCoordinates);
      var osakaCoordinates = convertCoordinates(34.685084, 135.510590);
      var osakaProjection = projection(osakaCoordinates);
      var sapporoCoordinates = convertCoordinates(43.050750, 141.377289);
      var sapporoProjection = projection(sapporoCoordinates);


      var cities = d3container.append('g').attr('class', 'cities');      


      appendTokyo(cities, tokyoProjection);
      appendOsaka(cities, osakaProjection);
      appendSapporo(cities, sapporoProjection);

    });

    return map;
  };

  function setZoom(zoomContainer, value) {
    zoomContainer.style.webkitTransform = value;
    zoomContainer.style.mozTransform = value;
    zoomContainer.style.msTransform = value;
    zoomContainer.style.oTransform = value;
    zoomContainer.style.transform = value;
  }

  function appendSapporo(wrapper, sapporoProjection) {

      var sapporo = wrapper.append('g').attr('class', 'sapporo');

      sapporo
        .append('circle')
        .attr('class', 'city')
        .attr('cx', sapporoProjection[0])
        .attr('cy', sapporoProjection[1])
        .attr('r', '3');

      var lineXEnd = sapporoProjection[0];
      var lineYEnd = sapporoProjection[1] + 2;

      var lineXStart = sapporoProjection[0];
      var lineYStart = sapporoProjection[1] + 15;
      var lineTextStart = sapporoProjection[0] - 120;

      sapporo
        .append('line')
        .attr('x1', lineXStart)
        .attr('x2', lineXEnd)
        .attr('y1', lineYStart)
        .attr('y2', lineYEnd)
        .attr('class', 'line');

      sapporo
        .append('line')
        .attr('x1', lineTextStart)
        .attr('x2', lineXStart)
        .attr('y1', lineYStart)
        .attr('y2', lineYStart)
        .attr('class', 'line');

      sapporo
        .append('text')
        .attr('x', lineTextStart)
        .attr('y', lineYStart - 7)
        .text('Sapporo');
  }



  function appendOsaka(wrapper, osakaProjection) {

      var osaka = wrapper.append('g').attr('class', 'osaka');

      osaka
        .append('circle')
        .attr('class', 'city')
        .attr('cx', osakaProjection[0])
        .attr('cy', osakaProjection[1])
        .attr('r', '3');

      var lineXEnd = osakaProjection[0];
      var lineYEnd = osakaProjection[1] - 2;

      var lineXStart = osakaProjection[0];
      var lineYStart = osakaProjection[1] - 40;
      var lineTextStart = osakaProjection[0] - 120;

      osaka
        .append('line')
        .attr('x1', lineXStart)
        .attr('x2', lineXEnd)
        .attr('y1', lineYStart)
        .attr('y2', lineYEnd)
        .attr('class', 'line');

      osaka
        .append('line')
        .attr('x1', lineTextStart)
        .attr('x2', lineXStart)
        .attr('y1', lineYStart)
        .attr('y2', lineYStart)
        .attr('class', 'line');

      osaka
        .append('text')
        .attr('x', lineTextStart)
        .attr('y', lineYStart - 7)
        .text('Osaka');
  }

  function appendTokyo(wrapper, tokyoProjection) {

      var tokyo = wrapper.append('g').attr('class', 'tokyo');

      tokyo
        .append('circle')
        .attr('class', 'city')
        .attr('cx', tokyoProjection[0])
        .attr('cy', tokyoProjection[1])
        .attr('r', '3');

      var lineXEnd = tokyoProjection[0];
      var lineYEnd = tokyoProjection[1] - 2;

      var lineXStart = tokyoProjection[0];
      var lineYStart = tokyoProjection[1] - 70;
      var lineTextStart = tokyoProjection[0] - 140;

      tokyo
        .append('line')
        .attr('x1', lineXStart)
        .attr('x2', lineXEnd)
        .attr('y1', lineYStart)
        .attr('y2', lineYEnd)
        .attr('class', 'line');

      tokyo
        .append('line')
        .attr('x1', lineTextStart)
        .attr('x2', lineXStart)
        .attr('y1', lineYStart)
        .attr('y2', lineYStart)
        .attr('class', 'line');

      tokyo
        .append('text')
        .attr('x', lineTextStart)
        .attr('y', lineYStart - 5)
        .text('Tokyo');
  }

  function convertCoordinates(y, x) {
    return [x, y];
  }

  function onEvent(eventName) {
    var self = this;
  }

  return zoom;
});