import axios from "axios";
import config from "./config.js";

export async function getCandles() {
    try {

        const url = `https://api.twelvedata.com/time_series?symbol=${config.SYMBOL}&interval=${config.INTERVAL}&outputsize=${config.OUTPUT_SIZE}&apikey=${config.API_KEY}`;

        const { data } = await axios.get(url);

        if (data.status === "error") {
            console.log("TwelveData Error:", data.message);
            return [];
        }

        if (!data.values) {
            console.log("No candle data received.");
            return [];
        }

        return data.values.reverse();

    } catch (error) {

        console.error("API Error:", error.message);
        return [];

    }
}