requirejs.config({
  paths : {
    "handlebars"        : "libs/handlebars/handlebars.runtime",
    "smoothScroll"      : "libs/smooth-scroll/dist/js/smooth-scroll.min",
    "d3"                : "libs/d3/d3",
    "topojson"          : "libs/topojson/topojson",
    "google-analytics"  : "libs/bower-google-analytics/analytics",
    "async"             : "libs/requirejs-plugins/src/async"
  },
  shim: {
    "handlebars": {
      exports: "Handlebars"
    },
    "smoothScroll": {
      exports: "smoothScroll"
    },
    "d3": {
      exports: "d3"
    },
    "topojson": {
      exports: "topojson"
    },
    "google-analytics": {
      exports: "ga"
    }
  }
});