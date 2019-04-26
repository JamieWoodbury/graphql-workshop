import path from 'path';
import merge from 'webpack-merge';

import base from '../../webpack.config';

export default merge(base, {
  entry: {
    index: [path.resolve(__dirname, 'src/index.tsx')]
  }
});
