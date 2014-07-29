'use strict';

define(['d3', 'topojson', 'utils/utils'], function(d3, topojson, utils) {
  
  function l(a, b) {
    if (b) {
      console.log(a, b);
      return;
    }
    console.log(a);
  }

  var route  = {};
  route.path = route.path || {};
  route.data = route.data || {};

  route.path.visual = {
    ANIMATED  : 0,
    STATIC    : 1
  };

  route.path.line = {
    STRAIGHT : 0,
    CURVE    : 1
  }

  route.path.markers = {};
  route.path.markers.type = {
    REGULAR : 0,
    PULSE : 1,
    NONE  : 2
  }

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
    var f = {};
    var graphElem;
    var mapDataLink;
    var options;
    var map;

    options = {
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

    f.view        = aView;
    f.getName     = getName;
    f.onEvent     = onEvent;
    mapDataLink   = "/js/europe.topojson.json";
    graphElem     = f.view.querySelector('.code-route-map');
    map           = createMap(graphElem, options);
    map.graphElem   = graphElem;
    map.wrapperElem = f.view.querySelector('.code-route-wrapper');
    map.tooltipElem = f.view.querySelector('.abs-tooltip');
    garhammar.registerListener('resize', 'code/maps/route');
    map.tooltipElem.querySelector('.js-close').addEventListener('click', function(ev) {
      ev.preventDefault();
      map.tooltipElem.classList.add('hide');
    });
    f.map = map;

    d3.json(mapDataLink, function(error, topojson) {
      if (error) {
        console.error(error);
        return;
      }
      map.renderCountries(topojson);
      map.renderPath(route.data.points);
      map.topojson = topojson;
    });

    return f;
  }

  function getName() {
    return {
      name  : this.view.getAttribute('data-component'),
      id    : this.view.getAttribute('data-id')
    }
  }

  function onEvent(eventName) {
    var self = this;
    clearTimeout(self.map.timer);
    self.map.updateMapWidth();
    d3.selectAll('circle').remove();
    d3.selectAll('.route').remove();
    d3.select('g.units').remove();
    utils.each(this.map.wrapperElem.querySelectorAll('.code-route-tooltip-marker'), function(elem) {
      if (elem.classList.contains('clone')) {
        return;
      }
      self.map.wrapperElem.removeChild(elem)
    });
    self.map.timer = setTimeout(function() {
      self.map.renderCountries(self.map.topojson);
      self.map.renderPath(route.data.points);
    }, 300);
  }

  function createMap(graphElem, options) {
    return {
      setup           : setupMap(graphElem, options),
      renderCountries : renderCountries,
      renderPath      : renderPath,
      addMarker       : addMarker,
      addMarkerTooltipListener : addMarkerTooltipListener,
      getStraightPath : getStraightPath,
      getCurvedPath   : getCurvedPath,
      animate         : animate,
      convertCoordinates  : convertCoordinates,
      updateProjection    : updateProjection,
      updateMapWidth      : updateMapWidth
    };
  }

  function getStraightPath(pointStart, pointEnd) {
    var startPointCoordinates = this.convertCoordinates(pointStart);
    var endPointCoordinates = this.convertCoordinates(pointEnd);
    var path = 'M ' + startPointCoordinates[0] + ' ' + startPointCoordinates[1];
    path += ' L ' + endPointCoordinates[0] + ' ' + endPointCoordinates[1];
    return path;
  };

  function getCurvedPath(pointStart, pointEnd, o) {
    var startPointCoordinates = this.convertCoordinates(pointStart);
    var endPointCoordinates = this.convertCoordinates(pointEnd);

    var isNegativeX = 0 > (startPointCoordinates[0] - endPointCoordinates[0]);
    var isNegativeY = 0 > (startPointCoordinates[1] - endPointCoordinates[1]);
    var x1 = Math.abs(startPointCoordinates[0] - endPointCoordinates[0]);
    var y1 = Math.abs(startPointCoordinates[1] - endPointCoordinates[1]);
    var hypotenuse = Math.sqrt( x1 * x1 + y1 * y1);
    var halfHypotenuse = hypotenuse / 2;
    var alfa = Math.atan(y1 / x1);
    var beta = (Math.PI / 2) - alfa;
    var x2 = Math.cos(alfa) * halfHypotenuse;
    var y2 = Math.sin(alfa) * halfHypotenuse;
    var normalVectorStartCoordinates = [
      isNegativeX ? startPointCoordinates[0] + x2 : startPointCoordinates[0] - x2,
      isNegativeY ? startPointCoordinates[1] + y2 : startPointCoordinates[1] - y2
    ];
      var offset = o || .4;
      var normalVectorLength = hypotenuse * offset;
      var x3 = Math.cos(beta) * normalVectorLength;
      var y3 = Math.sin(beta) * normalVectorLength;
      var offsetX = 0;
      if (isNegativeX) {
        if (isNegativeY) {
          offsetX = normalVectorStartCoordinates[0] + x3;
        } else {
          offsetX = normalVectorStartCoordinates[0] - x3;
        }
      } else {
        if (isNegativeY) {
          offsetX = normalVectorStartCoordinates[0] - x3;
        } else {
          offsetX = normalVectorStartCoordinates[0] + x3;
        }
      }
      var normalVectorEndCoordinates = [
        offsetX,
        normalVectorStartCoordinates[1] - y3 // The curve is always pointing upwards
      ];

    // Move to start point...
    var path = 'M ' + startPointCoordinates[0] + ' ' + startPointCoordinates[1];
    // ...draw line through control point...
    path += ' Q ' + normalVectorEndCoordinates[0] + ' ' + normalVectorEndCoordinates[1];
    // and continue line to end point
    path += ' ' + endPointCoordinates[0] + ' ' + endPointCoordinates[1];
    return path;
  }

  function animate(pathElem, transitionTime) {
    pathElem
      .attr("stroke-dasharray", function() { return this.getTotalLength() + ' ' + this.getTotalLength()})
      .attr("stroke-dashoffset", function() { return this.getTotalLength(); })
      .transition()
      .duration(transitionTime)
      .ease("linear")
      .attr("stroke-dashoffset", 0);
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
      self.timer = setTimeout(
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
            shadowElem = self.setup.container.append('svg:path')
              .attr('d', shadow)
              .attr('class', 'route shadow')
              .attr("filter", "url(#blur)");
          }
          
          pathElem = self.setup.container.append('svg:path')
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
    markerTooltipWrapper = self.wrapperElem.querySelector('.clone.code-route-tooltip-marker').cloneNode(true);
    coordinates = self.convertCoordinates(currentPoint);
    markerTooltip = markerTooltipWrapper.querySelector('.question');
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
      tooltip.style.bottom = (self.setup.outerHeight - coordinates[1]) + 'px';
      tooltip.style.left = (coordinates[0] - 110) + 'px';
      tooltip.classList.remove('hide');
      tooltip.addEventListener('click', function(ev) {
        ev.preventDefault();
        this.classList.add('hide');
        markerTooltip.classList.remove('hide');
      });           
    });
  }

  function addMarker(point) {
    var pos;
    var marker;
    var self = this;
    if (point.markerType === route.path.markers.type.NONE) {
      return;
    }
    pos = self.convertCoordinates(point);
    marker = self.setup.container.append('svg:circle')
      .attr('r', 5)
      .attr('cx', pos[0])
      .attr('cy', pos[1])
      .attr('class', function() {

        var classes = 'marker';

        if (point.markerType === route.path.markers.type.PULSE) {
          classes += ' pulse';
        }
        if (point.tooltip) {
          classes += ' graph-tooltip';
        }

        return classes;
      });
    if (point.markerType === route.path.markers.type.PULSE) {
      marker.transition()
        .duration(2000)
        .ease("linear")
        .attr('r', 12)
        .style('stroke-width', 5)
    }
    return marker;
  }

  function convertCoordinates(point) {
    return this.setup.projection([point.coordinates[1], point.coordinates[0]]);
  }


  function renderCountries(mapData) {
    var self = this;
    var subunits = topojson.feature(mapData, mapData.objects.collection);
    this.updateProjection(subunits);
    self.setup.container.append('g')
        .attr("class", "units")
      .selectAll("path")
        .data(subunits.features)
      .enter()
        .append("path")
        .attr("d", self.setup.path)
        .attr("class", function(d) {
          if (d.properties.name === 'Sweden') {
            return "highlight unit unit-" + d.properties.name;
          }
          return "unit unit-" + d.properties.name;
        });
  }


  function updateProjection(subunits) {
    if (!this.setup.bounds) {
      this.setup.bounds = this.setup.path.bounds(subunits);
    }
    var b = this.setup.bounds;
    var s = 1 / Math.max((b[1][0] - b[0][0]) / this.setup.innerWidth, (b[1][1] - b[0][1]) / this.setup.innerHeight);
    var t = [(this.setup.innerWidth - s * (b[1][0] + b[0][0])) / 2, (this.setup.innerHeight - s * (b[1][1] + b[0][1])) / 2];
    // Update the projection to use computed scale & translate.
    this.setup.projection
        .scale(s)
        .translate(t);
  }



  function updateMapWidth() {
    var parent       = this.graphElem.parentNode;
    var parentWidth  = parent.offsetWidth - parseInt(getComputedStyle(parent, null).getPropertyValue('padding-right'), 10) - parseInt(getComputedStyle(parent, null).getPropertyValue('padding-left'), 10);
    var outerWidth   = Math.max(this.setup.MIN_WIDTH, Math.min(this.setup.MAX_WIDTH, parentWidth));
    var outerHeight  = outerWidth / this.setup.aspect;
    d3.select(this.graphElem)
      .attr('width', outerWidth)
      .attr('height', outerHeight);
    this.setup.outerWidth   = outerWidth;
    this.setup.outerHeight  = outerHeight;
    this.setup.innerWidth   = outerWidth;
    this.setup.innerHeight  = outerHeight;
  }



  function setupMap(graphElem, options) {
    var self         = this;
    var parent       = graphElem.parentNode;
    var parentWidth  = parent.offsetWidth - parseInt(getComputedStyle(parent, null).getPropertyValue('padding-right'), 10) - parseInt(getComputedStyle(parent, null).getPropertyValue('padding-left'), 10);
    var initWidth    = parseInt(graphElem.getAttribute('data-init-width'), 10);
    var initHeight   = parseInt(graphElem.getAttribute('data-init-height'), 10);
    var aspect       = initWidth / initHeight;
    var MIN_WIDTH    = options.minWidth;
    var MAX_WIDTH    = options.maxWidth;
    var outerWidth   = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, parentWidth));
    var outerHeight  = outerWidth / aspect;
    var margins      = options.margins;
    var innerWidth   = outerWidth - margins.left - margins.right;
    var innerHeight  = outerHeight - margins.top - margins.bottom;
    // graphElem.setAttribute('viewBox', '0 0 ' + outerWidth + ' ' + outerHeight);
    var d3chart = d3.select(graphElem)
      .attr('width', outerWidth)
      .attr('height', outerHeight);

    var d3container = d3chart
      .append('g')
      .attr('transform', 'translate(' + margins.left + ', ' + margins.top + ')')
      .attr('class', 'map container')
      .attr('width', innerWidth)
      .attr('height', innerHeight);

    var projection = d3.geo.conicConformal()
      .rotate(options.projection.rotate)
      .scale(1) // Set bogus until we know bounds
      .translate([0, 0]);  // Set bogus until we know bounds

    var path = d3.geo.path().projection(projection);
    
    return {
      container   : d3container,
      path        : path,
      projection  : projection,
      innerWidth  : innerWidth,
      innerHeight : innerHeight,
      outerWidth  : outerWidth,
      outerHeight : outerHeight,
      MIN_WIDTH   : options.minWidth,
      MAX_WIDTH   : options.maxWidth,
      aspect      : aspect
    };

  }

  return route;
});