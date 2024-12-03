const { Telegraf } = require('telegraf');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN);

const regex = /https?:\/\/(www\.)?(vm\.)?(vt\.)?(tiktok\.com|instagram\.com\/(reel|p))/;

const errorMessages = JSON.parse(fs.readFileSync(path.join(__dirname, 'error.json'), 'utf8'));

bot.on('message', async (ctx) => {
    const chatId = ctx.chat.id;
    const url = ctx.message.text;
    await ctx.react('🌭');

    if (regex.test(url)) {
        const data = await download(url, chatId);
        if (!data) return;
        if (url.includes('vm.tiktok') || url.includes('instagram.com/reel')) {      // for videos
            try {
                await bot.telegram.sendVideo(chatId, data.url);
            }
            catch (error) {
                await bot.telegram.sendMessage(chatId, "Error sending video.");
            }
        }
        if (url.includes('vt.tiktok') || url.includes('instagram.com/p')) {     // for images
            try {
                const mediaGroup = data.picker.map(item => ({
                    type: item.type,
                    media: item.url
                }));
                await bot.telegram.sendMediaGroup(chatId, mediaGroup);
            }
            catch (error) {
                await bot.telegram.sendMessage(chatId, "Error sending image.");
            }
        }
        else {
            await bot.telegram.sendMessage(chatId, "Unsupported link type.");
        }
    }
});

function getErrorMessage(code) {
    const formattedCode = code.startsWith('error.') ? code.slice(6) : code;
    return errorMessages[formattedCode] || 'Unknown error';
}

async function download(url, chatId) {
    try {
        const response = await axios.post(process.env.API_URL, {
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
                'Content-Type': 'application/json',
                // 'Authorization': `Api-Key ${process.env.API_KEY}`
            }
        });
        return response.data;
    } catch (error) {
        await bot.telegram.sendMessage(chatId, `Error downloading: ${getErrorMessage(error.response.data.error.code)}`);
    }
}

bot.launch();