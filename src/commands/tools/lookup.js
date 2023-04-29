// use /lookup to get the goodreads page for the given book and author. Give summary of book / number of pages / average rating / genres of book
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const Vibrant = require("node-vibrant");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lookup")
        .setDescription(
            "Lookup details of book and display general info on it."
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
        ),
    async execute(interaction, client) {
        const book = interaction.options.getString("book");
        const author = interaction.options.getString("author");

        // const api_key = process.env.GOOGLE_API_KEY;
        const config = {
            headers: { "User-Agent": "Discord Book Bot" },
        };

        const isBook = await bookExists(book, author);
        // make a request to the google books api
        if (isBook) {
            axios
                .get(
                    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                        book
                    )}+inauthor:${encodeURIComponent(author)}`,
                    config
                )
                .then(async (response) => {
                    // console.log(response);
                    const bookData = response.data.items[0].volumeInfo;
                    const bookTitle = bookData.title;
                    const bookAuthor = bookData.authors[0];
                    const bookPublisher = bookData.publisher;
                    const pageCount = bookData.pageCount;
                    const description = bookData.description;
                    const categories = bookData.categories;
                    const averageRating = bookData.averageRating;
                    const thumbnail = bookData.imageLinks.thumbnail;
                    const bookUrl = bookData.infoLink;

                    // console.log("bookData", bookData);
                    // console.log(`Title: ${bookTitle}`);
                    // console.log(`Author: ${bookAuthor}`);
                    // console.log(`Publisher: ${bookPublisher}`);
                    // console.log(`pageCount: ${pageCount}`);
                    // console.log(`description: ${description}`);
                    // console.log(`categories: ${categories}`);
                    // console.log(`averageRating: ${averageRating}`);
                    // console.log(`thumbnail: ${thumbnail}`);
                    // console.log(`bookUrl: ${bookUrl}`);

                    const reducedDesc = reduceStringSize(description);
                    const primaryColor = await getDominantColorFromImage(
                        thumbnail
                    );

                    const embed = new EmbedBuilder()
                        .setColor(primaryColor)
                        .setTitle(bookTitle)
                        .setAuthor({
                            // user client.user if you want the book club boot icon and name instead
                            iconURL: interaction.user.displayAvatarURL(),
                            name: interaction.user.tag,
                        })
                        .setThumbnail(thumbnail)
                        .setURL(bookUrl)
                        .addFields([
                            {
                                name: `Description`,
                                value: reducedDesc,
                                inline: false,
                            },
                        ]);

                    if (categories) {
                        embed.addFields({
                            name: `Categories`,
                            value: categories.toString(),
                            inline: false,
                        });
                    }

                    if (averageRating) {
                        embed.addFields({
                            name: `Average Rating`,
                            value: averageRating.toString(),
                            inline: false,
                        });
                    }

                    if (bookPublisher) {
                        embed.addFields({
                            name: `Publisher`,
                            value: bookPublisher,
                            inline: false,
                        });
                    }

                    if (pageCount) {
                        embed.addFields({
                            name: `Page Count`,
                            value: pageCount.toString(),
                            inline: false,
                        });
                    }

                    await interaction.reply({ embeds: [embed] });
                })

                .catch((error) => {
                    console.error(error);
                });
        } else {
            await interaction.reply({
                content: `Sorry! ${book} by ${author} was not found in Google Books API`,
                ephemeral: true,
            });
        }
    },
};

// search book before making request
async function bookExists(title, author) {
    const query = `${title}+inauthor:${author}`;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
    )}`;
    const response = await axios.get(url);
    if (
        response.data.items &&
        response.data.items.length > 0 &&
        response.data.items[0].volumeInfo
    ) {
        return true;
    }
    return false;
}

// reduce description string if too large
function reduceStringSize(str) {
    if (str.length > 500) {
        return str.substring(0, 500) + "...";
    } else {
        return str;
    }
}

// gets dominant color of image
async function getDominantColorFromImage(imageUrl) {
    // Download the image
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    // Get the dominant colors using node-vibrant
    const palette = await Vibrant.from(buffer).getPalette();

    // Return the hex value of the most dominant color
    return palette.Vibrant.getHex();
}
