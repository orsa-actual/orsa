# Orsa Core

The OrsaCore class is both the root element of the Orsa DOM and the main entry point for starting Orsa.

Invoking Orsa is easy:

```
const OrsaCore = require('orsa-core').OrsaCore;

const oc = new OrsaCore({
  plugins: [
    require('orsa-project-fs-scanner-plugin'),
  ],
  'orsa-project-fs-scanner-plugin': {
    path: './myprojects',
  },
});
oc.run((err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(JSON.stringify(oc.toObject(), null, 2));
  }
});
```

This will scan for project directories in the `./myprojects` directory.

If writing your own Orsa runner isn't your bag, if you are a just a command line kinda cat, then rock on my friend and check out [orsa-cli](https://github.com/orsa-actual/orsa/tree/master/packages/orsa-cli).
