import axios from "axios";
import * as cheerio from "cheerio";
import * as admin from "firebase-admin";
import * as cron from "node-cron";

const KOHOUTOVICE_SAUNA_SELECTOR = "#info-ticket-collapse > div > div:nth-child(3) > div > span";
const KOHOUTOVICE_POOL_SELECTOR = "#info-ticket-collapse > div > div:nth-child(2) > div > span";

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(require("./firebase-config.json")),
});

const db = admin.firestore();

function extractFirstNumber(data: string): number {
    const match = data.match(/(\d+)\//);
    return match ? parseInt(match[1], 10) : 0;
}

// Function to scrape data from the website
async function scrapeData(): Promise<void> {
    try {
        const { data } = await axios.get("https://aquapark.starez.cz/");
        const $ = cheerio.load(data);

        // Scrape the sauna and pool data
        const saunaData = extractFirstNumber($(KOHOUTOVICE_SAUNA_SELECTOR).text().trim());
        const poolData = extractFirstNumber($(KOHOUTOVICE_POOL_SELECTOR).text().trim());

        console.log("Scraped data:", { saunaData, poolData });

        // Save data to Firebase
        await db.collection("kohoutovice").add({
            sauna: saunaData,
            pool: poolData,
            date: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log("Data scraped and saved:", { saunaData, poolData });
    } catch (error) {
        console.error("Error scraping data:", error);
    }
}

// Schedule to run every 10 minutes
cron.schedule("*/10 * * * *", scrapeData);
