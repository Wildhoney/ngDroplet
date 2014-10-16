(function($process) {

    "use strict";

    var express        = require('express'),
        app            = express(),
        server         = require('http').createServer(app),
        multer         = require('multer');

    app.use(express.static(__dirname + '/..'));
    app.use(multer({ dest: __dirname + '/uploads' }));

    // Responsible for handling the file upload.
    app.post('/upload.html', function(request, response) {

        var count = request.files.file.length;
        response.status(200).send(JSON.stringify({ success: true, fileCount: count }));

    });

    server.listen($process.env.PORT || 3507);

})(process);