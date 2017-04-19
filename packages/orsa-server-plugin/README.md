# Orsa Javascript build package

Handles running the build and test commands for Javscript projects.

## Configuration

You can specify the build and test commands in your Orsa configuration like so:

```
{
  'orsa-js-build-plugin': {
    'buildCommand': 'npm i --something funky',
    'testCommand': 'npm t --stranger things',
  },
}
```
