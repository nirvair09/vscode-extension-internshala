// webpack.media.config.js
const path = require('path');

module.exports = {
  entry: './media/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'media'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.media.json',
        },
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'production',
};
