'use strict'

/**
 * activity-element
 * Render an activitystrea.ms 2.0 object to an HTMLElement
 */
module.exports = function (activity) {
  var el = document.createElement('div');
  el.innerHTML = JSON.stringify(activity);
  return el;
};
