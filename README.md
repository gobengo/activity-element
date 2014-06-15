# activity-element

Render [JSON Activity Streams](http://tools.ietf.org/html/draft-snell-activitystreams-09) Objects into HTMLElements.

## Example

```javascript
var activityMocks = require('activity-mocks');
var el = require('activity-element')(activityMocks.jsonld);
document.body.appendChild(el);
```

## `make` commands

* `make build` - will `npm install` and `bower install`
* `make dist` - will use r.js optimizer to compile the source, UMD wrap, and place that and source maps in dist/
* `make clean`
* `make server` - serve the repo over http
* `make deploy [env={*prod,uat,qa}]` - Deploy to lfcdn, optionally specifying a bucket env
