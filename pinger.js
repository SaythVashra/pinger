const express = require("express");
const app = express();
const https = require("https");
const play = require('audio-play');
const load = require('audio-loader');

let weAreOnline = false;
let html = "";
let appleCaptiveHtml = "<HTML><HEAD><TITLE>Success</TITLE></HEAD><BODY>Success</BODY></HTML>\n"
let url = 'https://captive.apple.com/';

function getDate() {

    const time = new Date();

    const options = {
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    };

    return time.toLocaleDateString("en-US", options);
}

function connectAlarm() {
    load(__dirname + '/sounds/connect-alarm.mp3').then(play);
}

function disconnectAlarm() {
    load('sounds/disconnect-alarm.mp3').then(play);
}

function checkInternetConnection() {

    https.get(url, function (res) {

        res.on("data", function (data) {

            html = data.toString();

            if (res.statusCode === 200 && html === appleCaptiveHtml) {
                if (!weAreOnline) {
                    weAreOnline = true;
                    console.error("Internet connection found!!  " + getDate());
                }
            }
        });
    }).on('error', function (e) {
        if (weAreOnline) {
            weAreOnline = false;
            console.error("Internet connection lost...  " + getDate());
        }
    });
}

setInterval(checkInternetConnection, 10000);