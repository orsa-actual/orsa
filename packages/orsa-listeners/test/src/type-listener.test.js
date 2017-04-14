/* eslint class-methods-use-this: 0 */
const expect = require('chai').expect;
const TypeListener = require('../../src/type-listener');
const {
  MetaData,
  Base,
  ElementSet,
} = require('orsa-dom');
const isFunction = require('lodash.isfunction');
const keys = require('lodash.keys');
const sinon = require('sinon');

class MyTypeListener extends TypeListener {
  matchedEvent(evtName, domElement, info) {
    super.matchedEvent(evtName, domElement, info);
    this.evtName = evtName;
    this.domElement = domElement;
    this.info = info;
  }
}

class MyRefusingListener extends TypeListener {
  shouldProcess() {
    return false;
  }
}

class MyListenerThatFiresMessagesDuringProcess extends TypeListener {
  process(de, cb) {
    expect(de).to.not.be.null;
    this.callback({}, this.elem, this.info);
    cb();
  }
}

describe('orsa type listener', () => {
  it('should listen for basic events', () => {
    const op = new MyTypeListener();
    const names = [];
    op.initialize({
      on: (name) => {
        names.push(name);
      },
    });
    op.setup();
    expect(names).to.eql([
      Base.CHANGED,
      MetaData.UPDATE,
      MetaData.DELETE,
      ElementSet.ADD,
    ]);
  });

  it('should send the message on to the listener', () => {
    const op = new MyTypeListener('hoosier');
    const ncb = {};
    op.initialize({
      taskManager: {
        add: (name, task) => {
          expect(name).to.eql('process');
          expect(isFunction(task)).to.be.true;
          task(() => {});
        },
      },
      on: (name, cb) => {
        ncb[name] = cb;
      },
    });
    op.setup();
    const elem = {
      match: (pattern) => {
        expect(pattern).to.eql({
          type: 'hoosier',
        });
        return true;
      },
    };
    const info = {
      foo: 'bar',
    };
    keys(ncb).forEach((k) => {
      ncb[k]({}, elem, info);
      expect(op.domElement).to.eql(elem);
      expect(op.evtName).to.eql(k);
      expect(op.info).to.eql(info);
    });
  });

  it('should send the message on to the listener', () => {
    const op = new MyListenerThatFiresMessagesDuringProcess('hoosier');

    op.elem = {
      name: 'foo',
      match: (pattern) => {
        expect(pattern).to.eql({
          type: 'hoosier',
        });
        return true;
      },
    };
    op.info = {
      foo: 'bar',
    };

    op.initialize({
      taskManager: {
        add: (name, task) => {
          expect(name).to.eql('process');
          expect(isFunction(task)).to.be.true;
          task(() => {});
        },
      },
      on: (name, cb) => {
        op.callback = cb;
      },
    });
    op.setup();
    op.callback({}, op.elem, op.info);
  });

  it('should allow for refusing a message', () => {
    const op = new MyRefusingListener('hoosier');
    const ncb = {};
    const spy = sinon.spy();
    op.initialize({
      taskManager: {
        add: spy,
      },
      on: (name, cb) => {
        ncb[name] = cb;
      },
    });
    op.setup();
    const elem = {
      match: (pattern) => {
        expect(pattern).to.eql({
          type: 'hoosier',
        });
        return true;
      },
    };
    const info = {
      foo: 'bar',
    };
    keys(ncb).forEach((k) => {
      ncb[k]({}, elem, info);
    });
    expect(spy.called).to.be.false;
  });
});
