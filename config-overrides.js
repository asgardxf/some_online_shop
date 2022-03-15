const {
  override,
  addBabelPlugin,
  addBabelPreset,
  addLessLoader,
  fixBabelImports,
} = require('customize-cra');

module.exports = override(
  addBabelPlugin('babel-plugin-emotion'),
  addBabelPreset('@emotion/babel-preset-css-prop'),
  // https://3x.ant.design/docs/react/customize-theme#Ant-Design-Less-variables
  fixBabelImports('antd', {
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        '@text-color': 'rgba(0, 0, 0, 1)',
        '@text-color-secondary': 'rgba(0, 0, 0, 0.65)',
        '@btn-primary-bg': '#4B4B4B',
        '@btn-default-bg': '#4B4B4B',
        '@btn-default-color': '#fff',
        '@border-radius-base': '4px',
        '@radio-button-bg': '#fff',
        '@btn-disable-bg': '#bdbdbd',
        '@btn-disable-color': '#fff',
      },
    },
  }),
);
