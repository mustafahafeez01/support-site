/**
 * Cookie Consent Manager for Travel Document Vault
 * Handles GDPR/ePrivacy compliance by conditionally loading Google Analytics.
 */

(function() {
    'use strict';

    const GA_MEASUREMENT_ID = 'G-NDB2TZPVDS';
    const CONSENT_KEY = 'cookie_consent_status'; // 'granted' or 'denied'
    
    // Check if user has already made a choice
    const consentStatus = localStorage.getItem(CONSENT_KEY);

    if (consentStatus === 'granted') {
        loadAnalytics();
    } else if (consentStatus === null) {
        showConsentBanner();
    }

    // Function to load Google Analytics dynamically
    function loadAnalytics() {
        // Load the gtag.js script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        // Initialize DataLayer
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag; // Make globally available
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID, { 'anonymize_ip': true });
        
        console.log('Analytics loaded (Consent Granted)');
    }

    // Function to show the UI
    function showConsentBanner() {
        // Create styles
        const style = document.createElement('style');
        style.textContent = `
            #cookie-banner {
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                max-width: 600px;
                margin: 0 auto;
                background: rgba(17, 25, 40, 0.85); /* Glass dark */
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                z-index: 9999;
                box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                transform: translateY(150%);
                transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
                font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            }
            
            #cookie-banner.visible {
                transform: translateY(0);
            }

            .cb-content {
                color: #e2e8f0; /* slate-200 */
                font-size: 0.9rem;
                line-height: 1.5;
            }

            .cb-title {
                font-weight: 600;
                color: white;
                margin-bottom: 4px;
                font-size: 1rem;
            }

            .cb-actions {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }

            .cb-btn {
                padding: 8px 20px;
                border-radius: 99px;
                font-size: 0.875rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .cb-btn-accept {
                background-color: #FFB000; /* Brand Gold */
                color: #003A87; /* Brand Blue */
                border: none;
            }
            
            .cb-btn-accept:hover {
                background-color: #e69f00;
                transform: translateY(-1px);
            }

            .cb-btn-decline {
                background-color: transparent;
                color: #94a3b8; /* slate-400 */
                border: 1px solid rgba(255,255,255,0.1);
            }

            .cb-btn-decline:hover {
                background-color: rgba(255,255,255,0.05);
                color: white;
            }

            @media (min-width: 640px) {
                #cookie-banner {
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                }
                .cb-actions {
                    flex-shrink: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Create HTML
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = `
            <div class="cb-text">
                <div class="cb-title">Website Privacy</div>
                <div class="cb-content">
                    We use cookies to analyze <strong>website traffic</strong>. 
                </div> 
                <div class="cb-content" style="font-size: 0.8rem; margin-top:4px; opacity: 0.7;">
                    (The App itself is 100% private and tracks nothing).
                </div>
            </div>
            <div class="cb-actions">
                <button id="cb-decline" class="cb-btn cb-btn-decline">Decline</button>
                <button id="cb-accept" class="cb-btn cb-btn-accept">Accept</button>
            </div>
        `;
        document.body.appendChild(banner);

        // Animate in
        requestAnimationFrame(() => {
            banner.classList.add('visible');
        });

        // Event Listeners
        document.getElementById('cb-accept').addEventListener('click', () => {
            localStorage.setItem(CONSENT_KEY, 'granted');
            banner.classList.remove('visible');
            setTimeout(() => banner.remove(), 500);
            loadAnalytics();
        });

        document.getElementById('cb-decline').addEventListener('click', () => {
            localStorage.setItem(CONSENT_KEY, 'denied');
            banner.classList.remove('visible');
            setTimeout(() => banner.remove(), 500);
        });
    }
})();
