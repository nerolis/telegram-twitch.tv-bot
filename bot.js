import { options, token }                           from './conf.js';
import tmi                                          from 'tmi.js';
import Telegraf                                     from 'telegraf';
import SocksProxyAgent                              from 'socks-proxy-agent';

const commandArgsMiddleware = require('./middleware');

const Telegram   = new Telegraf(token, { telegram: { agent: new SocksProxyAgent('socks://88.198.202.64:1080') } });
const Twitch     = new tmi.client(options);

Telegram.use(commandArgsMiddleware());
Telegram.startPolling();

let subscribers = {};

initTelegramCommands();

function initTelegramCommands() {
        
    Telegram.start(ctx => ctx.reply('Бот, который помогает отслеживать сообщения с twitch.tv. /join $channelname для того, чтоб начать пользоваться ботом.'));
 
    Telegram.command('commands', ctx => getCommandList(ctx));

    Telegram.command('join', ctx => {
        const channelName = ctx.contextState.command.args;

        joinTwitch(ctx, channelName);
    });

    Telegram.command('subscribe', ctx => {
        if (!subscribers.channels) {
            subscribeOnChannel(ctx);
        } else {
            ctx.reply(`Already subscribed on ${options.channels} channel`);
        }
    });

    Telegram.command('stalk', ctx => {
        const nickname = ctx.contextState.command.args;

        if (!subscribers.nickname) {
            subscribeOnTarget(ctx, nickname);
        } else {
            ctx.reply(`Already stalk for ${nickname} channel`);
        }
    });
};


const getCommandList = ctx => {
    ctx.reply(`/subscribe - подписка все сообщения текущего канала. /stalk $channelname подписка на все сообщения конкретного человека`);
};

const subscribeOnTarget  = (ctx, nickname) => {
    subscribers.nickname = true;

    ctx.reply(`Subscribed on ${nickname} messages`);

    Twitch.on("chat", (channel, userstate, message, self, user) => {
        if (userstate['display-name'].toLowerCase() == nickname) {
            ctx.reply(`${userstate['display-name']} : ${message}`);
        }
    });
};

const subscribeOnChannel  = ctx => {
    subscribers.channels  = true;
    ctx.reply(`Subscribed on ${options.channels} channel`);
    
    Twitch.on("chat", (channel, userstate, message, self, user) => {
        ctx.reply(`${userstate['display-name']} : ${message}`);
    });
};

const joinTwitch = (ctx, channelName) => {
    options.channels.push(channelName);

    ctx.reply(`now listen to ${options.channels}. /commands`);

    if (options.channels.length < 1) {
        ctx.reply(`Channel list is empty`);
    } else {
        Twitch.connect();
    }
}

Twitch.on("chat", (channel, userstate, message, self, user) => {
    if (message.split(' ')[0] === '!ask') {
        if (Math.random() >= 0.5) {
            Twitch.action(channel, userstate['display-name'] + ', Да.');
        } else {
            Twitch.action(channel, userstate['display-name'] + ', Нет.');
        }
    }
});