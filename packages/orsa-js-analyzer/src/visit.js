const iterate = (children, visitor) => {
  children.forEach((child) => {
    if (
      child.start !== undefined &&
      child.end !== undefined &&
      child.type !== undefined
    ) {
      visitor(child);
    }

    if (child.methods) {
      iterate(child.methods, visitor);
    }
    if (child.params) {
      iterate(child.params, visitor);
    }
  });
};

module.exports = iterate;
