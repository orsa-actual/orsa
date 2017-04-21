const expect = require('chai').expect;
const File = require('orsa-dom').File;
const sinon = require('sinon');

const Plugin = require('../../src/plugin');

const reactSample = `
import React from 'react';

/**
Foo
*/
export default class MyComponent extends React.Component {
  render() {
    return (
      <div />
    );
  }
}
`;

const reactSampleWithProps = `
import React from 'react';

/**
Foo
*/
export default class MyComponent extends React.Component {
  render() {
    return (
      <div />
    );
  }
}

MyComponent.propTypes = {
  title: PropTypes.string,
  enabled: PropTypes.boolean,
};

MyComponent.defaultProps = {
  title: 'Hi!',
  enabled: false,
};
`;


const noReactSample = `
export () => true;
`;

describe('orsa react-docgen plugin', () => {
  it('should not run in the right circumnstances', () => {
    const op = new Plugin();
    const fe = new File();
    expect(op.shouldProcess(fe)).to.not.be.true;
  });

  it('should only run in the right circumnstances', () => {
    const op = new Plugin();
    const fe = new File();
    fe.localPath = 'foo';
    expect(op.shouldProcess(fe)).to.be.true;
  });

  it('should handle sucess', () => {
    const op = new Plugin({
      fs: {
        readFileSync: (path) => {
          expect(path).to.eql('foo');
          return reactSample;
        },
      },
    });
    const fe = new File();
    fe.localPath = 'foo';
    op.process(fe, () => {
      expect(fe.metadata.get('js.docgen').description).to.eql('Foo');
    });
  });

  it('should handle sucess', () => {
    const op = new Plugin({
      fs: {
        readFileSync: (path) => {
          expect(path).to.eql('foo');
          return reactSampleWithProps;
        },
      },
    });
    const fe = new File();
    fe.localPath = 'foo';
    op.process(fe, () => {
      expect(fe.metadata.get('js.docgen').description).to.eql('Foo');
      expect(fe.metadata.get('js.docgen').props[0].name).to.eql('title');
    });
  });

  it('should handle a file read error', () => {
    const op = new Plugin({
      fs: {
        readFileSync: () => {
          throw new Error('Foo');
        },
      },
    });
    const fe = new File();
    fe.localPath = 'foo';

    const spy = sinon.spy();
    op.initialize({
      logManager: {
        warn: spy,
      },
    });

    op.process(fe, () => {
      expect(spy).to.be.called;
    });
  });

  it('should handle a file with no react', () => {
    const op = new Plugin({
      fs: {
        readFileSync: () => noReactSample,
      },
    });
    const fe = new File();
    fe.localPath = 'foo';

    op.initialize({});

    op.process(fe, () => {
      expect(fe.metadata.get('js.docgen')).to.be.null;
    });
  });
});
