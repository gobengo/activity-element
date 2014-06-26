var phraser = require('./phraser');
var fs = require('fs');
var domify = require('domify');

var collectionHtml = fs.readFileSync(__dirname + '/templates/collection-item.html', 'utf8');
var collectionTemplate = domify(collectionHtml)

/**
 * Render a Collection Object into a
 * collection-item HTMLElement
 */
exports.collection = function collectionElement(collection) {
  var collectionPhrase = phraser.object.collection(collection);
  var el = collectionTemplate.cloneNode(true);
  if (collection.id) {
    el.setAttribute('resource', collection.id);    
  }
  var publishedDate = new Date(Date.parse(collection.published));
  render(el, {
    '[property~="as:title"]': collection.title,
    '[property~="as:published"]': formatDate(publishedDate),
    '[property~="as:tags"] > li': collection.tags
        .map(function (tag) {
            return tag.displayName || tag.label;
        })
        .filter(Boolean)
        .map(function (tagStr) {
            return {
                'a[rel="tag"]': tagStr
            }
        })
  });

  // todo: support attribute setting in render
  var titleEl = el.querySelector('[property~="as:title"]')
  if (titleEl) {
    titleEl.setAttribute('href', collection.url);
  }
  return el;
};

function propertyMap(obj) {
    return Object.keys(obj).reduce(function (out, prop) {
        var query = '[property~="prop"]'.replace('prop', prop);
        out[query] = obj[prop];
        return out;
    }, {});
}

function render(el, data) {
    Object.keys(data).forEach(function (query) {
        var val = data[query];
        var matches = [].slice.call(el.querySelectorAll(query));
        matches.forEach(function (el) {
            // if just given a string, thats els content
            if (typeof val === 'string') {
                el.innerHTML = val;
                return el;
            }
            // if given an array, we'll need to clone the
            // selected el for each item in the array
            if (Array.isArray(val)) {
                var frag = document.createDocumentFragment();
                var protoEl = el;
                val.map(function (val) {
                    var el = protoEl.cloneNode(true);
                    return render(el, val);
                }).forEach(function (el) {
                    frag.appendChild(el);
                });
                // Replace old node with the fragment
                // containing clodes for each array item
                el.parentNode.replaceChild(frag, el);
                return el;
            }
            console.error('dont know how to render val', query, val);
        });
    })
    return el;
}

function outerHTML(el) {
    var wrap = document.createElement('div');
    wrap.appendChild(el);
    return wrap.innerHTML;
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

/**
 * Format a date object to be displayed to humans
 * @param date {Date} A JavaScript Date object
 * @return {string} A formatted timestamp like "5/27//06 • 3:26 AM"
 */
var MONTH_STRINGS = [
    'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun','Jul', 'Aug',
    'Sep', 'Oct', 'Nov', 'Dec'
];

function formatDate(date, relativeTo) {
    relativeTo = relativeTo || new Date();
    var diffMs = date.getTime() - relativeTo.getTime(),
        dateString;
    // Future
    if (diffMs > 0) {
        return '';
    }
    // Less than 60s ago -> 5s
    if (diffMs > -60 * 1000) {
        return Math.round( -1 * diffMs / 1000) + 's';
    }
    // Less than 1h ago -> 5m
    if (diffMs > -60 * 60 * 1000) {
        return Math.round( -1 * diffMs / (1000 * 60)) + 'm';
    }
    // Less than 24h ago -> 5h
    if (diffMs > -60 * 60 * 24 * 1000) {
        return Math.round( -1 * diffMs / (1000 * 60 * 60)) + 'h';
    }
    // >= 24h ago -> 6 Jul
    dateString = date.getDate() + ' ' + MONTH_STRINGS[date.getMonth()];
    // or like 6 Jul 2012 if the year if its different than the relativeTo year
    if (date.getFullYear() !== relativeTo.getFullYear()) {
        dateString += ' ' + date.getFullYear();
    }
    return dateString;
};
