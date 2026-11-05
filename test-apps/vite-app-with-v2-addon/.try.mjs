export default {
  scenarios: [
    {
      name: 'ember-lts-5.12',
      npm: { devDependencies: { 'ember-source': '~5.12.0' } },
    },
    {
      name: 'ember-lts-6.4',
      npm: { devDependencies: { 'ember-source': '~6.4.0' } },
    },
    {
      name: 'ember-6.8',
      npm: { devDependencies: { 'ember-source': '~6.8.0' } },
    },
    {
      name: 'ember-latest',
      npm: { devDependencies: { 'ember-source': 'latest' } },
    },
  ],
};
