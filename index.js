var http = require('http');
var Static = require('node-static');

var file = new Static.Server('./dist', {gzip: true, cache: 7200});

var server = http.createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
});

server.listen(8080);
console.log('Server started on port 8080');