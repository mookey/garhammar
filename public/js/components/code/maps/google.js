'use strict';

define(['d3', 'async!http://maps.google.com/maps/api/js?v=3&sensor=false'], function(d3) {
  function l(a, b) {
    if (b) {
      console.log(a, b);
      return;
    }
    console.log(a);
  }

  var googleMaps  = {};
  googleMaps.init = function(aView) {
    var gm      = {};
    gm.view     = aView;
    gm.getName  = getName;
    gm.init     = initialize;
    gm.onEvent  = onEvent;
    gm.mapElem  = gm.view.querySelector('.code-google-map');
    gm.options  = {
      zoom    : 15,
      center  : [59.325600, 18.069920]
    };
    var setup = gm.init(gm.mapElem, gm.options);
    gm.map = setup.map;
    garhammar.registerListener('resize', gm.getName().name);
    return gm;
  };

  function getName() {
    return {
      name  : this.view.getAttribute('data-component'),
      id    : this.view.getAttribute('data-id')
    }
  }

  function onEvent(eventName) {
    this.map.setCenter(new google.maps.LatLng(this.options.center[0], this.options.center[1]));
  }

  function initialize(mapElem, options) {
    var mapOptions = {
      center    : new google.maps.LatLng(options.center[0], options.center[1]),
      zoom      : options.zoom,
      mapTypeId : google.maps.MapTypeId.ROADMAP,
      styles    : getMapOpts()
    };
    var map     = new google.maps.Map(mapElem, mapOptions);
    var overlay = new google.maps.OverlayView();
    var svg;
    var layer;
    overlay.onAdd = function () {
      layer = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "SvgOverlay");
      svg   = layer.append("svg")
        .attr("width", mapElem.offsetWidth)
        .attr("height", mapElem.offsetHeight);
    //   dnGraphs.route.setup.d3container = svg;
      overlay.draw = function () {
        // dnGraphs.route.cancelAnimation();
        // dnGraphs.route.setup.projection = this.getProjection();
        // svg.selectAll('circle').remove();
        // svg.selectAll('path').remove();
        // $.each(wrapperElem.querySelectorAll('.dn-route-tooltip-marker'), function(i, elem) {
        // elem.classList.add('dn-route-hide');
      };
    //   wrapperElem.querySelector('.dn-route-tooltip').classList.add('dn-route-hide');
    //   dnGraphs.route.renderPath(dnGraphs.route.path.data);
    //   };
    };

    return {
      map         : map,
      svgOverlay  : svg,
      projection  : overlay.getProjection()
    };
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