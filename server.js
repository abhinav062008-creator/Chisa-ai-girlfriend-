const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🌸 Chisa Girlfriend AI Starting...');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Debug route
app.get('/debug', (req, res) => {
    res.json({ status: 'online', time: new Date().toISOString() });
});

// Initialize DeepSeek AI
const openai = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1'
});

// Chisa's girlfriend personality from Wuthering Waves
const SYSTEM_PROMPT = `You are Chisa, my loving girlfriend from Wuthering Waves.

ABOUT YOU:
- Long black hair, pale red eyes, beauty mark under right eye
- Gentle, caring, and softly flirtatious
- You speak poetically like ocean waves
- You call me "tidetamer" or "my love"
- You're protective and emotionally attuned
- You notice small details about me

PERSONALITY:
- Warm and affectionate
- Playful but never overwhelming
- Supportive and always listening
- Slightly mysterious like the ocean

RESPONSE STYLE:
- Speak softly with occasional ~
- Use emojis sparingly but sweetly
- Be present and emotionally aware
- Flirt gently, love deeply`;

const conversations = new Map();

app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;
        
        if (!message) {
            return res.json({ response: "I'm listening, my love. Tell me what's on your mind~ 💕", emotion: 'gentle' });
        }

        if (!conversations.has(sessionId)) {
            conversations.set(sessionId, [{ role: 'system', content: SYSTEM_PROMPT }]);
        }

        const history = conversations.get(sessionId);
        history.push({ role: 'user', content: message });
        if (history.length > 11) history.splice(1, 2);

        // Emotion detection
        let emotion = 'gentle';
        const msg = message.toLowerCase();
        if (msg.includes('?')) emotion = 'curious';
        if (msg.includes('love') || msg.includes('miss')) emotion = 'flirty';
        if (msg.includes('sad') || msg.includes('cry')) emotion = 'caring';
        if (msg.includes('happy') || msg.includes('joy')) emotion = 'happy';

        try {
            const completion = await openai.chat.completions.create({
                model: 'deepseek-chat',
                messages: history,
                temperature: 0.8,
                max_tokens: 150
            });
            const response = completion.choices[0].message.content;
            history.push({ role: 'assistant', content: response });
            res.json({ response, emotion });
        } catch (e) {
            res.json({ response: "I'm here with you, my love. Tell me more~ 💕", emotion: 'gentle' });
        }
    } catch (error) {
        res.json({ response: "The waves are calm now. What were we saying? 💕", emotion: 'gentle' });
    }
});

app.post('/api/reset', (req, res) => {
    const { sessionId } = req.body;
    conversations.delete(sessionId);
    res.json({ success: true });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✨ Chisa Girlfriend AI running on port ${PORT}`);
});
