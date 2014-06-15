var ActivityElement = require('activity-element');
var cycle = require('stream-cycle');
var transform = require('stream-transform');
var mocks = require('activity-mocks');

var exampleActivity = document.getElementById('activity');
var exampleFeed = document.getElementById('feed');

var activity = mocks.livefyre;
exampleActivity.appendChild(ActivityElement(activity))

var activityPrototypes = [mocks.livefyre, mocks.jsonld, mocks.strings];

cycle(activityPrototypes)
  .pipe(transform.map(ActivityElement))
  .forEach(function (el) {
    exampleFeed.appendChild(el);
  });
