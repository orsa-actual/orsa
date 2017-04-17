/* eslint class-methods-use-this: 0 */
const expect = require('chai').expect;
const Plugin = require('../../src/plugin');

class FakeBunyan {
  info(text) {
    expect(text).to.eql('info-msg');
  }
  warn(text) {
    expect(text).to.eql('warn-msg');
  }
  error(text) {
    expect(text).to.eql('error-msg');
  }
}

describe('orsa bunyan logger plugin', () => {
  it('should send on messages', () => {
    const p = new Plugin({
      bunyan: {
        createLogger: (options) => {
          expect(options.name).to.eql('orsa');
          return new FakeBunyan();
        },
      },
    });
    const events = {};
    p.initialize({
      on: (evtName, cb) => {
        events[evtName] = cb;
      },
    });
    events['orsa.log.warn'](null, 'warn-msg');
    events['orsa.log.error'](null, 'error-msg');
    events['orsa.log.info'](null, 'info-msg');
  });
});
