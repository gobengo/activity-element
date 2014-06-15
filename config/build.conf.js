({
  mainConfigFile: 'requirejs.conf.js',
  paths: {
    almond: 'node_modules/almond/almond'
  },
  baseUrl: '..',
  name: "activity-element",
  include: [
    'almond'
  ],
  stubModules: ['text', 'hgn', 'json'],
  out: "../dist/activity-element.min.js",
  cjsTranslate: true,
  optimize: "none",
  uglify2: {
    compress: {
      unsafe: true
    },
    mangle: true
  },
  wrap: {
    startFile: 'wrap-start.frag',
    endFile: 'wrap-end.frag'
  },
  generateSourceMaps: true,
  onBuildRead: function(moduleName, path, contents) {
    switch (moduleName) {
      case "jquery":
        contents = "define([], function(require, exports, module) {" + contents + "});";
    }
    return contents;
  }
})
