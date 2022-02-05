const config = require("./config.json");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const client = new discord.Client({
  intents: [
    discord.Intents.FLAGS.GUILDS,
    discord.Intents.FLAGS.GUILD_MEMBERS,
    discord.Intents.FLAGS.GUILD_MESSAGES,
  ],
});

const slashCommandsData = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("renvoie pong")
  .addUserOption((option) =>
    option.setName("user").setDescription("Utilisateur mentionné")
  );

client.on("ready", () => {
  console.log("Ready :)");
});

// Accueil d'un nouveau membre
client.on("guildMemberAdd", (newMember) => {
  // <@${newMember.id}>
  const channelId = "938908141909868595"; // A adapter en fonction du salon ciblé
  client.channels.cache
    .get(channelId)
    .send(`${newMember.displayName} nous a rejoint. Bienvenue à toi !`);
});

// Départ d'un membre
client.on("guildMemberRemove", (leavingMember) => {
  const channelId = "938908141909868595";
  client.channels.cache
    .get(channelId)
    .send(`${leavingMember.displayName} nous a quitté... Aurevoir :'(`);
});

// Prefix messages
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  // !help
  if (message.content === `${config.prefix}help`) {
    const embedHelp = new discord.MessageEmbed()
      .setColor("DARK_ORANGE")
      .setTitle("Commandes du bot")
      .setDescription("**Liste des commandes appelables par le bot**")
      .setThumbnail(
        "https://i.pinimg.com/originals/e3/1b/69/e31b69b8c8386d35a188ad3bc959fdd8.png"
      )
      .addField("__!help__", "Affiche la liste des commandes")
      .addField("__!ping__", "Renvoie 'pong'")
      .setFooter(
        "Même s'il est pas foufou, ce bot est la propriété de son auteur."
      );

    message.channel.send({ embeds: [embedHelp] });
  }
  // !ping
  else if (message.content === `${config.prefix}ping`) {
    message.reply("pong !");
  }

  client.application.commands.create(slashCommandsData);
});

client.on("interactionCreate", (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === "ping") {
      const user = interaction.options.get("user");
      if (user !== undefined) {
        interaction.reply(`Pong <@${user.id}> !`);
      }
    }
  }
});

client.login(config.token);
