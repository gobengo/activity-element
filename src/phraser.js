'use strict'

var extend = require('util-extend');


var phraser = module.exports = {};

phraser.phrase = function (activity) {
  var phrase = [];
  phrase.push.call(phrase,
    phraser.actor(activity.actor),
    phraser.verb(activity.verb),
    phraser.object(activity.object)
  );
  return phrase.join(' ');
}

/**
 * verb -> string
 */
phraser.verb = function phraseVeb(verb) {
  if (verb === 'verb') debugger
    ;
  var verbText = (typeof verb === 'string' ? verb : String(verb.displayName)).toLowerCase();
  switch (verbText) {
    case 'post':
      verbText = 'posted';
      break;
    case 'create':
      verbText = 'created';
      break;
  }
  return verbText;
}

/**
 * actor -> string
 */
phraser.actor = function phraseActor(actor) {
  if (actor.objectType === 'site') {
    return sitePhrase(actor);
  }
  if (typeof actor === 'string') {
    return actor;
  }
  var displayName = actor.displayName;
  var actorExtension = actor['extension-person'];
  if (actorExtension) {
    displayName = actorExtension.displayName
  }
  if (displayName) {
    return displayName
  }
  return actor.toString();
}

function sitePhrase(site) {
  var siteId = site.id.match(/site=(\d+)/);
  var phrase = 'a site';
  if (siteId) {
    phrase = 'site '+siteId[1];
  }
  return phrase;
}


/**
 * object -> string
 */
phraser.object = function objectPhrase(object) {
  var collectionExtension = object && object['extension-collection'];
  if (collectionExtension) {
    object = collectionExtension;
  }
  if (typeof object === 'string') {
    return 'a link';
  }
  if (object.displayName) {
    return quoted(object.displayName);
  }
  switch (object.objectType) {
    case 'message':
      return phraser.object.message(object);
    case 'collection':
      return phraser.object.collection(object);
    default:
      return singular(objectTypeString(object.objectType));
  }
}

extend(phraser.object, {
  collection: function collectionPhrase(collection) {
    return quoted(collection.title)
  },
  message: function messagePhrase(message) {
    var text = 'the message "{content}"'
      .replace('{content}', message.content);
    return text;
  }
})

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
