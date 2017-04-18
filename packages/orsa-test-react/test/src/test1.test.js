/* eslint global-require: 0 */
const expect = require('chai').expect;
const Orsa = require('orsa-core');
const path = require('path');
const includes = require('lodash.includes');
const {
  Project,
  File,
} = require('orsa-dom');

describe('orsa tester', () => {
  it('test1 should have projects', (done) => {
    const oc = new Orsa({
      plugins: [
        require('orsa-project-fs-scanner-plugin'),
      ],
      'orsa-project-fs-scanner-plugin': {
        path: path.resolve(__dirname, '../../fixtures/test1'),
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
    const oc = new Orsa({
      plugins: [
        require('orsa-project-fs-scanner-plugin'),
      ],
      'orsa-project-fs-scanner-plugin': {
        path: path.resolve(__dirname, '../../fixtures/test1'),
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
    const oc = new Orsa({
      plugins: [
        require('orsa-project-fs-scanner-plugin'),
      ],
      'orsa-project-fs-scanner-plugin': {
        path: path.resolve(__dirname, '../../fixtures/test1'),
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
        path: path.resolve(__dirname, '../../fixtures/test1'),
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
    const oc = new Orsa({
      plugins: [
        require('orsa-project-fs-scanner-plugin'),
        require('orsa-js-project-plugin'),
      ],
      'orsa-project-fs-scanner-plugin': {
        path: path.resolve(__dirname, '../../fixtures/test1'),
      },
    });
    oc.run(() => {
      expect(oc.children.find({
        name: 'project1',
      })[0].metadata.get('projectType')).to.eql('node');
      done();
    });
  });

  it('test1 should have projects and files', (done) => {
    const oc = new Orsa({
      plugins: [
        require('orsa-project-fs-scanner-plugin'),
        require('orsa-js-project-plugin'),
        require('orsa-js-language-plugin'),
      ],
      'orsa-project-fs-scanner-plugin': {
        path: path.resolve(__dirname, '../../fixtures/test1'),
      },
    });
    oc.run(() => {
      const project1 = oc.children.find({
        type: Project.TYPE,
        name: 'project1',
      })[0];
      const indexFile = project1.children.find({
        type: File.TYPE,
        name: 'index.js',
      })[0];
      expect(indexFile).to.not.be.null;
      done();
    });
  });
});
