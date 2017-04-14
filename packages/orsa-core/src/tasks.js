const EventEmitter = require('events');

class OrsaTasks extends EventEmitter {
  constructor() {
    super();
    this.tasks = [];
    this.nextTaskId = 1;
    this.started = false;
  }

  get finished() {
    return this.started && this.tasks.length === 0;
  }

  start() {
    this.started = true;
    this.emit(OrsaTasks.STARTED);
    this.tasks.forEach(t => t.task());
    this.checkForDone();
  }

  checkForDone() {
    if (this.finished) {
      this.emit(OrsaTasks.FINISHED);
    }
  }

  add(name, task) {
    const tid = this.nextTaskId;
    const taskInfo = {
      id: tid,
      task: () => {
        task(() => {
          this.remove(tid);
          this.checkForDone();
        });
      },
    };
    this.tasks.push(taskInfo);
    this.emit(OrsaTasks.CREATE, taskInfo);
    this.nextTaskId += 1;

    if (this.started) {
      taskInfo.task();
    }

    return tid;
  }

  find(id) {
    const found = this.tasks.find(t => t.id === id);
    return found;
  }

  remove(id) {
    this.emit(OrsaTasks.DELETE, this.find(id));
    this.tasks = this.tasks.filter(t => t.id !== id);
  }
}

OrsaTasks.CREATE = 'OrsaTasks.CREATE';
OrsaTasks.DELETE = 'OrsaTasks.DELETE';
OrsaTasks.STARTED = 'OrsaTasks.STARTED';
OrsaTasks.FINISHED = 'OrsaTasks.FINISHED';

module.exports = OrsaTasks;
