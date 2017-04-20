# Orsa Javascript language package

Parses the AST for Javascript classes and React components.

## Options

Here are the configuration options under `orsa-js-language-plugin`:

| Option | Description |
|-----|----|
| disableStandardMatachers | If true all the standard matchers are disabled and only custom matchers defined with the `matchers` key are used. |
| matchers | An array of matcher functions following the [matcher function contract](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-js-analyzer/docs/matcher-contract.md) |
