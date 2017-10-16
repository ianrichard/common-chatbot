'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = logJsonToFile;
var fs = require('fs');
var path = require('path');

function logJsonToFile(fileName, json) {

    var shouldWriteLogsToFiles = JSON.parse(fs.readFileSync(__dirname.split('lib')[0] + 'package.json')).flags.writeLogsToFiles;

    if (shouldWriteLogsToFiles) {

        var targetDirectory = __dirname.split('lib')[0] + 'logs';

        if (!fs.existsSync(targetDirectory)) {
            fs.mkdirSync(targetDirectory);
        }

        fs.writeFile(targetDirectory + '/' + fileName + '.json', JSON.stringify(json, null, 4), function (err) {
            if (err) throw err;
        });
    }
}
//# sourceMappingURL=log-json-to-file.js.map