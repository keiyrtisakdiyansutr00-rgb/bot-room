require("dotenv").config();

const { Client, GatewayIntentBits, ChannelType } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const TOKEN = process.env.TOKEN;

// 🧪 debug
console.log("TOKEN LENGTH:", TOKEN?.length);

// 🎯 ห้องสุ่ม
const TRIGGER_CHANNEL_ID = '1494239212654821477';

// ✅ READY EVENT (แก้แล้ว)
client.once('ready', () => {
  console.log(`✅ Bot online: ${client.user.tag}`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {

  if (!newState.channelId) return;

  if (newState.channelId === TRIGGER_CHANNEL_ID) {

    console.log('🎯 เข้า ห้องสุ่มแล้ว');

    const member = newState.member;

    const available = newState.guild.channels.cache
      .filter(ch =>
        ch.type === ChannelType.GuildVoice &&
        ch.id !== TRIGGER_CHANNEL_ID
      )
      .map(ch => ({
        channel: ch,
        limit: ch.userLimit ?? 0
      }))
      .filter(obj =>
        obj.limit === 0 || obj.channel.members.size < obj.limit
      );

    if (available.length === 0) {
      console.log('❌ ไม่มีห้องว่าง');
      return;
    }

    const random =
      available[Math.floor(Math.random() * available.length)].channel;

    console.log('🚀 จะย้ายไป:', random.name);

    try {
      await member.voice.setChannel(random);
      console.log('✅ ย้ายสำเร็จ');
    } catch (err) {
      console.log('❌ ERROR:', err.message);
    }
  }
});

client.login(TOKEN);