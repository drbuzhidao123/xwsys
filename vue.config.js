const webpack = require('webpack')
module.exports = {
    //服务器配置
        devServer: {
            overlay: {
                // 让浏览器 overlay 同时显示警告和错误
                warnings: true,
                errors: true
            },
            disableHostCheck: true,
            host: 'localhost',
            port: 80, // 端口号
            https: false, // https:{type:Boolean}
            open: true, // 配置自动启动浏览器
            hotOnly: true, // 热更新
            proxy: {
                '/api': {
                    target: 'http://www.xwsysapi.com/admin/',
                    ws: true,
                    changeOrigin: true,
                    pathRewrite: {
                        '^/api': ''
                    }
                },
            }
           
        },

       
    }
