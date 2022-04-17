const path = require('path')
module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.join(__dirname, './src/assets/styles/variables.less'),
        path.join(__dirname, './src/assets/styles/mixins.less')
      ]
    }
  },
  chainWebpack: config => {
    // 开启域名/ip访问
    config.devServer.disableHostCheck(true)
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10000 }))
  },
  // # 这个是设置外部扩展，模块为qc变量名为QC，导入qc将不做打包。qc已在index.html用cdn引入
  configureWebpack: {
    externals: {
      qc: 'QC'
    }
  },
}
