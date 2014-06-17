var ActivityElement = require('activity-element');
var cycle = require('stream-cycle');
var transform = require('stream-transform');
var slice = require('stream-slice');
var activityMocks = require('activity-mocks');

var exampleActivity = document.getElementById('activity');
var collectionFeed = document.getElementById('collection-feed');
var exampleFeed = document.getElementById('feed');

var activity = activityMocks.livefyre.userPostMessage;
exampleActivity.appendChild(ActivityElement(activity))

/**
 * Create a Transform that renders activities into HTMLElements
 */
var activityRenderer = function () {
  return transform.compose(
    transform.map(ActivityElement),
    // add .activity class
    transform.map(function (el) {
      el.classList.add('activity');
      return el;
    }),
    // wrap in <li>
    transform.map(function (el) {
      var li = document.createElement('li');
      li.appendChild(el);
      return li;
    }));
};

// Get a 100 activities of all sorts
var activities = cycle(activityMocks.toArray())
  .pipe(slice(100));

// Get just the subset of Livefyre ones
var livefyreActivites = activities
  .pipe(transform.filter(function (a) {
    var actorId = a && a.actor && a.actor.id;
    return actorId && /livefyre/.test(actorId);
  }));

// Livefyre activites go in one feed
livefyreActivites
  .pipe(activityRenderer())
  .forEach(function (el) {
    collectionFeed.appendChild(el);
  });

// All activities go in the other
activities
  .pipe(activityRenderer())
  .forEach(function (el) {
    exampleFeed.appendChild(el);
  });
