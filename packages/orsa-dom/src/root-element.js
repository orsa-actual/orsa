/* eslint class-methods-use-this: 0 */
const Element = require('./element');
const Project = require('./project');

class RootElement extends Element {
  constructor(metadata) {
    super(null, metadata);

    this.typeMap = {
      File: require('./file'),
      Project: require('./project'),
    };
  }

  get childrenSetOptions() {
    return {
      identityMatchers: [
        (a, b) => (
          a.type === Project.TYPE &&
          a.type === b.type &&
          a.name === b.name
        ),
      ],
    };
  }

  restoreNode(parent, data) {
    let obj = null;
    if (this.typeMap[data.type] !== undefined) {
      obj = new this.typeMap[data.type](parent, {});
      obj.restore(data);
    } else {
      this.emit(RootElement.RESTORE_ERROR, `${data.type} is unknown`);
    }
    return obj;
  }
}

module.exports = RootElement;
