// ===== Dependencies =====
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

// ===== Load Environment Variables =====
dotenv.config({ path: __dirname + '/.env' });  // Force load from server folder

// ===== Initialize App =====
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ===== Initialize OpenAI =====
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ===== Chat Endpoint =====
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Incoming message:', message);

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
        });

        const reply = response.choices[0].message.content;
        res.json({ reply });
    } catch (error) {
        console.error('OpenAI Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to get a response from OpenAI' });
    }
});

// ===== Start Server =====
app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});