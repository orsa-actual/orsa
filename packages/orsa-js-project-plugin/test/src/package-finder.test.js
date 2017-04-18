const expect = require('chai').expect;
const Plugin = require('../../src/package-finder');
const sinon = require('sinon');

describe('orsa js project plugin', () => {
  it('should only run if the project type is not defined', () => {
    const op = new Plugin();
    expect(op.shouldProcess({
      metadata: {
        get: (name) => {
          expect(name).to.eql('projectType');
          return '';
        },
      },
    })).to.be.true;
    expect(op.shouldProcess({
      metadata: {
        get: (name) => {
          expect(name).to.eql('projectType');
          return 'java';
        },
      },
    })).to.be.false;
    expect(op.shouldProcess({
      metadata: {
        get: (name) => {
          expect(name).to.eql('projectType');
          return 'node';
        },
      },
    })).to.be.false;
  });

  it('should only run if the project has a local path', () => {
    const espy = sinon.spy();
    const op = new Plugin({
      fs: {
        existsSync: espy,
      },
    });
    const spy = sinon.spy();
    expect(op.process({}, spy));
    expect(spy).to.be.called;
    expect(espy).to.not.be.called;
  });

  it('should look for the package.json', () => {
    const mspy = sinon.spy();
    const op = new Plugin({
      fs: {
        existsSync: (path) => {
          expect(path).to.not.be.null;
          return false;
        },
      },
    });
    const spy = sinon.spy();
    expect(op.process({
      localPath: 'foo',
      metadata: {
        set: mspy,
      },
    }, spy));
    expect(spy).to.be.called;
    expect(mspy).to.not.be.called;
  });

  it('should set if we find package.json', () => {
    const mspy = sinon.spy();
    const op = new Plugin({
      fs: {
        existsSync: (path) => {
          expect(path).to.not.be.null;
          return true;
        },
        readFileSync: (path) => {
          expect(path.match(/package.json$/)).to.not.be.null;
          return JSON.stringify({
            version: '0.0.2',
          });
        },
      },
    });
    const spy = sinon.spy();
    expect(op.process({
      localPath: 'foo',
      metadata: {
        set: (key, value) => {
          if (key === 'projectType') {
            expect(value).to.eql('node');
          } else if (key === 'versionChanged') {
            expect(value).to.be.true;
          } else if (key === 'modules') {
            expect(value).to.be.null;
          } else if (key === 'test') {
            expect(value).to.be.null;
          }
        },
      },
    }, spy));
    expect(spy).to.be.called;
    expect(mspy).to.not.be.called;
  });

  it('should set if we find package.json', () => {
    const mspy = sinon.spy();
    const op = new Plugin({
      fs: {
        existsSync: (path) => {
          expect(path).to.not.be.null;
          return true;
        },
        readFileSync: (path) => {
          expect(path.match(/package.json$/)).to.not.be.null;
          return JSON.stringify({
            version: '0.0.2',
          });
        },
      },
    });
    const spy = sinon.spy();
    expect(op.process({
      localPath: 'foo',
      version: '0.0.2',
      metadata: {
        set: (key, value) => {
          if (key === 'projectType') {
            expect(value).to.eql('node');
          } else if (key === 'versionChanged') {
            expect(value).to.be.false;
          } else if (key === 'js.packageJSON') {
            expect(value).to.eql({
              version: '0.0.2',
            });
          } else {
            expect(false).to.be.true;
          }
        },
      },
    }, spy));
    expect(spy).to.be.called;
    expect(mspy).to.not.be.called;
  });

  it('should set if we find package.json', () => {
    const op = new Plugin({
      fs: {
        existsSync: (path) => {
          expect(path).to.not.be.null;
          return true;
        },
        readFileSync: (path) => {
          expect(path.match(/package.json$/)).to.not.be.null;
          return 'blarg';
        },
      },
    });
    const spy = sinon.spy();
    op.initialize({
      on: () => {},
      logManager: {
        warning: (t1) => {
          expect(t1).to.eql('Couldn\'t parse package.json: foo/package.json');
        },
      },
    });
    expect(op.process({
      localPath: 'foo',
      metadata: {},
    }, spy));
    expect(spy).to.be.called;
  });
});
