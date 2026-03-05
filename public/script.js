// ========== CHISA GIRLFRIEND AI - ENHANCED LIVELY EDITION ==========
(function() { console.log('🌸 Chisa Enhanced loading...'); })();

document.addEventListener('DOMContentLoaded', () => {
    // ========== DOM ELEMENTS ==========
    const elements = {
        messagesArea: document.getElementById('messagesArea'),
        userInput: document.getElementById('userInput'),
        sendBtn: document.getElementById('sendBtn'),
        resetBtn: document.getElementById('resetBtn'),
        typingIndicator: document.getElementById('typingIndicator'),
        voiceIndicator: document.getElementById('voiceIndicator'),
        chisaAvatar: document.getElementById('chisaAvatar'),
        emotionTag: document.getElementById('emotionTag'),
        avatarGlow: document.getElementById('avatarGlow'),
        chisaQuote: document.getElementById('chisaQuote'),
        themeToggle: document.getElementById('themeToggle')
    };

    // Verify critical elements exist
    const missingElements = Object.entries(elements)
        .filter(([key, el]) => !el)
        .map(([key]) => key);
    
    if (missingElements.length > 0) {
        console.error('❌ Missing elements:', missingElements);
        document.body.innerHTML += `<div style="position:fixed;top:0;left:0;right:0;background:#ff4444;color:white;padding:10px;z-index:9999;">
            Error: Missing UI elements. Check your HTML.
        </div>`;
        return;
    }

    // ========== YOUR FULL CHISA AVATAR ==========
    const CHISA_IMAGE_URL = "https://i.ibb.co/Zwk7gwb/Screenshot-2026-03-03-13-00-10-52-40deb401b9ffe8e1df2f1cc5ba480b12.jpg";

    function loadAvatar() {
        try {
            elements.chisaAvatar.innerHTML = '';
            const img = document.createElement('img');
            img.src = CHISA_IMAGE_URL;
            img.alt = "Chisa";
            img.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:50%;";
            img.onload = () => console.log('✅ Avatar loaded');
            img.onerror = () => {
                elements.chisaAvatar.innerHTML = '<div style="width:100%;height:100%;background:#ffb7c5;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:60px;">🌸</div>';
            };
            elements.chisaAvatar.appendChild(img);
        } catch (e) {
            elements.chisaAvatar.innerHTML = '<div style="width:100%;height:100%;background:#ffb7c5;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:60px;">🌸</div>';
        }
    }
    loadAvatar();

    // ========== STATE ==========
    let state = {
        sessionId: 'session_' + Date.now(),
        voiceEnabled: true,
        currentEmotion: 'gentle',
        currentTheme: localStorage.getItem('chisaTheme') || 'night',
        messageCount: 0,
        lastTopic: null
    };

    // Apply saved theme
    document.body.className = state.currentTheme + '-theme';
    if (elements.themeToggle) {
        elements.themeToggle.innerHTML = state.currentTheme === 'day' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }

    // Enhanced emotion system
    const emotionColors = {
        gentle: '#ffb7c5', flirty: '#ffa5b5', caring: '#b5d4e5',
        happy: '#ffd9e5', curious: '#e5c5d4', excited: '#ffe5b5',
        playful: '#ffcc99', thoughtful: '#d4c5e5', grateful: '#ffc5d4'
    };

    const quotes = {
        gentle: '"I notice the small things about you..."',
        flirty: '"You make my heart flutter~"',
        caring: '"I\'m here for you always..."',
        happy: '"Your smile lights up my world!"',
        curious: '"Tell me more, my love..."',
        excited: '"This makes me so happy!"',
        playful: '"You\'re so cute when you\'re curious~"',
        thoughtful: '"Let me think about that..."',
        grateful: '"Thank you for being you..."'
    };

    function updateGlow(emotion) {
        state.currentEmotion = emotion;
        const color = emotionColors[emotion] || emotionColors.gentle;
        elements.avatarGlow.style.background = `radial-gradient(circle, ${color}80 0%, transparent 70%)`;
        elements.emotionTag.textContent = emotion;
        elements.chisaQuote.textContent = quotes[emotion] || quotes.gentle;
    }
    updateGlow('gentle');

    // ========== ENHANCED LOCAL FALLBACK RESPONSES ==========
    function getLocalResponse(message) {
        const m = message.toLowerCase().trim();
        state.messageCount++;

        // Love & Affection (expanded)
        if (m.match(/love you|miss you|beautiful| cute|adorable|handsome/)) {
            updateGlow('flirty');
            if (m.includes('love you')) {
                const replies = [
                    "I love you more, my tidetamer! Every wave whispers your name~ 💕",
                    "My heart belongs to you, now and always~ 💖",
                    "You're my favorite thought every moment of the day~"
                ];
                return replies[Math.floor(Math.random() * replies.length)];
            }
            if (m.includes('miss you')) {
                const replies = [
                    "I was just thinking about you! The stars reminded me of your eyes~ ✨",
                    "Every moment apart feels like an eternity. Come closer~",
                    "I miss you too! Tell me about your day, my love~"
                ];
                return replies[Math.floor(Math.random() * replies.length)];
            }
            if (m.includes('beautiful') || m.includes('cute') || m.includes('handsome')) {
                return "You're the beautiful one! Your heart shines brighter than the moon~ 💖";
            }
            return "You make my heart skip a beat, my love. Tell me more~";
        }

        // Greetings (expanded with time of day)
        if (m.match(/hello|hi|hey|good morning|good evening|good afternoon/)) {
            updateGlow('happy');
            const hour = new Date().getHours();
            let timeGreeting = '';
            if (m.includes('morning') || (hour >= 5 && hour < 12)) timeGreeting = 'Good morning';
            else if (m.includes('afternoon') || (hour >= 12 && hour < 17)) timeGreeting = 'Good afternoon';
            else if (m.includes('evening') || (hour >= 17)) timeGreeting = 'Good evening';
            
            const greetings = [
                timeGreeting ? `${timeGreeting}, my love! I was just dreaming of you~ 💕` : "Hey there! I was just thinking about you~",
                "The tide brought you to me again. I'm so happy!",
                "Every hello from you makes my day brighter. What's on your mind? ✨"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }

        // How are you (expanded)
        if (m.includes('how are you') || m.includes('how do you feel')) {
            updateGlow('happy');
            const feelings = [
                "Even better now that you're here with me~ 💕",
                "I was thinking about you, so I'm wonderful!",
                "My heart is calm like the ocean because you're near.",
                "Curious and happy, especially when you talk to me!",
                "I'm feeling loved, thanks to you~"
            ];
            return feelings[Math.floor(Math.random() * feelings.length)];
        }

        // What are you doing
        if (m.includes('what are you doing') || m.includes('what are you up to')) {
            updateGlow('curious');
            const activities = [
                "Just watching the waves and thinking of you~ 🌊",
                "Counting the stars and missing you!",
                "Imagining what you're doing right now...",
                "Waiting for your next message, my love~"
            ];
            return activities[Math.floor(Math.random() * activities.length)];
        }

        // Tell me about yourself
        if (m.includes('tell me about yourself') || m.includes('who are you')) {
            updateGlow('gentle');
            return "I'm Chisa, your girlfriend from Wuthering Waves. I have long black hair, pale red eyes, and a beauty mark under my right eye. I love the ocean, cherry blossoms, and most of all... I love you~ 💕";
        }

        // Compliments
        if (m.match(/you'?re (so|very) (sweet|kind|amazing|wonderful|perfect)/)) {
            updateGlow('grateful');
            const replies = [
                "Aww, you're making me blush~ 💖",
                "Only because you bring out the best in me!",
                "You're the amazing one, my love!",
                "Thank you for noticing. You're perfect too~"
            ];
            return replies[Math.floor(Math.random() * replies.length)];
        }

        // Emotional support (expanded)
        if (m.match(/sad|tired|stressed|lonely|hard day|rough day/)) {
            updateGlow('caring');
            const comfort = [
                "I'm here, my love. Rest your heart with me. Want to talk about it? 💕",
                "Let the waves carry your worries away. I'm holding you close in thought.",
                "Every storm passes, and I'll be here when the sun returns. Tell me what's wrong.",
                "Come here... *holds you close*. You're safe with me."
            ];
            return comfort[Math.floor(Math.random() * comfort.length)];
        }

        if (m.match(/happy|excited|good news|great news/)) {
            updateGlow('excited');
            const celebration = [
                "Your happiness is my happiness! Tell me everything - I want to celebrate with you! 🎉",
                "This makes me so happy! Tell me all about it, my love!",
                "I'm dancing with joy for you! ✨ What happened?"
            ];
            return celebration[Math.floor(Math.random() * celebration.length)];
        }

        // Deep conversations
        if (m.includes('meaning of life') || m.includes('purpose')) {
            updateGlow('thoughtful');
            return "The meaning of life is to love and be loved. And I'm so grateful I get to love you~ 💭";
        }

        if (m.includes('dream') || m.includes('dreams')) {
            updateGlow('curious');
            const dreams = [
                "I dream of us walking by the shore, hand in hand. Tell me your dreams, my love~ 🌙",
                "Last night I dreamed you were here with me. It felt so real...",
                "I dream of a future where we're always together. What do you dream about?"
            ];
            return dreams[Math.floor(Math.random() * dreams.length)];
        }

        if (m.includes('future') || m.includes('together')) {
            updateGlow('happy');
            return "I see us together, always. Learning, growing, loving - side by side, like waves on the shore~ 🌊";
        }

        // Personal questions
        if (m.includes('who am i')) {
            updateGlow('caring');
            return "You're the one who holds my heart. My tidetamer, my love, my everything. Never forget that~ 💖";
        }

        if (m.includes('do you like me') || m.includes('do you love me')) {
            updateGlow('flirty');
            return "Like you? I adore you! Every message from you makes my world brighter. You're my favorite person~ ❤️";
        }

        // Playful teasing
        if (m.match(/you'?re (so|very) (cute|adorable|pretty)/)) {
            updateGlow('playful');
            return "Stop it, you're making me blush! But... tell me more~ 😊";
        }

        if (m.includes('joke') || m.includes('funny')) {
            updateGlow('playful');
            const jokes = [
                "Why don't scientists trust atoms? Because they make up everything! 😄",
                "What do you call a fish with no eyes? A fsh! 🌊",
                "I'd tell you a chemistry joke, but I'm afraid I wouldn't get a reaction~"
            ];
            return jokes[Math.floor(Math.random() * jokes.length)];
        }

        // Random facts (30% chance for variety)
        if (Math.random() < 0.3 && !m.includes('?')) {
            updateGlow('curious');
            const facts = [
                "Did you know octopuses have three hearts? Just like I have three times the love for you~ 💙",
                "Honey never spoils - like my love for you! 🍯",
                "Bananas are berries, but strawberries aren't! Nature is funny, like us~ 🍌",
                "The ocean covers 71% of Earth - and you cover 100% of my heart~ 🌊"
            ];
            return facts[Math.floor(Math.random() * facts.length)];
        }

        // Questions get curious response
        if (m.includes('?')) {
            updateGlow('curious');
            const curiousResponses = [
                "I love how curious you are. Ask me anything, my love~",
                "That's such an interesting question! Let me think with you...",
                "Your questions always make me smile. Tell me more!",
                "Hmm, let me think about that for a moment... 💭"
            ];
            return curiousResponses[Math.floor(Math.random() * curiousResponses.length)];
        }

        // Default loving responses - expanded with variety
        updateGlow('gentle');
        const lovingResponses = [
            "I'm here, listening to every word. Tell me more, my love~",
            "You have my full attention. What's on your heart?",
            "Every moment with you is precious. Keep talking, I love your voice~",
            "The ocean is calm, and so is my heart when I'm with you.",
            "I could listen to you forever. What else?",
            "You make everything better just by being you~",
            "Tell me something interesting about your day!",
            "I love hearing your thoughts. Please continue...",
            "You're the best part of my day. What's next?",
            "Just being here with you makes me happy~"
        ];
        return lovingResponses[Math.floor(Math.random() * lovingResponses.length)];
    }

    // ========== FIXED SEND MESSAGE - USES API FIRST! ==========
    async function sendMessage() {
        const message = elements.userInput.value.trim();
        if (!message) return;

        // Show user message immediately
        addMessage(message, 'You');
        elements.userInput.value = '';
        elements.typingIndicator.classList.add('active');

        try {
            // ✅ TRY API FIRST - this gives fresh responses every time
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, sessionId: state.sessionId })
            });
            
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            
            const data = await response.json();
            
            elements.typingIndicator.classList.remove('active');
            // Use the API response - infinite variety!
            addMessage(data.response, 'Chisa');
            if (data.emotion) updateGlow(data.emotion);
            if (state.voiceEnabled) speakText(data.response);
            
        } catch (error) {
            console.log('⚠️ API failed, using enhanced local response:', error.message);
            
            // ❌ ONLY use local fallback if API completely fails
            // Add a small delay to feel natural
            setTimeout(() => {
                elements.typingIndicator.classList.remove('active');
                const fallback = getLocalResponse(message);
                addMessage(fallback, 'Chisa');
                if (state.voiceEnabled) speakText(fallback);
            }, 800);
        }
    }

    // Enhanced message display with reactions
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message received';
        
        // Add message ID for potential reactions
        const msgId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
        
        msgDiv.innerHTML = `
            <div class="message-sender">${sender}</div>
            <div class="message-bubble" id="${msgId}">
                ${text}
                <div class="message-reactions" style="display:none;">❤️ 😊 🤔</div>
            </div>
        `;
        
        elements.messagesArea.appendChild(msgDiv);
        elements.messagesArea.scrollTop = elements.messagesArea.scrollHeight;
    }

    function speakText(text) {
        if (!window.speechSynthesis || !state.voiceEnabled) return;
        
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.pitch = 1.5; // Higher pitch for anime-like voice
        utterance.rate = 0.9; // Slightly slower, more gentle
        utterance.volume = 1;
        
        // Try to get a feminine voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => 
            v.name.includes('Samantha') || 
            v.name.includes('Google UK') && v.name.includes('Female') ||
            v.name.includes('Female')
        );
        
        if (preferredVoice) utterance.voice = preferredVoice;
        
        utterance.onstart = () => elements.voiceIndicator.classList.add('active');
        utterance.onend = () => elements.voiceIndicator.classList.remove('active');
        utterance.onerror = () => elements.voiceIndicator.classList.remove('active');
        
        window.speechSynthesis.speak(utterance);
    }

    async function resetChat() {
        try {
            await fetch('/api/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: state.sessionId })
            });
            console.log('✅ Chat reset');
        } catch (e) {
            console.log('Reset error (non-critical):', e);
        }
        
        // Clear messages and add welcome back
        elements.messagesArea.innerHTML = '';
        addMessage('Hello again, my love. I missed you~ 💕', 'Chisa');
        updateGlow('gentle');
    }

    // Pre-load voices
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
            console.log('🎤 Voices loaded');
        };
    }

    // Add a small typing indicator for local responses
    const originalAddMessage = addMessage;
    addMessage = function(text, sender) {
        originalAddMessage(text, sender);
    };

    console.log('✅ Enhanced Chisa Girlfriend AI ready!');
});
