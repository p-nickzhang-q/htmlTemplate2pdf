var FillHtml = require('./fillHtml');
var Html2Pdf = require('./html2Pdf');

//paperSize
// {
//     width: width + 'mm',
//     height: width + 'mm',
//     border: border + 'mm'
// }
function HtmlTemplate2Pdf(html, data, paperSize, returnType) {
    if (typeof html !== 'string') {
        throw Error('html must be String!');
    }
    html = FillHtml(html, data);
    return Html2Pdf(html, paperSize, returnType);
}

module.exports = HtmlTemplate2Pdf;