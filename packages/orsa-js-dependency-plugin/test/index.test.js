const expect = require('chai').expect;
const plugin = require('../index');

describe('plugin index', () => {
  it('should export the plugin', () => {
    expect(plugin).to.not.be.null;
  });
});
