const expect = require('chai').expect;
const OrsaTasks = require('../../src/tasks');

describe('orsa tasks', () => {
  it('make sure we dont run a task twice', () => {
    let count = 0;
    const ot = new OrsaTasks.OrsaTask(1, () => {
      count += 1;
    });
    expect(count).to.eql(0);
    ot.run();
    expect(count).to.eql(1);
    ot.run();
    expect(count).to.eql(1);
  });

  it('should handle adding a task', () => {
    const ot = new OrsaTasks();
    let endcb = null;
    const tid = ot.add('test', (cb) => {
      endcb = cb;
    });
    expect(ot.finished).to.be.false;
    expect(ot.find(tid)).to.not.be.null;
    expect(ot.find(-1)).to.be.undefined;
    ot.start();
    endcb();
    expect(ot.finished).to.be.true;
  });

  it('should start a task automatically if processing has started', () => {
    const ot = new OrsaTasks();
    ot.start();
    let endcb = null;
    const tid = ot.add('test', (cb) => {
      endcb = cb;
    });
    expect(ot.finished).to.be.false;
    expect(ot.find(tid)).to.not.be.null;
    expect(ot.find(-1)).to.be.undefined;
    endcb();
    expect(ot.finished).to.be.true;
  });
});
