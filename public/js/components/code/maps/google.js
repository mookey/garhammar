'use strict';

define(['d3', 'utils/utils', 'components/code/maps/maps_base', 'async!http://maps.google.com/maps/api/js?v=3&sensor=false'], function(d3, utils, base) {

  var route = base.route;
  var googleMaps  = {};
  googleMaps.data = {};

  googleMaps.data.points = {
    positions : [
      {
        coordinates : [59.327501, 18.070896],
        markerType  : route.path.markers.type.REGULAR,
        line        : route.path.line.NONE,
        countinous  : false,
        animeTime   : 300
      },
      {
        coordinates : [59.327501, 18.070896],
        markerType  : route.path.markers.type.NONE,
        line        : route.path.line.STRAIGHT,
        countinous  : true,
        animeTime   : 300
      },
      {
        coordinates : [59.326844, 18.068857],
        markerType  : route.path.markers.type.NONE,
        line        : route.path.line.STRAIGHT,
        countinous  : true,
        animeTime   : 400
      },
      {
        coordinates : [59.325498, 18.066003],
        markerType  : route.path.markers.type.PULSE,
        line        : route.path.line.NONE,
        tooltip     : 'Yeah, this is, eeh, nice...',
        countinous  : false,
        animeTime   : 300
      },
      {
        coordinates : [59.325498, 18.066003],
        markerType  : route.path.markers.type.NONE,
        line        : route.path.line.STRAIGHT,
        countinous  : true,
        animeTime   : 400
      },
      {
        coordinates : [59.323265, 18.069512],
        markerType  : route.path.markers.type.NONE,
        line        : route.path.line.STRAIGHT,
        countinous  : true,
        animeTime   : 70
      },
      {
        coordinates : [59.323600, 18.070219],
        markerType  : route.path.markers.type.NONE,
        line        : route.path.line.STRAIGHT,
        countinous  : true,
        animeTime   : 300
      },
      {
        coordinates : [59.324312, 18.068999],
        markerType  : route.path.markers.type.REGULAR,
        line        : route.path.line.NONE,
        tooltip     : 'Beer stop.',
        countinous  : false,
        animeTime   : 300
      },
      {
        coordinates : [59.324312, 18.068999],
        markerType  : route.path.markers.type.NONE,
        line        : route.path.line.STRAIGHT,
        countinous  : true,
        animeTime   : 100
      },
      {
        coordinates : [59.324659, 18.069718],
        markerType  : route.path.markers.type.NONE,
        line        : route.path.line.STRAIGHT,
        countinous  : true,
        animeTime   : 200
      },
      {
        coordinates : [59.325513, 18.068927],
        markerType  : route.path.markers.type.NONE,
        line        : route.path.line.STRAIGHT,
        countinous  : true,
        animeTime   : 300
      },
      {
        coordinates : [59.326570, 18.068726],
        markerType  : route.path.markers.type.NONE,
        line        : route.path.line.STRAIGHT,
        countinous  : true,
        animeTime   : 300
      },
      {
        coordinates : [59.327860, 18.072894],
        markerType  : route.path.markers.type.NONE,
        line        : route.path.line.STRAIGHT,
        countinous  : true,
        animeTime   : 300
      },
      {
        coordinates : [59.327860, 18.072894],
        markerType  : route.path.markers.type.PULSE,
        line        : route.path.line.NONE,
        countinous  : false,
        animeTime   : 300
      }
    ]
  };

  googleMaps.mapObjects = [];

  googleMaps.init = function(aView) {
    var setup;
    var gm          = Object.create(new base.Base());
    gm.view         = aView;
    gm.init         = initialize;
    // gm.onEvent      = onEvent;
    gm.mapElem      = gm.view.querySelector('.code-maps-google');
    gm.wrapperElem  = gm.view.querySelector('.code-maps-google-wrapper');
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
    gm.loop = loop;
    gm.stepNo = 0;

    // google.maps.event.addListener(gm.map, 'dragend', function() {
    //   var center = new google.maps.LatLng(gm.options.center[0], gm.options.center[1]);
    //   if (gm.map.getBounds().contains(center)) {
    //     return;
    //   }
    //   gm.map.setCenter(center);
    // });
    // garhammar.registerListener('resize', gm.getName().name);
    return gm;
  };

  function addButtonListeners() {
    var self = this;
    this.view.querySelector('.js-step').addEventListener('click', function(ev) {
        ev.preventDefault();
        if (this.classList.contains('disabled')) {
          return;
        }
        self.loop(self.stepNo);
    });

    this.view.querySelector('.js-reset').addEventListener('click', function(ev) {
      ev.preventDefault();
      self.stepNo = 0;
      self.reset();
    });

  }

  function loop(stepNo) {
      var self    = this;
      var step    = self.step(self.stepNo);
      var button  = this.view.querySelector('.js-step');
      button.classList.remove('disabled');
      self.stepNo = step.no;
      if (step.countinous) {
        button.classList.add('disabled');
        setTimeout(function() {
          self.loop(self.stepNo);
        }, step.animeTime);
      }
      if (self.stepNo === googleMaps.data.points.positions.length) {
        button.classList.add('disabled');
      }
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
    markerTooltipWrapper.classList.add('js-tooltip-marker');
    self.mapElem.appendChild(markerTooltipWrapper);
    markerTooltip.addEventListener('click', function(ev) {
      var tooltip;
      var diff;
      var tooltipArrow;
      var rightOffset;
      var style;
      ev.preventDefault();
      this.classList.add('hide');
      tooltip = markerTooltipWrapper.querySelector('.abs-tooltip');
      tooltip.querySelector('.tooltip-message').innerHTML = currentPoint.tooltip;
      tooltip.style.bottom = (self.mapElem.offsetHeight - coordinates[1]) + 'px';
      if (!tooltip.classList.contains('js-initiated')) {
        if ((coordinates[0] - 110) < 0) {
          diff = Math.abs(coordinates[0] - 110);
          tooltip.style.left = '10px';
          diff += 10;
          tooltipArrow = tooltip.querySelector('.js-abs-tooltip-arrow');
          style = window.getComputedStyle(tooltipArrow);
          rightOffset = parseInt(window.getComputedStyle(tooltipArrow).getPropertyValue('right'), 10);
          tooltipArrow.style.right = (rightOffset + diff) + 'px';
        } else {
          tooltip.style.left = (coordinates[0] - 110) + 'px';
        }
      }
      tooltip.classList.remove('hide');
      tooltip.addEventListener('click', function(ev) {
        ev.preventDefault();
        this.classList.add('hide');
        markerTooltip.classList.remove('hide');
      });           
      tooltip.classList.add('js-initiated');
    });
  }

  // function onEvent(eventName) {
  //   var no = this.stepNo;
  //   this.map.setCenter(new google.maps.LatLng(this.options.center[0], this.options.center[1]));
  //   this.reset();
  //   var i = 0;
  //   for (; i < no; i++) {
  //     this.step(i, true);
  //   }
  // }

  function initialize(mapElem, options) {
    var map;
    var overlay;
    var self = this;
    var mapOptions = {
      center            : new google.maps.LatLng(options.center[0], options.center[1]),
      zoom              : options.zoom,
      minZoom           : options.minZoom,
      maxZoom           : options.maxZoom,
      disableDefaultUI  : true,
      scrollwheel       : false,
      draggable         : false,
      panControl        : false,
      mapTypeId         : google.maps.MapTypeId.ROADMAP,
      styles            : getMapOpts()
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
        self.reset();
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
    this.stepNo = 0;
    this.container.selectAll('circle').remove();
    this.container.selectAll('path').remove();
    utils.each(this.view.querySelectorAll('.js-tooltip-marker'), function(elem) {
      utils.removeNode(elem);
    });
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
    i++;

    if (currentPoint.tooltip) {
      self.addMarkerTooltipListener(currentPoint);
    }
    if (!nextPoint) {
      return { no : i, countinous : false };
    }
    if (currentPoint.line === route.path.line.NONE) {
      return { no : i, countinous : false };
    }
    if (currentPoint.line === route.path.line.STRAIGHT) {
      path = self.getStraightPath(currentPoint, nextPoint);
    }
    
    pathElem = self.container.append('svg:path')
      .attr('d', path)
      .attr('class', 'step');

    if (!currentPoint.animeTime || disableAnim) {
      if (!currentPoint.countinous) {
        return { no : i, countinous : false };
      }
      return self.step(i);
    }

    self.animate(pathElem, currentPoint.animeTime);
    if (!currentPoint.countinous) {
      return { no : i, countinous : false };
    }
    return { no : i, countinous : true, animeTime : currentPoint.animeTime };
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