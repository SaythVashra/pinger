const https = require("https");
const readline = require('readline');
const exec = require("child_process").exec;
const execFile = require("child_process").execFile;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//*******************************************************************//

let weAreOnline = false;
let isMuted = false;
let autoRunSteam = false;
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
    if(!isMuted){
        const player = require('play-sound')(opts = {players: "mpg123"});
        player.play(__dirname + '/sounds/connect-alarm.mp3', function (err) {
            if (err) throw err
        })
    }
}

function disconnectAlarm() {
    if(!isMuted){
    const player = require('play-sound')(opts = {players: "mpg123"});
    player.play(__dirname + '/sounds/disconnect-alarm.mp3', function (err) {
        if (err) throw err
    })
    }
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
                    if (autoRunSteam) {
                        runSteam();
                    }
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

checkInternetConnection();
setInterval(checkInternetConnection, 10000);

//*****************************************************************//

const isRunning = (query, cb) => {
    let platform = process.platform;
    let cmd = '';
    switch (platform) {
        case 'win32' :
            cmd = `tasklist`;
            break;
        case 'darwin' :
            cmd = `ps -ax | grep ${query}`;
            break;
        case 'linux' :
            cmd = `ps -A`;
            break;
        default:
            break;
    }
    exec(cmd, (err, stdout, stderr) => {
        cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
};

function runSteam() {

    isRunning('steam.exe', (status) => {
        if (status === false) {
            execFile(__dirname + "/runSteam.bat");
            console.log("Running Steam...");
        } else {
            console.log("Steam is already running.");
        }
    });
}

//********************************USER INPUTS*********************************//

rl.on('line', (input) => {

    switch (input) {

        case "r steam":
            runSteam();
            break;

        case "ar-steam on":
            autoRunSteam = true;
            console.log("Autorun Steam set to ON.");
            break;

        case "ar-steam off":
            autoRunSteam = false;
            console.log("Autorun Steam set to OFF.");
            break;

        case "snd off":
            isMuted = true;
            console.log("Sound muted.");
            break;

        case "snd on":
            isMuted = false;
            console.log("Sound activated.");
            break;

        default:
            console.log("'" + input + "'" + " is not a valid command.");

    }
});