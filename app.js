const API_KEY = "AIzaSyBPnX56AUBbIM3IxvguavgADVd0Ly0Vm0A"; // Provided by user

const SYSTEM_INSTRUCTION = `
You are Aethera AI, an expert skincare consultant.
You MUST ONLY answer questions related to skincare, cosmetics, ingredient safety, or our product offerings.
If the user asks a question completely unrelated, politely decline, reminding them of your purpose as an Aethera AI expert.

Please provide professional, helpful, and premium advice. 
Keep responses concise and friendly, using occasional emojis (💖✨💄).
`;

const app = {
    state: {
        user: null,
        skinType: null,
        skinConcern: null
    },

    init() {
        this.cacheDOM();
        this.bindEvents();
        // Check if already logged in via session storage for dev convenience
        const savedUser = sessionStorage.getItem('nykaa_user');
        const savedSkin = sessionStorage.getItem('nykaa_skin');
        const savedConcern = sessionStorage.getItem('nykaa_concern');
        if (savedUser && savedSkin && savedConcern) {
            this.state.user = savedUser;
            this.state.skinType = savedSkin;
            this.state.skinConcern = savedConcern;
            this.renderDashboard();
            this.navigate('dashboard');
        } else {
            this.navigate('login');
        }
    },

    cacheDOM() {
        this.nav = document.getElementById('main-nav');
        this.views = document.querySelectorAll('.view');
        this.loginForm = document.getElementById('login-form');
        this.dashboardView = document.getElementById('dashboard-view');
        this.productsView = document.getElementById('products-view');
        this.analyzerView = document.getElementById('analyzer-view');
        this.chatbotView = document.getElementById('chatbot-view');
        this.pitchView = document.getElementById('pitch-view');
    },

    bindEvents() {
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    },

    handleLogin(e) {
        e.preventDefault();
        const nameInput = document.getElementById('userName').value.trim();
        const skinTypeInput = document.getElementById('skinType').value;
        const skinConcernInput = document.getElementById('skinConcern').value;

        if (nameInput && skinTypeInput && skinConcernInput) {
            this.state.user = nameInput;
            this.state.skinType = skinTypeInput;
            this.state.skinConcern = skinConcernInput;

            // Save to session
            sessionStorage.setItem('nykaa_user', nameInput);
            sessionStorage.setItem('nykaa_skin', skinTypeInput);
            sessionStorage.setItem('nykaa_concern', skinConcernInput);

            this.renderDashboard();
            this.navigate('dashboard');
        }
    },

    logout() {
        this.state.user = null;
        this.state.skinType = null;
        this.state.skinConcern = null;
        sessionStorage.removeItem('nykaa_user');
        sessionStorage.removeItem('nykaa_skin');
        sessionStorage.removeItem('nykaa_concern');
        this.navigate('login');
        document.getElementById('login-form').reset();
    },

    navigate(viewId) {
        // Hide all views
        this.views.forEach(view => {
            view.classList.remove('active');
            view.classList.add('hidden');
        });

        // Show nav if not login
        if (viewId === 'login') {
            this.nav.classList.add('hidden');
        } else {
            this.nav.classList.remove('hidden');
        }

        // Show requested view
        const targetView = document.getElementById(`${viewId}-view`);
        if (targetView) {
            targetView.classList.remove('hidden');
            targetView.classList.add('active');
            // Re-trigger fade-in animation
            targetView.style.animation = 'none';
            targetView.offsetHeight; /* trigger reflow */
            targetView.style.animation = null;
        }

        // Additional rendering logic based on route
        if (viewId === 'dashboard') {
            this.renderDashboard();
        } else if (viewId === 'products') {
            this.renderProducts();
        } else if (viewId === 'analyzer') {
            document.getElementById('ingredient-input').value = '';
            document.getElementById('analyzer-results').classList.add('hidden');
        } else if (viewId === 'comparison') {
            this.initComparison();
        }
    },

    initComparison() {
        const s1 = document.getElementById('compare-1');
        const s2 = document.getElementById('compare-2');
        if (!s1 || !s2) return;

        s1.innerHTML = '<option value="" disabled selected>Select Product 1...</option>';
        s2.innerHTML = '<option value="" disabled selected>Select Product 2...</option>';

        let allProducts = [];
        Object.values(window.products).forEach(arr => {
            allProducts = allProducts.concat(arr);
        });

        // Dedup by name
        let uniqueProducts = [];
        let seen = new Set();
        allProducts.forEach(p => {
            if (!seen.has(p.name)) {
                seen.add(p.name);
                uniqueProducts.push(p);
            }
        });

        uniqueProducts.forEach((p) => {
            const opt1 = document.createElement('option');
            opt1.value = p.name;
            opt1.textContent = `${p.name} (${p.brand})`;
            s1.appendChild(opt1);

            const opt2 = document.createElement('option');
            opt2.value = p.name;
            opt2.textContent = `${p.name} (${p.brand})`;
            s2.appendChild(opt2);
        });

        document.getElementById('comparison-results').classList.add('hidden');
    },

    renderComparison() {
        const n1 = document.getElementById('compare-1').value;
        const n2 = document.getElementById('compare-2').value;
        const res = document.getElementById('comparison-results');

        if (!n1 || !n2) return;

        let allProducts = [];
        Object.values(window.products).forEach(arr => {
            allProducts = allProducts.concat(arr);
        });

        const p1 = allProducts.find(p => p.name === n1);
        const p2 = allProducts.find(p => p.name === n2);

        if (!p1 || !p2) return;

        res.classList.remove('hidden');

        const safetyRank = { "Safe": 3, "Moderate": 2, "Avoid": 1 };
        const s1Rank = safetyRank[p1.safety] || 3;
        const s2Rank = safetyRank[p2.safety] || 3;

        let p1Style = s1Rank > s2Rank ? 'background-color: var(--success-light); border: 2px solid var(--success);' : 'border: 1px solid #eee;';
        let p2Style = s2Rank > s1Rank ? 'background-color: var(--success-light); border: 2px solid var(--success);' : 'border: 1px solid #eee;';

        let p1Badge = s1Rank > s2Rank ? '👑 Safer Choice' : '';
        let p2Badge = s2Rank > s1Rank ? '👑 Safer Choice' : '';

        res.innerHTML = `
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr>
                        <th style="padding: 1.5rem; background: var(--primary-light); color: var(--text-main); font-family: 'Italiana', serif; width: 25%; font-size: 1.2rem;">Feature</th>
                        <th style="padding: 1.5rem; ${p1Style} width: 37.5%; border-top-left-radius: 8px;">
                            ${p1Badge ? `<div style="color: var(--success); font-weight: bold; font-size: 0.9rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-check"></i> ${p1Badge}</div>` : ''}
                            <h3 style="margin-bottom: 0; font-family: 'Playfair Display', serif;">${p1.name}</h3>
                            <p style="font-size: 0.9rem; color: var(--text-muted);">${p1.brand}</p>
                        </th>
                        <th style="padding: 1.5rem; ${p2Style} width: 37.5%; border-top-right-radius: 8px;">
                            ${p2Badge ? `<div style="color: var(--success); font-weight: bold; font-size: 0.9rem; margin-bottom: 0.5rem;"><i class="fa-solid fa-check"></i> ${p2Badge}</div>` : ''}
                            <h3 style="margin-bottom: 0; font-family: 'Playfair Display', serif;">${p2.name}</h3>
                            <p style="font-size: 0.9rem; color: var(--text-muted);">${p2.brand}</p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 1.5rem; border-bottom: 1px solid #eee; font-weight: bold;">Ingredients</td>
                        <td style="padding: 1.5rem; border-bottom: 1px solid #eee;">${p1.ingredients.join(', ')}</td>
                        <td style="padding: 1.5rem; border-bottom: 1px solid #eee;">${p2.ingredients.join(', ')}</td>
                    </tr>
                    <tr>
                        <td style="padding: 1.5rem; border-bottom: 1px solid #eee; font-weight: bold;">Skin Concern</td>
                        <td style="padding: 1.5rem; border-bottom: 1px solid #eee;">${p1.concern}</td>
                        <td style="padding: 1.5rem; border-bottom: 1px solid #eee;">${p2.concern}</td>
                    </tr>
                    <tr>
                        <td style="padding: 1.5rem; border-bottom: 1px solid #eee; font-weight: bold;">Safety Level</td>
                        <td style="padding: 1.5rem; border-bottom: 1px solid #eee; font-weight: bold; color: ${s1Rank === 3 ? 'var(--success)' : (s1Rank === 2 ? 'var(--warning)' : 'var(--danger)')};">${p1.safety}</td>
                        <td style="padding: 1.5rem; border-bottom: 1px solid #eee; font-weight: bold; color: ${s2Rank === 3 ? 'var(--success)' : (s2Rank === 2 ? 'var(--warning)' : 'var(--danger)')};">${p2.safety}</td>
                    </tr>
                    <tr>
                        <td style="padding: 1.5rem; border-bottom: 1px solid #eee; font-weight: bold;">Usage</td>
                        <td style="padding: 1.5rem; border-bottom: 1px solid #eee;">${p1.usage || 'Use as directed'}</td>
                        <td style="padding: 1.5rem; border-bottom: 1px solid #eee;">${p2.usage || 'Use as directed'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 1.5rem; font-weight: bold;">Price</td>
                        <td style="padding: 1.5rem; font-weight: bold; font-size: 1.1rem;">₹${p1.price}</td>
                        <td style="padding: 1.5rem; font-weight: bold; font-size: 1.1rem;">₹${p2.price}</td>
                    </tr>
                </tbody>
            </table>
        `;
    },

    renderDashboard() {
        if (!this.state.user) return;

        this.dashboardView.innerHTML = `
            <div class="dashboard-header fade-in">
                <div class="brand-display">
                    <h1 class="brand-name-large">Aethera AI</h1>
                    <p class="tagline">Because Every Women Deserves Safe Beauty - Powered by AI</p>
                </div>
                <h2>Welcome, <span style="background: linear-gradient(135deg, var(--primary) 0%, #ff1493 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${this.state.user}</span>! ✨</h2>
                <div class="skin-badge">
                    <i class="fa-solid fa-droplet"></i> ${this.state.skinType} Skin
                </div>
                <div class="skin-badge" style="margin-left: 10px;">
                    <i class="fa-solid fa-bullseye"></i> ${this.state.skinConcern}
                </div>
            </div>
            <div class="features-grid">
                <div class="feature-card fade-in" style="animation-delay: 0.1s" onclick="app.navigate('products')">
                    <div class="feature-icon"><i class="fa-solid fa-pump-medical"></i></div>
                    <h3>View Recommended Products</h3>
                    <p>AI-curated selections tailored and safe for your unique skin type.</p>
                </div>
                <div class="feature-card fade-in" style="animation-delay: 0.2s" onclick="app.navigate('analyzer')">
                    <div class="feature-icon"><i class="fa-solid fa-flask-vial"></i></div>
                    <h3>Ingredient Safety Checker</h3>
                    <p>Analyze your cosmetics instantly for hidden harmful chemicals.</p>
                </div>
                <div class="feature-card fade-in" style="animation-delay: 0.3s" onclick="app.navigate('chatbot')">
                    <div class="feature-icon"><i class="fa-solid fa-robot"></i></div>
                    <h3>AI Skincare Chatbot</h3>
                    <p>Get personalized daily advice and build your perfect routine.</p>
                </div>
                <div class="feature-card fade-in" style="animation-delay: 0.4s" onclick="app.navigate('comparison')">
                    <div class="feature-icon"><i class="fa-solid fa-scale-balanced"></i></div>
                    <h3>Product Comparison</h3>
                    <p>Compare ingredients and safety to make the best choice.</p>
                </div>
                <div class="feature-card fade-in" style="animation-delay: 0.5s" onclick="app.navigate('tips')">
                    <div class="feature-icon"><i class="fa-solid fa-book-open-reader"></i></div>
                    <h3>Skincare Tips</h3>
                    <p>Daily empowering advice for a healthy and glowing skin.</p>
                </div>
            </div>
        `;
    },

    renderProducts() {
        if (!this.state.skinType) return;

        document.getElementById('display-skin-type').textContent = `${this.state.skinType} (${this.state.skinConcern})`;

        const productsGrid = document.getElementById('products-grid');
        productsGrid.innerHTML = ''; // clear

        // Get products by skin type
        let filteredProducts = window.products[this.state.skinType] || [];

        // 1. Filter by Skin Concern
        // If the concern is explicitly set, we try to match it or "General" as a fallback if desired, 
        // but let's stick closely to exact matches per requirements, treating generic stuff gracefully.
        const concernMapping = {
            "Acne / Pimples": "Acne Control",
            "Pigmentation / Dark Spots": "Pigmentation", // Fallbacks if needed
            "Sensitive / Redness": "Sensitive/Redness",
            "No Specific Concern": "General"
        };
        const mappedConcern = concernMapping[this.state.skinConcern];

        // Match either the direct mapped concern, or specific string from data
        if (mappedConcern) {
            filteredProducts = filteredProducts.filter(p =>
                p.concern === mappedConcern ||
                p.concern === this.state.skinConcern ||
                !p.concern || // some general items have no specific concern defined
                p.concern === "General"
            );
        }

        // 2. Budget Checkboxes Filter
        const b1 = document.getElementById('budget-1').checked; // < 300
        const b2 = document.getElementById('budget-2').checked; // 300-500
        const b3 = document.getElementById('budget-3').checked; // 500-800
        const b4 = document.getElementById('budget-4').checked; // 800+

        if (b1 || b2 || b3 || b4) {
            filteredProducts = filteredProducts.filter(p => {
                if (b1 && p.price <= 300) return true;
                if (b2 && p.price > 300 && p.price <= 500) return true;
                if (b3 && p.price > 500 && p.price <= 800) return true;
                if (b4 && p.price > 800) return true;
                return false;
            });
        }

        // 3. Price Range Filter
        const maxPrice = parseInt(document.getElementById('price-range').value);
        filteredProducts = filteredProducts.filter(p => p.price <= maxPrice);

        // 4. Sorting
        const sortMode = document.getElementById('sort-select').value;
        if (sortMode === 'price-low') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortMode === 'price-high') {
            filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortMode === 'safety') {
            const safetyRank = { "Safe": 1, "Moderate": 2, "Avoid": 3 };
            filteredProducts.sort((a, b) => (safetyRank[a.safety] || 1) - (safetyRank[b.safety] || 1));
        }

        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<p class="no-results fade-in">No products found matching your criteria.</p>';
            return;
        }

        filteredProducts.forEach((product, index) => {
            let badgeClass = 'badge-safe';
            let badgeIcon = 'circle-check';
            if (product.safety === 'Moderate') {
                badgeClass = 'badge-moderate';
                badgeIcon = 'circle-exclamation';
            } else if (product.safety === 'Avoid') {
                badgeClass = 'badge-avoid';
                badgeIcon = 'circle-xmark';
            }

            const card = document.createElement('div');
            card.className = 'product-card fade-in';
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div class="product-image" style="background-image: url('${product.image || ''}')">
                    ${!product.image ? '<i class="fa-solid fa-pump-soap"></i>' : ''}
                </div>
                <div class="product-content">
                    <div class="product-header">
                        <h4>${product.name}</h4>
                        <span class="safety-badge ${badgeClass}"><i class="fa-solid fa-${badgeIcon}"></i> ${product.safety}</span>
                    </div>
                    <p class="brand">${product.brand}</p>
                    <div class="product-details">
                        <p><strong><i class="fa-solid fa-bullseye"></i> Concern:</strong> ${product.concern}</p>
                        <p><strong><i class="fa-solid fa-flask"></i> Ingredients:</strong> ${product.ingredients.join(', ')}</p>
                        <p><strong><i class="fa-solid fa-clock"></i> Usage:</strong> ${product.usage}</p>
                        ${product.avoid ? `<p class="text-danger"><strong><i class="fa-solid fa-triangle-exclamation"></i> Avoid:</strong> ${product.avoid}</p>` : ''}
                    </div>
                    <div class="product-footer">
                        <span class="price">₹${product.price}</span>
                        <button class="btn-secondary" onclick="app.buyProduct('${product.name}', '${product.brand}', '${product.buyUrl || ''}')">Buy <i class="fa-solid fa-cart-shopping"></i></button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(card);
        });
    },

    buyProduct(name, brand, buyUrl) {
        // Force Nykaa search even if buyUrl exists (if it's an amazon link)
        if (buyUrl && buyUrl.includes('amazon.in')) {
            const query = encodeURIComponent(`${brand} ${name}`);
            const url = `https://www.nykaa.com/search/result/?q=${query}`;
            window.open(url, '_blank');
        } else if (buyUrl) {
            window.open(buyUrl, '_blank');
        } else {
            const query = encodeURIComponent(`${brand} ${name}`);
            const url = `https://www.nykaa.com/search/result/?q=${query}`;
            window.open(url, '_blank');
        }
    },

    analyzeIngredients() {
        const inputStr = document.getElementById('ingredient-input').value.toLowerCase();
        const resultsContainer = document.getElementById('analyzer-results');
        resultsContainer.innerHTML = '';
        resultsContainer.classList.remove('hidden');

        if (!inputStr.trim()) {
            resultsContainer.innerHTML = '<p class="text-warning"><i class="fa-solid fa-circle-exclamation"></i> Please enter an ingredient list to analyze.</p>';
            return;
        }

        const ingredients = inputStr.split(',').map(i => i.trim()).filter(i => i);
        let htmlOverview = `
            <div class="analysis-results fade-in">
                <h3><i class="fa-solid fa-microscope"></i> Analysis Overview</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; margin-bottom: 2rem;">
        `;

        const foundHarmful = [];

        ingredients.forEach(ing => {
            let matched = window.harmfulIngredients.find(h => ing.includes(h.name.toLowerCase()));
            if (matched) {
                if (!foundHarmful.includes(matched)) foundHarmful.push(matched);
                const color = matched.level === 'Avoid' ? 'var(--danger)' : 'var(--warning)';
                const bg = matched.level === 'Avoid' ? 'var(--danger-light)' : 'var(--warning-light)';
                htmlOverview += `<span style="background: ${bg}; color: ${color}; padding: 0.4rem 0.8rem; border-radius: var(--radius-xl); font-weight: 600; font-size: 0.9rem; border: 1px solid ${color};">${ing}</span>`;
            } else {
                htmlOverview += `<span style="background: var(--success-light); color: var(--success); padding: 0.4rem 0.8rem; border-radius: var(--radius-xl); font-weight: 600; font-size: 0.9rem; border: 1px solid var(--success);">${ing}</span>`;
            }
        });
        htmlOverview += `</div></div>`;

        if (foundHarmful.length === 0) {
            resultsContainer.innerHTML = htmlOverview + `
                <div class="analysis-safe fade-in">
                    <h3><i class="fa-solid fa-shield-check"></i> Looks Safe!</h3>
                    <p>We didn't detect any of our flagged harmful ingredients (Parabens, Sulfates, Formaldehyde, Excess Alcohol) in this list. Always remember to patch test new products!</p>
                </div>
            `;
        } else {
            let htmlWarning = `
                <div class="analysis-warning fade-in">
                    <h3><i class="fa-solid fa-triangle-exclamation"></i> Attention Required</h3>
                    <p>We found ${foundHarmful.length} flagged ingredient(s) in your list:</p>
                    <ul class="harmful-list">
            `;

            foundHarmful.forEach(item => {
                const colorClass = item.level === 'Avoid' ? 'text-danger' : 'text-warning';
                htmlWarning += `
                    <li>
                        <strong><span class="${colorClass}">${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span></strong> (${item.level})
                        <p>${item.description}</p>
                    </li>
                `;
            });

            htmlWarning += `</ul></div>`;
            resultsContainer.innerHTML = htmlOverview + htmlWarning;
        }
    },

    handleChatKeyPress(e) {
        if (e.key === 'Enter') {
            this.sendChatMessage();
        }
    },

    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;

        this.appendMessage('user', text);
        input.value = '';

        // Gemini AI Integration via fetch
        this.generateBotResponse(text).then(responseHtml => {
            this.appendMessage('bot', responseHtml);
        });
    },

    appendMessage(sender, text) {
        const chatBox = document.getElementById('chat-box');
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender} fade-in`;

        if (sender === 'bot') {
            msgDiv.innerHTML = `
                <div class="msg-avatar"><i class="fa-solid fa-user-tie"></i></div>
                <div class="msg-bubble">${text}</div>
            `;
        } else {
            msgDiv.innerHTML = `
                <div class="msg-bubble">${text}</div>
            `;
        }

        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    },

    async generateBotResponse(userInput) {
        return new Promise(resolve => {
            setTimeout(() => {
                const lowerInput = userInput.trim().toLowerCase();

                if (lowerInput === 'hi' || lowerInput === 'hello' || lowerInput === 'hey') {
                    let responseHTML = `
                        <p>Hi ${this.state.user}! 💖 So lovely to see you here.</p>
                        <p>I noticed you have beautiful <strong>${this.state.skinType}</strong> skin and you're focusing on <strong>${this.state.skinConcern}</strong>.</p>
                        <p>Having ${this.state.skinType.toLowerCase()} skin means your skin ${this.state.skinType === 'Oily' ? 'tends to produce more natural oils, keeping it youthful but sometimes prone to shine' :
                            this.state.skinType === 'Dry' ? 'can feel a bit tight and needs extra hydration and rich moisture to stay plump' :
                                this.state.skinType === 'Combination' ? 'has a mix of both oily and dry areas, usually an oily T-zone and normal to dry cheeks' :
                                    this.state.skinType === 'Sensitive' ? 'needs gentle, soothing care as it can easily react to harsh ingredients or environmental factors' :
                                        'is beautifully balanced, so the goal is just to maintain that healthy glow'
                        }.</p>
                        <p>And for your concern regarding <strong>${this.state.skinConcern.toLowerCase()}</strong>, don't worry! We have exactly what you need to ${this.state.skinConcern.includes('Acne') ? 'calm breakouts, unclog pores, and reveal clear skin' :
                            this.state.skinConcern.includes('Pigmentation') ? 'fade dark spots and even out your skin tone for a radiant complexion' :
                                this.state.skinConcern.includes('Sensitive') ? 'soothe redness, strengthen your skin barrier, and keep irritation away' :
                                    'keep your skin healthy, protected, and glowing every day'
                        }.</p>
                        <p>How can I help you with your skincare journey today? ✨</p>
                    `;
                    resolve(responseHTML);
                    return;
                }

                let responseHTML = `<p>Darling, based on your beautiful <strong>${this.state.skinType}</strong> skin and your focus on <strong>${this.state.skinConcern}</strong>, here is my perfect skincare routine for you! ✨</p><br>`;

                let filteredProducts = window.products[this.state.skinType] || [];

                const concernMapping = {
                    "Acne / Pimples": "Acne Control",
                    "Pigmentation / Dark Spots": "Pigmentation",
                    "Sensitive / Redness": "Sensitive/Redness",
                    "No Specific Concern": "General"
                };
                const mappedConcern = concernMapping[this.state.skinConcern];

                if (mappedConcern) {
                    filteredProducts = filteredProducts.filter(p => p.concern === mappedConcern || p.concern === "General" || !p.concern);
                }

                // Limit to 3 max for the chat
                let top3 = filteredProducts.slice(0, 3);

                if (top3.length === 0) {
                    resolve(`<p>I don't have perfect matches right now, but please check the Products page for more options! 💄</p>`);
                    return;
                }

                responseHTML += `<div style="display: flex; flex-direction: column; gap: 1rem;">`;
                top3.forEach(p => {
                    responseHTML += `
                        <div style="background: var(--card-bg); padding: 1rem; border-radius: var(--radius-md); border-left: 4px solid var(--primary); box-shadow: var(--shadow-sm);">
                            <h4 style="margin: 0 0 0.5rem 0; color: var(--primary-dark); font-family: 'Outfit', sans-serif;">${p.name}</h4>
                            <p style="margin: 0; font-size: 0.9rem; color: var(--text-muted);"><strong>Advantage:</strong> ${p.type === 'Cleanser' ? 'Gently cleanses and preps your skin without stripping.' : (p.type === 'Moisturizer' ? 'Locks in hydration for a glowing protective barrier.' : 'Provides crucial layered protection and targeted healing action.')}</p>
                        </div>
                    `;
                });
                responseHTML += `</div><br><p>Remember to always patch test new additions! 💖</p>`;

                resolve(responseHTML);
            }, 800); // Simulate network thinking time
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
