const Momnet = require('moment');

function fillHtml(html, data) {
    html = enSureTemplate(html, data);
    for (var k of Object.keys(data)) {
        var value = data[k];
        var num = 0;
        var count = countKey(k, html);
        while (num < count) {
            num++;
            if (value instanceof Array) {
                var targetString = findTargetElement(k, html);
                if (targetString === null) {
                    continue;
                }
                var forStrs = findForStrs(targetString);
                var templateStr = findTemplateStr(targetString, k);
                templateStr = fillHtmlArray(templateStr, forStrs, value);
                html = html.replace(targetString, templateStr);
            } else if (value instanceof Object) {
                html = fillHtmlObj(html, value, k);
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
        }
    }
    return html;
}

function fillHtmlObj(html, value, parentKey) {
    var result = {}
    Object.keys(value).forEach(childKey => {
        result[`${parentKey}.${childKey}`] = value[childKey];
    });
    return fillHtml(html, result);
}

function setValue(k, value, html) {
    return html.replace(`\{\{${k}\}\}`, value);
}

function countKey(k, html) {
    var words = html.split(k);
    return words.length - 1;
    // var num = 0;
    // var index = html.indexOf(k);
    // while (index !== -1) {
    //     index = html.indexOf(k, index + 1);
    //     num++;
    // }
    // return num;
}

function findTargetElement(k, target) {
    var kRegex = new RegExp('<' + k);
    //页面中没有这个key
    if (target.match(kRegex) === null) {
        return null
    }
    var kIdx = target.indexOf(target.match(kRegex)[0]);
    var endIdx = target.indexOf(target.match(new RegExp('/' + k))[0], kIdx);
    return target.substring(kIdx, endIdx + k.length + 2);
}

function findForStrs(html) {
    var arr = html.split(/\n/);
    return arr[0].substring(1, arr[0].length - 2).split(' ');
}

function fillHtmlArray(html, forStrs, data) {
    var result = "";
    var itemStr = forStrs[1].split('=')[1].replace(new RegExp('\"', "g"), "");
    data.forEach(v => {
        if (v instanceof Object) {
            var childData = {};
            Object.keys(v).forEach(k => {
                childData[`${itemStr}.${k}`] = v[k];
            })
            result += fillHtml(html, childData);
        } else {
            result += html.replace(new RegExp("\\{\\{" + itemStr + "\\}\\}", "g"), v.toString());
        }
        result += "\n";
    })
    return result;
}

function findTemplateStr(targetString) {
    var arr = targetString.split(/\n/);
    return targetString.replace(arr[0] + '\n', '').replace('\n' + arr[arr.length - 1], '');
}

function enSureTemplate(html, data) {
    for (var k of Object.keys(data)) {
        var value = data[k];
        var num = 0;
        var count = countKey(k, html);
        while (num < count) {
            var targetString = findTargetElement(k, html);
            num++
            if (targetString === null) {
                continue;
            }
            if (targetString.indexOf("if") !== -1) {
                var ifExpressionStr = findIf(targetString);
                //获得if表达式的值
                var result = new Boolean(eval(ifExpressionStr.replace(k, 'data.' + k)));
                if (result == true) {
                    if (value instanceof Array) {
                        //如果是数组元素，那识别的标签会在数组设值时，被替换为空
                    } else {
                        //非数组元素，则替换识别标签为空
                        var arr = targetString.split(/\n/);
                        html = html.replace(arr[0], '').replace(arr[arr.length - 1], '');
                    }
                } else {
                    html = html.replace(new RegExp(targetString, 'g'), '')
                }
            }
        }
    }
    return html;
}

function findIf(targetString) {
    var arr = targetString.split(/\n/);
    var arr2 = arr[0].split('\"');
    // ["<username if=", "!username", ">\r"]
    // 获得if里的表达式
    var ifIdx = arr2.findIndex(item => {
        return item.indexOf("if") !== -1;
    });
    return arr2[ifIdx + 1]
}

module.exports = fillHtml;