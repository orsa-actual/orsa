# Orsa architecture

Here is some more information on the Orsa architecture and why it is the way it is.

## The DOM and the Event Stream

Orsa has a somewhat unique architecture. The three primary elements are the plugins, the DOM, and the event stream. Plugin tasks make alterations to the DOM which generates events, other plugins then look at those events, and make further alterations, and the system cycles until all the tasks and events are resolved.

Here is an example scenario;

* A git plugin clones a project into a local directory. The git plugin then adds a `Project` DOM element to the root element.
* A node project plugin listening for `Project` type events sees the new project and scans to see if it's a JS project. It then creates a task to check the project directory for a `package.json` and if so it sets a `projectType` metadata attribute to `node`.
* Another node plugin sees that a `Project` element has been updated to `projectType === 'node'` and it creates a task to grab the list of source files and adds those as `File` DOM elements to the `Project` element.
* Another node plugin sees a new `File` element with a `mimeType` of `text/javascript` and it creates a task to scan the file to create an AST, which it then sets as a temporary metadata element, `js.ast`, on the File element.
* And so on, and so on, until all the tasks are resolved.

The upside of the event stream is that you can easily snap processing elements into our out of it. The downside, familiar to anyone who has worked on event-based system is event cycling, where an event spawns a process, which in turn fires an event which in turn re-spawns it's own process. There is no magic bullet for event cycling, but the [listener classes](https://github.com/orsa-actual/orsa/tree/master/packages/orsa-listeners), which we strongly recommend using, make it less of an issue.

It's important to note that Orsa has a single event stream for all the elements of the DOM, and that event stream comes from the `root element`. That way plugins don't have to track all of the DOM nodes themselves and subscribe/unsubscribe to each one.

## Why Phases?

Orsa runs a set of phases; `setup`, `scan`, `index`, `summarize` and `shutdown`. Strictly speaking your can do whatever it wants any time it wants in any of these phases. And the DOM is completely unlocked in all phases. But the phase architecture, familiar as a pattern to anyone who has used Apache, or used a testing framework like Mocha, provides a nice contract for plugin authors to run their code at the *correct time*.

## What About Scaling?

For a single project, or smaller clusters of projects, the Orsa in-memory DOM and whatever you choose to export it to should be sufficient to get a lot of useful metadata about your projects. For larger project you should deploy an orsa-server and then point your `orsa` CLI at it on a per-project basis in your CI/CD pipeline. Even for small projects an orsa-server would be a good choice to get a nice overall interface on your projects.

## Why OOP?

FP is so hot right now, so why is Orsa an OOP system? The value that comes out of ORSA is the Document Object Model (DOM). The DOM has all the projects, all the files, the metadata for the projects and files, and so on. And, by their very nature a DOM is an **Object** model comprised of objects. So, since the DOM is classes and objects it stands to reason that plugins and the task manager, should be as well.

That being said, there is nothing precluding someone from creating a plugin that in turn takes a set of functions which it then runs against the DOM.

## Why Lerna?

You may have noticed the structure of this repo is to have the modules in a `packages` directory. That's because we are using [Lerna](https://github.com/lerna/lerna) which makes it a **lot easier** to develop systems that are an eco-system of smaller modules and plugins.
