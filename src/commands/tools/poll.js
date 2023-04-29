const { SlashCommandBuilder } = require("@discordjs/builders");
const { CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription(
            "Generate a poll for book club voting. Enter up to 10 books, minimum 2."
        )
        .addStringOption((book) =>
            book
                .setName("book1")
                .setDescription("This is book 1.")
                .setRequired(true)
        )
        .addStringOption((book) =>
            book
                .setName("book2")
                .setDescription("This is book 2.")
                .setRequired(true)
        )
        .addStringOption((book) =>
            book
                .setName("book3")
                .setDescription("This is book 3.")
                .setRequired(false)
        )
        .addStringOption((book) =>
            book
                .setName("book4")
                .setDescription("This is book 4.")
                .setRequired(false)
        )
        .addStringOption((book) =>
            book
                .setName("book5")
                .setDescription("This is book 5.")
                .setRequired(false)
        )
        .addStringOption((book) =>
            book
                .setName("book6")
                .setDescription("This is book 6.")
                .setRequired(false)
        )
        .addStringOption((book) =>
            book
                .setName("book7")
                .setDescription("This is book 7.")
                .setRequired(false)
        )
        .addStringOption((book) =>
            book
                .setName("book8")
                .setDescription("This is book 8.")
                .setRequired(false)
        )
        .addStringOption((book) =>
            book
                .setName("book9")
                .setDescription("This is book 9.")
                .setRequired(false)
        )
        .addStringOption((book) =>
            book
                .setName("book10")
                .setDescription("This is book 10.")
                .setRequired(false)
        ),

    async execute(interaction, client) {
        const book1 = interaction.options.getString("book1");
        const book3 = interaction.options.getString("book3");
        const book2 = interaction.options.getString("book2");
        const book4 = interaction.options.getString("book4");
        const book5 = interaction.options.getString("book5");
        const book6 = interaction.options.getString("book6");
        const book7 = interaction.options.getString("book7");
        const book8 = interaction.options.getString("book8");
        const book9 = interaction.options.getString("book9");
        const book10 = interaction.options.getString("book10");

        const books = [
            book1,
            book2,
            book3,
            book4,
            book5,
            book6,
            book7,
            book8,
            book9,
            book10,
        ];

        const nonEmptyBooks = books.filter(
            (book) => book !== null && book !== undefined && book !== ""
        );

        const emojis = [
            "1️⃣",
            "2️⃣",
            "3️⃣",
            "4️⃣",
            "5️⃣",
            "6️⃣",
            "7️⃣",
            "8️⃣",
            "9️⃣",
            "🔟",
        ];

        if (nonEmptyBooks.length > 0) {
            let bookOption = "";

            for (let i = 0; i < nonEmptyBooks.length; i++) {
                let tempString = `• ${emojis[i]}: ` + `${nonEmptyBooks[i]}\n\n`;
                bookOption += tempString;
            }

            const pollMessage = await interaction.reply({
                content: `**__Round 1 of Book Club Poll__**\n${bookOption}(You have 1 min to vote)`,
                fetchReply: true,
            });

            for (let i = 0; i < nonEmptyBooks.length; i++) {
                pollMessage.react(emojis[i]);
            }

            const collector = pollMessage.createReactionCollector({
                filter: (reaction, user) =>
                    emojis.includes(reaction.emoji.name) &&
                    user.id !== client.user.id,
                // time: 15000, // for testing
                time: 60000, // actual
            });

            const reactionCounts = {};
            const top3 = [];

            collector.on("end", async (collected) => {
                for (const reaction of collected) {
                    const emoji = reaction[0];
                    const count = reaction[1].count;
                    reactionCounts[emoji] = count;
                }

                let response = "";
                for (const [emoji, count] of Object.entries(reactionCounts)) {
                    response += `${emoji}: ${count - 1}\n\n`;
                }

                await interaction.channel.send(
                    `**__Here are the Final "Round 1" votes__**\n${response}`
                );

                // find the top 3 books by sorting the reactionCounts object by value and taking the first 3
                const sortedCounts = Object.entries(reactionCounts).sort(
                    (a, b) => b[1] - a[1]
                );

                for (let i = 0; i < 3 && i < sortedCounts.length; i++) {
                    top3.push({
                        book: nonEmptyBooks[emojis.indexOf(sortedCounts[i][0])],
                        count: sortedCounts[i][1],
                    });
                }

                // send a message witht the top 3 books
                let top3MessageContent = `**\n__Final top 3 books__**\n`;
                for (let i = 0; i < top3.length; i++) {
                    top3MessageContent += `${emojis[i]}: ${top3[i].book} (${
                        top3[i].count - 1
                    } votes)\n\n`;
                }
                top3MessageContent += `(You have 1 min to vote)`;
                const top3Message = await interaction.channel.send(
                    top3MessageContent
                );

                for (let i = 0; i < top3.length; i++) {
                    top3Message.react(emojis[i]);
                }

                const subCollector = top3Message.createReactionCollector({
                    filter: (reaction, user) =>
                        emojis.includes(reaction.emoji.name) &&
                        user.id !== client.user.id,
                    // time: 15000, // for testing
                    time: 60000, // actual
                });

                const reactionCounts2 = {};
                subCollector.on("end", async (subCollected) => {
                    for (const reaction of subCollected) {
                        const emoji2 = reaction[0];
                        const count2 = reaction[1].count;
                        reactionCounts2[emoji2] = count2;
                    }
                    // find the top 3 books by sorting the reactionCounts object by value and taking the first 3
                    const sortedCounts2 = Object.entries(reactionCounts2).sort(
                        (a, b) => b[1] - a[1]
                    );
                    const finalTopBook = [];
                    for (let i = 0; i < 1 && i < sortedCounts2.length; i++) {
                        finalTopBook.push({
                            book: top3[emojis.indexOf(sortedCounts2[i][0])],
                            count: sortedCounts[i][1],
                        });
                    }
                    const topBook = finalTopBook[0].book.book;
                    console.log("next book club book is : ", topBook);

                    await interaction.channel.send(
                        `🎉 **Next Book Club book is "${topBook}"! 🎉**`
                    );
                });
            });
        } else {
            await interaction.reply("No options were provided.");
        }
    },
};
