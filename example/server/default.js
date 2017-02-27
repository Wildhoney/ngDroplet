(function($process) {

    "use strict";

    var express = require('express'),
        app     = express(),
        server  = require('http').createServer(app),
        multer  = require('multer'),
        upload  = multer({ dest: __dirname + '/uploads' });

    app.use(express.static(__dirname + '/..'));

    // Responsible for handling the file upload.
    app.post('/upload.html', upload.array('file'), function(request, response) {

        var count = request.files.length;
        response.status(200).send(JSON.stringify({ success: true, fileCount: count }));

    });

    server.listen($process.env.PORT || 3507);

})(process);