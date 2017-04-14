const expect = require('chai').expect;
const sinon = require('sinon');
const OrsaPlugins = require('../../src/plugins');
const OrsaCore = require('../../src/core');

class NoVersionPlugin {
}

class PluginWithoutInitliaze {
}
PluginWithoutInitliaze.version = 1;

class GoodExamplePlugin {
  constructor() {
    this.created = true;
    this.reportCalledWith = null;
  }
  report(params) {
    this.reportCalledWith = params;
  }
  initialize(orsa, config) {
    this.initializeCalledWith = config;
  }
}
GoodExamplePlugin.version = 1;

class NoReportPlugin {
  constructor() {
    this.created = true;
  }
}
NoReportPlugin.version = 1;

describe('orsa plugins', () => {
  it('should handle a plugin with no version', (done) => {
    const op = new OrsaPlugins();
    op.on(OrsaPlugins.ERROR, (err) => {
      expect(err).to.not.be.null;
      done();
    });
    op.add(NoVersionPlugin);
  });

  it('should add plugins', (done) => {
    const op = new OrsaPlugins();
    op.on(OrsaPlugins.CREATE, (plugin) => {
      expect(plugin.created).to.be.true;
      done();
    });
    op.add(GoodExamplePlugin);
  });

  it('should remove plugins', (done) => {
    const op = new OrsaPlugins();
    op.add(GoodExamplePlugin);
    op.on(OrsaPlugins.DELETE, (name) => {
      expect(name).to.equal('GoodExamplePlugin');
      done();
    });
    op.remove('GoodExamplePlugin');
    op.remove('bar');
  });

  it('should not double add plugins', () => {
    const op = new OrsaPlugins();
    const spy = sinon.spy();
    op.on(OrsaPlugins.CREATE, spy);
    op.add(GoodExamplePlugin);
    op.add(GoodExamplePlugin);
    sinon.assert.calledOnce(spy);
  });

  it('should find plugins', () => {
    const op = new OrsaPlugins();
    op.add(GoodExamplePlugin);
    expect(op.find('GoodExamplePlugin')).to.not.be.null;
  });

  it('should invoke methods on plugins', () => {
    const op = new OrsaPlugins();
    op.add(GoodExamplePlugin);
    op.add(NoReportPlugin);
    op.invoke('report', {
      foo: 'bar',
    });
    expect(op.find('GoodExamplePlugin').reportCalledWith).to.eql({
      foo: 'bar',
    });
  });

  it('should get initialized', () => {
    const oc = new OrsaCore({
      foo: 'bar',
    });
    oc.plugins.add(GoodExamplePlugin);
    expect(oc.plugins.find('GoodExamplePlugin').initializeCalledWith).to.eql({
      foo: 'bar',
    });
  });

  it('should get initialized, or not', () => {
    const oc = new OrsaCore({
      foo: 'bar',
    });
    oc.plugins.add(PluginWithoutInitliaze);
    oc.plugins.add(GoodExamplePlugin);
    expect(oc.plugins.find('GoodExamplePlugin').initializeCalledWith).to.eql({
      foo: 'bar',
    });
  });
});
