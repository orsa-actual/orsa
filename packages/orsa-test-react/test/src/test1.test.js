/* eslint global-require: 0 */
const expect = require('chai').expect;
const Orsa = require('orsa-core');
const path = require('path');
const includes = require('lodash.includes');

const fixWallabyPaths = (p) => {
  let newPath = p;
  /* istanbul ignore next */
  if (p.match(/\/instrumented\//i) && p.match(/wallaby/i)) {
    /* istanbul ignore next */
    newPath = newPath.replace(/instrumented/, 'original');
  }
  return newPath;
};

describe('orsa tester', () => {
  it('test1 should have projects', (done) => {
    const dirName = fixWallabyPaths(__dirname);
    const oc = new Orsa({
      plugins: [
        require('orsa-project-fs-scanner-plugin'),
      ],
      'orsa-project-fs-scanner-plugin': {
        path: path.resolve(dirName, '../../fixtures/test1'),
      },
    });
    oc.run(() => {
      expect(oc.children.toArray().length).to.eql(4);
      const names = oc.children.toArray().map(p => p.name);
      expect(includes(names, 'project1')).to.be.true;
      expect(includes(names, 'project2')).to.be.true;
      expect(includes(names, 'project3')).to.be.true;
      done();
    });
  });

  it('test1 should be idempotent', (done) => {
    const dirName = fixWallabyPaths(__dirname);
    const oc = new Orsa({
      plugins: [
        require('orsa-project-fs-scanner-plugin'),
      ],
      'orsa-project-fs-scanner-plugin': {
        path: path.resolve(dirName, '../../fixtures/test1'),
      },
    });
    oc.run(() => {
      expect(oc.children.toArray().length).to.eql(4);
      const names = oc.children.toArray().map(p => p.name);
      expect(includes(names, 'project1')).to.be.true;
      expect(includes(names, 'project2')).to.be.true;
      expect(includes(names, 'project3')).to.be.true;
    });
    oc.run(() => {
      expect(oc.children.toArray().length).to.eql(4);
      const names = oc.children.toArray().map(p => p.name);
      expect(includes(names, 'project1')).to.be.true;
      expect(includes(names, 'project2')).to.be.true;
      expect(includes(names, 'project3')).to.be.true;
      done();
    });
  });

  it('test1 save/restore and run again without change', (done) => {
    const dirName = fixWallabyPaths(__dirname);
    const oc = new Orsa({
      plugins: [
        require('orsa-project-fs-scanner-plugin'),
      ],
      'orsa-project-fs-scanner-plugin': {
        path: path.resolve(dirName, '../../fixtures/test1'),
      },
    });
    oc.run(() => {
      expect(oc.children.toArray().length).to.eql(4);
      const names = oc.children.toArray().map(p => p.name);
      expect(includes(names, 'project1')).to.be.true;
      expect(includes(names, 'project2')).to.be.true;
      expect(includes(names, 'project3')).to.be.true;
    });

    // Save it
    const save = oc.save();

    const oc2 = new Orsa({
      plugins: [
        require('orsa-project-fs-scanner-plugin'),
      ],
      'orsa-project-fs-scanner-plugin': {
        path: path.resolve(dirName, '../../fixtures/test1'),
      },
    });

    // Restore in the previous save and check that
    oc2.restore(save);
    expect(oc2.children.toArray().length).to.eql(4);

    // Run it again and make sure we haven't changed anything
    oc2.run(() => {
      expect(oc2.children.toArray().length).to.eql(4);
      const names = oc.children.toArray().map(p => p.name);
      expect(includes(names, 'project1')).to.be.true;
      expect(includes(names, 'project2')).to.be.true;
      expect(includes(names, 'project3')).to.be.true;
      done();
    });
  });


  it('test1 should be seen as node projects', (done) => {
    const dirName = fixWallabyPaths(__dirname);
    const oc = new Orsa({
      plugins: [
        require('orsa-project-fs-scanner-plugin'),
        require('orsa-node-project-plugin'),
      ],
      'orsa-project-fs-scanner-plugin': {
        path: path.resolve(dirName, '../../fixtures/test1'),
      },
    });
    oc.run(() => {
      expect(oc.children.find({
        name: 'project1',
      })[0].metadata.get('projectType')).to.eql('node');
      done();
    });
  });
});
