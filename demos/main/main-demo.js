var ActivityElement = require('activity-element');
var activityMocks = require('activity-mocks');

var StreamClient = require('stream-client');

// stream utils
var cycle = require('stream-cycle');
var transform = require('stream-transform');
var slice = require('stream-slice');

/*********
Elements
**********/

var exampleActivity = document.getElementById('activity');
var collectionFeed = document.getElementById('collection-feed');
var exampleFeed = document.getElementById('feed');
var streamClientFeed = document.getElementById('stream-client-feed');

// Quick example of rendering a single activity
var activity = activityMocks.livefyre.userPostMessage;
exampleActivity.appendChild(ActivityElement(activity))

/*********
Renderers
**********/

/**
 * Create a Transform that renders activities into HTMLElements
 */
var ActivityRenderer = function () {
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

var CustomActivityRenderer = function () {
  return ActivityRenderer().use(
    transform.map(ActivityElement),
    // add .activity class
    transform.map(function (el) {
      el.classList.add('activity');
      return el;
    })
    // // wrap in <li>
    // transform.map(function (el) {
    //   var li = document.createElement('li');
    //   li.appendChild(el);
    //   return li;
    // })
  );
};

var renderLivefyre = function (activity, next) {
  console.log('using plugin to livefyreActivityRenderer', activity);
  var actorId = activity.actor && activity.actor.id;
  if (actorId && /livefyre/.test(actorId)) {
    return next(null, ActivityElement(activity));
  }
  return next(null, activity);
}


var livefyreActivityRenderer = ActivityRenderer()
  .use(renderLivefyre)
  // .use(transform.map(isHTMLEl))
  .use(function (el, next) {
    // only if renderLivefyre could render it
    // currently ignoring all other valid AS
    if ( ! isHTMLEl(el)) return next(null, el);
    el.classList.add('activity');
    next(null, el);
  });

/*********
Activities
**********/

// Get a 100 activities of all sorts
var activities = cycle(activityMocks.toArray())
  .pipe(slice(100));

// // Get just the subset of Livefyre ones
// var livefyreActivites = activities
//   .pipe(transform.filter(function (a) {
//     var actorId = a && a.actor && a.actor.id;
//     return actorId && /livefyre/.test(actorId);
//   }));

// Livefyre activites go in one feed
// livefyreActivities
//   .pipe(CustomActivityRenderer())
//   .forEach(function (el) {
//     collectionFeed.appendChild(el);
//   });

/*********
Activity Feeds
**********/

activities
  .pipe(livefyreActivityRenderer)
  .forEach(function (el) {
    if ( ! isHTMLEl(el)) {
      console.debug("Wont append to DOM", el);
      return;
    }
    // append to the feed!
    collectionFeed.appendChild(el);
  });

// All activities go in the other
activities
  .pipe(CustomActivityRenderer())
  .forEach(function (el) {
    exampleFeed.appendChild(el);
  });

function isHTMLEl(el) {
  return el && el.nodeType === 1;
}
