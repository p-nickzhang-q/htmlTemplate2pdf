var HtmlTemplate2Pdf = require('../index');
const fs = require('fs');

fs.readFile('./test/template.html', (err, html) => {
    if (err) {
        console.error(err);
    }
    HtmlTemplate2Pdf(html.toString(), {
        arr: [{
                '部门': '研发部',
                '姓名': '夏冬2',
                '基本工资': 1000,
                '到岗工资': 200,
                '午餐工资': 100,
                '高温补助': 100,
                '应发工资': 1100
            },
            {
                '部门': '研发部2',
                '姓名': '夏冬1',
                '基本工资': 1000,
                '到岗工资': 200,
                '午餐工资': 100,
                '高温补助': 100,
                '应发工资': 1100
            },
            {
                '部门': '研发部3',
                '姓名': '夏冬3',
                '基本工资': 1000,
                '到岗工资': 200,
                '午餐工资': 100,
                '高温补助': 100,
                '应发工资': 1100
            },
            {
                '部门': '研发部4',
                '姓名': '夏冬4',
                '基本工资': 1000,
                '到岗工资': 200,
                '午餐工资': 100,
                '高温补助': 100,
                '应发工资': 1100
            }
        ]
    }, {
        width: 210,
        height: 297,
        border: 1
    }).then(buffer => {
        fs.writeFileSync('./test/result.pdf', buffer);
        console.log('Success');
    })
});