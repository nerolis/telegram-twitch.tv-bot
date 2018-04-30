import { options, proxy, token, target }            from './conf.js';
import tmi                                          from 'tmi.js';
import Telegraf                                     from 'telegraf';
import SocksProxyAgent                              from 'socks-proxy-agent';
const commandArgsMiddleware = require('./middleware');

const telegram   = new Telegraf(token, { telegram: { agent: new SocksProxyAgent('socks://88.198.202.64:1080') }});
const twitch     = new tmi.client(options);

telegram.use(commandArgsMiddleware());


telegram.startPolling();
twitch.connect();

let subscribed = false;
let init = {};

twitch.on('connected', (address, port) => {
    init.twitch = true;
    console.log('Twitch = true');
});

telegram.telegram.getMe().then(() => {
    init.twitch = true;
    console.log(`Telegram = true`);
});

if (!init.twitch && init.telegram) {
    throw new Error('Something wrong with connect');
} else {
    initTelegramCommands();
}

function initTelegramCommands() {
    telegram.hears('!subscribe', ctx => {
        if (!subscribed) {
            subscribeOnChannel(ctx);
        } else {
            ctx.reply(`Already subscribed on ${options.channels} channels`);
        }
    });
};

const subscribeOnChannel = ctx => {
    subscribed = true;
    ctx.reply(`Subscribed on ${options.channels} channels`);
    
    twitch.on("chat", (channel, userstate, message, self, user) => {
        ctx.reply(`${userstate['display-name']} : ${message}`);
    });
};

const checkTarget = userstate => {
    if (userstate['display-name'] !== target)
        return false

    return true;
};

twitch.on('join', (channel, user, message) => {
    if (user === target) console.log(`${target} joined the channel`);
});