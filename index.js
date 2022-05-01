const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');
const token = '5310210321:AAH2nnKu-UOMEwbdSixLCpm8wkM4wO9DpIQ';

const bot = new TelegramApi(token, { polling: true });
const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Now I will think of a number from 0 to 9, and you have to guess it`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Guess it', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Welcome text' },
        { command: '/info', description: 'User info' },
        { command: '/game', description: 'Play game' },
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/192/7.webp');
            return bot.sendMessage(chatId, `Welcome to Canty bot`);
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `You are ${msg.chat.first_name}`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, "I don't understand you");
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (parseFloat(data) === chats[chatId]) {
            return await bot.sendMessage(chatId, `You win. ${chats[chatId]} - is true`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `You lose. Bot choose ${chats[chatId]}`, againOptions);
        }
    })
}

start();