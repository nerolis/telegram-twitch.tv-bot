const tmi = require('tmi.js');
const jsdom = require("jsdom");
const mongodb = require('mongodb')
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jQuery')(window);
const fs = require('fs');
process.stdin.resume();
process.stdin.setEncoding('utf8');

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
    channels: ['annieflowers', `qwhejuqwhne`]
};

var client = new tmi.client(options);
client.connect();


// Возможность отвечать из консоли в чат моего канала.
process.stdin.on('data', function (text) {
 if (text.substring(0, 4) === '.msg') {
    reply(text);
  }
});

// получился какой-то высер, но работает, пока оставлю.
reply = (text) => {
    client.action('qwhejuqwhne', text.slice(4))
}

client.on('join', function (channel, user, message) {
    if (user !== 'qwhejuqwhne') {
        console.log(user + channel)
    }
});   

// На коннекте заводим интервал на чек онлайн стрима.
client.on('connected', function(address, port) {
    let intervalTimer = setInterval(() => {
        CheckOnlineStatus()
    }, 60000); // Минуту.
});                                                                                                 

// Создаем и обновляем блокнотик с датой последнего онлайна. 
lastBroadcast = () => { 
fs.writeFile('lastBroadcast.txt', new Date().toLocaleString(), function (err) { 
    if (err) 
        return console.log(err);
});

}
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
                fs.readFile('lastBroadcast.txt', 'utf8', function (err, data) { // открываем файл и чекаем, дату, когда стрим был онлайн в последний раз.
                if (err) {
                    return console.log(err);
                }
                    console.log(data) // Выводим  в консоль дату
                });

            } else {
                // client.action('annieflowers', `online`);
                lastBroadcast() // Если стрим онлайн, мы сохраняем последний онлайн(дату) в функции lastBroadcast 
                clearTimeout(); // Если стрим онлайн, мы клирим(выключаем интервал)
            }
        }
    });
}