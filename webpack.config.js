const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // at the top

module.exports = {
  watch: false,
  mode: process.env.NODE_ENV,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
  devServer: {
    historyApiFallback: true,
    // contentBase: path.join(__dirname, 'dist'),
    publicPath: '/build/',
    proxy: {
      '/': {
        target: 'http://localhost:3000',
      },
    },
    
    
    
    // proxy: [{
    //   // context: ['/api', '/authorize'],
    //   // target: 'http://localhost:3000',
    //   '/': 'http://localhost:3000/',
    //   // '/api': 'http://localhost:3000/',
    //   // '/': 'http://localhost:3000/',
    //   // '/authorize': 'http://localhost:3000/',
    // }],
  },
};
