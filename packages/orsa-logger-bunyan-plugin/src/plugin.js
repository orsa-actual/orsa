const bunyan = require('bunyan');
const assign = require('lodash.assign');

const BaseListener = require('orsa-listeners').BaseListener;

class OrsaBunyanLogger extends BaseListener {
  constructor(options = {}) {
    super({});
    this.options = assign({
      bunyan,
    }, options);
    this.bunyan = this.options.bunyan.createLogger({
      name: 'orsa',
    });
  }

  initialize(orsa) {
    orsa.on('orsa.log.warn', (orsaObj, text) => {
      this.bunyan.warn(text);
    });
    orsa.on('orsa.log.info', (orsaObj, text) => {
      this.bunyan.info(text);
    });
    orsa.on('orsa.log.error', (orsaObj, text) => {
      this.bunyan.error(text);
    });
  }
}

module.exports = OrsaBunyanLogger;
