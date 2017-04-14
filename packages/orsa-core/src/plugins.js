const EventEmitter = require('events');
const values = require('lodash.values');

class OrsaPlugins extends EventEmitter {
  constructor(orsa) {
    super();
    this.orsa = orsa;
    this.plugins = {};
  }

  add(PluginClass) {
    if (!PluginClass.version) {
      this.emit(OrsaPlugins.ERROR, new Error('Bad plugin version'));
    }
    if (this.plugins[PluginClass.name] === undefined) {
      this.plugins[PluginClass.name] = new PluginClass();
      this.emit(OrsaPlugins.CREATE, this.plugins[PluginClass.name]);
    }
  }

  remove(name) {
    if (this.plugins[name] !== undefined) {
      delete this.plugins[name];
      this.emit(OrsaPlugins.DELETE, name);
    }
  }

  find(name) {
    return this.plugins[name];
  }

  invoke(method, params) {
    values(this.plugins).forEach((plugin) => {
      if (plugin[method]) {
        plugin[method](params);
      }
    });
  }
}

OrsaPlugins.CREATE = 'CREATE';
OrsaPlugins.DELETE = 'DELETE';

module.exports = OrsaPlugins;
