const config = require("./config.json");
const discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const client = new discord.Client({
  intents: [
    discord.Intents.FLAGS.GUILDS,
    discord.Intents.FLAGS.GUILD_MEMBERS,
    discord.Intents.FLAGS.GUILD_MESSAGES,
    discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
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
  const principalTextChannel = Array.from(client.channels.cache).find(
    (t) => t[1].type === "GUILD_TEXT"
  );
  client.channels.cache
    .get(principalTextChannel)
    .send(`${newMember.displayName} nous a rejoint. Bienvenue à toi !`);
});

// Départ d'un membre
client.on("guildMemberRemove", (leavingMember) => {
  const principalTextChannel = Array.from(client.channels.cache).find(
    (t) => t[1].type === "GUILD_TEXT"
  );
  client.channels.cache
    .get(principalTextChannel)
    .send(`${leavingMember.displayName} nous a quitté... Aurevoir :'(`);
});

// Détection de réaction
client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.emoji.name === "😻") {
    const channelId = reaction.message.channelId;
    client.channels.cache
      .get(channelId)
      .send(`Miaouuu à toi aussi <@${user.id}> ! 😻 😻 😻`);
  }
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
