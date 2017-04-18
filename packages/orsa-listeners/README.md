# Orsa Listeners

The Orsa listeners classes are the easiest way to write a new plugin. They let you focus on doing the processing part of the work, without having to worry about the event stream from Orsa.

There are four classes:

| Class | Description |
|-----|-----|
| [BaseListener](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-listeners/src/base-listener.js) | This is the base class for all the listeners. It provides `listenFor` which is an easy way to register for events. As well as `addTask` which is a handy way of adding tasks. And logging through `logInfo`, `logError`, and `logWarn`. As nice as `BaseListener` is, you'll probably want to use [ProjectListener](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-listeners/src/project-listener.js) or [FileListener](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-listeners/src/file-listener.js) instead, both of which are subclasses of [TypeListener](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-listeners/src/type-listener.js) |
| [TypeListener](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-listeners/src/type-listener.js) | TypeListener manages listening to particular types of DOM elements, notably `File` and `Project`. It knows which messages to listen for. It also supports **locking**. |
| [ProjectListener](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-listeners/src/project-listener.js) | Listens for changes to Project elements. |
| [FileListener](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-listeners/src/file-listener.js) | Listens for changes to File elements. |

The two critical methods on [ProjectListener](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-listeners/src/project-listener.js) and [FileListener](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-listeners/src/file-listener.js) that you need to override are `shouldProcess(domElement)` and `process(domElement, done)`. The `shouldProcess` method is called to determine if now is the right time to run. And the `process` method is called when `shouldProcess` returns true.

In `shouldProcess` you should inspect the attributes and `metadata` of the DOM element to make sure that you have the data you need to run. In `process` you do the work and then call `done` when you are done.

You also have access to `this.orsa` any time you want to log something.

An example file listener watches for a Javascript AST to become available and then does something with it, like so:

```
const get = require('lodash.get');

class MyCoolPlugin extends FileListener {
  shouldProcess(domElement) {
    return get(domElement.metadata, 'js.ast', null) !== null;
  }

  process(domElement, callback) {
    domElement.metadata.set('js.woohoo', 'yay!');
    callback();
  }
}
```

## Naming

Naming your plugin class appropriately is **really** important. Orsa uses the class name of your Plugin to disambiguate it from other plugins. So it's really important that it's unique. We recommend naming your plugin class as a camel-cased version of the package name. For example `orsa-my-scanner-plugin` would become `OrsaMyScannerPlugin` as shown below:

```
class OrsaMyScannerPlugin extends ProjectListener {
  ...
}
```

## Locking

The `TypeListener` class provides a helpful `locking` behavior. Because a `process` method might make multiple changes to a DOM element, which would cause multiple events, it's likely that you would get into an event stream endless death spiral. Locking ensures that if `process` is already running against a particular element, it will not be run again until `process` has been completed.
