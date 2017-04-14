const expect = require('chai').expect;
const OrsaBase = require('../../src/base');
const EventEmitter = require('events');

describe('orsa project', () => {
  it('should have no type', () => {
    const op = new OrsaBase(null);
    expect(op.type).to.equal('');
  });

  it('should save', () => {
    const op = new OrsaBase(null);
    expect(op.save()).to.eql({
      type: '',
    });
  });

  it('should restore', () => {
    const op = new OrsaBase(null);
    op.restore({
      type: 'bar',
    });
    expect(op.type).to.eql('bar');
  });

  it('should allow persisted attributes', (done) => {
    const op = new OrsaBase(null);
    op.setPersistedAttributes([
      'hi',
    ]);
    op.hi = 'foo';
    expect(op.hi).to.eql('foo');
    expect(op.save()).to.eql({
      type: '',
      hi: 'foo',
    });
    op.on(OrsaBase.CHANGED, (obj, { attribute, value, }) => {
      expect(obj === op).to.be.true;
      expect(attribute).to.eql('hi');
      expect(value).to.eql('foo');
      done();
    });
    op.hi = 'foo';
  });

  it('should emit on itself', (done) => {
    const op = new OrsaBase(null);
    op.on('foo', (obj, data) => {
      expect(op === obj).to.be.true;
      expect(data).to.eql({ foo: 'bar', });
      done();
    });
    op.emit('foo', { foo: 'bar', });
  });

  it('should emit to the top parent', (done) => {
    const p1 = new EventEmitter();
    const p2 = {
      parent: p1,
    };
    const op = new OrsaBase(p2);
    p1.on('foo', (obj, data) => {
      expect(op === obj).to.be.true;
      expect(data).to.eql({ foo: 'bar', });
      done();
    });
    op.emit('foo', { foo: 'bar', });
  });
});
