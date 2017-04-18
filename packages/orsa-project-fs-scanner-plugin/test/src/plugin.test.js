const expect = require('chai').expect;
const Plugin = require('../../src/plugin');

describe('orsa base listener', () => {
  it('should handle invalid config', () => {
    const op = new Plugin();
    op.initialize({
      logManager: {
        warn: (text) => {
          expect(text).to.eql(
            'OrsaProjectFsScannerPlugin: No path in the configuration'
          );
        },
      },
    }, {});
    op.scan();
  });

  it('should handle invalid config with null path', () => {
    const op = new Plugin();
    op.initialize({
      logManager: {
        warn: (text) => {
          expect(text).to.eql(
            'OrsaProjectFsScannerPlugin: No path in the configuration'
          );
        },
      },
    }, {
      'orsa-project-fs-scanner-plugin': {
        path: null,
      },
    });
    op.scan();
  });

  it('should scan a directory', () => {
    const op = new Plugin({
      fs: {
        readdirSync: (path) => {
          expect(path).to.eql('foo');
          return [
            'fooz',
            'barz',
            'bazz',
          ];
        },
        statSync: path => ({
          isDirectory: () => path.match(/fooz$/) !== null,
        }),
      },
    });
    op.initialize({
      taskManager: {
        add: (name, func) => {
          expect(name).to.eql('OrsaProjectFsScannerPlugin: scanning foo');
          func(() => {
          });
        },
      },
      children: {
        add: (child) => {
          expect(child.localPath.match(/fooz/).length).to.eql(1);
        },
      },
      emit: () => {},
    }, {
      'orsa-project-fs-scanner-plugin': {
        path: 'foo',
      },
    });
    op.scan();
  });
});
