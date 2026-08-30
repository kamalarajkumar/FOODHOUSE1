const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
require("dotenv").config();

const Food = require("./models/Food");

const htmlPath = path.join(
    __dirname,
    "..",
    "frontend",
    "foodhouse.html"
);

const categories = [
    "Starters",
    "Main Courses",
    "Veg",
    "Desserts",
    "pizzas",
    "Britishfood",
    "Soups",
    "Salads",
    "Ice creams",
    "Drinks"
];

function cleanText(text) {
    return text
        .replace(/\s+/g, " ")
        .trim();
}

function extractFoods(html) {
    const $ = cheerio.load(html);
    const foods = [];

    $("h2.section-title").each(function() {

        const category = cleanText($(this).text());

        if (!categories.includes(category)) {
            return;
        }

        // The menu-scroll immediately after this category heading
        const menuScroll = $(this).nextAll(".menu-scroll").first();

        if (!menuScroll.length) {
            console.log(`Menu not found for: ${category}`);
            return;
        }

        menuScroll.find(".menu-item").each(function() {

            const card = $(this);

            const name = cleanText(
                card.find("h3").first().text()
            );

            const description = cleanText(
                card.find("p").first().text()
            );

            const priceText = cleanText(
                card.find(".price").first().text()
            );

            const price = Number(
                priceText.replace(/[^\d.]/g, "")
            );

            const image = card.find("img").first().attr("src") || "";

            if (!name || Number.isNaN(price)) {
                console.log(
                    `Skipping invalid food in ${category}`
                );
                return;
            }

            foods.push({
                name,
                description: description || "Delicious food",
                price,
                category,
                image,
                available: true
            });
        });
    });

    return foods;
}

async function importFoods() {

    try {

        console.log("Reading:", htmlPath);

        if (!fs.existsSync(htmlPath)) {
            throw new Error(
                "foodhouse.html not found in frontend folder"
            );
        }

        const html = fs.readFileSync(
            htmlPath,
            "utf8"
        );

        const foods = extractFoods(html);

        console.log(`Found ${foods.length} foods.`);

        if (foods.length !== 80) {
            console.log(
                `WARNING: Expected 80 foods but found ${foods.length}.`
            );
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log(
            "MongoDB connected successfully!"
        );

        // Remove the previous imported records
        await Food.deleteMany({});

        console.log(
            "Old food records removed."
        );

        await Food.insertMany(foods);

        console.log(
            `Successfully imported ${foods.length} foods into MongoDB!`
        );

        console.log("\nCategories:");

        for (const category of categories) {

            const count = foods.filter(
                food => food.category === category
            ).length;

            console.log(
                `${category}: ${count}`
            );
        }

        await mongoose.disconnect();

        console.log(
            "\nImport completed successfully."
        );

    } catch (error) {

        console.error(
            "Import failed:",
            error.message
        );

        await mongoose.disconnect().catch(() => {});

        process.exit(1);
    }
}

importFoods();