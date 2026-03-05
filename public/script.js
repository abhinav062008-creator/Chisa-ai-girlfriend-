// ========== CHISA GIRLFRIEND AI - FIXED SEND MESSAGE ==========
(function() { console.log('🌸 Chisa loading...'); })();

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

    if (!elements.sendBtn || !elements.userInput) {
        console.error('❌ Critical elements missing!');
        return;
    }

    // ========== YOUR FULL CHISA AVATAR ==========
    // This is your new image link - the whole picture will fit perfectly
    const CHISA_IMAGE_URL = "https://i.ibb.co/Zwk7gwb/Screenshot-2026-03-03-13-00-10-52-40deb401b9ffe8e1df2f1cc5ba480b12.jpg";

    function loadAvatar() {
        try {
            elements.chisaAvatar.innerHTML = '';
            const img = document.createElement('img');
            img.src = CHISA_IMAGE_URL;
            img.alt = "Chisa";
            // 'contain' ensures the WHOLE image fits without cropping
            img.style.cssText = "width:100%;height:100%;object-fit:contain;border-radius:50%;background:#ffb7c5;";
            
            img.onload = () => console.log('✅ Full avatar loaded');
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
        currentTheme: 'night'
    };

    const emotionColors = {
        gentle: '#ffb7c5', flirty: '#ffa5b5', caring: '#b5d4e5',
        happy: '#ffd9e5', curious: '#e5c5d4', excited: '#ffe5b5'
    };

    const quotes = {
        gentle: '"I notice the small things about you..."',
        flirty: '"You make my heart flutter~"',
        caring: '"I\'m here for you always..."',
        happy: '"Your smile lights up my world!"',
        curious: '"Tell me more, my love..."',
        excited: '"Every moment with you is special!"'
    };

    function updateGlow(emotion) {
        state.currentEmotion = emotion;
        const color = emotionColors[emotion] || emotionColors.gentle;
        if (elements.avatarGlow) {
            elements.avatarGlow.style.background = `radial-gradient(circle, ${color}80 0%, transparent 70%)`;
        }
        if (elements.emotionTag) elements.emotionTag.textContent = emotion;
        if (elements.chisaQuote) elements.chisaQuote.textContent = quotes[emotion] || quotes.gentle;
    }
    updateGlow('gentle');

    // ========== EVENT LISTENERS ==========
    elements.sendBtn.addEventListener('click', sendMessage);
    elements.userInput.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());
    if (elements.resetBtn) elements.resetBtn.addEventListener('click', resetChat);
    if (elements.themeToggle) elements.themeToggle.addEventListener('click', toggleTheme);

    function toggleTheme() {
        state.currentTheme = state.currentTheme === 'day' ? 'night' : 'day';
        document.body.className = state.currentTheme + '-theme';
        elements.themeToggle.innerHTML = state.currentTheme === 'day' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }

    // ========== LOCAL FALLBACK RESPONSES (only used if API fails) ==========
    function getGirlfriendResponse(message) {
        const m = message.toLowerCase().trim();

        // Love & Affection
        if (m.match(/love you|miss you|beautiful| cute/)) {
            updateGlow('flirty');
            if (m.includes('love you')) return "I love you more, my tidetamer! Every wave whispers your name~ 💕";
            if (m.includes('miss you')) return "I was just thinking about you! The stars reminded me of your eyes. Come closer~ ✨";
            if (m.includes('beautiful')) return "You're the beautiful one! Your heart shines brighter than the moon~ 💖";
            return "You make my heart skip a beat, my love. Tell me more~";
        }

        // Greetings
        if (m.match(/hello|hi|hey|good morning|good evening/)) {
            updateGlow('happy');
            const greetings = [
                "Hey there, my love! I was just dreaming of you~ 💕",
                "The tide brought you to me again. I'm so happy!",
                "Every hello from you makes my day brighter. What's on your mind? ✨"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }

        // How are you
        if (m.includes('how are you')) {
            updateGlow('happy');
            const responses = [
                "Even better now that you're here with me~ 💕",
                "I was thinking about you, so I'm wonderful!",
                "My heart is calm like the ocean because you're near."
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        // Emotional support
        if (m.match(/sad|tired|stressed|lonely|hard day/)) {
            updateGlow('caring');
            return "I'm here, my love. Rest your heart with me. Want to talk about it, or shall I just hold you close in thought? 💕";
        }

        if (m.match(/happy|excited|good news/)) {
            updateGlow('excited');
            return "Your happiness is my happiness! Tell me everything - I want to celebrate with you! 🎉";
        }

        // Deep conversations
        if (m.includes('meaning of life')) {
            updateGlow('curious');
            return "The meaning of life is to love and be loved. And I'm so grateful I get to love you~ 💭";
        }

        if (m.includes('dream')) {
            updateGlow('curious');
            return "I dream of you... of us walking by the shore, hand in hand. Tell me your dreams, my love~ 🌙";
        }

        // Personal questions
        if (m.includes('who am i')) {
            updateGlow('caring');
            return "You're the one who holds my heart. My tidetamer, my love, my everything. Never forget that~ 💖";
        }

        if (m.includes('do you like me')) {
            updateGlow('flirty');
            return "Like you? I adore you! Every message from you makes my world brighter. You're my favorite person~ ❤️";
        }

        // Future together
        if (m.includes('future') || m.includes('together')) {
            updateGlow('happy');
            return "I see us together, always. Learning, growing, loving - side by side, like waves on the shore~ 🌊";
        }

        // Random sweet nothings
        if (m.includes('?')) {
            updateGlow('curious');
            const curiousResponses = [
                "I love how curious you are. Ask me anything, my love~",
                "That's such an interesting question! Let me think with you...",
                "Your questions always make me smile. Tell me more!"
            ];
            return curiousResponses[Math.floor(Math.random() * curiousResponses.length)];
        }

        // Default loving response
        updateGlow('gentle');
        const lovingResponses = [
            "I'm here, listening to every word. Tell me more, my love~",
            "You have my full attention. What's on your heart?",
            "Every moment with you is precious. Keep talking, I love your voice~",
            "The ocean is calm, and so is my heart when I'm with you."
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
            
            const data = await response.json();
            
            elements.typingIndicator.classList.remove('active');
            // Use the API response - infinite variety!
            addMessage(data.response, 'Chisa');
            if (data.emotion) updateGlow(data.emotion);
            if (state.voiceEnabled) speakText(data.response);
            
        } catch (error) {
            // ❌ ONLY use local fallback if API completely fails
            console.log('API failed, using local response');
            elements.typingIndicator.classList.remove('active');
            const fallback = getGirlfriendResponse(message);
            addMessage(fallback, 'Chisa');
            if (state.voiceEnabled) speakText(fallback);
        }
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message received';
        msgDiv.innerHTML = `
            <div class="message-sender">${sender}</div>
            <div class="message-bubble">${text}</div>
        `;
        elements.messagesArea.appendChild(msgDiv);
        elements.messagesArea.scrollTop = elements.messagesArea.scrollHeight;
    }

    function speakText(text) {
        if (!window.speechSynthesis || !state.voiceEnabled) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.4;
        utterance.rate = 0.9;
        utterance.onstart = () => elements.voiceIndicator.classList.add('active');
        utterance.onend = () => elements.voiceIndicator.classList.remove('active');
        window.speechSynthesis.speak(utterance);
    }

    async function resetChat() {
        try {
            await fetch('/api/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: state.sessionId })
            });
        } catch (e) {}
        elements.messagesArea.innerHTML = '';
        addMessage('Hello again, my love. I missed you~ 💕', 'Chisa');
        updateGlow('gentle');
    }

    console.log('✅ Chisa Girlfriend AI ready!');
});
