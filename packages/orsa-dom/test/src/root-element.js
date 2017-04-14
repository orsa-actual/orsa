const expect = require('chai').expect;
const RootElement = require('../../src/root-element');
const OrsaProject = require('../../src/project');

describe('orsa root-element', () => {
  it('should allow metadata', () => {
    const op = new RootElement({
      foo: 'bar',
    });
    expect(op.metadata.toObject()).to.eql({
      foo: 'bar',
    });
  });

  it('should create nodes as a factory', () => {
    const op = new RootElement({
      foo: 'bar',
    });

    expect(op.restoreNode(op, {
      type: OrsaProject.TYPE,
      children: [],
    }).type).to.eql(OrsaProject.TYPE);

    expect(op.restoreNode(op, {
      type: 'rubbish',
      children: [],
    })).to.be.null;
  });
});
