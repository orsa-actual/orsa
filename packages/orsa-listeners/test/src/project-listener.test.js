const expect = require('chai').expect;
const ProjectListener = require('../../src/project-listener');
const {
  Project,
} = require('orsa-dom');

describe('orsa project listener', () => {
  it('should handle a name and have a version', () => {
    const op = new ProjectListener();
    expect(op.type).to.equal(Project.TYPE);
  });

  it('should lock on local path', () => {
    const op = new ProjectListener();
    expect(op.lockOn({
      localPath: 'foo',
    })).to.eql('foo');
  });

  it('should find projects in the dom tree', () => {
    const op = new ProjectListener();
    const p1 = {
      type: Project.TYPE,
    };
    const p2 = {
      type: 'foo',
      project: p1,
    };
    const p3 = {
      type: 'foo',
    };
    expect(op.findTarget(p1) === p1).to.be.true;
    expect(op.findTarget(p2) === p1).to.be.true;
    expect(op.findTarget(p3)).to.be.null;
  });
});
