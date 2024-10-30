// server.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

// Define elements/compounds to search for in descriptions
const compoundKeywords = [
    "chlorine", "bromine", "iodine", "fluorine", "sodium", "potassium",
    "oxygen", "nitrogen", "hydrogen", "carbon", "silver", "gold"
];

// Helper function to extract compatible compounds from description
function extractCompatibleCompounds(description) {
    const compatibleCompounds = [];
    compoundKeywords.forEach(keyword => {
        if (description.toLowerCase().includes(keyword)) {
            compatibleCompounds.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
        }
    });
    return compatibleCompounds.length > 0 ? compatibleCompounds : ["No specific compatible compounds found"];
}

// Fetch compound data from Wikipedia
async function fetchCompoundData(compoundName) {
    try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${compoundName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch data for ${compoundName}`);
        }
        const data = await response.json();
        
        // Extract key info
        const description = data.extract || "No description available.";
        const title = data.title;

        // Get compatible compounds from the description
        const compatibleCompounds = extractCompatibleCompounds(description);
        
        // Create a basic resultant compound and use case (for demonstration)
        const resultantCompound = `${title} Compound Mix`;
        const uses = compatibleCompounds.includes("No specific compatible compounds found")
            ? ["Generic Use Case"]
            : ["Industrial, Medical, and Research Applications"]; // Placeholder

        return {
            compound: title,
            description,
            compatibleCompounds,
            resultantCompound,
            uses
        };
    } catch (error) {
        console.error("Error fetching data from Wikipedia:", error);
        return null;
    }
}

// API endpoint
app.get('/api/compound/:name', async (req, res) => {
    const compoundName = req.params.name;
    const data = await fetchCompoundData(compoundName);
    if (data) {
        res.json(data);
    } else {
        res.status(500).json({ error: "Failed to fetch compound data" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
import { json } from 'express';
