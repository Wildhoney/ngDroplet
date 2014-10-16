(function($process) {

    "use strict";

    var express        = require('express'),
        app            = express(),
        fileSystem     = require('fs'),
        server         = require('http').createServer(app),
        multer         = require('multer');

    app.use(express.static(__dirname + '/..'));
    app.use(multer({ dest: __dirname + '/uploads' }));

    // Responsible for handling the file upload.
    app.post('/upload.html', function(request, response) {
        response.status(200).send();
    });

    server.listen($process.env.PORT || 3507);

})(process);