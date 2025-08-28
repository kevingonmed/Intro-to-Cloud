import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());

// Endpoint para obtener próximos partidos
app.get("/matches", async (req, res) => {
    try {
        const leagueId = 39; // Premier League
        const url = `https://v3.football.api-sports.io/fixtures?league=${leagueId}&next=10`;

        const response = await fetch(url, {
            headers: { "x-apisports-key": process.env.API_KEY }
        });

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch matches" });
    }
});

// Endpoint para obtener lineup de un fixture
app.get("/lineups/:fixtureId", async (req, res) => {
    try {
        const fixtureId = req.params.fixtureId;
        const url = `https://v3.football.api-sports.io/lineups?fixture=${fixtureId}`;

        const response = await fetch(url, {
            headers: { "x-apisports-key": process.env.API_KEY }
        });

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch lineup" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
