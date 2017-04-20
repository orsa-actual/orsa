class JSTypeBase {
  constructor(type, start, end) {
    this.start = start;
    this.end = end;
    this.type = type;
  }

  toObject() {
    return {
      start: this.start,
      end: this.end,
      type: this.type,
    };
  }
}

module.exports = JSTypeBase;
