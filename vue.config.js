const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    devServer: {
        port: 3000, // 端口号，如果端口号被占用，会自动提升1
        // 处理跨域，本地代理转发
        proxy: {
            '/qr-code': {
                // target: 'http://121.37.197.45:8080',  //接口域名
                target: 'http://172.16.12.52:8080',  //接口域名
                // target: 'http://172.16.174.15:8083',  //接口域名
                ws: false,
                changeOrigin: true,  //是否跨域
                // pathRewrite: {
                //     '^/qr-code': ''
                // }
            },
            '/pdf': {
                target: 'http://172.16.12.51:80',  //接口域名
                ws: false,
                changeOrigin: true,  //是否跨域
                pathRewrite: {
                    '^/pdf': ''
                }
            },
            '/jeecg-boot': {
                // target: 'http://121.37.197.45:8803',  //接口域名
                // target: 'http://106.13.36.159:8081',  //接口域名
                // target: 'http://106.13.36.159:8083',  //接口域名
                // target: 'http://172.16.174.15:8083',  //接口域名
                target: 'http://182.92.125.56:8083',  //接口域名
                ws: false,
                pathRewrite: { '^/jeecg-boot': '' },
                changeOrigin: true //是否跨域
            }
        }
    },
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@$', resolve('src'))
            .set('@api', resolve('src/api'))
            .set('@assets', resolve('src/assets'))
            .set('@comp', resolve('src/components'))
            .set('@views', resolve('src/views'))
            .set('@layout', resolve('src/layout'))
            .set('@static', resolve('src/static'))
            .set('@config', resolve('src/config'))
    },
    css: {
        loaderOptions: { // 向CSS相关的loader传递选项
            less: {
                javascriptEnabled: true
            }
        }
    },
    lintOnSave: false, // 关闭格式检查
    productionSourceMap: false // 打包时不会生成 .map 文件，加快打包速度
}

