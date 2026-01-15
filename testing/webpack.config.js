import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default (env, argv) => {
    const isProd = argv.mode === 'production';

    return {
        target: 'web',
        devtool: isProd ? 'source-map' : 'eval-source-map',
        entry: path.resolve('src', 'index.js'),
        output: {
            path: path.resolve('dist'),
            filename: 'bundle.[contenthash].js',
            clean: true,
        },
        devServer: {
            port: 9000,
            open: true,
            hot: true,
            static: {
                directory: path.resolve('dist'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/i,
                    exclude: /node_modules/,
                    use: 'babel-loader',
                },
                {
                    test: /\.html$/i,
                    loader: 'html-loader',
                },
                {
                    test: /\.css$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                    ],
                },
                {
                    test: /\.(svg|png|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
            }),
            new MiniCssExtractPlugin({
                filename: isProd ? '[name].[contenthash].css' : '[name].css',
            }),
        ],
    };
};
