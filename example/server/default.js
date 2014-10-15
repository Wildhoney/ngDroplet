(function($process) {

    "use strict";

    var express     = require('express'),
        app         = express(),
        server      = require('http').createServer(app);

    app.use(express.static(__dirname + '/..'));

    app.post('/upload.html', function(request, response) {
        response.send('Blah');
    });

    server.listen($process.env.PORT || 3507);

})(process);