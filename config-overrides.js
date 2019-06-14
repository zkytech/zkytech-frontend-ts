const { override, fixBabelImports, addLessLoader, addWebpackAlias,addBabelPlugin} = require('customize-cra');
const path = require('path');
const { paths } = require('react-app-rewired');

const addWebpackExternals = (externalDeps) => config => {
    config.externals = {
        ...config.externals,
        ...externalDeps
    };
    return config;
};
const setGlobalObject = value => config => {
    // mutate config as you want

    // config.optimization.minimize=true
    // config.optimization.splitChunks.name=true
    // config.optimization.splitChunks.minChunks=1
    // config.optimization.splitChunks.minSize=300
    // config.optimization.minimizer= [new UglifyJsPlugin()]
    // config.plugins.push(new webpack.optimize.ModuleConcatenationPlugin())
    // config.devtool = 'none'

    console.log(config)
    // return config so the next function in the pipeline receives it as argument
    return config
}

module.exports = {
    webpack:override(
        addWebpackExternals({
            'react': 'React',
            'react-dom': 'ReactDOM',
            'redux':'Redux',
            'react-redux':'ReactRedux',
            'react-thunk':'ReduxThunk',
            'react-router-dom':'ReactRouterDOM',
            'marked':'marked',
            'highlight.js':'hljs'
        }),
        addBabelPlugin("syntax-dynamic-import"),
        addWebpackAlias(
            {
                '@src':path.resolve(__dirname,paths.appSrc),
                '@components':path.resolve(__dirname,`${paths.appSrc}/components`),
                '@services':path.resolve(__dirname,`${paths.appSrc}/services`),
                '@actions':path.resolve(__dirname, `${paths.appSrc}/actions`),
                '@reducers':path.resolve(__dirname, `${paths.appSrc}/reducers`)
            }
        ),
        // antd模块化加载
        fixBabelImports('import', {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: true,
        }),

        // antd主题配置
        addLessLoader({
            javascriptEnabled: true,
            modifyVars: { '@primary-color': '#1DA57A' },
        }),
        setGlobalObject(),
    ),
    paths:function (paths,env) {
        // console.log(paths)
        // 自定义paths，比如build目录路径
        // paths.appBuild=path.resolve('../zkytech-backend/src/main/resources/static')
        return paths;
    },

}
