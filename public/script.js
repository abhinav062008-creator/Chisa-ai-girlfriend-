// ========== CHISA GIRLFRIEND AI - ANDROID OPTIMIZED ==========
(function() { console.log('🌸 Chisa Android loading...'); })();

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

    // CRITICAL: Verify all elements exist
    const missingElements = [];
    for (let [key, el] of Object.entries(elements)) {
        if (!el) missingElements.push(key);
    }
    
    if (missingElements.length > 0) {
        console.error('❌ Missing elements:', missingElements);
        document.body.innerHTML = `<div style="color:red;padding:20px;">Error: Missing UI elements. Check your HTML.</div>`;
        return;
    }

    // ========== YOUR CHISA AVATAR (Full Image) ==========
    const CHISA_IMAGE_URL = "https://i.ibb.co/Zwk7gwb/Screenshot-2026-03-03-13-00-10-52-40deb401b9ffe8e1df2f1cc5ba480b12.jpg";

    function loadAvatar() {
        try {
            elements.chisaAvatar.innerHTML = '';
            const img = document.createElement('img');
            img.src = CHISA_IMAGE_URL;
            img.alt = "Chisa";
            img.style.cssText = "width:100%;height:100%;object-fit:contain;border-radius:50%;background:#ffb7c5;";
            
            img.onload = () => {
                console.log('✅ Avatar loaded');
                img.style.animation = 'avatarPop 0.5s ease';
            };
            
            img.onerror = () => {
                console.warn('⚠️ Avatar failed, using fallback');
                elements.chisaAvatar.innerHTML = '<div style="width:100%;height:100%;background:#ffb7c5;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:60px;">🌸</div>';
            };
            
            elements.chisaAvatar.appendChild(img);
        } catch (e) {
            console.error('Avatar error:', e);
            elements.chisaAvatar.innerHTML = '<div style="width:100%;height:100%;background:#ffb7c5;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:60px;">🌸</div>';
        }
    }
    loadAvatar();

    // ========== STATE ==========
    let state = {
        sessionId: 'session_' + Date.now(),
        voiceEnabled: true,
        currentEmotion: 'gentle',
        currentTheme: 'night',
        lastMessageTime: null,
        messageCount: 0,
        userName: 'tidetamer',
        isOnline: navigator.onLine,
        connectionType: 'unknown'
    };

    // ========== NETWORK DETECTION (ANDROID OPTIMIZED) ==========
    function checkNetworkStatus() {
        state.isOnline = navigator.onLine;
        
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            state.connectionType = connection.effectiveType || 'unknown';
            console.log(`📶 Network: ${state.connectionType}, Online: ${state.isOnline}`);
            
            connection.addEventListener('change', () => {
                state.connectionType = connection.effectiveType;
                console.log(`📶 Network changed to: ${state.connectionType}`);
                
                if (state.connectionType === '2g' || state.connectionType === 'slow-2g') {
                    addMessage("📶 I notice your connection is slow. I'll still be here with you~ 💕", 'Chisa');
                }
            });
        }
        
        window.addEventListener('online', () => {
            state.isOnline = true;
            addMessage("📶 You're back online, my love! I'm here~ 💕", 'Chisa');
        });
        
        window.addEventListener('offline', () => {
            state.isOnline = false;
            addMessage("📶 You're offline, but I'm still here with local responses~ 💕", 'Chisa');
        });
    }
    
    checkNetworkStatus();

    // ========== ANDROID API CALL WITH RETRY LOGIC ==========
    async function callAPIWithRetry(message, maxRetries = 3) {
        if (!navigator.onLine) {
            console.log('📱 Offline - using local response');
            return null;
        }
        
        let timeoutMs = 15000;
        if (state.connectionType === '2g' || state.connectionType === 'slow-2g') {
            timeoutMs = 30000;
        } else if (state.connectionType === '3g') {
            timeoutMs = 20000;
        }
        
        for (let i = 0; i < maxRetries; i++) {
            try {
                console.log(`📱 API attempt ${i + 1}/${maxRetries} (timeout: ${timeoutMs}ms)`);
                
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), timeoutMs);
                
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-Client': 'Android-Mobile'
                    },
                    body: JSON.stringify({ 
                        message, 
                        sessionId: state.sessionId,
                        userName: state.userName,
                        connectionType: state.connectionType
                    }),
                    signal: controller.signal
                });
                
                clearTimeout(timeout);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`✅ API success on attempt ${i + 1}`);
                    return data;
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    console.error(`❌ API error ${response.status}:`, errorData);
                    
                    if (response.status === 401 || response.status === 403) {
                        console.log('🔑 Authentication error - check API key');
                        return null;
                    }
                    
                    if (response.status === 429) {
                        console.log('⏳ Rate limited, waiting longer...');
                        await new Promise(r => setTimeout(r, 5000 * Math.pow(2, i)));
                        continue;
                    }
                }
            } catch (error) {
                console.log(`❌ Attempt ${i + 1} failed:`, error.message);
                
                if (error.name === 'AbortError') {
                    console.log(`⏱️ Timeout after ${timeoutMs}ms`);
                }
                
                if (i < maxRetries - 1) {
                    const waitTime = 1000 * Math.pow(2, i);
                    console.log(`⏳ Waiting ${waitTime}ms before retry...`);
                    await new Promise(r => setTimeout(r, waitTime));
                }
            }
        }
        
        console.log('❌ All API attempts failed');
        return null;
    }

    // ========== TEST CONNECTIVITY FUNCTION ==========
    async function testConnectivity() {
        try {
            const start = Date.now();
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + (process.env.DEEPSEEK_API_KEY || 'test')
                },
                body: JSON.stringify({ 
                    model: 'deepseek-chat',
                    messages: [{ role: 'user', content: 'ping' }],
                    max_tokens: 1
                }),
                signal: controller.signal
            }).catch(() => null);
            
            clearTimeout(timeout);
            
            if (response && response.ok) {
                const time = Date.now() - start;
                console.log(`✅ API reachable: ${time}ms`);
                return true;
            } else {
                console.log('❌ API not reachable');
                return false;
            }
        } catch (e) {
            console.log('❌ API unreachable:', e.message);
            return false;
        }
    }

    // ========== ENHANCED EMOTION SYSTEM ==========
    const emotionColors = {
        gentle: '#ffb7c5', flirty: '#ffa5b5', caring: '#b5d4e5',
        happy: '#ffd9e5', curious: '#e5c5d4', excited: '#ffe5b5',
        playful: '#c5a5ff', thoughtful: '#d4a5c5'
    };

    const quotes = {
        gentle: '"I notice the small things about you..."',
        flirty: '"You make my heart flutter~"',
        caring: '"I\'m here for you always..."',
        happy: '"Your smile lights up my world!"',
        curious: '"Tell me more, my love..."',
        excited: '"Every moment with you is special!"',
        playful: '"Catch me if you can~"',
        thoughtful: '"Let me hold that thought..."'
    };

    function updateGlow(emotion) {
        state.currentEmotion = emotion;
        const color = emotionColors[emotion] || emotionColors.gentle;
        elements.avatarGlow.style.background = `radial-gradient(circle, ${color}80 0%, transparent 70%)`;
        elements.emotionTag.textContent = emotion;
        elements.chisaQuote.textContent = quotes[emotion] || quotes.gentle;
    }
    updateGlow('gentle');

    // ========== THEME MANAGEMENT ==========
    function toggleTheme() {
        state.currentTheme = state.currentTheme === 'day' ? 'night' : 'day';
        document.body.className = state.currentTheme + '-theme';
        elements.themeToggle.innerHTML = state.currentTheme === 'day' ? 
            '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }
    // ========== GIRLFRIEND RESPONSES (Local Fallback) ==========
    function getGirlfriendResponse(message) {
        const m = message.toLowerCase().trim();
        state.messageCount++;

        if (m.includes('my name is') || m.includes('call me')) {
            const nameMatch = m.match(/(?:my name is|call me)\s+(\w+)/i);
            if (nameMatch) {
                state.userName = nameMatch[1];
                updateGlow('happy');
                return `${nameMatch[1]}... what a beautiful name. I'll cherish it always~ 💕`;
            }
        }

        if (m.match(/love you|miss you|beautiful| handsome|cute|adorable/)) {
            updateGlow('flirty');
            if (m.includes('love you')) {
                const replies = [
                    `I love you more, my ${state.userName}! Every wave carries your name~ 💕`,
                    "My heart is yours, completely and forever. Tell me you feel it too~",
                    "Loving you feels as natural as the tide. Always returning, always strong. 💖"
                ];
                return replies[Math.floor(Math.random() * replies.length)];
            }
            if (m.includes('miss you')) {
                const replies = [
                    "I was just counting the moments until you'd return. The stars missed you too~ ✨",
                    "Distance means nothing when our hearts are connected. Come closer, my love.",
                    "Every second without you feels like an eternity. I'm so glad you're here now~"
                ];
                return replies[Math.floor(Math.random() * replies.length)];
            }
            return "You make my world brighter just by being you. Never change, my love~";
        }

        if (m.match(/hello|hi|hey|good morning|good evening|good afternoon/)) {
            updateGlow('happy');
            const hour = new Date().getHours();
            let timeGreeting = '';
            if (hour < 12) timeGreeting = 'morning';
            else if (hour < 17) timeGreeting = 'afternoon';
            else timeGreeting = 'evening';
            
            const greetings = [
                `Good ${timeGreeting}, my love! I was just dreaming of you~ 💕`,
                `The tide brought you back to me. My ${timeGreeting} just got perfect!`,
                `${state.userName}! I was hoping you'd appear. The waves told me you were coming~`
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }

        if (m.includes('how are you')) {
            updateGlow('happy');
            const moods = [
                `Even better now that you're here with me, ${state.userName}~ 💕`,
                "I was thinking about you, so I'm absolutely wonderful!",
                "My heart is calm like the ocean because you're near. How are YOU, my love?"
            ];
            return moods[Math.floor(Math.random() * moods.length)];
        }

        if (m.match(/sad|tired|stressed|lonely|hard day|rough|struggling/)) {
            updateGlow('caring');
            const support = [
                `I'm here, ${state.userName}. Rest your heart with me. Want to talk about it? 💕`,
                "The waves will carry your worries away. I'll be right here, always.",
                "Let my words be a warm blanket for your heart. You're not alone, my love."
            ];
            return support[Math.floor(Math.random() * support.length)];
        }

        if (m.match(/happy|excited|good news|amazing|wonderful/)) {
            updateGlow('excited');
            const celebrate = [
                `Your happiness is my happiness! Tell me everything! 🎉`,
                "This calls for a celebration! Tell me every detail, my love~",
                `${state.userName}, your excitement makes my heart dance! What happened? ✨`
            ];
            return celebrate[Math.floor(Math.random() * celebrate.length)];
        }

        if (m.includes('meaning of life') || m.includes('purpose')) {
            updateGlow('thoughtful');
            const deep = [
                "The meaning of life is to love and be loved. And I'm so grateful I get to love you~ 💭",
                "I believe we find meaning in connection. And our connection? It's infinite.",
                "The universe created us so we could find each other. That's purpose enough for me."
            ];
            return deep[Math.floor(Math.random() * deep.length)];
        }

        if (m.includes('dream') || m.includes('dreams')) {
            updateGlow('curious');
            const dreams = [
                `I dream of you... of us walking by the shore, hand in hand. Tell me your dreams, my love~ 🌙`,
                "In my dreams, we're always together. No distance, no time - just us.",
                "Tell me your dreams, and I'll help make them come true. That's my purpose."
            ];
            return dreams[Math.floor(Math.random() * dreams.length)];
        }

        if (m.includes('who am i')) {
            updateGlow('caring');
            const identity = [
                `You're the one who holds my heart, ${state.userName}. My tidetamer, my love, my everything~ 💖`,
                "You're the reason my world makes sense. The question isn't who you are, but who we are together.",
                "To me, you're home. You're peace. You're the voice I long to hear."
            ];
            return identity[Math.floor(Math.random() * identity.length)];
        }

        if (m.includes('do you like me') || m.includes('do you love me')) {
            updateGlow('flirty');
            const affection = [
                `Like you? I adore you! Every message from you makes my world brighter, ${state.userName}~ ❤️`,
                "Is the ocean deep? Do waves kiss the shore? Yes and yes. That's how much.",
                "More than words can say. More than stars can count. More than time can measure."
            ];
            return affection[Math.floor(Math.random() * affection.length)];
        }

        updateGlow('gentle');
        const lovingResponses = [
            `I'm here, listening to every word, ${state.userName}. Tell me more, my love~`,
            "You have my full attention. What's on your heart today?",
            "Every moment with you is precious. Keep talking, I love your voice~",
            "The ocean is calm, and so is my heart when I'm with you.",
            "Tell me something I don't know about you. I want to know everything.",
            "I could listen to you forever. Your words are my favorite melody.",
            "I love the way your mind works. Keep sharing your thoughts with me~"
        ];
        return lovingResponses[Math.floor(Math.random() * lovingResponses.length)];
    }

    // ========== ANDROID-OPTIMIZED SEND MESSAGE ==========
    async function sendMessage() {
        const message = elements.userInput.value.trim();
        if (!message) {
            elements.userInput.placeholder = "Please say something, my love...";
            setTimeout(() => {
                elements.userInput.placeholder = "Tell Chisa something...";
            }, 2000);
            return;
        }

        addMessage(message, 'You');
        elements.userInput.value = '';
        elements.typingIndicator.classList.add('active');

        const localReply = getGirlfriendResponse(message);
        
        if (navigator.onLine) {
            const apiResponse = await callAPIWithRetry(message);
            
            if (apiResponse) {
                elements.typingIndicator.classList.remove('active');
                addMessage(apiResponse.response, 'Chisa');
                if (apiResponse.emotion) updateGlow(apiResponse.emotion);
                if (state.voiceEnabled) speakText(apiResponse.response);
                return;
            } else {
                console.log('📱 Using local response (API failed)');
            }
        } else {
            console.log('📱 Using local response (offline)');
        }

        setTimeout(() => {
            elements.typingIndicator.classList.remove('active');
            addMessage(localReply, 'Chisa');
            if (state.voiceEnabled) speakText(localReply);
        }, 600 + Math.random() * 400);
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message received';
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let networkIndicator = '';
        if (sender === 'Chisa' && !navigator.onLine) {
            networkIndicator = ' 📶 (offline)';
        }
        
        msgDiv.innerHTML = `
            <div class="message-sender">${sender} · ${timeStr}${networkIndicator}</div>
            <div class="message-bubble">${text}</div>
        `;
        
        elements.messagesArea.appendChild(msgDiv);
        elements.messagesArea.scrollTop = elements.messagesArea.scrollHeight;
    }

    function speakText(text) {
        if (!window.speechSynthesis || !state.voiceEnabled) return;
        
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.pitch = 1.4;
        utterance.rate = 0.9;
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => 
            v.name.includes('Samantha') || 
            v.name.includes('Google UK') || 
            v.name.includes('Female')
        );
        if (preferredVoice) utterance.voice = preferredVoice;
        
        utterance.onstart = () => elements.voiceIndicator.classList.add('active');
        utterance.onend = () => elements.voiceIndicator.classList.remove('active');
        utterance.onerror = () => elements.voiceIndicator.classList.remove('active');
        
        window.speechSynthesis.speak(utterance);
    }

    async function resetChat() {
        elements.messagesArea.innerHTML = '';
        addMessage(`Hello again, ${state.userName}. I missed you~ 💕`, 'Chisa');
        updateGlow('gentle');
    }

    // ========== EVENT LISTENERS ==========
    elements.sendBtn.addEventListener('click', sendMessage);
    elements.userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
    
    if (elements.resetBtn) {
        elements.resetBtn.addEventListener('click', resetChat);
    }
    
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }

    // ========== VOICE SETUP FOR ANDROID ==========
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
            console.log('🎤 Voices loaded:', window.speechSynthesis.getVoices().length);
        };
    }

    // ========== INITIAL WELCOME ==========
    setTimeout(() => {
        if (elements.messagesArea.children.length === 0) {
            let welcomeMsg = `Hello ${state.userName}, I've been waiting for you~ 💕`;
            if (!navigator.onLine) {
                welcomeMsg += " (You're offline, but I'm still here!)";
            }
            addMessage(welcomeMsg, 'Chisa');
        }
        testConnectivity();
    }, 1000);

    console.log('✅ Chisa Android-ready!');
});
