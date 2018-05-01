import { options, token }                           from './conf.js';
import tmi                                          from 'tmi.js';
import Telegraf                                     from 'telegraf';
import SocksProxyAgent                              from 'socks-proxy-agent';
import commandArgsMiddleware                        from './middleware';

const Telegram   = new Telegraf(token, { telegram: { agent: new SocksProxyAgent('socks://88.198.202.64:1080') } });
const Twitch     = new tmi.client(options);

Telegram.use(commandArgsMiddleware());
Telegram.startPolling();

initTelegramCommands();
initTwitchListeners();

let subscribers = {};

function initTelegramCommands() {
    Telegram.start(ctx =>
         ctx.reply('/join $channelname. Join twitch channel.'));
    
    Telegram.command('commands', ctx =>
         ctx.reply(`/subscribe - listen to all msges in joined channel. /stalk $channelname listen to msgs by specific user in joined channel`));

    Telegram.command('join', ctx => 
        joinTwitch(ctx));

    Telegram.command('subscribe', ctx => {
        if (!subscribers.channels) {
            listenJoinedChannel(ctx);
        } else {
            ctx.reply(`Already listen to ${options.channels} channel`);
        }
    });

    Telegram.command('stalk', ctx => {
        if (!subscribers.nickname) {
            listenToSpecificUser(ctx);
        } else {
            ctx.reply(`Already stalk for ${nickname} channel`);
        }
    });
};

function initTwitchListeners() {
    Twitch.on("chat", (channel, userstate, message, self, user) => {
        if (message.split(' ')[0] === '!ask') {
            if (Math.random() >= 0.5) {
                Twitch.action(channel, userstate['display-name'] + ', Да.');
            } else {
                Twitch.action(channel, userstate['display-name'] + ', Нет.');
            }
        }
    });
};

const listenToSpecificUser  = ctx => {
    const nickname = ctx.contextState.command.args;
    subscribers.nickname = true;

    ctx.reply(`Subscribed on ${nickname} messages`);

    Twitch.on("chat", (channel, userstate, message, self, user) => {
        if (userstate['display-name'].toLowerCase() == nickname) {
            ctx.reply(`${userstate['display-name']} : ${message}`);
        }
    });
};

const listenJoinedChannel  = ctx => {
    subscribers.channels  = true;
    ctx.reply(`Now listen to ${options.channels} channel`);
    
    Twitch.on("chat", (channel, userstate, message, self, user) => {
        ctx.reply(`${userstate['display-name']} : ${message}`);
    });
};

const joinTwitch = ctx => {
    const channelName = ctx.contextState.command.args;
    options.channels.push(channelName);

    ctx.reply(`Now listen to ${options.channels}. /commands`);

    if (options.channels.length < 1) {
        ctx.reply(`Channel list is empty`);
    } else {
        Twitch.connect();
    }
};
