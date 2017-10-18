var tmi = require('tmi.js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jQuery')(window);

// Options. 
var options = {
    options:
       { debug: true },
    connection: {
         cluster: 'aws',
         reconnect: true
        },
    identity: {
         username: 'qwhejuqwhne',
         password: 'oauth:g4btluwtvdv0ouuk4yjyb50ke7t8dw'
       },
    channels: ['lesstra', 'annieflowers']
};

var client = new tmi.client(options);
client.connect();

client.on('join', function (channel, user, message) {
    if (user === '808s808s808s') {
        client.action('lesstra', `внимание, @808s808s808s зашел в чат`);
    }
});   

client.on('connected', function(address, port) {
    let intervalTimer = setInterval(() => {
        CheckOnlineStatus()
    }, 60000); // Каждую минуту.
});                                                                                                 

CheckOnlineStatus = () => {
    $.ajax({
        url: `https://api.twitch.tv/kraken/streams/annieflowers`,
        dataType: 'json',
        headers: {
            'Client-ID': 'j2cclgmrxhctqtee70qgm6uqg25cy4'
        },
        success: function (channel) {
            if (channel["stream"] == null) {
                console.log('Offline. After 60 sec, another parse.')
            } else {
                client.action('annieflowers', ` @annieflowers online, clear timeout`);
                clearTimeout(intervalTimer);
            }
        }
    });
}