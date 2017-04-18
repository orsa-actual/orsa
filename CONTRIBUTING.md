# Contributing

> Before contributing, please read our [code of conduct](https://github.com/orsa-actual/orsa/blob/master/CODE_OF_CONDUCT.md).

Contributions are always welcome, no matter how large or small.

## Chat

Feel free to check out [orsa-actual on slack](https://orsa-actual.slack.com).

## Developing

Orsa is built for node 4 and up but we develop using node 7. Make sure you are on npm 3.

You can check this with `node -v` and `npm -v`.

### Setup

```sh
$ git clone https://github.com/orsa-actual/orsa
$ cd orsa
$ make bootstrap
```

### Writing tests

Tests are super important. We won't take PRs for code that has less than perfect test coverage in this project. For your own plugins in your own projects you can do what you like, but getting high test coverage is really cool.

## Internals
- [Core](https://github.com/orsa-actual/orsa/tree/master/packages/orsa-core)
- [Listeners](https://github.com/orsa-actual/orsa/tree/master/packages/orsa-listeners)
- [DOM](https://github.com/orsa-actual/orsa/tree/master/packages/orsa-dom)
