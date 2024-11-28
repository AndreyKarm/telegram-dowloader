const { Telegraf } = require('telegraf');
const axios = require('axios');
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN);

const regex = /https?:\/\/(www\.)?(vm\.)?(vt\.)?(tiktok\.com|instagram\.com\/(reel|p))/;


bot.on('message', async (ctx) => {
    const chatId = ctx.chat.id;
    const url = ctx.message.text;

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