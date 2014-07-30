'use strict';

define(['d3'], function(d3) {

  var route  = route || {};
  route.path = route.path || {};
  route.data = route.data || {};

  route.path.line = {
    STRAIGHT : 0,
    CURVE    : 1,
    NONE     : 2
  };

  route.path.markers = {};
  route.path.markers.type = {
    REGULAR : 0,
    PULSE : 1,
    NONE  : 2
  };
  
  var Base = function() {
    
    this.getName = function() {
      return {
        name  : this.view.getAttribute('data-component'),
        id    : this.view.getAttribute('data-id')
      };
    };

    this.convertCoordinates = function(point) {
      return this.projection([point.coordinates[1], point.coordinates[0]]);
    };

    this.getStraightPath = function(pointStart, pointEnd) {
      var startPointCoordinates = this.convertCoordinates(pointStart);
      var endPointCoordinates = this.convertCoordinates(pointEnd);
      var path = 'M ' + startPointCoordinates[0] + ' ' + startPointCoordinates[1];
      path += ' L ' + endPointCoordinates[0] + ' ' + endPointCoordinates[1];
      return path;
    };

    this.getCurvedPath = function(pointStart, pointEnd, o) {
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
        var offset = o || 0.4;
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
    };

    this.animate = function(pathElem, transitionTime) {
      pathElem
        .attr("stroke-dasharray", function() { return this.getTotalLength() + ' ' + this.getTotalLength();})
        .attr("stroke-dashoffset", function() { return this.getTotalLength();})
        .transition()
        .duration(transitionTime)
        .ease("linear")
        .attr("stroke-dashoffset", 0);
    };


    this.addMarker = function(point) {
      var pos;
      var marker;
      var self = this;
      if (point.markerType === route.path.markers.type.NONE) {
        return;
      }
      pos = self.convertCoordinates(point);
      marker = self.container.append('svg:circle')
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
          .style('stroke-width', 5);
      }
      return marker;
    };

    this.createMap = function(graphElem, options) {
      var self         = this;
      var parent       = graphElem.parentNode;
      var parentWidth  = parent.offsetWidth - parseInt(window.getComputedStyle(parent, null).getPropertyValue('padding-right'), 10) - parseInt(window.getComputedStyle(parent, null).getPropertyValue('padding-left'), 10);
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
        projection  : projection
      };

    };
  };

  return {
    Base  : Base,
    route : route
  };
});