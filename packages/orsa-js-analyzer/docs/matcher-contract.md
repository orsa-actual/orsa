# The matcher API contract

The contract of a matcher is simple. The matcher is a function that takes a `node` and a `path` and returns either null or a feature object.

The simplest possible matcher is:

```
const myMatcher = () => null;
```

But obviously that's no good. So, let's get a little more advanced:

```
const types = require('babel-types');
const JSXText = require('orsa-js-analyzer').types.JSXText;

module.exports = (node /*, path */) => {
  let matched = null;
  if (types.isJSXText(node)) {
    const text = node.value.toString().trim();
    if (text.length > 0) {
      matched = new JSXText(
        node.loc.start.line,
        node.loc.end.line,
        text
      );
    }
  }
  return matched;
};
```

This matcher uses `babel-types` to identify that the node is a JSX text node. Then makes sure it's not just some white space. And if it's not whitespace it creates a `JSXText` object with the text contents and sends it on. In this case the matcher does not need the parent `path` object.

The engine behind `orsa-js-analyzer` is [babel-traverse](https://github.com/babel/babel/tree/master/packages/babel-traverse).

The easiest way I've found to develop these matchers is to use something like [AST Explorer](https://astexplorer.net/), set to Babel 6 mode, to see what the AST structure is of a code sample I develop.
