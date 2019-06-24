const Momnet = require('moment');

function fillHtml(html, data) {
    for (var k of Object.keys(data)) {
        var value = data[k];
        var num = 0;
        var count = countKey(k, html);
        while (num < count) {
            if (value instanceof Array) {
                var label = findLabel(k, html);
                if (label === null) {
                    continue;
                }
                var targetString = findTargetElement(k, label, html).trim();
                var forStrs = findForStrs("for=\"", "\"", targetString).split(" ");
                var templateStr = findTemplateStr(targetString, k);
                templateStr = fillHtmlArray(templateStr, forStrs, value);
                html = html.replace(targetString, templateStr);
            } else if (typeof value === 'number') {
                if (k.indexOf('date') !== -1 || k.indexOf('time') !== -1) {
                    if (value === 0) {
                        html = setValue(k, '', html);
                    } else {
                        var dateStr = Momnet(value).format('YYYY-MM-DD HH:mm:ss')
                        html = setValue(k, dateStr, html);
                    }
                } else {
                    html = setValue(k, value, html);
                }
            } else if (value === null || value === undefined) {
                html = setValue(k, '', html);
            } else {
                html = setValue(k, value.toString(), html);
            }
            num++;
        }
    }
    return html;
}

function setValue(k, value, html) {
    return html.replace(`\{\{${k}\}\}`, value);
}

function countKey(k, html) {
    var num = 0;
    var index = html.indexOf(k);
    while (index !== -1) {
        index = html.indexOf(k, index + 1);
        num++;
    }
    return num;
}

function findLabel(k, target) {
    var kRegex = new RegExp(k);
    //页面中没有这个key
    if (target.match(kRegex) === null) {
        return null
    }
    var kIdx = target.indexOf(target.match(kRegex)[0]);
    var startIdx = target.lastIndexOf("<", kIdx);
    target = target.substring(startIdx, kIdx);
    return target.substring(1, target.indexOf(' '));
}

function findKIdx(k, target) {
    var kRegex = new RegExp(k);
    return target.indexOf(target.match(kRegex)[0]);
}

function findElementStart(k, target) {
    var kRegex = new RegExp(k);
    var kIdx = target.indexOf(target.match(kRegex)[0]);
    var startIdx = target.lastIndexOf("<", kIdx);
    var endIdx = target.indexOf(">", kIdx) + 1;
    return target.substring(startIdx, endIdx);
}

function findTargetElement(k, label, html) {
    var endRegex = new RegExp("</" + label + ">");
    var start = findElementStart(k, html);
    var end = html.match(endRegex)[0];
    var startIdx = html.indexOf(start);
    var endIdx = html.indexOf(end, startIdx) + end.length;
    return html.substring(startIdx, endIdx);
}

function findForStrs(start, end, html) {
    var startRegex = new RegExp(start);
    var endRegex = new RegExp(end);
    var start = html.match(startRegex)[0];
    var end = html.match(endRegex)[0];
    var startIdx = html.indexOf(start);
    var endIdx = html.indexOf(end, startIdx + start.length) + end.length;
    html = html.substring(startIdx + 1, endIdx)
    return html.substring(html.indexOf("\""), html.lastIndexOf("\"")).trim().replace(new RegExp("\"", "g"), "");
}

function fillHtmlArray(html, forStrs, data) {
    var result = "";
    data.forEach(v => {
        if (v instanceof Object) {
            var childData = {};
            Object.keys(v).forEach(k => {
                childData[`${forStrs[0]}.${k}`] = v[k];
            })
            result += fillHtml(html, childData);
        } else {
            result += html.replace(new RegExp("\\{\\{" + forStrs[0] + "\\}\\}", "g"), v.toString());
        }
        result += "\n";
    })
    return result;
}

function findTemplateStr(targetString, k) {
    var kIds = findKIdx(k, targetString);
    var startIdx = targetString.indexOf(" for");
    var endIds = targetString.indexOf("\"", kIds) + 1;
    return targetString.replace(targetString.substring(startIdx, endIds), "");
}

function findBetween(start, end, html) {
    var startRegex = new RegExp(start);
    var endRegex = new RegExp(end);
    var start = html.match(startRegex)[0];
    var end = html.match(endRegex)[0];
    var startIdx = html.indexOf(start);
    var endIdx = html.indexOf(end, startIdx) + end.length;
    return html.substring(startIdx, endIdx);
}

module.exports = fillHtml;