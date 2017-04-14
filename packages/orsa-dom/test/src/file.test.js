const expect = require('chai').expect;
const File = require('../../src/file');
const Project = require('../../src/project');

describe('orsa projects', () => {
  it('should have the right type', () => {
    const op = new File(null);
    expect(op.type).to.equal(File.TYPE);
  });

  it('should find its project', () => {
    const p = new Project(null);
    const f1 = new File(p);
    const f2 = new File(f1);
    expect(f1.project === p).to.be.true;
    expect(f2.project === p).to.be.true;
  });

  it('should match a path', () => {
    const op = new File(null);
    op.localPath = 'blah';
    expect(op.match({
      localPath: 'blah',
    })).to.be.true;
    expect(op.match({
      localPath: 'bloop',
    })).to.be.false;
  });
});
