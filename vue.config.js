const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "./",
  productionSourceMap: true,
  devServer: {
    port: 8085,
    host: "localhost",
    before(app) { },
    https: false,
    open: true,
    proxy: {
      "/bluewhale": {
        target: "https://testboss.imeduplus.com",
        changeOrigin: true
      },
      "/zl_api": {
        target: "https://testsaas.imeduplus.com",
        changeOrigin: true
      },
      // "/zl_api/uc": {
      //   target: "http://172.31.120.52:8080",
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "/zl_api/uc": "/uc"
      //   }
      // },
      // "/zl_api/kidscare": {
      //   target: "http://172.31.120.52:8081",
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "/zl_api/kidscare": "/kidscare"
      //   }
      // },
      "/xys_api": {
        target: "http://testsaas.eschoolpal.com",
        changeOrigin: true
      },
      "/zl_image": {
        target: "https://testsaas.imzhiliao.com",
        changeOrigin: true,
        pathRewrite: {
          "/zl_image": ""
        }
      },
      "/xys_api": {
        target: "https://testsaas.imeduplus.com",
        changeOrigin: true
      },
      "/xys_auth_api": {
        target: "https://testsaas.imeduplus.com",
        changeOrigin: true,
        pathRewrite: {
          "/xys_auth_api": ""
        }
      },
      // "/zlweb": {
      //   target: "https://testsaas.imeduplus.com",
      //   changeOrigin: true
      // },
      "/zlweb": {
        target: "http://localhost:4003/src",
        // target: "http://localhost/eduplus_zl/src",
        changeOrigin: true,
        pathRewrite: {

          "/zlweb": ""
        }
      },
      "/xysweb": {
        target: "https://testsaas.imeduplus.com",
        changeOrigin: true
      }
    }
  },
  lintOnSave: false, //关闭eslint代码检查
  configureWebpack: config => {
    config.resolve.extensions = [".js", ".vue", ".json"];
  },
  chainWebpack: config => {
    config.resolve.alias
      .set("vue$", "vue/dist/vue.esm.js")
      .set("@", resolve("src"));
  }
};
