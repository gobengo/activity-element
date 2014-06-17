var ActivityElement = require('activity-element');
var cycle = require('stream-cycle');
var transform = require('stream-transform');
var activityMocks = require('activity-mocks');

var exampleActivity = document.getElementById('activity');
var exampleFeed = document.getElementById('feed');

var activity = activityMocks.livefyre.userPostMessage;
exampleActivity.appendChild(ActivityElement(activity))
var activityPrototypes = [activityMocks.livefyre, activityMocks.jsonld, activityMocks.strings];

var mocks = activityMocks.toArray();

cycle(mocks)
  .pipe(transform.map(ActivityElement))
  .pipe(transform.map(function (el) {
    el.classList.add('activity');
    return el;
  }))
  .pipe(transform.map(function (el) {
    var li = document.createElement('li');
    li.appendChild(el);
    return li;
  }))
  .forEach(function (el) {
    exampleFeed.appendChild(el);
  });
