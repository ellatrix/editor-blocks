const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

module.exports = {
    entry: './index.js',
    output: {
        filename: './bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: [ 'react', 'es2015' ]
                }
            },
            {
                test: /\.s?css$/,
                use: ExtractTextPlugin.extract( {
                    use: [
                        { loader: 'raw-loader' },
                        // { loader: 'postcss-loader' },
                        {
                            loader: 'sass-loader',
                            // query: {
                            //     includePaths: [ 'editor/assets/stylesheets' ],
                            //     data: '@import "variables"; @import "mixins";',
                            //     outputStyle: 'production' === process.env.NODE_ENV ?
                            //         'compressed' : 'nested'
                            // }
                        }
                    ]
                } )
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin( 'bundle.css' )
    ]
};
