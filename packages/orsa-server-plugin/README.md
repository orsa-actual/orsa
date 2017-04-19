# Orsa Server plugin

Handles sending Orsa data to the [Orsa Server](https://github.com/orsa-actual/orsa-server).

## Configuration

You need to tell the plugin where the server is. You do that in the configuration as shown below:

```
{
  'orsa-server-plugin': {
    url: 'http://localhost:3000/api/update',
  },
}
```

If you are using the [command line interface](https://github.com/orsa-actual/orsa/tree/master/packages/orsa-cli) simply add the `server` command line option:

```
orsa --server http://localhost:3000/api/update
```
