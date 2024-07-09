const fs = require('fs');
const path = require('path');

require('dotenv').config({path: path.resolve(__dirname, '.env.prod')});

async function sendHook() {
    const jsonFile = fs.readFileSync(__dirname + '/result.json', 'utf8');
    const jsonData = JSON.parse(jsonFile);

    let resultArr = [''];
    resultArr.push(`test time: ${jsonData.stats.startTime}\n`);

    for (let index in jsonData.suites) {
        let result = new Object();
        result.file = jsonData.suites[index].file;
        for (let num in jsonData.suites[index].specs) {
            result.title = jsonData.suites[index].specs[num].title
            for (let n in jsonData.suites[index].specs[num].tests) {
                result.projectId = jsonData.suites[index].specs[num].tests[n].projectId;
                result.expectedStatus = jsonData.suites[index].specs[num].tests[n].expectedStatus;
                resultArr.push(`[${result.projectId}] > ${result.file} > ${result.title} : ${result.expectedStatus}\n`);
            }
        }
    }

    await fetch(`${process.env.SLACK_HOOK_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/son'
        },
        body: JSON.stringify({
            "attachments": [
                {
                    "color": "#000000",
                    "author_name": "세이브존 어드민 바로가기",
                    "author_link": "https://event-new-admin.esavezone.co.kr/",
                    "author_icon": "https://esavezone.co.kr/svzn_icon.png",
                    "title": `Test Result: ${__dirname}`,
                    "text": `${resultArr}`,
                }
            ]
        }),
    });
}

sendHook();
console.log('> run result.js');