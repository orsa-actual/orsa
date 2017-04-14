const expect = require('chai').expect;
const Project = require('../../src/project');
const File = require('../../src/file');

describe('orsa project', () => {
  it('should have the right type', () => {
    const op = new Project(null);
    expect(op.type).to.equal(Project.TYPE);
  });

  it('should merge duplicate kids', () => {
    const op = new Project(null);

    const f1 = new File(op);
    f1.relativePath = 'foo';
    op.children.add(f1);
    expect(op.children.toArray().length).to.eql(1);

    const f2 = new File(op);
    f2.relativePath = 'bar';
    op.children.add(f2);
    expect(op.children.toArray().length).to.eql(2);

    const f3 = new File(op);
    f3.relativePath = 'bar';
    const fout = op.children.add(f3);
    expect(op.children.toArray().length).to.eql(2);
    expect(fout === f2).to.be.true;
  });
});
