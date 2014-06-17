require.config({
    paths: {
        SockJS: 'lib/sockjs/sockjs',
        'event-emitter': 'lib/event-emitter/src/event-emitter',
        jquery: 'lib/jquery/dist/jquery',
        extend: 'lib/util-extend/extend',
        sinon: 'node_modules/sinon/pkg/sinon',
        chai: 'node_modules/chai/chai',
        debug: 'lib/debug/debug',
        through: 'node_modules/through/index',
        'stream-cycle': 'node_modules/stream-cycle/src/index',
        'stream-transform': 'node_modules/stream-transform/src/index',
        'activity-mocks': 'node_modules/activity-mocks/dist/activity-mocks',
        events: 'node_modules/stream-transform/node_modules/stream-arrays/node_modules/stream-objectmode/node_modules/events/events',
        inherits: 'node_modules/stream-transform/node_modules/stream-arrays/node_modules/inherits/inherits_browser',
        'util-extend': 'node_modules/stream-transform/node_modules/stream-arrays/node_modules/stream-objectmode/node_modules/util-extend/extend',
        'activity-element': 'dist/activity-element'
    },
    map: {
        '*': {
            stream: 'stream-objectmode'
        }
    },
    packages: [{
        name: 'stream-objectmode',
        location: 'node_modules/stream-transform/node_modules/stream-arrays/node_modules/stream-objectmode/src',
    },{
        name: 'stream-arrays',
        location: 'node_modules/stream-transform/node_modules/stream-arrays',
        main: 'index'
    }],
    shim: {
        SockJS: {
            exports: 'SockJS'
        },
        sinon: {
          exports: 'sinon'
        }
    }
});
