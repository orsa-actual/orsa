# Orsa Javascript analyzer

There is a reason why languages like TypeScript exist, and that's because Javascript, as much as we love it, has about fifteen ways to do anything. That makes it really hard to pick out language features, like class definitions, imports, exports, JSX uses, etc. This library exists apart from [Orsa](https://github.com/orsa-actual/orsa) to make it easier to manage the pattern matching for features in Javascript.

This library normalizes the different ways that a feature is expressed in Javascript into a standard set of feature objects. For example, `const Foo = React.createClass({...})`, `class Foo extends React.Component { ... }`, and `const MyComponent = (props) => (...);` are all normalized into a `class` with different metadata. This makes it easier for downstream analysis applications, like Orsa, to get a high level view of what is defined and where.

## Terminology

| Term | Meaning |
|----|----|
| Features | An important feature in a JS file. This includes things like class definitions, uses of JSX, imports and requires. All features have a `type` which define what the feature is, as well as a `start` and `end` which store the start and end line numbers. Beyond that each feature has different attributes. |
| Matcher | A function that, given an AST node and a path, returns a feature if it finds one. |

### Class

| Field | Type | Description |
|-----|-----|-----|
| start | number | The starting line number. |
| end | number | The ending line number. |
| type | string | `class` |
| name | string | The name of the class. |
| superClass | string | The superclass |
| metadata | object | Additional metadata about the class. |
| metadata.react | boolean | True if this is a react component. |
| metadata.stateless | boolean | True if this is a stateless react component. |
| methods | array | An array of methods |
| jsDoc | object | JSDoc information |

### Method

| Field | Type | Description |
|-----|-----|-----|
| start | number | The starting line number. |
| end | number | The ending line number. |
| type | string | `method` |
| name | string | The name of the method. |
| kind | string | The kind of the method as defined by [babylon](https://github.com/babel/babylon). |
| params | array | The parameters. |
| jsDoc | object | JSDoc information |

### Parameter

| Field | Type | Description |
|-----|-----|-----|
| start | number | The starting line number. |
| end | number | The ending line number. |
| type | string | `parameter` |
| name | string | The name of the method. |

### Import

| Field | Type | Description |
|-----|-----|-----|
| start | number | The starting line number. |
| end | number | The ending line number. |
| type | string | `import` |
| from | string | The name of what's being imported. |
| keys | array | The names of the variables that the import is being assigned to. |

### JSX Usage

| Field | Type | Description |
|-----|-----|-----|
| start | number | The starting line number. |
| end | number | The ending line number. |
| type | string | `jsx-usage` |
| name | string | The name of the component. |
| base | string | The base name of the component if it's in the form of `<Foo.Bar />` base would be `Foo`. |
| attributes | array | The attributes used by the component invocation. |

## Connection to orsa-ast-parser

There is a development dependency on `orsa-ast-parser` because we want't to ensure that the AST that we are traversing is based on the same [babylon](https://github.com/babel/babylon) parameters as is used by Orsa core.
