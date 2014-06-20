// "use strict";

var ActivityElement = require('activity-element');
var mocks = require('activity-mocks');
var assert = require('chai').assert;
var sinon = require('sinon');

describe('activity-element', function () {
    it('renders all activity-mocks', function (done) {
        // doesnt assert that they're good :P
        mocks.toArray().forEach(function (activity) {
            var el = ActivityElement(activity);
            assert.ok(el);
            assert.typeOf(el.appendChild, 'function');
        });
        done();
    });
    it('renders all livefyre. activity-mocks', function (done) {
        // this is a subset of the above, but more important right now
        var lfMocks = mocks.names
            .filter(function (name) {
                return name.indexOf('livefyre.') === 0;
            })
            .map(mocks.create);
        lfMocks.forEach(function (activity) {
            var el = ActivityElement(activity);
            // console.log(el.innerHTML);
            assert.ok(el);
            assert.typeOf(el.appendChild, 'function');
        });
        done();
    });
});
