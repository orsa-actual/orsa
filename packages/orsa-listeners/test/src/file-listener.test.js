const expect = require('chai').expect;
const FileListener = require('../../src/file-listener');
const {
  File,
} = require('orsa-dom');

describe('orsa file listener', () => {
  it('should handle a name and have a version', () => {
    const op = new FileListener();
    expect(op.type).to.equal(File.TYPE);
  });

  it('should lock on local path', () => {
    const op = new FileListener();
    expect(op.lockOn({
      localPath: 'foo',
    })).to.eql('foo');
  });
});
