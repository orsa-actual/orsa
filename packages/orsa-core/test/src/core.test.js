const expect = require('chai').expect;
const OrsaCore = require('../../src/core');

class MyPlugin {
  constructor() {
    this.scanCalled = false;
  }
  scan() {
    this.scanCalled = true;
  }
}
MyPlugin.version = 1;

class BadPlugin {
  initialize(orsa) {
    this.orsa = orsa;
  }
  scan() {
    this.orsa.logManager.error('foo');
  }
}
BadPlugin.version = 1;

describe('orsa-core index', () => {
  it('should have a version', () => {
    expect(OrsaCore.version).to.equal('0.0.3');
  });

  it('should allow subscriptions', (done) => {
    const oc = new OrsaCore({
      plugins: null,
    });
    oc.on('foo', (obj, info) => {
      expect(obj === oc).to.be.true;
      expect(info).to.equal('bar');
      done();
    });
    oc.emit('foo', 'bar');
  });

  it('should catch a plugin load error', (done) => {
    const oc = new OrsaCore({
      plugins: [
        'a',
      ],
    }, {
      require: () => {
        throw new Error('wow, bad plugin!');
      },
      console: {
        log: () => {},
      },
    });
    oc.run((err) => {
      expect(err).to.eql('Error: wow, bad plugin!');
      done();
    });
  });

  it('should load plugins', () => {
    const oc = new OrsaCore({
      plugins: [
        'a',
      ],
    }, {
      require: (name) => {
        expect(name).to.eql('a');
        return MyPlugin;
      },
    });
    oc.run((err) => {
      expect(err).to.be.null;
      expect(oc.plugins.find('MyPlugin').scanCalled).to.be.true;
    });
  });

  it('should load plugins', () => {
    const oc = new OrsaCore({
      plugins: [
        MyPlugin,
      ],
    });
    oc.run((err) => {
      expect(err).to.be.null;
      expect(oc.plugins.find('MyPlugin').scanCalled).to.be.true;
    });
  });

  it('should load plugins with multiple plugin syntax', () => {
    const oc = new OrsaCore({
      plugins: [
        'a',
      ],
    }, {
      require: (name) => {
        expect(name).to.eql('a');
        return [
          MyPlugin,
        ];
      },
    });
    oc.run((err) => {
      expect(err).to.be.null;
      expect(oc.plugins.find('MyPlugin').scanCalled).to.be.true;
    });
  });

  it('should run', (done) => {
    const oc = new OrsaCore();
    const names = [];
    oc.on(OrsaCore.PHASE_START, (obj, name) => {
      expect(obj === oc).to.be.true;
      names.push(name);
    });
    oc.run((err) => {
      expect(err).to.be.null;
      expect(names).to.eql([
        'setup',
        'scan',
        'index',
        'summarize',
        'shutdown',
      ]);
      done();
    });
  });

  it('should run with plugins', (done) => {
    const oc = new OrsaCore();
    oc.plugins.add(MyPlugin);
    oc.run((err) => {
      expect(err).to.be.null;
      expect(oc.plugins.find('MyPlugin').scanCalled).to.be.true;
      done();
    });
  });

  it('should run with an error', (done) => {
    const oc = new OrsaCore();
    oc.plugins.add(BadPlugin);
    const names = [];
    oc.on(OrsaCore.PHASE_START, (obj, name) => {
      expect(obj === oc).to.be.true;
      names.push(name);
    });
    oc.run((err) => {
      expect(err).to.eql('foo');
      expect(names).to.eql([
        'setup',
        'scan',
      ]);
      done();
    });
  });

  it('should log warnings, etc.', () => {
    let expected = '';

    const oc = new OrsaCore({
      fooz: 'baz',
    }, {
      console: {
        log: (t1, t2) => {
          expect(t1 === expected).to.be.true;
          expect(t2).to.eql('foo');
        },
      },
    });

    expected = 'info';
    oc.logManager.info('foo');

    expected = 'warning';
    oc.logManager.warning('foo');

    expected = 'error';
    oc.logManager.error('foo');
  });

  it('should have children', () => {
    const oc = new OrsaCore({
      fooz: 'baz',
    });
    expect(oc.children).to.not.be.undefined;
  });

  it('should be able to save', () => {
    const oc = new OrsaCore();
    expect(oc.save()).to.eql({
      type: '',
      children: [],
    });
  });
});
