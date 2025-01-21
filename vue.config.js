const registerRouter = require("./backend/router");

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        /*
         在使用全局变量前首先得要最新版本
        "node-sass": "^5.0.0",
        "sass-loader": "^10.1.0",
         */
        // 全局引入变量和 mixin
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  },
  devServer: {
    before(app) {
      registerRouter(app);
    }
  },
  configureWebpack: config => {
    if (process.env.npm_config_report) {
      const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
        .BundleAnalyzerPlugin;
      config.plugins.push(new BundleAnalyzerPlugin());
    }
  },
  // 当我们在生产环境下不希望开启，因为容易被人看我们的源码
  productionSourceMap: false,
  // 路径的部署目标在子路径下，就得对应设置publicPath，在vue cli文档里有解释
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/"
};
