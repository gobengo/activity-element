'use strict'

var domify = require('domify');
var fs = require('fs');
var activityTemplate = domify(fs.readFileSync(__dirname + '/activity.html', 'utf8'));

var properties = {
  actor: 'as:actor',
  verb: 'as:verb',
  object: 'as:object'
};


/**
 * activity-element
 * Render an activitystrea.ms 2.0 object to an HTMLElement
 */
module.exports = function (activity) {
  var el = activityTemplate.cloneNode(true);

  // render actor
  getElementsByProperty.call(el, properties.actor)
    .forEach(function (actorNode) {
      actorNode.appendChild(actorElement(activity.actor));
    });

  // render verb
  var verb = activity.verb
  var verbText = typeof verb === 'string' ? verb : verb.displayName;
  switch (verbText) {
    case 'post':
      verbText = 'posted';
      break;
  }
  getElementsByProperty.call(el, properties.verb)
    .forEach(function (verbNode) {
      appendText.call(verbNode, verbText);
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
  if (actor.displayName) {
    return textNode(actor.displayName);
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
  console.log('creating objectElement for', object);
  if (typeof object === 'string') {
    return textNode('the resource '+object);
  }
  if (object.displayName) {
    return textNode(quoted(object.displayName));
  }
  switch (object.objectType) {
    case 'message':
      return messageElement(object);
    case 'collection':
      return collectionElement(object);
    default:
      return textNode(singular(objectTypeString(object.objectType)));
  }
}

function collectionElement(collection) {
  var a = document.createElement('a');
  a.appendChild(textNode(quoted(collection.title)));
  a.setAttribute('href', collection.url);
  if (collection.id) {
    a.setAttribute('resource', collection.id);    
  }
  return a;
}

function messageElement(message) {
  var text = 'the message "{content}"'
    .replace('{content}', message.content);
  return textNode(text);
}

function objectTypeString(objectType) {
  if (typeof objectType === 'string') {
    return objectType;
  }
  if (objectType.displayName) {
    return objectType.displayName;
  }
  return objectType.toString;
}

function quoted(text) {
  return '"text"'.replace('text', text);
}

var vowels = ['a','e','i','o','u'];
function singular(noun) {
  var prefix = 'a ';
  if (vowels.indexOf(noun[0]) === 0) {
    prefix = 'an ';
  }
  return prefix + noun;
}

function textNode(t) {
  return document.createTextNode(t);
}

/**
 * Get children of this HTMLELement that have the
 * provided property attribute
 */
function getElementsByProperty(property, value) {
  var query = '[property~="{property}"]'.replace('{property}', property);
  var childrenWithProperty = this.querySelectorAll(query);
  return [].slice.call(childrenWithProperty)
}

/**
 * Append a text node to this HTMLElement
 */
function appendText(str) {
  var text = document.createTextNode(str);
  this.appendChild(text);
  return text;
}
