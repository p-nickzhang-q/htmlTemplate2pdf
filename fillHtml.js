const Momnet = require('moment');

function fillHtml(html, data) {
    for (var k of Object.keys(data)) {
        var value = data[k];
        var num = 0;
        var count = countKey(k, html);
        while (num < count) {
            if (value instanceof Array) {
                var targetString = findTargetElement(k, html);
                if (targetString === null) {
                    num++;
                    continue;
                }
                var forStrs = findForStrs(targetString);
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

function findTargetElement(k, target) {
    var kRegex = new RegExp(k);
    //页面中没有这个key
    if (target.match(kRegex) === null) {
        return null
    }
    var kIdx = target.indexOf(target.match(kRegex)[0]);
    var endIdx = target.indexOf(target.match(new RegExp('/' + k))[0], kIdx);
    return target.substring(kIdx - 1, endIdx + k.length + 2);
}

function findForStrs(html) {
    var arr = html.split(/\n/);
    return arr[0].substring(1, arr[0].length - 2).split(' ');
}

function fillHtmlArray(html, forStrs, data) {
    var result = "";
    data.forEach(v => {
        if (v instanceof Object) {
            var childData = {};
            Object.keys(v).forEach(k => {
                childData[`${forStrs[1]}.${k}`] = v[k];
            })
            result += fillHtml(html, childData);
        } else {
            result += html.replace(new RegExp("\\{\\{" + forStrs[1] + "\\}\\}", "g"), v.toString());
        }
        result += "\n";
    })
    return result;
}

function findTemplateStr(targetString) {
    var arr = targetString.split(/\n/);
    return targetString.replace(arr[0], '').replace(arr[arr.length - 1], '').trim();
}

module.exports = fillHtml;