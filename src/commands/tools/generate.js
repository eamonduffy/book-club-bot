const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("generate")
    .setDescription(
      "Generates question(s) based off given book name and chapter"
    )
    .addStringOption((option) =>
      option
        .setName("book")
        .setDescription("The name of the given book")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("author")
        .setDescription("The author of the given book")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("chapters")
        .setDescription(
          "The chapter(s) to generate questions based off of (comma seperated)"
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const book = interaction.options.getString("book");
    const author = interaction.options.getString("author");
    const chapters = interaction.options.getString("chapters");

    console.log(`Book: ${book}, Author: ${author}, Chapter: ${chapters}`);

    openAIMessage = `In the book '${book}' by '${author}', can you generate one question per chapter for a book club conversation on chapter(s) '${chapters}'?`;

    const apiKey = process.env.OPENAI_API_KEY;

    const client = axios.create({
      headers: {
        Authorization: "Bearer " + apiKey,
      },
    });

    const params = {
      prompt: openAIMessage,
      model: "text-davinci-003",
      max_tokens: 60,
      temperature: 0,
    };

    client
      .post("https://api.openai.com/v1/completions", params)
      .then((result) => {
        console.log(result.data.choices[0].text);
        interaction.reply(result.data.choices[0].text);
      })
      .catch((err) => {
        console.log(err);
      });

    // await interaction.reply(result.data.choices[0].text);
  },
};
