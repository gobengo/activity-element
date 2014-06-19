// "use strict";

var phraser = require('activity-element').phraser;
var mocks = require('activity-mocks');
var assert = require('chai').assert;
var sinon = require('sinon');

describe('activity-element.phraser', function () {
    it('phrases livefyre.sitePostCollection activity', function () {
        var phrase = phraser.phrase(mocks.livefyre.sitePostCollection);
        assert.typeOf(phrase, 'string');
        assert.equal(phrase, 'site 222 posted "Hello world!"');
    });
    it('phrases livefyre.userPostMessage activity', function () {
        var phrase = phraser.phrase(mocks.livefyre.userPostMessage);
        assert.typeOf(phrase, 'string');
        assert.equal(phrase, 'Bob Doe posted the message "This is a comment post."');
    });
    it('phrases spec.basicWithDetail activity', function () {
        var phrase = phraser.phrase(mocks.spec.basicWithDetail);
        assert.typeOf(phrase, 'string');
        assert.equal(phrase, 'Martin Smith posted "Why I love Activity Streams"');
    });
    it('phrases spec.extended activity', function () {
        var phrase = phraser.phrase(mocks.spec.extended);
        assert.typeOf(phrase, 'string');
        assert.equal(phrase, 'Martin Smith posted a Photo');
    });
    it('phrases spec.minimal activity', function () {
        var phrase = phraser.phrase(mocks.spec.minimal);
        assert.typeOf(phrase, 'string');
        // this could be improved...
        assert.equal(phrase, 'urn:example:person:martin posted a link');        
    })
});
