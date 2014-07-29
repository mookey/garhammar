'use strict';

define(['d3', 'topojson', 'utils/utils', 'components/code/maps/maps_base'], function(d3, topojson, utils, base) {

  var route = base.route;

  route.data.points = {
    positions : [
      {
        coordinates : [59.312009, 18.147598],
        markerType  : route.path.markers.type.REGULAR,
        line        : route.path.line.CURVE,
        tooltip     : 'Stockholm, the start of our journey.',
        animeTime   : 2000
      },
      {
        coordinates : [40.413425, -3.703848],
        markerType  : route.path.markers.type.REGULAR,
        line        : route.path.line.STRAIGHT,
        tooltip     : 'Madrid, next stop Valencia.',
        tooltipPos  : 'left',
        animeTime   : 300
      },
      {
        coordinates : [39.891979, -3.044744],
        markerType  : route.path.markers.type.NONE,
        line        : route.path.line.STRAIGHT,
        animeTime   : 400
      },
      {
        coordinates : [39.862470, -2.358099],
        markerType  : route.path.markers.type.NONE,
        line        : route.path.line.STRAIGHT,
        animeTime   : 300
      },
      {
        coordinates : [39.375864, -2.154852],
        markerType  : route.path.markers.type.NONE,
        line        : route.path.line.STRAIGHT,
        animeTime   : 300
      },
      {
        coordinates : [39.651323, -1.193548],
        markerType  : route.path.markers.type.NONE,
        line        : route.path.line.STRAIGHT,
        animeTime   : 300
      },
      {
        coordinates : [39.465722, -0.380909],
        markerType  : route.path.markers.type.REGULAR,
        line        : route.path.line.CURVE,
        animeTime   : 1000
      },
      {
        coordinates : [41.880868, 12.474100],
        markerType  : route.path.markers.type.PULSE,
        line        : route.path.line.STRAIGHT,
        tooltip     : 'Last stop. Welcome to Rome. ',
        animeTime   : 1000
      }
    ]
  };


  route.init = function(aView) {
    var setup;
    var mapDataLink;
    var map     = Object.create(new base.Base());
    var options = {
      margins : {
          top      : 0,
          right    : 0,
          bottom   : 0,
          left     : 0
      },
      projection  : {
        rotate    : [-18, -53, 10]
      },
      minWidth : 286,
      maxWidth : 1000
    };
    map.view        = aView;
    map.graphElem   = map.view.querySelector('.code-route-map');
    map.wrapperElem = map.view.querySelector('.code-route-wrapper');
    map.tooltipElem = map.view.querySelector('.abs-tooltip');
    setup           = map.createMap(map.graphElem, options);
    map.container   = setup.container;
    map.projection  = setup.projection;
    map.path        = setup.path;
    map.options     = options;
    map.onEvent     = onEvent;
    map.renderPath  = renderPath;
    map.reset       = reset;
    map.renderCountries           = renderCountries;
    map.updateProjection          = updateProjection;
    map.addMarkerTooltipListener  = addMarkerTooltipListener;
    map.updateMapWidth            = updateMapWidth;
    mapDataLink     = "/js/europe.topojson.json";
    garhammar.registerListener('resize', 'code/maps/route');

    d3.json(mapDataLink, function(error, topojson) {
      if (error) {
        console.error(error);
        return;
      }
      map.renderCountries(topojson);
      map.renderPath(route.data.points);
      map.data = topojson;
    });

    return map;
  }


  function onEvent(eventName) {
    var self = this;
    clearTimeout(self.paintTimer);
    self.updateMapWidth();
    self.reset();
    self.paintTimer = setTimeout(function() {
      self.renderCountries(self.data);
      self.renderPath(route.data.points);
    }, 300);
  }


  function reset() {
    var self = this;
    var d3graph = d3.select(self.graphElem);
    d3graph.selectAll('circle').remove();
    d3graph.selectAll('.route').remove();
    d3graph.select('g.units').remove();
    utils.each(self.view.querySelectorAll('.code-route-tooltip-marker'), function(elem) {
      if (elem.classList.contains('clone')) {
        return;
      }
      self.wrapperElem.removeChild(elem)
    });   
  }


  function renderPath(routeData) {

    var self  = this;
    var i     = 0;

    var prevPoint;
    var currentPoint;
    var nextPoint;
    var path;
    var pathElem;
    var shadow;
    var shadowElem;

    function step(delay) {
      self.paintTimer = setTimeout(
        function() {

          prevPoint     = routeData.positions[i - 1];
          currentPoint  = routeData.positions[i];
          nextPoint     = routeData.positions[i + 1];
          shadowElem    = undefined;
          i++;
          self.addMarker(currentPoint);
          if (currentPoint.tooltip) {
            self.addMarkerTooltipListener(currentPoint);
          }
          if (!nextPoint) {
            return;
          }
          if (currentPoint.line === route.path.line.STRAIGHT) {
            path = self.getStraightPath(currentPoint, nextPoint);
          }
          if (currentPoint.line === route.path.line.CURVE) {
            path = self.getCurvedPath(currentPoint, nextPoint);
            shadow = self.getCurvedPath(currentPoint, nextPoint, .2);
            shadowElem = self.container.append('svg:path')
              .attr('d', shadow)
              .attr('class', 'route shadow')
              .attr("filter", "url(#blur)");
          }
          
          pathElem = self.container.append('svg:path')
            .attr('d', path)
            .attr('class', 'route');

          if (currentPoint.animeTime) {
            if (shadowElem) {
              self.animate(shadowElem, currentPoint.animeTime);
            }
            self.animate(pathElem, currentPoint.animeTime);
            delay = currentPoint.animeTime;
          } else {
            delay = 0;
          }
          step(delay);
        }, delay);
    }
    step(0);

  };

  function addMarkerTooltipListener(currentPoint) {
    var self = this;
    var markerTooltipWrapper;
    var markerTooltip;
    var markerTooltipOffsetX = 16;
    var markerTooltipOffsetY = -17;
    var coordinates;
    markerTooltipWrapper  = self.wrapperElem.querySelector('.clone.code-route-tooltip-marker').cloneNode(true);
    coordinates           = self.convertCoordinates(currentPoint);
    markerTooltip         = markerTooltipWrapper.querySelector('.question');
    if (currentPoint.tooltipPos === 'left') {
      markerTooltip.classList.add('left')
      markerTooltip.style.left = coordinates[0] - (3 * markerTooltipOffsetX) + 'px';
    } else {
      markerTooltip.style.left = coordinates[0] + markerTooltipOffsetX + 'px';
    }
    markerTooltip.style.top = coordinates[1] + markerTooltipOffsetY + 'px';
    markerTooltipWrapper.classList.remove('clone');
    markerTooltipWrapper.classList.remove('hide');
    self.wrapperElem.appendChild(markerTooltipWrapper);
    markerTooltip.addEventListener('click', function(ev) {
      var tooltip;
      ev.preventDefault();
      this.classList.add('hide');
      tooltip = markerTooltipWrapper.querySelector('.abs-tooltip');
      tooltip.querySelector('.tooltip-message').innerHTML = currentPoint.tooltip;
      tooltip.style.bottom = (self.graphElem.offsetHeight - coordinates[1]) + 'px';
      tooltip.style.left = (coordinates[0] - 110) + 'px';
      tooltip.classList.remove('hide');
      tooltip.addEventListener('click', function(ev) {
        ev.preventDefault();
        this.classList.add('hide');
        markerTooltip.classList.remove('hide');
      });           
    });
  }



  function renderCountries(mapData) {
    var self = this;
    var subunits = topojson.feature(mapData, mapData.objects.collection);
    this.updateProjection(subunits);
    self.container.append('g')
        .attr("class", "units")
      .selectAll("path")
        .data(subunits.features)
      .enter()
        .append("path")
        .attr("d", self.path)
        .attr("class", function(d) {
          if (d.properties.name === 'Sweden') {
            return "highlight unit unit-" + d.properties.name;
          }
          return "unit unit-" + d.properties.name;
        });
  }


  function updateProjection(subunits) {
    if (!this.bounds) {
      this.bounds = this.path.bounds(subunits);
    }
    var innerWidth  = this.graphElem.offsetWidth - this.options.margins.left - this.options.margins.right;
    var innerHeight = this.graphElem.offsetHeight - this.options.margins.top - this.options.margins.bottom;
    var b = this.bounds;
    var s = 1 / Math.max((b[1][0] - b[0][0]) / innerWidth, (b[1][1] - b[0][1]) / innerHeight);
    var t = [(innerWidth - s * (b[1][0] + b[0][0])) / 2, (innerHeight - s * (b[1][1] + b[0][1])) / 2];
    // Update the projection to use computed scale & translate.
    this.projection
        .scale(s)
        .translate(t);
  }


  function updateMapWidth() {
    var parent       = this.graphElem.parentNode;
    var initWidth    = parseInt(this.graphElem.getAttribute('data-init-width'), 10);
    var initHeight   = parseInt(this.graphElem.getAttribute('data-init-height'), 10);
    var aspect       = initWidth / initHeight;
    var parentWidth  = parent.offsetWidth - parseInt(getComputedStyle(parent, null).getPropertyValue('padding-right'), 10) - parseInt(getComputedStyle(parent, null).getPropertyValue('padding-left'), 10);
    var outerWidth   = Math.max(this.options.minWidth, Math.min(this.options.maxWidth, parentWidth));
    var outerHeight  = outerWidth / aspect;
    this.graphElem.setAttribute('width', outerWidth);
    this.graphElem.setAttribute('height', outerHeight);
  }


  return route;
});