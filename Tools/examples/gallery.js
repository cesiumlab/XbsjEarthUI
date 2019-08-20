var fs = require('fs');
var globby = require('globby');

const exampleMap = {};

var fileList = ['Apps/Examples/*.html'];
var filePaths = globby.sync(fileList);
filePaths = filePaths.filter(e => e !=='Apps/Examples/index.html');

filePaths.forEach(filePath => {
    var content = fs.readFileSync(filePath, 'utf-8');

    var results = /\<title\>([\s\S]*)\<\/title\>/mg.exec(content);
    var title = '<未能获取示例名称!>';
    if (results && results.length >= 2) {
        title = results[1];
    }

    // <meta name="xbsj-labels" content="Beginner, Showcases"></meta>
    // var results2 = /\<meta\sname=\"xbsj-labels\"\scontent=\"(.*)\"\>\<\/meta\>/mg.exec(content);
    var results2 = /\<meta\sname=\"xbsj-labels\"\scontent=\"(.*)\"\>/mg.exec(content);
    var labels = [];
    if (results2 && results2.length >= 2) {
        labels = results2[1].split(',').map(e => e.trim());
    }
    if (labels.length === 0) {
        labels.push('杂项');
    }

    labels.forEach(label => {
        exampleMap[label] = exampleMap[label] || [];
        exampleMap[label].push({
            title: title,
            url: './' + filePath.slice(14),
        });
    });
});

var exampleList = Object.entries(exampleMap).map(([title, list]) => ({
    title,
    list,
}));

var ss = 'vueApp.examples = ' + JSON.stringify(exampleList, undefined, '    ');

var fd = fs.openSync('Apps/Examples/scripts/list.js', 'w+');
var buffer = Buffer.from('/* This file is automatically rebuilt by the Cesium build process. */\n');

// fs.writeSync(fd, buffer, 0, buffer.length, 0); //write new data
fs.writeSync(fd, ss);

fs.close(fd);