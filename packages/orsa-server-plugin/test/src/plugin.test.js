/* eslint no-lonely-if: 0, no-loop-func: 0 */
const expect = require('chai').expect;

const {
  Project,
  File,
} = require('orsa-dom');

const Plugin = require('../../src/plugin');

describe('orsa js build plugin', () => {
  it('should run successfully', () => {
    let successCB = null;

    const onBlock = {};
    onBlock.on = (evtName, pcb) => {
      if (evtName === 'response') {
        successCB = pcb;
      }
      return onBlock;
    };

    const order = [];
    const op = new Plugin({
      uuidV4: () => 'foo',
      request: {
        post(url, data) {
          expect(url).to.eql('http://localhost:3000/api/update');
          expect(data.json).to.be.true;
          if (data.body.signal !== undefined) {
            order.push(data.body.signal);
            if (data.body.signal === 'startRun') {
              expect(data.body).to.eql({
                signal: 'startRun',
                runID: 'foo',
                name: undefined,
              });
            } else if (data.body.signal === 'endRun') {
              expect(data.body).to.eql({
                signal: 'endRun',
                runID: 'foo',
                name: undefined,
              });
            } else if (data.body.signal === 'beforeProject') {
              expect(data.body).to.eql({
                signal: 'beforeProject',
                runID: 'foo',
                name: 'project-foo',
              });
            } else if (data.body.signal === 'afterProject') {
              expect(data.body).to.eql({
                signal: 'afterProject',
                runID: 'foo',
                name: 'project-foo',
              });
            } else {
              expect(false).to.be.true;
            }
          } else {
            order.push(`${data.body.type}:${data.body.name}`);
            if (data.body.type === File.TYPE) {
              expect(data.body.name).to.eql('fe1-foo');
              expect(data.body.project).to.eql('project-foo');
            } else if (data.body.type === Project.TYPE) {
              expect(data.body.name).to.eql('project-foo');
            } else {
              expect(false).to.be.true;
            }
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
    processCB(() => {
      successCB = null;
      expect(order).to.eql([
        'startRun',
        'beforeProject',
        'Project:project-foo',
        'File:fe1-foo',
        'afterProject',
        'endRun',
      ]);
    });

    while (successCB) {
      successCB((cb) => {
        successCB = null;
        cb();
      });
    }
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
