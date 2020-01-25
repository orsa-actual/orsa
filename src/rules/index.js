module.exports = {
  runRules: (config, context, objectType, objectData) => {
    (config.rules || []).forEach((f) => {
      const out = f(config, context, objectType, objectData);
      if (out) {
        ['warning', 'error'].forEach(severity => {
          (out[severity] || []).forEach(message => {
            const msg = {
              severity,
              message,
            };
            if (objectType === 'Project') {
              msg.projectId = objectData.id;
            }
            if (objectType === 'File') {
              msg.fileId = objectData.id;
            }
            context.store.addWarning(msg);
          });
        });
      }
    });
  },
  fileRule: (fn) => (config, context, objectType, objectData) => 
    (objectType === 'File') ? fn(config, context, objectData) : null,
  projectRule: (fn) => (config, context, objectType, objectData) =>
    (objectType === 'Project') ? fn(config, context, objectData) : null,
};
