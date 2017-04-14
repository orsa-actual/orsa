const expect = require('chai').expect;
const OrsaDOM = require('../index');

describe('orsa-dom index', () => {
  it('should have element', () => {
    expect(OrsaDOM.Element).to.be.defined;
  });
});
