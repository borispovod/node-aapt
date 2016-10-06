'use strict';

var exec   = require('child_process').exec;
var path   = require('path');
var os     = require('os');
var fs     = require('fs');

var aapt = path.join(__dirname, 'lib', os.type(), 'aapt');

module.exports = function (filename, callback) {
  fs.access(aapt, fs.X_OK, function (err) {
    if(err) {
      err.msg = ['Hmmm, what OS are you using?', os.type()].join(' ');
      callback(err, null);
    } else {
      var cmd = [aapt, 'dump', 'badging', filename, '|', 'grep', 'package'].join(' ');
      exec(cmd, function (err, stdout, stderr) {
        var error = err || stderr;
        if(error) {
          callback(error, null);
        } else {
          var match = stdout.match(/name='([^']+)'[\s]*versionCode='(\d+)'[\s]*versionName='([^']+)/);
          var info = {
            packageName : match[1],
            versionCode : match[2],
            versionName : match[3],
          };
          callback(null, info);
        }
      });
    } 
  });
};
