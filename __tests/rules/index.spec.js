const { runRules, fileRule, projectRule } = require('../../src/rules');

describe('rules', () => {
  it('should handle a file rule', () => {
    const r1 = fileRule(() => 'foo');
    expect(r1).not.toBeNull();
    expect(r1({}, {}, 'File', {})).toEqual('foo');
    expect(r1({}, {}, 'Project', {})).toBeNull();
  });

  it('should handle a project rule', () => {
    const r1 = projectRule(() => 'foo');
    expect(r1).not.toBeNull();
    expect(r1({}, {}, 'Project', {})).toEqual('foo');
    expect(r1({}, {}, 'File', {})).toBeNull();
  });

  it('should run rules', () => {
    runRules({});
    runRules({
      rules: [
        () => {},
      ],
    });
  });

  it('should handle project rules', () => {
    const messages = [];
    runRules({
      rules: [
        () => ({
          warning: [
            {
              severity: 'low',
              message: 'blah',
            },
          ],
          error: null,
        }),
      ],
    }, {
      store: {
        addWarning: (msg) => { messages.push(msg); },
      },
    }, 'Project', {
      id: 'foo',
    });
    expect(messages.length).toEqual(1);
  });

  it('should handle project rules', () => {
    const messages = [];
    runRules({
      rules: [
        () => ({
          warning: [
            {
              severity: 'low',
              message: 'blah',
            },
          ],
          error: null,
        }),
      ],
    }, {
      store: {
        addWarning: (msg) => { messages.push(msg); },
      },
    }, 'File', {
      id: 'foo',
    });
    expect(messages.length).toEqual(1);
  });
});
