const expect = require('chai').expect;
const OrsaCore = require('../index');

describe('orsa-core index', () => {
  it('should have a version', () => {
    expect(OrsaCore.version).to.equal('0.0.3');
  });

  it('should allow subscriptions', (done) => {
    const oc = new OrsaCore();
    oc.on('foo', (obj, info) => {
      expect(obj === oc).to.be.true;
      expect(info).to.equal('bar');
      done();
    });
    oc.emit('foo', 'bar');
  });

  it('should log warnings, etc.', () => {
    const oc = new OrsaCore({
      fooz: 'baz',
    });
    expect(oc.children).to.not.be.undefined;
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
