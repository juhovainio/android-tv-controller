import dotenv from 'dotenv';
import {
    AndroidRemote,
    RemoteKeyCode,
    RemoteDirection
} from "androidtv-remote";
import Readline from "readline";
import fs from "fs";
dotenv.config();

let line = Readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let host = process.env.ANDROID_TV_IP;
let options = {
    pairing_port : 6467,
    remote_port : 6466,
    name : 'androidtv-remote',
    cert: {},
}
// Check if certificate files exist and load them
if (fs.existsSync('cert.pem') && fs.existsSync('key.pem')) {
    options.cert = {
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem')
    };
}

let androidRemote = new AndroidRemote(host, options)

androidRemote.on('secret', () => {
    line.question("Code : ", async (code) => {
        androidRemote.sendCode(code);
    });
});

androidRemote.on('powered', (powered) => {
    console.debug("Powered : " + powered)
});

androidRemote.on('volume', (volume) => {
    console.debug("Volume : " + volume.level + '/' + volume.maximum + " | Muted : " + volume.muted);
});

androidRemote.on('current_app', (current_app) => {
    console.debug("Current App : " + current_app);
});

androidRemote.on('ready', async () => {
    let cert = androidRemote.getCertificate();
    // Store certificate in a file
    fs.writeFileSync('cert.pem', cert.cert);
    fs.writeFileSync('key.pem', cert.key);

    // Send power toggle keycode
    androidRemote.sendKey(RemoteKeyCode.KEYCODE_POWER, RemoteDirection.SHORT)

    // Send HDMI 1 input keycode
    androidRemote.sendAppLink("content://android.media.tv/passthrough/com.droidlogic.tvinput%2F.services.Hdmi1InputService%2FHW5")

});

let started = await androidRemote.start();