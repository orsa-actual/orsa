const visit = require('../../src/javascript/visit');

describe('visit', () => {
  it('should handle empty', () => {
    const found = [];
    visit([], (node) => found.push(node));
    expect(found).toEqual([]);
  });

  it('should handle an array with an empty object', () => {
    const found = [];
    visit([
      {},
    ], (node) => found.push(node));
    expect(found).toEqual([]);
  });
});
