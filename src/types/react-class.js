const ClassDefinition = require('./class');

class ReactClass extends ClassDefinition {
  constructor(start, end, name) {
    super(start, end, name, {
      react: true,
    });
  }
}

module.exports = ReactClass;
