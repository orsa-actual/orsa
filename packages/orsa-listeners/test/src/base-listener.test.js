const expect = require('chai').expect;
const EventEmitter = require('events');
const BaseListener = require('../../src/base-listener');
const sinon = require('sinon');

describe('orsa base listener', () => {
  it('should handle a name and have a version', () => {
    const op = new BaseListener();
    expect(op.version).to.be.defined;
  });

  it('should have all the lifecycle events', () => {
    const op = new BaseListener();
    op.setup();
    op.scan();
    op.index();
    op.summarize();
    op.shutdown();
  });

  it('should add tasks', () => {
    const op = new BaseListener();
    op.initialize({
      taskManager: {
        add: (name, cb) => {
          expect(name).to.eql('BaseListener: foozbaz');
          expect(cb).to.be.defined;
        },
      },
    });
    op.addTask('foozbaz', () => {});
  });

  it('should log error/warning/info', () => {
    const op = new BaseListener();
    op.initialize({
      logManager: {
        warn: (text) => {
          expect(text).to.eql('BaseListener: warning');
        },
        info: (text) => {
          expect(text).to.eql('BaseListener: info');
        },
        error: (text) => {
          expect(text).to.eql('BaseListener: error');
        },
      },
    });
    op.logWarn('warning');
    op.logInfo('info');
    op.logError('error');
  });

  it('should handle no match', () => {
    const op = new BaseListener();
    const orsa = new EventEmitter();
    op.initialize(orsa, {
      foo: 'bar',
    });
    expect(op.config).to.eql({
      foo: 'bar',
    });

    const spy = sinon.spy();
    op.listenFor('bar', {
      fooz: 'baz',
    }, spy);

    orsa.emit('bar', {}, {
      match: (pattern) => {
        expect(pattern).to.eql({
          fooz: 'baz',
        });
        return false;
      },
    }, 20);

    expect(spy.called).to.be.false;
  });

  it('should listen to orsa for matching', (done) => {
    const op = new BaseListener();
    const orsa = new EventEmitter();
    op.initialize(orsa, {
      foo: 'bar',
    });
    expect(op.config).to.eql({
      foo: 'bar',
    });
    op.listenFor('bar', {
      fooz: 'baz',
    }, (obj, info) => {
      expect(obj).to.not.be.null;
      expect(info).to.eql(20);
      done();
    });
    orsa.emit('bar', {}, {
      match: (pattern) => {
        expect(pattern).to.eql({
          fooz: 'baz',
        });
        return true;
      },
    }, 20);
  });

  it('should listen to orsa for anything', (done) => {
    const op = new BaseListener();
    const orsa = new EventEmitter();
    op.initialize(orsa, {
      foo: 'bar',
    });
    expect(op.config).to.eql({
      foo: 'bar',
    });
    op.listenFor('bar', (obj, info) => {
      expect(obj).to.not.be.null;
      expect(info).to.eql(20);
      done();
    });
    orsa.emit('bar', {}, {}, 20);
  });
});
