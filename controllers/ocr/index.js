#!/usr/bin/env node
const fs = require('fs');
const path = require("path");
const { parseJson, walkSync, isAssetTypeAnImage, outputJson } = require("../../utils");
const request = require('request');
// const schedule = require('node-schedule');
/*
let rule = new schedule.RecurrenceRule();
let seconds = [], s = 0;
while (s < 60) {
    seconds.push(s);
    s++
}
rule.second = seconds;
let Job = schedule.scheduleJob(rule, () => { request()})
Job.cancel();
*/
const AK = "Odc9QlyB0i1kzC3nxT4fCoaS"
const SK = "W8oMGBkoMPp1eAAbGkqfbHRrEiX9GAne"
const url = 'https://aip.baidubce.com/rest/2.0/ocr/v1/general?access_token='
let req = [];
let accessToken = '';
let dirpath = path.resolve("./", "upload");

getAccessToken().then(function (token) {
    accessToken = token;
    walkSync(dirpath, function (filePath, stat) {
        if (filePath) {
            let basename = path.basename(filePath), index = basename.lastIndexOf('.') + 1;
            if (stat.isFile() && isAssetTypeAnImage(basename.substring(index))) {
                // setTimeout(() => {
                //     main(filePath).then((data) => {
                //         // console.log('====', path, filePath);
                //         outputJson(data, path.basename(filePath));
                //     }).catch(e => { console.log(e) })
                // }, 1000 * 3);
                req.push(main(filePath));
            }
        } else {
            console.log('walkSync error');
        }
    });
    console.table(req)
});

async function main(filepath) {
    if (accessToken === '') accessToken = await getAccessToken();
    console.log('main filepath', filepath);
    let options = {
        'method': 'POST',
        'url': url + accessToken,
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        form: {
            image: fs.readFileSync(filepath).toString('base64')
        }
    };
    return new Promise((resolve, reject) => {
        request(options, function (error, response) {
            // let file = path.basename(filepath);
            // console.log('time', new Date());
            if (error) {
                reject(error)
                // throw new Error(error);
            }
            // console.log(response.body);
            resolve(JSON.parse(response.body));
        });
    })
}
/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
function getAccessToken() {
    console.log('getAccessToken');
    let options = {
        'method': 'POST',
        'url': 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
    }
    return new Promise((resolve, reject) => {
        request(options, (error, response) => {
            if (error) { reject(error) }
            else { resolve(JSON.parse(response.body).access_token) }
        })
    })
}
