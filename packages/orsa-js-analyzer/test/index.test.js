const expect = require('chai').expect;
const index = require('../index');

describe('runner index', () => {
  it('should export the runner', () => {
    expect(index.runner).to.not.be.null;
  });

  it('should export visit', () => {
    expect(index.visit).to.not.be.null;
  });

  it('should export all the matchers', () => {
    expect(index.allMatchers.length).to.eql(7);
  });

  it('should export the matchers individually', () => {
    expect(index.matchers.import).to.not.be.null;
    expect(index.matchers.class).to.not.be.null;
  });

  it('should export the types individually', () => {
    expect(index.types.Base).to.not.be.null;
    expect(index.types.Class).to.not.be.null;
  });
});
