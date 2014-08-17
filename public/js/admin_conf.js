requirejs.config({
  paths : {
    "handlebars"    : "libs/handlebars/handlebars.runtime",
    "smoothScroll"  : "libs/smooth-scroll/dist/js/smooth-scroll.min"
  },
  shim: {
    "handlebars": {
      exports: "Handlebars"
    },
    "smoothScroll": {
      exports: "smoothScroll"
    }
  }
});