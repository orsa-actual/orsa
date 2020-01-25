const expect = require('chai').expect;

const visit = require('../../src/visit');

describe('visit', () => {
  it('should handle empty', () => {
    const found = [];
    visit([], node => found.push(node));
    expect(found).to.eql([]);
  });

  it('should handle an array with an empty object', () => {
    const found = [];
    visit([
      {},
    ], node => found.push(node));
    expect(found).to.eql([]);
  });
});
