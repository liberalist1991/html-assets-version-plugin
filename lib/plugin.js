const runner = (htmlPluginData, callback, opts) => {
  var suffix = ('?t=' + new Date().getTime());
  htmlPluginData.assets.js.forEach(function (val, index, arr) {
    arr[index] += suffix;
  });
  htmlPluginData.assets.css.forEach(function (val, index, arr) {
    arr[index] += suffix;
  });
  callback(null, htmlPluginData);
}

class Plugin {
  constructor(opts = {}) {
    this.opts = opts;
  }

  apply(compiler) {
    if (compiler.hooks) {
      // setup hooks for webpack >= 4
      compiler.hooks.compilation.tap('HtmlAssetsVersionPluginHooks', compilation => {
        compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('HtmlAssetsVersionPluginHooks', (htmlPluginData, callback) => {
          runner(htmlPluginData, callback, this.opts)
        });
      });
    } else {
      // setup hooks for webpack <= 3
      compiler.plugin('compilation', compilation => {
        compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback) => {
          runner(htmlPluginData, callback, this.opts)
        });
      });
    }
  }
}

module.exports = Plugin;
