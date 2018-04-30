import { options, proxy, token }                    from './conf.js';
import tmi                                          from 'tmi.js';
import Telegraf                                     from 'telegraf';
import SocksProxyAgent                              from 'socks-proxy-agent';

const commandArgsMiddleware = require('./middleware');
const telegram   = new Telegraf(token, { telegram: { agent: new SocksProxyAgent('socks://88.198.202.64:1080') }});
const twitch     = new tmi.client(options);

telegram.use(commandArgsMiddleware());
telegram.startPolling();
let subscribers = {};
let init = {};

telegram.telegram.getMe().then(() => {
    init.twitch = true;
    console.log(`Telegram = true`);
});

if (!init.telegram && init.twitch) {
    throw new Error('Something wrong with connect');
} else {
    initTelegramCommands();
};


function initTelegramCommands() {    
    telegram.start((ctx) => ctx.reply('Бот для twitch.tv, помогает отслеживать сообщения. /join $channelname для того, чтоб начать пользоваться ботом.'));

    telegram.command('join', ctx => {
        const channelName = ctx.contextState.command.args;
        initTwitch(ctx, channelName);
    });

    telegram.command('subscribe', ctx => {
        if (!subscribers.channels) {
            subscribeOnChannel(ctx);
        } else {
            ctx.reply(`Already subscribed on ${options.channels} channel`);
        }
    });

    telegram.command('stalk', ctx => {
        const nickname = ctx.contextState.command.args;
        subscribeOnTarget(ctx, nickname);
    });

    telegram.command('commands', ctx => {
        getCommandList(ctx);
    });
};


const getCommandList = ctx => {
    ctx.reply(`/subscribe - подписка все сообщения текущего канала. /stalk $channelname подписка на все сообщения конкретного человека`);
};

const subscribeOnTarget  = (ctx, nickname) => {
    subscribers.nickname = true;
    ctx.reply(`Subscribed on ${nickname} messages`);

    twitch.on("chat", (channel, userstate, message, self, user) => {
        if (checkChannelName(userstate, nickname)) {
            ctx.reply(`${userstate['display-name']} : ${message}`);
        }
    });
};

const subscribeOnChannel  = ctx => {
    subscribers.channels  = true;
    ctx.reply(`Subscribed on ${options.channels} channel`);
    
    twitch.on("chat", (channel, userstate, message, self, user) => {
        ctx.reply(`${userstate['display-name']} : ${message}`);
    });
};

const checkChannelName = (userstate, nickname) => {
    if (userstate['display-name'] !== nickname)
        return false

    return true;
};

const initTwitch = (ctx, channel) => {
    options.channels.push(channel);

    ctx.reply(`${options.channels} added to listen. /commands for commands`);

    if (options.channels.length < 1) {
        ctx.reply(`Channel list is empty`);
    } else {
        twitch.connect();
    }
}