let cfg = {
  crossorigin: "anonymous",
  devServer: {
    proxy: {
      "^/api": {
        target: "https://жк-династия33.рф",
        ws: true,
        changeOrigin: true
      }
      // disableHostCheck: true,
      // historyApiFallback: true,
      // headers: {
      //   "Access-Control-Allow-Origin": "*",
      //   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      //   "Access-Control-Allow-Headers":
      //     "X-Requested-With, content-type, Authorization"
    }
  }
}
// console.log("process :", process.env.NODE_ENV)
if (process.env.NODE_ENV !== "development") {
  const webpack = require("webpack")
  cfg = {
    ...cfg,
    configureWebpack: {
      plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1
        })
      ]
    },
    chainWebpack: config => {
      config.optimization.delete("splitChunks")
    }
  }
}
module.exports = cfg
