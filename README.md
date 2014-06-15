# stream-client

Talk to Livefyre/stream-v4

## `make` commands

* `make build` - will `npm install` and `bower install`
* `make dist` - will use r.js optimizer to compile the source, UMD wrap, and place that and source maps in dist/
* `make clean`
* `make server` - serve the repo over http
* `make deploy [env={*prod,uat,qa}]` - Deploy to lfcdn, optionally specifying a bucket env
