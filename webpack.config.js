const path = require('path')
const root = path.resolve(__dirname)

const config = {
    entry: path.resolve(root, "index.webpack.js"),
    output: {
        //目标输出目录
        path:  path.resolve(root, 'dist'),
        library: "IMessenger",
        //输出文件的文件名
        filename: 'imessager.js',
        libraryTarget : "umd",
        globalObject: "this"
    },
    devtool: "source-map",
    mode: "production"
};

module.exports = config;
