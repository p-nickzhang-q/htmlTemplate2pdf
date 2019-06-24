var pdf = require('phantom-html2pdf');
var q = require('q');

module.exports = (html, paperSize, returnType) => {
    var deferred = q.defer();
    pdf.convert({
        html: html,
        paperSize: paperSize,
        deleteOnAction: true
    }, function(err, result) {
        if (!err) {
            if (returnType === 'stream') {
                deferred.resolve(result.toStream());
            } else if (returnType === 'path') {
                deferred.resolve(result.getTmpPath());
            } else if (returnType === 'file') {
                deferred.resolve(new File(result.getTmpPath()))
            } else {
                result.toBuffer(returnedBuffer => {
                    deferred.resolve(returnedBuffer)
                });
            }
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
}