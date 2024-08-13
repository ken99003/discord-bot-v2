var http = require('http');

http.createServer(function(req, res) {
    res.write("niha");
    res.end();
}).listen(8080);