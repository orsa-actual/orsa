<img src="/assets/logo.png" align="right" width="350" />

# Orsa

<a href="https://travis-ci.org/orsa-actual/orsa"><img alt="Travis Status" src="https://img.shields.io/travis/orsa-actual/orsa/master.svg?label=travis"></a>
<img alt="MIT License" src="https://img.shields.io/packagist/l/doctrine/orm.svg">
<a href="https://circleci.com/gh/orsa-actual/orsa"><img alt="CircleCI Status" src="https://img.shields.io/circleci/project/github/orsa-actual/orsa/master.svg?label=circle"></a>
<a href="https://codecov.io/github/orsa-actual/orsa"><img alt="Coverage Status" src="https://img.shields.io/codecov/c/github/orsa-actual/orsa/master.svg"></a>

Orsa is a system for monitoring a set of software projects. An easy way to think of it is like the code intelligence system that's built into an IDE, but headless and queryable so that you can get access to every thing it finds. It's also [pluggable](https://github.com/orsa-actual/orsa/blob/master/docs/plugins.md)), so if it doesn't get the data you need then you can easily add more scanners, indexers, summarizers or rules.

As software projects grow in both code size and contributors, keeping track of it can be a problem. What node modules define the `Selector` React object? What modules will be effected when I make a change? Who uses the `inverted` attribute on the `Button` component? These questions, and more, are what Orsa was designed to answer.

## How Does Orsa Work?

Orsa itself only does four things;

* Act as the root element of the object model of the projects and their files
* Manage plugins
* Manage tasks created by plugins
* Manage logging stuff

Plugins are what really [do all the work](https://github.com/orsa-actual/orsa/blob/master/docs/plugins.md). There are lots of useful plugins that come out of the box that you can use to scan your projects.

## Orsa and Javascript

Orsa is written in Javascript so we have [extensive support for it](https://github.com/orsa-actual/orsa/blob/master/docs/javascript.md). That being said, Orsa's DOM, plugin and task systems are in no way Javascript specific. So if you want to build plugins to scan Java, Closure, Go, Basic, or whatever, have at it, publish them on `npm` and I'm sure we'll give you a shout out.

## Want to see it in a UI?

Command line is great, but what you really want is a Web UI, we have that too in [orsa-server](https://github.com/orsa-actual/orsa-server)! And even better, it's not just a web UI, it's also a [GraphQL server](http://graphql.org/). So you can write your own apps against the GraphQL endpoint.

## Staying in contact

First, thanks for your interest in Orsa. It's awesome! We really wan't you to use it, get value out of it, love it, and contribute to it (in that order). And if you have problems along the way, or just want to talk, join us in [Slack](https://orsa-actual.slack.com).

## Origin of the name

Orsa is the word for a female bear in Spanish. And like a bear with her cubs Orsa gives you the opportunity to watch over you codebase and nurture it into the system you've always wanted.

The term `orsa-actual` stems from the fact that `orsa` was already taken on github, and that we like Battlestar Galactica and calling something "... actual" is really cool.
