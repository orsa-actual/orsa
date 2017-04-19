const expect = require('chai').expect;

const {
  Project,
  File,
} = require('orsa-dom');

const Plugin = require('../../src/plugin');

describe('orsa js build plugin', () => {
  it('should run successfully', () => {
    const successCBs = [];

    const onBlock = {};
    onBlock.on = (evtName, pcb) => {
      if (evtName === 'response') {
        successCBs.push(pcb);
      }
      return onBlock;
    };

    const op = new Plugin({
      request: {
        post(url, data) {
          expect(url).to.eql('http://localhost:3000/api/update');
          expect(data.json).to.be.true;
          if (data.body.type === File.TYPE) {
            expect(data.body.name).to.eql('fe1-foo');
            expect(data.body.project).to.eql('project-foo');
          }
          if (data.body.type === Project.TYPE) {
            expect(data.body.name).to.eql('project-foo');
          }
          return onBlock;
        },
      },
    });

    let processCB = null;
    const orsa = {
      emit: () => {},
      taskManager: {
        add(name, cb) {
          expect(name).to.equal('OrsaServerPlugin: post to server');
          processCB = cb;
        },
      },
    };

    const pr1 = new Project(orsa, {
      foo: 'bar',
    });
    pr1.name = 'project-foo';

    const fe1 = new File(pr1);
    fe1.name = 'fe1-foo';
    pr1.children.add(fe1);

    orsa.children = {
      toArray() {
        return [
          pr1,
        ];
      },
    };

    op.initialize(orsa, {
      'orsa-server-plugin': {
        url: 'http://localhost:3000/api/update',
      },
    });

    op.shutdown(() => {});
    processCB(() => {});

    successCBs.forEach(cb => cb());
  });

  it('should handle errors', () => {
    const errorCBs = [];

    const onBlock = {};
    onBlock.on = (evtName, pcb) => {
      if (evtName === 'error') {
        errorCBs.push(pcb);
      }
      return onBlock;
    };

    const op = new Plugin({
      request: {
        post(url, data) {
          expect(url).to.eql('http://localhost:3000/api/update');
          if (data.body.type === File.TYPE) {
            expect(data.body.name).to.eql('fe1-foo');
            expect(data.body.project).to.eql('project-foo');
          }
          if (data.body.type === Project.TYPE) {
            expect(data.body.name).to.eql('project-foo');
          }
          return onBlock;
        },
      },
    });

    let processCB = null;
    const orsa = {
      emit: () => {},
      taskManager: {
        add(name, cb) {
          expect(name).to.equal('OrsaServerPlugin: post to server');
          processCB = cb;
        },
      },
      logManager: {
        warn(text) {
          expect(text).to.eql(
            'Error on posting to http://localhost:3000/api/update: foo'
          );
        },
      },
    };

    const pr1 = new Project(orsa, {
      foo: 'bar',
    });
    pr1.name = 'project-foo';

    const fe1 = new File(pr1);
    fe1.name = 'fe1-foo';
    pr1.children.add(fe1);

    orsa.children = {
      toArray() {
        return [
          pr1,
        ];
      },
    };

    op.initialize(orsa, {
      'orsa-server-plugin': {
        url: 'http://localhost:3000/api/update',
      },
    });

    op.shutdown(() => {});
    processCB(() => {});

    errorCBs.forEach(cb => cb('foo'));
  });

  it('should only run if confgured', () => {
    let hitMe = false;
    const op = new Plugin({
      request: {
        post() {
          hitMe = true;
        },
      },
    });

    let processCB = null;
    const orsa = {
      emit: () => {},
      taskManager: {
        add(name, cb) {
          expect(name).to.equal('OrsaServerPlugin: post to server');
          processCB = cb;
        },
      },
    };

    const pr1 = new Project(orsa, {
      foo: 'bar',
    });
    pr1.name = 'project-foo';

    const fe1 = new File(pr1);
    fe1.name = 'fe1-foo';
    pr1.children.add(fe1);

    orsa.children = {
      toArray() {
        return [
          pr1,
        ];
      },
    };

    op.initialize(orsa, {});

    op.shutdown(() => {});
    processCB(() => {});
    expect(hitMe).to.be.false;
  });
});
