module.exports = {
  data: {
    name: `visit-site-menu`,
  },
  async execute(interaction, client) {
    await interaction.reply({
      content: `You select: ${interaction.values[0]}`,
    });
  },
};
