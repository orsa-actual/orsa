# Orsa plugins guide

Plugins are the critical element to Orsa. Without plugins Orsa is a literal no-op. Orsa manages three things, the DOM, the plugins and a task manager that monitors the tasks that plugins create. Plugins do all the work in Orsa.

A plugin is just a class. This is a plugin:

```
class MyPlugin {
}
```

Though it doesn't do much. There is one critical element to this example though, the class name. The class name of a plugin **must be unique** across all the plugins registered with Orsa during a run. So we strongly suggest that you name your plugin in a namespaced way, for example if your package name is `orsa-js-spellcheck-plugin` then your plugin should be `OrsaJSSpellcheckPugin`. By convention the package name of your project should be `orsa-*-plugin` so that it's easy to disambiguate on NPM.

## Plugin Methods

```
class MyPlugin {
  initialize(orsa, config) {
  }

  setup() {
  }

  scan() {
  }

  index() {
  }

  summarize() {
  }

  shutdown() {
  }
}
```

The `initialize` method is called before any processing happens. You are given the `orsa` root-element and the `config` which is the complete configuration for the Orsa run. If you want to have configuration variables specific to your plugin by convention those are all keyed under your package name. So if your package is `orsa-js-spellcheck-plugin` then all the configuration should go under a `orsa-js-spellcheck-plugin` key inside the `config`.

The rest of the methods; `setup`, `scan`, `index`, `summarize` and `shutdown` are the phases of processing and are run in that order. Phases run until all the tasks are complete.

What happens during these methods is largely by convention, but here are some guidelines:

* `setup` - In this phase you should make sure you are ready for processing. This is a good time to register listeners on the `orsa` object as that's where all the action is.
* `scan` - In this phase you should make sure you are ready for processing. In this your plugin should scan for new information to add to the DOM. By the end of this phase all of the raw information about the code should be gathered.
* `index` - In this phase plugins take all the raw information and create easier-to-use indices.
* `summarize` - In this phase plugins use the raw data and indices to develop any summary reports.
* `shutdown` - A phase you can use to run any final tasks before processing ends.

## Tasks

To register a task during one of these phases call:

```
orsa.taskManager.add('my-task-name', (done) => {
  // Do your stuff here
  done();
}
```

Call the `done` callback only when your task is completed.

## Logging

You'll want to be able to log your process, you can do that using the `logManager` on the `orsa` object. It has three methods `info`, `warn`, and `error`. We **strongly** recommend against using error and go with a `warn` message instead, where you state that you were unable to complete your task. `error` outputs an error message but also stops processing when the phase completes. So use `error` wisely.

# The Easier Route

Plugins do two things; listen for events and update the DOM. But what events should you listen to? To make it easier we've developed a set of [listener base classes](https://github.com/orsa-actual/orsa/tree/master/packages/orsa-listeners) that subscribe to events for you so that all you need to do is evaluate the DOM to see if you should run, and then handle the processing when the DOM is ready.
