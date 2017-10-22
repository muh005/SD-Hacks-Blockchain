var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var exec = require('child_process').exec;

http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.filetoupload.path;
            var prefix = '/home/dcin/Dcin/uploaded/';
            var suffix = files.filetoupload.name;
            var newpath = prefix + suffix;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                console.log("cd "+prefix+" && "+"zip "+suffix+".zip"+" "+suffix+" && cd ..");
                exec("cd "+prefix+" && "+"zip "+suffix+".zip"+" "+suffix+" && cd ..", function(err, stdout, stderr) {
                    if (err) {
                        res.write(err);
                        res.end();
                    } else {
                        console.log("ipfs add "+newpath+".zip");
                        exec("ipfs add "+newpath+".zip", function(err, stdout, stderr){
                            if (err) {
                                res.write(err);
                                res.end();
                            } else {
                                console.log("rm "+newpath+".zip");
                                exec("rm "+newpath+".zip");
                                exec("rm "+newpath);
                                res.write("Your ipfs hash is "+stdout.split(' ')[1]);
                                console.log(stderr);
                                res.end();
                            }
                        });
                    }
                });
            });
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }
}).listen(5002);
