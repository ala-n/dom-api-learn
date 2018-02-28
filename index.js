const http = require('http');
const Static = require('node-static');

const file = new Static.Server('./publish', {gzip: true, cache: 7200});

const server = http.createServer((request, response) => {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
});

const PORT = process.env.PORT || 5000;

server.listen(PORT);
console.log('Server started on port ' + PORT);