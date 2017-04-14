const expect = require('chai').expect;
const Listeners = require('../index');

describe('orsa-listeners index', () => {
  it('should export classes', () => {
    expect(Listeners.BaseListener).to.not.be.null;
    expect(Listeners.FileListener).to.not.be.null;
    expect(Listeners.ProjectListener).to.not.be.null;
    expect(Listeners.TypeListener).to.not.be.null;
  });
});
