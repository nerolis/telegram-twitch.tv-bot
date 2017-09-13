var tmi = require('tmi.js');

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

var client = new tmi.client(options);
client.connect();


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
    if (message === '!uptime') {
        
    }
});                                     

client.on('connected', function(address, port) {
    client.action('nucl3arhc', 'MrDestructoid');
});                                                                                                 