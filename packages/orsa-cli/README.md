# Orsa command line interface

The `orsa` command line interface.

# Usage

To find and analyze a set of projects in a directory called `myprojects` run orsa this way:

```
orsa --path myprojects --output myprojects.json
```

To connect to an Orsa Server instance, add the server option:

```
orsa --path myprojects --output myprojects.json --server http://localhost:3000/api/update
```
