'use strict';

const { realpathSync } = require('node:fs');
const path = require('node:path');

const SOURCE = '@ember/reactive/collections';
const TARGET = 'ember-reactive-collections-polyfill';
const PACKAGE_ROOT = realpathSync(__dirname) + path.sep;

function isOwnFile(filename) {
  if (!filename) return false;

  let resolved;

  try {
    resolved = realpathSync(filename);
  } catch {
    resolved = filename;
  }

  return resolved.startsWith(PACKAGE_ROOT);
}

module.exports = function reactiveCollectionsPolyfill({ types: t }) {
  function rewrite(source) {
    if (source.node?.value === SOURCE) {
      source.replaceWith(t.stringLiteral(TARGET));
    }
  }

  const rewriter = {
    ImportDeclaration(path) {
      rewrite(path.get('source'));
    },
    ExportNamedDeclaration(path) {
      if (path.node.source) rewrite(path.get('source'));
    },
    ExportAllDeclaration(path) {
      rewrite(path.get('source'));
    },
    CallExpression(path) {
      if (!path.get('callee').isImport()) return;

      let [arg] = path.get('arguments');

      if (arg?.isStringLiteral()) rewrite(arg);
    },
  };

  return {
    name: 'ember-reactive-collections-polyfill',
    visitor: {
      Program(path, state) {
        if (isOwnFile(state.filename)) return;

        path.traverse(rewriter);
      },
    },
  };
};

module.exports.SOURCE = SOURCE;
module.exports.TARGET = TARGET;
