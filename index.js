var http = require('http');
var Static = require('node-static');

var file = new Static.Server('./publish', {gzip: true, cache: 7200});

var server = http.createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
});

var PORT = process.env.PORT || 5000;

server.listen(PORT);
console.log('Server started on port ' + PORT);