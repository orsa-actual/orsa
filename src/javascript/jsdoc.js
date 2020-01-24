/* eslint no-empty: 0 */
const doctrine = require('doctrine');

module.exports = (doc) => {
  let info = {};
  try {
    info = doctrine.parse(doc, {
      unwrap: true,
      sloppy: true,
    });
  } catch (e) {
  }
  return info;
};
