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
    let player = require('play-sound')(opts = {})
    player.play('sounds/connect-alarm.mp3', function (err) {
        if (err) throw err
    })
}

function disconnectAlarm() {
    let player = require('play-sound')(opts = {})
    player.play('sounds/disconnect-alarm.mp3', function (err) {
        if (err) throw err
    })
}

function checkInternetConnection() {

    https.get(url, function (res) {

        res.on("data", function (data) {

            html = data.toString();

            if (res.statusCode === 200 && html === appleCaptiveHtml) {
                if (!weAreOnline) {
                    weAreOnline = true;
                    console.error("Internet connection found!!  " + getDate());
                    connectAlarm();
                }
            }
        });
    }).on('error', function (e) {
        if (weAreOnline) {
            weAreOnline = false;
            console.error("Internet connection lost...  " + getDate());
            disconnectAlarm();
        }
    });
}

setInterval(checkInternetConnection, 10000);
