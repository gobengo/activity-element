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
  render(el, {
    '[property~="as:title"]': collection.title,
    '[property~="as:published"]': collection.published,
    '[property~="as:tags"] > li': collection.tags.map(function (tag) {
        console.log('mapping tag', tag);
        return {
            'a[rel="tag"]': tag.label
        }
    })
  })
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
            if (query.indexOf('published') !== -1) {
                debugger;
            }
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
