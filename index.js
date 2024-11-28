const { Telegraf } = require('telegraf');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN);

const regex = /https?:\/\/(www\.)?(vm\.)?(vt\.)?(tiktok\.com|instagram\.com\/(reel|p))/;

let channelNames = [];

// Read the existing channel names from the file
fs.readFile('channels.csv', 'utf8', function (err, data) {
    if (err) {
        console.error('Error reading channels.csv:', err);
        return;
    }
    channelNames = data.split('\n').filter(name => name.trim() !== '');
});

bot.on('message', async (ctx) => {
    const chatId = ctx.chat.id;
    const url = ctx.message.text;

    const chatName = ctx.chat.username || ctx.chat.title || `Chat ID: ${chatId}`;
    if (!channelNames.includes(chatName)) {
        channelNames.push(chatName);
        fs.appendFile('channels.csv', chatName + '\n', function (err) {
            if (err) {
                console.error('Error appending to channels.csv:', err);
            }
        });
    }

    if (regex.test(url)) {
        const data = await download(url);
        if (url.includes('vm.tiktok') || url.includes('instagram.com/reel')) {      // for vidoes
            await bot.telegram.sendVideo(chatId, data.url);
        }
        else if (url.includes('vt.tiktok') || url.includes('instagram.com/p')) {     // for images
            const mediaGroup = data.picker.map(item => ({
                type: item.type,
                media: item.url
            }));
            await bot.telegram.sendMediaGroup(chatId, mediaGroup);
        }
        else {
            await bot.telegram.sendMessage(chatId, "Unsupported link type.");
        }
    }
});

async function download(url) {
    try {
        const response = await axios.post('https://api.liotom.me/', {
            url: url,
            videoQuality: '720',
            audioFormat: 'mp3',
            audioBitrate: '128',
            filenameStyle: 'classic',
            downloadMode: 'auto',
            youtubeVideoCodec: 'h264',
            youtubeDubLang: 'en',
            alwaysProxy: false,
            disableMetadata: false,
            tiktokFullAudio: false,
            tiktokH265: false,
            twitterGif: true,
            youtubeHLS: false
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error(error);
        return { status: 'error', error: { code: 'request_failed' } };
    }
}

bot.launch();