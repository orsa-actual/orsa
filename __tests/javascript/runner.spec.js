const index = require('../../src/javascript/index');

describe('runner index', () => {
  it('should export the runner', () => {
    expect(index.runner).not.toBeNull();
  });

  it('should export visit', () => {
    expect(index.visit).not.toBeNull();
  });

  it('should export all the matchers', () => {
    expect(index.allMatchers.length).toEqual(7);
  });

  it('should export the matchers individually', () => {
    expect(index.matchers.import).not.toBeNull();
    expect(index.matchers.class).not.toBeNull();
  });

  it('should export the types individually', () => {
    expect(index.types.Base).not.toBeNull();
    expect(index.types.Class).not.toBeNull();
  });
});
