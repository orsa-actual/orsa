/* eslint consistent-return: 0 */
const expect = require('chai').expect;
const sinon = require('sinon');

const Plugin = require('../../src/plugin');

describe('orsa js build plugin', () => {
  it('should not run in the right circumnstances', () => {
    const op = new Plugin();
    expect(op.shouldProcess({
      metadata: {
        get: () => '',
      },
    })).to.not.be.true;
  });

  it('should only run in the right circumnstances', () => {
    const op = new Plugin();
    expect(op.shouldProcess({
      metadata: {
        get: (key) => {
          if (key === 'projectType') {
            return 'node';
          }
          if (key === 'builtVersion') {
            return '1.0';
          }
        },
        version: null,
      },
    })).to.be.true;
  });

  it('should build with a different command', () => {
    const op = new Plugin({
      exec: (command, options, cb) => {
        expect(options.cwd).to.not.be.null;
        expect(command === 'build' || command === 'npm test')
          .to.be.true;
        cb(null, 'foo', 'bar');
      },
    });
    const infoSpy = sinon.spy();
    const warnSpy = sinon.spy();
    op.initialize({
      logManager: {
        info: infoSpy,
        warn: warnSpy,
      },
    }, {
      'orsa-js-build-plugin': {
        buildCommand: 'build',
      },
    });
    op.process({
      metadata: {
        set: () => {},
      },
    }, () => {
      expect(infoSpy).to.be.called;
      expect(warnSpy).to.not.be.called;
    });
  });

  it('should test with a different command', () => {
    const op = new Plugin({
      exec: (command, options, cb) => {
        expect(options.cwd).to.not.be.null;
        expect(command === 'npm install' || command === 'test')
          .to.be.true;
        cb(null, 'foo', 'bar');
      },
    });
    const infoSpy = sinon.spy();
    const warnSpy = sinon.spy();
    op.initialize({
      logManager: {
        info: infoSpy,
        warn: warnSpy,
      },
    }, {
      'orsa-js-build-plugin': {
        testCommand: 'test',
      },
    });
    op.process({
      metadata: {
        set: () => {},
      },
    }, () => {
      expect(infoSpy).to.be.called;
      expect(warnSpy).to.not.be.called;
    });
  });

  it('run build and test', () => {
    const op = new Plugin({
      exec: (command, options, cb) => {
        expect(options.cwd).to.not.be.null;
        expect(command === 'npm install' || command === 'npm test')
          .to.be.true;
        cb(null, 'foo', 'bar');
      },
    });
    const infoSpy = sinon.spy();
    const warnSpy = sinon.spy();
    op.initialize({
      logManager: {
        info: infoSpy,
        warn: warnSpy,
      },
    }, {});
    op.process({
      metadata: {
        set: (key, value) => {
          if (key === 'node.build.stdout') {
            expect(value).to.eql('foo');
          }
          if (key === 'node.build.stderr') {
            expect(value).to.eql('bar');
          }
        },
      },
    }, () => {
      expect(infoSpy).to.be.called;
      expect(warnSpy).to.not.be.called;
    });
  });

  it('handle a failing build', () => {
    const op = new Plugin({
      exec: (command, options, cb) => {
        expect(options.cwd).to.not.be.null;
        expect(command === 'npm install')
          .to.be.true;
        cb('ack!', 'foo', 'bar');
      },
    });
    const infoSpy = sinon.spy();
    const warnSpy = sinon.spy();
    op.initialize({
      logManager: {
        info: infoSpy,
        warn: warnSpy,
      },
    }, {});
    op.process({
      metadata: {
        set: (key, value) => {
          if (key === 'node.build.stdout') {
            expect(value).to.eql('foo');
          }
          if (key === 'node.build.stderr') {
            expect(value).to.eql('bar');
          }
        },
      },
    }, () => {
      expect(infoSpy).to.not.be.called;
      expect(warnSpy).to.be.called;
    });
  });

  it('handle a failing test', () => {
    const op = new Plugin({
      exec: (command, options, cb) => {
        expect(options.cwd).to.not.be.null;
        cb(command === 'npm test' ? 'ack!' : null, 'foo', 'bar');
      },
    });
    const infoSpy = sinon.spy();
    const warnSpy = sinon.spy();
    op.initialize({
      logManager: {
        info: infoSpy,
        warn: warnSpy,
      },
    }, {});
    op.process({
      metadata: {
        set: (key, value) => {
          if (key === 'node.build.stdout') {
            expect(value).to.eql('foo');
          }
          if (key === 'node.build.stderr') {
            expect(value).to.eql('bar');
          }
        },
      },
    }, () => {
      expect(infoSpy).to.be.called;
      expect(warnSpy).to.be.called;
    });
  });
});
