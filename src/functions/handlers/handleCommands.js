const { REST } = require("@Discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFolders = fs.readdirSync("./src/commands");
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        console.log(
          `Command: ${command.data.name} has been passed through the handler`
        );
      }
    }

    // clientID (bot ID) which is from discord developer portal
    const clientId = "1079497991200718989";

    // below are the guildIDs of my servers, to get the guildID. User needs to have dev mode on and right click server and look at bottom for 'Copy ID'
    const myServerId = "890946950759874631"; // for my personal server
    const coolCatsId = "449076992923402250"; // for cool cats server

    const rest = new REST({ version: "10" }).setToken(process.env.token);

    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationGuildCommands(clientId, coolCatsId), {
        body: client.commandArray,
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (err) {
      console.error(err);
    }
  };
};
