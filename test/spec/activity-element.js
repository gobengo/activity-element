"use strict";

var ActivityElement = require('activity-element');
var mocks = require('activity-mocks');
var assert = require('chai').assert;
var sinon = require('sinon');

describe('activity-element', function () {
    it('renders an element', function () {
        var el = ActivityElement(mocks.livefyre);
        assert.ok(el);
        assert.typeOf(el.appendChild, 'function');
    });
});
