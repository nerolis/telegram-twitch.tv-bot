var tmi = require('tmi.js');
var $ = require('jQuery');

// Options. 
var options = {
    options:
       { debug: true },
    connection: {
         cluster: 'aws',
         reconnect: true
        },
    identity: {
         username: 'renelisz',
         password: 'oauth:orjlr6h2rrl8sjgm1qxjkllhme7xp0'
       },
    channels: ['nucl3arhc']
};
// Connect.
var client = new tmi.client(options);
client.connect();


// An answers for phrases. 
client.on('chat', function(channel, user, message, self) {
    if (message == 'посоветуй билд') {
        client.action('nucl3arhc', user['display-name'] + ', кок дизчардж!');
    }
    if (message == 'почему окультист') {
        client.action('nucl3arhc', user['display-name'] + ', промахнулся в лабе Kappa');
    }
    if (message == 'почему гвард') {
        client.action('nucl3arhc', user['display-name'] + ', промахнулся в лабе Kappa');
    }
    if (message == 'брокен') {
        client.action('nucl3arhc', user['display-name'] + ', FrankerZ');
    }
    if (message == 'сколько реген ес') {
        client.action('nucl3arhc', user['display-name'] + ', energy shield regen 1763.4');
    }
});    

client.on("message", function (channel, userstate, message, self) {
    // Don't listen to my own messages..
    if (self) return;

    // Handle different message types..
    switch (userstate["message-type"]) {
        case "action":
            client.action('nucl3arhc', userstate['display-name'] + ', this is an action msg');
            break;
        case "chat":
        // this
            break;
        case "whisper":
            client.action('nucl3arhc', userstate['display-name'] + ', this is a whisper');
            break;
        default:
            client.action('nucl3arhc', userstate['display-name'] + ', something else');
            break;
    }
});

// Start.
client.on('connected', function(address, port) {
});                                                                                                 