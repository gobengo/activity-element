module.exports = ActivityRenderer;

var transform = require('stream-transform');

/**
 * Create a Transform that renders activities into HTMLElements
 */
function ActivityRenderer() {
  var userland = transform.compose();
  // in the future this permalast transform should filter(Boolean)
  var last = transform.compose();
  var activityRenderer = transform.compose(userland, last);
  // when you use things, only touch the element renderer
  // that way the last step is still always filtering for falsy
  activityRenderer.use = function () {
    userland.use.apply(userland, arguments);
    return activityRenderer;
  };
  // you can add to the last...
  activityRenderer.last = function () {
    last.use.apply(last, arguments);
  }
  return activityRenderer;
};
