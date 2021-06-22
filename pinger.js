const express = require("express");
const app = express();
const https = require("https");

const connectAlarm = new Audio(__dirname + "/sounds/connect-alarm.mp3");
const disconnectAlarm = new Audio(__dirname + "/sounds/disconnect-alarm.mp3");

let weAreOnline = false;

function checkInternetConnection(){

https.get('https://captive.apple.com/', (res) => {
    console.log('statusCode:' + res.statusCode);
    if (res.statusCode === 200) {
        if (!weAreOnline) {
            connectAlarm.play();
            weAreOnline = true;
            console.error("Internet connection found!!");
        }
    }
}).on('error', (e) => {
    if (weAreOnline) {
        disconnectAlarm.play()
        weAreOnline = false;
        console.error("Internet connection lost...");
    }
});

}


setInterval(checkInternetConnection, 10000);