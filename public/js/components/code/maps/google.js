'use strict';

define(['d3', 'utils/utils', 'components/code/maps/maps_base', 'async!http://maps.google.com/maps/api/js?v=3&sensor=false'], function(d3, utils, base) {

  var route = base.route;
  var googleMaps  = {};
  googleMaps.data = {};

  googleMaps.data.points = {
    positions : [
      {
        coordinates : [59.325600, 18.069920],
        markerType  : route.path.markers.type.REGULAR,
        line        : route.path.line.NONE,
        tooltip     : 'Stockholm, the start of our journey.',
        animeTime   : 300
      },
      {
        coordinates : [59.325600, 18.069920],
        markerType  : route.path.markers.type.NONE,
        line        : route.path.line.STRAIGHT,
        tooltip     : 'Madrid, next stop Valencia.',
        tooltipPos  : 'left',
        animeTime   : 300
      },
      {
        coordinates : [59.326710, 18.068603],
        markerType  : route.path.markers.type.REGULAR,
        line        : route.path.line.STRAIGHT,
        tooltip     : 'Madrid, next stop Valencia.',
        // tooltipPos  : 'left',
        animeTime   : 300
      }
      // {
      //   coordinates : [59.326710, 18.068603],
      //   markerType  : route.path.markers.type.NONE,
      //   line        : route.path.line.STRAIGHT,
      //   // tooltip     : 'Madrid, next stop Valencia.',
      //   // tooltipPos  : 'left',
      //   animeTime   : 300
      // }
    ]
  };

  googleMaps.mapObjects = [];

  googleMaps.init = function(aView) {
    var setup;
    var gm          = Object.create(new base.Base());
    gm.view         = aView;
    gm.init         = initialize;
    gm.onEvent      = onEvent;
    gm.mapElem      = gm.view.querySelector('.code-google-map');
    gm.wrapperElem  = gm.view.querySelector('.code-google-wrapper');
    gm.step         = step;
    gm.reset        = reset;
    gm.convertCoordinates = convertCoordinates;
    gm.options  = {
      zoom    : 15,
      minZoom : 10,
      maxZoom : 16,
      center  : [59.325600, 18.069920]
    };
    gm.init(gm.mapElem, gm.options);
    gm.addButtonListeners = addButtonListeners;
    gm.addMarkerTooltipListener = addMarkerTooltipListener;
    gm.addButtonListeners();
    gm.stepNo = 0;

    google.maps.event.addListener(gm.map, 'dragend', function() {
      var center = new google.maps.LatLng(gm.options.center[0], gm.options.center[1]);
      if (gm.map.getBounds().contains(center)) {
        return;
      }
      gm.map.setCenter(center);
    });
    garhammar.registerListener('resize', gm.getName().name);
    return gm;
  };

  function addButtonListeners() {
    var self = this;
    utils.each(this.view.querySelectorAll('button'), function(button) {
      button.addEventListener('click', function(ev) {
        ev.preventDefault();
        if (this.classList.contains('disabled')) {
          return;
        }
        if (this.name === 'step') {
          self.stepNo = self.step(self.stepNo);
          if (self.stepNo === googleMaps.data.points.positions.length) {
            this.classList.add('disabled');
          }
          return;
        }
        self.reset();
        self.stepNo = 0;
      });
    });
  }

  function addMarkerTooltipListener(currentPoint) {
    var self = this;
    var markerTooltipWrapper;
    var markerTooltip;
    var markerTooltipOffsetX = 16;
    var markerTooltipOffsetY = -17;
    var coordinates;
    markerTooltipWrapper  = self.wrapperElem.querySelector('.clone.code-google-map-tooltip-marker').cloneNode(true);
    coordinates           = self.convertCoordinates(currentPoint);
    markerTooltip         = markerTooltipWrapper.querySelector('.question');
    if (currentPoint.tooltipPos === 'left') {
      markerTooltip.classList.add('left');
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

  function onEvent(eventName) {
    this.map.setCenter(new google.maps.LatLng(this.options.center[0], this.options.center[1]));
  }

  function initialize(mapElem, options) {
    var map;
    var overlay;
    var self = this;
    var mapOptions = {
      center    : new google.maps.LatLng(options.center[0], options.center[1]),
      zoom      : options.zoom,
      minZoom   : options.minZoom,
      maxZoom   : options.maxZoom,
      mapTypeId : google.maps.MapTypeId.ROADMAP,
      styles    : getMapOpts()
    };
    map     = new google.maps.Map(mapElem, mapOptions);
    overlay = new google.maps.OverlayView();
    overlay.onAdd = function () {
      var layer = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "SvgOverlay");
      self.container = layer.append("svg")
        .attr("width", mapElem.offsetWidth)
        .attr("height", mapElem.offsetHeight);
      overlay.draw = function () {
        self.projection = this.getProjection();
        self.container.selectAll('circle').remove();
        self.container.selectAll('path').remove();
        var i = 0;
        for (; i < self.stepNo; i++) {
          self.step(i, true);
        }
      };
    };
    overlay.setMap(map);
    self.map = map;
  }

  function convertCoordinates(point) {
    var googleCoordinates = new google.maps.LatLng(point.coordinates[0], point.coordinates[1]);
    var pixelCoordinates = this.projection.fromLatLngToDivPixel(googleCoordinates);
    return [pixelCoordinates.x, pixelCoordinates.y];
  }

  function reset() {
    this.container.selectAll('circle').remove();
    this.container.selectAll('path').remove();
    utils.each(this.view.querySelectorAll('button'), function(item) {
      item.classList.remove('disabled');
    });
  }

  function step(k, disableAnim) {
    var self      = this;
    var i         = k || 0;
    var mapsData  = googleMaps.data.points;
    var prevPoint;
    var currentPoint;
    var nextPoint;
    var path;
    var pathElem;

    prevPoint     = mapsData.positions[i - 1];
    currentPoint  = mapsData.positions[i];
    nextPoint     = mapsData.positions[i + 1];
    self.addMarker(currentPoint);

    if (currentPoint.tooltip) {
      self.addMarkerTooltipListener(currentPoint);
    }
    if (!nextPoint) {
      i++;
      return i;
    }
    if (currentPoint.line === route.path.line.NONE) {
      i++;
      return i;
    }
    if (currentPoint.line === route.path.line.STRAIGHT) {
      path = self.getStraightPath(currentPoint, nextPoint);
    }
    
    pathElem = self.container.append('svg:path')
      .attr('d', path)
      .attr('class', 'step');

    if (!currentPoint.animeTime || disableAnim) {
      i++;
      return i;
    }

    i++;
    self.animate(pathElem, currentPoint.animeTime);
    return i;
  }



  function getMapOpts() {
    return [
      {
        "stylers": [
          {
            "hue": "#dd0d0d"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "lightness": 100
          },
          {
            "visibility": "simplified"
          }
        ]
      }
    ];
  }

  return googleMaps;
});