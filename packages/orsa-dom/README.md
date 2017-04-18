# Orsa DOM

The Orsa DOM is the central element of the Orsa system. It's the reason that folks use Orsa.

The Orsa DOM system includes these classes:

| Class Name | Description |
|------|------|
| [OrsaBase](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-dom/src/base.js) | This is the base node type. It manages the persisted attributes of the node, as well as emitting events, saving/restoring, and conversion to a JSON object. |
| [Element](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-dom/src/element.js) | Derived from [OrsaBase](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-dom/src/base.js) this object also contains `metadata` and `children`. |
| [Project](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-dom/src/project.js) | Derived from [Element](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-dom/src/element.js) the `Project` node type includes; `name`, `localPath` and `version` as persisted attributes. |
| [File](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-dom/src/file.js) | Derived from [Element](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-dom/src/element.js) the `File` node type includes; `localPath`, `relativePath`, `name` and `mimeType` as persisted attributes. |

## Important methods

Elements support these accessor and methods:

| Method/Field | Description |
|-----|-----|
| `type` | The type of node. Important types are `File.TYPE` and `Project.TYPE`. |
| `toObject()` | Returns a JSON version of the node and it's children. |
| `match(pattern)` | Returns true if an element matches the keys of the pattern. |
| `save()` and `restore(data)` | Saves and restores a DOM structure. |
| `metadata.get(key)` | Gets a metadata value. |
| `metadata.set(key, value)` | Sets a metadata value. |
| `children.add(elem)` | Adds a child. |
| `children.toArray()` | Returns the array of children. |

## Persisted Attributes

Persisted attributes are metadata values that are so critical to the function of the system that they are promoted out of the `metadata` and onto the DOM element itself as direct attributes. For `Project` nodes this includes; `name`, `localPath` and `version`. For `File` node type includes; `localPath`, `relativePath`, `name` and `mimeType`.

## Metadata

Metadata is a critical part of the DOM, it's where plugins store everything they learn about a file or a project. Metadata supports two methods `set` and `get`:

### set(key, value, options)

Sets a key on metadata structure. The key is in [lodash's set format](https://lodash.com/docs/4.17.4#set). `options` only supports one option at the moment, which is `temporary`. If `temporary` is set then the data is not output during save/restore or in `toObject()`. This is handy when you have big transient structures, like the AST, which are handy during processing, but which should not be stored.

Here is an example set:

```
domElement.metadata.set('foo.bar.baz', 15);
```

This would result in:

```
foo: {
  bar: {
    baz: 15,
  },
},
```

In the `toObject()` output.

Here is an example of a set of a temporary value:

```
domElement.metadata.set('foo.bar.baz', 15, {
  temporary: true,
});
```

This key would not be output from `toObject()`.

### get(key, value)

Gets a key from a metadata structure. The key is in [lodash's get format](https://lodash.com/docs/4.17.4#get).

Here is an example get:

```
domElement.metadata.get('foo.bar.baz');
```

## Children

Subclasses of `Element` support children. You can add a child this way:

```
const realNewElement = domElement.children.add(newElement);
```

A really important note when it comes to adding a child is the merging behavior (described below). That's why the expression above says `realNewElement` is the output of `add`. When you add an element it's possible that instead of being added it will be merged with an existing element. In either case the `realNewElement` is the element you should use from that point until the end of your plugins interaction with the element.

You can access the set children on an element this way:

```
domElement.children.toArray();
```

### Children Merging

If you are writing a plugin that adds elements to the DOM, for example a project or file scanner, then you will invariably want to handle the "add only if it's not already there" use case. Well, good on yah, but you don't need to do that. The `RootElement` and `Project` elements are pre-set so that if you add an element that has the same persisted attributes as another child that is already there then your new element is merged with the original.

## Other classes

This package also includes [ElementSet](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-dom/src/element-set.js), which manages the children array of Elements, [MetaData](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-dom/src/metadata.js) which manages the metadata object, and [RootElement](https://github.com/orsa-actual/orsa/blob/master/packages/orsa-dom/src/root-element.js) which handles creating elements by type name when saving and restoring the DOM.
