import webpack from 'webpack';
import path from 'path';
import { config as dotenv } from 'dotenv';

dotenv({ path: path.resolve(__dirname, '.env') });
const DEV_PORT = 8080;

const config: webpack.Configuration = {
  output: {
    path: path.resolve(__dirname, 'build')
  },

  devtool: 'cheap-module-source-map',
  devServer: {
    hot: true,
    inline: true,
    port: DEV_PORT,
    contentBase: path.join(__dirname, 'build'),
    headers: { 'Access-Control-Allow-Origin': '*' },
    https: false,
    stats: 'minimal',
    historyApiFallback: true
  },

  optimization: {
    namedModules: true
  },

  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
            plugins: ['react-hot-loader/babel', '@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: require.resolve('style-loader')
          },
          {
            loader: require.resolve('css-loader'),
            options: {
              localIdentName: '[name]__[local]--[hash:base64:5]',
              modules: true,
              url: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.resolve(__dirname, '../postcss.config.js')
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    mainFields: ['module', 'main'],
    modules: ['node_modules', path.resolve(__dirname, './packages')],
    extensions: ['.ts', '.tsx', '.js', '.css']
  },

  target: 'web',
  stats: 'none',

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        VERSION: JSON.stringify(`v${require('./package.json').version}`),
        GITHUB_TOKEN: JSON.stringify(process.env.GITHUB_TOKEN)
      }
    })
  ]
};

export default config;
