// JavaScript source code
const fs = require('fs');
var path = require('path');

const files = ['package.json', 'next.config.mjs', 'tsconfig.json'];
const folders = ['src', 'public'];
const walk = function (dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            results = results.concat(walk(file));
        } else {
            /* Is a file */
            results.push(file);
        }
    });
    return results;
}

const copyfile = function callback(fromfile, destinyfile) {

    var destinyfullfile = 'prebuild/' + destinyfile;
   
    //gets your app's root path
    var directoryPath = path.dirname(destinyfullfile);
    var verifiedpath = '.';
    directoryPath.split("/").forEach(function callback(currentValue, index, array) {
        verifiedpath = verifiedpath + "/" + currentValue;
        if (!fs.existsSync(verifiedpath)) {
            // If it doesn't exist, create the directory
            fs.mkdirSync(verifiedpath); 
        }  
    });
     
    fs.copyFile(fromfile, destinyfullfile, (err) => {
        if (err) throw err;
        console.log(destinyfullfile);
    }); 
};
 
files.forEach(function callback(currentValue, index, array) {
    copyfile(currentValue, currentValue);
});

folders.forEach(function callback(folder, index, array) {
    var destfolder = folder.toString().split("/").pop();
    walk(folder).forEach(function callback(file, index, array) {

        var filerelpath = file.split(destfolder).pop();
        copyfile(file,  destfolder + filerelpath);
    });
     
});
 
