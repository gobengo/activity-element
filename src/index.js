'use strict'

var domify = require('domify');
var fs = require('fs');
var activityTemplate = domify(fs.readFileSync(__dirname + '/activity.html', 'utf8'));

var exports = module.exports = ActivityElement;
exports.Renderer = require('./renderer');
var phraser = exports.phraser = require('./phraser');

var properties = {
  actor: 'as:actor',
  verb: 'as:verb',
  object: 'as:object'
};

exports.Renderer = require('./renderer');

/**
 * activity-element
 * Render an activitystrea.ms 2.0 object to an HTMLElement
 */
function ActivityElement(activity) {
  var el = activityTemplate.cloneNode(true);

  // render actor
  getElementsByProperty.call(el, properties.actor)
    .forEach(function (actorNode) {
      actorNode.appendChild(actorElement(activity.actor));
    });

  // render verb
  var verb = activity.verb;
  getElementsByProperty.call(el, properties.verb)
    .forEach(function (verbNode) {
      verbNode.setAttribute('content', verb);
      verbNode.appendChild(textNode(phraser.verb(verb)))
    });
  
  // render object
  getElementsByProperty.call(el, properties.object).forEach(function (objectNode) {
    objectNode.appendChild(objectElement(activity.object));
  });
  return el;
};

function actorElement(actor) {
  if (actor.objectType === 'site') {
    return siteElement(actor);
  }
  if (typeof actor === 'string') {
    return textNode(actor);
  }
  var displayName = actor.displayName;
  var actorExtension = actor['extension-person'];
  if (actorExtension) {
    displayName = actorExtension.displayName
  }
  if (displayName) {
    return textNode(displayName);
  }
  return textNode(actor.toString());
}

function siteElement(site) {
  var a = document.createElement('a');
  var siteId = site.id.match(/site=(\d+)/);
  var innerText = 'a site';
  if (siteId) {
    innerText = 'site '+siteId[1];
  }
  a.appendChild(textNode(innerText));
  a.setAttribute('href', site.url);
  a.setAttribute('resource', site.id);
  return a;
}

function objectElement(object) {
  switch (object.objectType) {
    case 'message':
      return messageElement(object);
    case 'collection':
      return collectionElement(object);
    default:
      return textNode(phraser.object(object));
  }
}

function collectionElement(collection) {
  var collectionPhrase = phraser.object.collection(collection);
  var a = document.createElement('a');
  a.appendChild(textNode(collectionPhrase));
  a.setAttribute('href', collection.url);
  if (collection.id) {
    a.setAttribute('resource', collection.id);    
  }
  return a;
}

function messageElement(message) {
  var messagePhrase = phraser.object.message(message);
  return textNode(messagePhrase);
}

function textNode(t) {
  return document.createTextNode(t);
}

/**
 * Get children of this HTMLELement that have the
 * provided RDFa property attribute
 */
function getElementsByProperty(property, value) {
  var query = '[property~="{property}"]'.replace('{property}', property);
  var childrenWithProperty = this.querySelectorAll(query);
  return [].slice.call(childrenWithProperty)
}
