module.exports = {
  data: {
    name: `visit-site`,
  },
  async execute(interaction, client) {
    await interaction.reply({
      content: `https://eamonduffy.dev`,
    });
  },
};
