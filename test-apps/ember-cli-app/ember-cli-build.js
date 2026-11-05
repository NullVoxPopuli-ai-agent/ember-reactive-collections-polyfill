'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    babel: {
      plugins: [
        require.resolve('ember-reactive-collections-polyfill/babel-plugin'),
      ],
    },
  });


  return app.toTree();
};
