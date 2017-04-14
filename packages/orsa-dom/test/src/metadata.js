const expect = require('chai').expect;
const OrsaMetadata = require('../../src/metadata');
const EventEmitter = require('events');

describe('orsa metadata', () => {
  it('should allow for setting and getting', () => {
    const md = new OrsaMetadata();
    md.set('foo', 'bar');
    expect(md.toObject()).to.eql({
      foo: 'bar',
    });
    expect(md.get('foo')).to.eql('bar');
    expect(md.get('fooz')).to.be.null;
  });

  it('should allow for setting and getting options', () => {
    const md = new OrsaMetadata();
    md.set('foo', 'bar', {
      version: 1,
    });
    expect(md.toObject()).to.eql({
      foo: 'bar',
    });
    expect(md.getOptions('foo')).to.eql({
      version: 1,
    });
    expect(md.getOptions('fooz')).to.be.null;
  });

  it('should allow for updating', () => {
    const md = new OrsaMetadata();
    md.set('foo', 'bar');
    expect(md.toObject()).to.eql({
      foo: 'bar',
    });
    md.set('foo', 'baz');
    expect(md.toObject()).to.eql({
      foo: 'baz',
    });
  });

  it('should allow for deleting', () => {
    const md = new OrsaMetadata();
    md.set('foo', 'bar');
    expect(md.toObject()).to.eql({
      foo: 'bar',
    });
    md.delete('foo');
    expect(md.toObject()).to.eql({
    });
  });

  it('should support temporaries', () => {
    const md = new OrsaMetadata();
    md.set('foo', 'bar', {
      temporary: true,
    });
    md.set('fooz', 'baz');
    expect(md.toObject()).to.eql({
      fooz: 'baz',
    });
  });

  it('should support freeze and thaw', () => {
    const md = new OrsaMetadata();
    md.set('foo', 'bar', {
      temporary: true,
    });
    md.set('fooz', 'baz');
    const frozen = md.save();
    const md2 = new OrsaMetadata();
    md2.restore(frozen);
    expect(md2.toObject()).to.eql({
      fooz: 'baz',
    });
  });

  it('should emit updates', (done) => {
    const md = new OrsaMetadata();
    md.on(OrsaMetadata.UPDATE, (mdo, { key, value, }) => {
      expect(md === mdo).to.be.true;
      expect(key).to.eql('foo');
      expect(value).to.eql('bar');
      done();
    });
    md.set('foo', 'bar');
  });

  it('should emit support a secondary emitter', (done) => {
    const emitter = new EventEmitter();
    const md = new OrsaMetadata(emitter, {});
    emitter.on(OrsaMetadata.UPDATE, (mdo, { key, value, }) => {
      expect(md === mdo).to.be.true;
      expect(key).to.eql('foo');
      expect(value).to.eql('bar');
      done();
    });
    md.set('foo', 'bar');
  });

  it('should match on something', () => {
    const md = new OrsaMetadata(null, {
      foo: 'bar',
    });
    expect(md.match({})).to.be.true;
    expect(md.match({
      foo: 'bar',
    })).to.be.true;
    expect(md.match({
      fooz: 'baz',
    })).to.be.false;
  });

  it('should emit support a secondary emitter on delete', (done) => {
    const emitter = new EventEmitter();
    const md = new OrsaMetadata(emitter, {});
    md.set('foo', 'bar');
    emitter.on(OrsaMetadata.DELETE, (mdo, { key, }) => {
      expect(md === mdo).to.be.true;
      expect(key).to.eql('foo');
      done();
    });
    md.delete('foo');
  });
});
