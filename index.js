const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
  console.error('Hata: DISCORD_TOKEN veya CLIENT_ID ortam degiskeni eksik!');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Botun aktifligini ve gecikmesini olcer.')
    .toJSON()
];

client.once('ready', async () => {
  console.log(`Bot aktif oldu: ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(token);
  try {
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log('Slash komutlar basariyla yuklendi.');
  } catch (error) {
    console.error('Komut yukleme hatasi:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply(`Pong! Gecikme: ${Math.round(client.ws.ping)}ms`);
  }
});

client.login(token);
