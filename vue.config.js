module.exports = {
  crossorigin: "anonymous",
  devServer: {
    proxy: {
      "^/api": {
        target: "https://жк-династия33.рф",
        ws: true,
        changeOrigin: true
      },
    }
  }
};
