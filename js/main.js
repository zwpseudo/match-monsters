/**
 * Match Monsters - Main Entry Point
 * This file initializes the game and handles application startup.
 */

// ==========================================================================
// Global Variables and Constants
// ==========================================================================

// Debug mode flag
const DEBUG_MODE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Game instance
let game = null;

// Performance monitoring
const PERFORMANCE = {
    startTime: performance.now(),
    loadTime: 0,
    fps: {
        current: 0,
        history: [],
        lastUpdate: 0
    }
};

// Browser compatibility requirements
const BROWSER_REQUIREMENTS = {
    localStorage: true,
    canvas: true,
    es6: true,
    webGL: false,
    touchEvents: false
};

// Asset loading tracking
const ASSETS = {
    total: 0,
    loaded: 0,
    failed: 0,
    items: {}
};

// ==========================================================================
// Initialization
// ==========================================================================

/**
 * Main initialization function
 */
function initializeGame() {
    // Show loading screen
    showLoadingScreen();
    
    // Check browser compatibility
    if (!checkBrowserCompatibility()) {
        showCompatibilityError();
        return;
    }
    
    // Initialize performance monitoring
    if (DEBUG_MODE) {
        initializePerformanceMonitoring();
    }
    
    // Load assets
    loadAssets()
        .then(() => {
            // Create game instance
            createGameInstance();
            
            // Register service worker
            registerServiceWorker();
            
            // Hide loading screen when game is ready
            hideLoadingScreen();
            
            // Log initialization complete
            if (DEBUG_MODE) {
                PERFORMANCE.loadTime = performance.now() - PERFORMANCE.startTime;
                console.log(`Game initialized in ${PERFORMANCE.loadTime.toFixed(2)}ms`);
            }
        })
        .catch(error => {
            handleError('Asset loading failed', error);
        });
}

/**
 * Creates the main game instance
 */
function createGameInstance() {
    try {
        // Create game
        game = createGame();
        
        // Apply device-specific optimizations
        applyDeviceOptimizations();
        
        // Log game creation
        if (DEBUG_MODE) {
            console.log('Game instance created successfully');
        }
    } catch (error) {
        handleError('Failed to create game instance', error);
        showErrorScreen('Game initialization failed. Please refresh the page.');
    }
}

// ==========================================================================
// Asset Loading
// ==========================================================================

/**
 * Loads all game assets
 * @returns {Promise} Promise that resolves when all assets are loaded
 */
function loadAssets() {
    return new Promise((resolve, reject) => {
        // Define assets to load
        const assetsToLoad = [
            // Element Images (SVGs)
            { type: 'image', id: 'fire_element', src: 'assets/images/elements/fire.svg' },
            { type: 'image', id: 'water_element', src: 'assets/images/elements/water.svg' },
            { type: 'image', id: 'earth_element', src: 'assets/images/elements/earth.svg' },
            { type: 'image', id: 'electric_element', src: 'assets/images/elements/electric.svg' },
            { type: 'image', id: 'psychic_element', src: 'assets/images/elements/psychic.svg' },
            { type: 'image', id: 'berry_element', src: 'assets/images/elements/berry.svg' },
            
            // UI and other images
            { type: 'image', id: 'favicon', src: 'assets/images/favicon.svg' },
            
            // Sounds
            { type: 'audio', id: 'match_sound', src: 'assets/sounds/match.mp3' },
            { type: 'audio', id: 'swap_sound', src: 'assets/sounds/swap.mp3' },
            { type: 'audio', id: 'invalid_sound', src: 'assets/sounds/invalid.mp3' },
            { type: 'audio', id: 'evolve_sound', src: 'assets/sounds/evolve.mp3' },
            { type: 'audio', id: 'boost_sound', src: 'assets/sounds/boost.mp3' },
            { type: 'audio', id: 'attack_sound', src: 'assets/sounds/attack.mp3' },
            { type: 'audio', id: 'damage_sound', src: 'assets/sounds/damage.mp3' },
            { type: 'audio', id: 'victory_sound', src: 'assets/sounds/victory.mp3' },
            { type: 'audio', id: 'defeat_sound', src: 'assets/sounds/defeat.mp3' },
            { type: 'audio', id: 'bgm_sound', src: 'assets/sounds/bgm.mp3' }
        ];

        // Add monster portraits dynamically
        // Assuming MONSTERS array is available from constants.js
        if (typeof MONSTERS !== 'undefined' && Array.isArray(MONSTERS)) {
            MONSTERS.forEach(monster => {
                assetsToLoad.push({
                    type: 'monster_portrait', // Special type for fallback logic
                    id: `monster_${monster.id}_${monster.name.toLowerCase().replace(/\s+/g, '')}`,
                    src: monster.portrait // Base path, e.g., 'assets/images/monsters/bonzumi.webp'
                });
            });
        } else {
            if (DEBUG_MODE) {
                console.warn('MONSTERS array not found or not an array. Monster portraits will not be loaded.');
            }
        }
        
        // Set total assets count
        ASSETS.total = assetsToLoad.length;
        
        // If no assets to load, resolve immediately
        if (ASSETS.total === 0) {
            resolve();
            return;
        }
        
        // Create assets directory structure if it doesn't exist (conceptual for client-side)
        createAssetsDirectories();
        
        // Load each asset
        let loadedCount = 0;
        
        assetsToLoad.forEach(asset => {
            let loadPromise;

            if (asset.type === 'monster_portrait') {
                // For monster portraits, try WebP then PNG
                loadPromise = loadAssetWithFallback(asset, 'webp', 'png');
            } else {
                // For other assets, load directly
                loadPromise = loadAsset(asset);
            }

            loadPromise
                .then(loadedAsset => {
                    // Store loaded asset
                    ASSETS.items[asset.id] = loadedAsset;
                    ASSETS.loaded++;
                    loadedCount++;
                    
                    // Update loading progress
                    updateLoadingProgress();
                    
                    // Check if all assets are loaded
                    if (loadedCount === ASSETS.total) {
                        resolve();
                    }
                })
                .catch(error => {
                    ASSETS.failed++;
                    loadedCount++;
                    
                    if (DEBUG_MODE) {
                        console.error(`Failed to load asset: ${asset.id} (src: ${asset.src})`, error.message);
                    }
                    
                    // Continue loading other assets
                    if (loadedCount === ASSETS.total) {
                        // If some assets failed but we have the minimum required, continue
                        // Allow game to start if at least 50% of assets loaded (or some other threshold)
                        if (ASSETS.failed < ASSETS.total / 2 || ASSETS.total === 0) {
                             if (DEBUG_MODE) console.warn(`Continuing with ${ASSETS.failed} failed assets.`);
                            resolve();
                        } else {
                            reject(new Error(`Failed to load ${ASSETS.failed} out of ${ASSETS.total} assets. Critical assets might be missing.`));
                        }
                    }
                });
        });
    });
}

/**
 * Creates the assets directory structure if it doesn't exist
 */
function createAssetsDirectories() {
    // In a real environment, this would create directories on the server
    // For client-side, we'll just check if the directories exist
    
    // For development purposes, we'll create placeholder assets if needed
    if (DEBUG_MODE) {
        createPlaceholderAssets();
    }
}

/**
 * Creates placeholder assets for development if primary assets fail
 */
function createPlaceholderAssets() {
    // Placeholder for element images (if SVGs fail, though unlikely)
    const elementTypes = ['fire', 'water', 'earth', 'electric', 'psychic', 'berry'];
    const elementColors = {
        fire: '#ff5722',
        water: '#2196f3',
        earth: '#8bc34a',
        electric: '#ffeb3b', // Updated from air
        psychic: '#9c27b0', // Updated from light
        berry: '#e91e63'
    };
    
    elementTypes.forEach(type => {
        // Only create placeholder if actual asset (SVG) hasn't loaded
        if (!ASSETS.items[`${type}_element`]) {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            
            ctx.fillStyle = elementColors[type];
            ctx.beginPath();
            ctx.arc(32, 32, 28, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(type.toUpperCase(), 32, 32);
            
            const dataUrl = canvas.toDataURL('image/png');
            const placeholderImg = new Image();
            placeholderImg.src = dataUrl;
            ASSETS.items[`${type}_element_placeholder`] = placeholderImg; // Store with different ID
            if(DEBUG_MODE) console.warn(`Created PNG placeholder for ${type} element.`);
        }
    });
}

/**
 * Loads a single asset
 * @param {Object} asset - Asset to load (must have type and src)
 * @returns {Promise} Promise that resolves with the loaded asset
 */
function loadAsset(asset) {
    return new Promise((resolve, reject) => {
        if (!asset || !asset.src || !asset.type) {
            reject(new Error(`Invalid asset definition: ${JSON.stringify(asset)}`));
            return;
        }

        switch (asset.type) {
            case 'image':
            case 'monster_portrait': // Treat monster_portrait initially as image
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = (err) => reject(new Error(`Failed to load image: ${asset.src}. Error: ${err.type}`));
                img.src = asset.src;
                break;
                
            case 'audio':
                const audio = new Audio();
                // 'canplaythrough' event can be unreliable, 'loadeddata' is often sufficient
                audio.onloadeddata = () => resolve(audio); 
                audio.onerror = (err) => reject(new Error(`Failed to load audio: ${asset.src}. Error code: ${audio.error ? audio.error.code : 'unknown'}`));
                audio.src = asset.src;
                break;
                
            case 'json':
                fetch(asset.src)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error ${response.status} for ${asset.src}`);
                        }
                        return response.json();
                    })
                    .then(json => resolve(json))
                    .catch(error => reject(error));
                break;
                
            default:
                reject(new Error(`Unknown asset type: ${asset.type} for src: ${asset.src}`));
        }
    });
}

/**
 * Loads an asset with a preferred type and a fallback type.
 * @param {Object} asset - Asset definition (id, base src without extension).
 * @param {string} preferredExtension - e.g., 'webp'.
 * @param {string} fallbackExtension - e.g., 'png'.
 * @returns {Promise} Promise that resolves with the loaded asset.
 */
function loadAssetWithFallback(asset, preferredExtension, fallbackExtension) {
    return new Promise((resolve, reject) => {
        // src in asset is like 'assets/images/monsters/bonzumi.webp'
        // We need the base path to append extensions
        const baseSrc = asset.src.substring(0, asset.src.lastIndexOf('.'));

        const preferredAsset = { ...asset, src: `${baseSrc}.${preferredExtension}` };
        loadAsset(preferredAsset)
            .then(resolve) // Preferred loaded successfully
            .catch(() => {
                // Preferred failed, try fallback
                if (DEBUG_MODE) {
                    console.warn(`Failed to load ${preferredAsset.src}, trying fallback .${fallbackExtension}`);
                }
                const fallbackAsset = { ...asset, src: `${baseSrc}.${fallbackExtension}` };
                loadAsset(fallbackAsset)
                    .then(resolve) // Fallback loaded successfully
                    .catch(fallbackError => {
                        // Both failed
                        if (DEBUG_MODE) {
                            console.error(`Failed to load ${fallbackAsset.src} (fallback) as well.`);
                        }
                        // Reject with the error from the fallback attempt, or a more generic one
                        reject(fallbackError || new Error(`Failed to load asset ${asset.id} with both .${preferredExtension} and .${fallbackExtension}`));
                    });
            });
    });
}


/**
 * Updates the loading progress display
 */
function updateLoadingProgress() {
    const progress = ASSETS.total > 0 ? (ASSETS.loaded / ASSETS.total) * 100 : 100;
    
    // Update loading bar
    const loadingProgressEl = document.querySelector('#loading-screen .loading-progress'); // More specific selector
    if (loadingProgressEl) {
        loadingProgressEl.style.width = `${progress}%`;
    }
    
    // Update loading text
    const loadingTextEl = document.querySelector('#loading-screen .loading-text'); // More specific selector
    if (loadingTextEl) {
        loadingTextEl.textContent = `Loading assets... ${Math.round(progress)}%`;
    }
    
    if (DEBUG_MODE) {
        console.log(`Loading progress: ${Math.round(progress)}% (${ASSETS.loaded}/${ASSETS.total})`);
    }
}

// ==========================================================================\
// Browser Compatibility
// ==========================================================================

/**
 * Checks if the browser is compatible with the game
 * @returns {boolean} True if browser is compatible
 */
function checkBrowserCompatibility() {
    let compatible = true;
    const issues = [];
    
    // Check for localStorage
    if (BROWSER_REQUIREMENTS.localStorage && !hasLocalStorage()) {
        compatible = false;
        issues.push('Local Storage is not supported');
    }
    
    // Check for canvas support
    if (BROWSER_REQUIREMENTS.canvas && !hasCanvasSupport()) {
        compatible = false;
        issues.push('Canvas is not supported');
    }
    
    // Check for ES6 support
    if (BROWSER_REQUIREMENTS.es6 && !hasES6Support()) {
        compatible = false;
        issues.push('ES6 features are not supported');
    }
    
    // Check for WebGL support if required
    if (BROWSER_REQUIREMENTS.webGL && !hasWebGLSupport()) {
        compatible = false;
        issues.push('WebGL is not supported');
    }
    
    // Check for touch events if required
    if (BROWSER_REQUIREMENTS.touchEvents && !hasTouchSupport()) {
        // This is not a blocker, just a preference
        if (DEBUG_MODE) {
            console.warn('Touch events are not supported, falling back to mouse events');
        }
    }
    
    // Log compatibility issues
    if (!compatible && DEBUG_MODE) {
        console.error('Browser compatibility issues:', issues);
    }
    
    return compatible;
}

/**
 * Checks if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
function hasLocalStorage() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Checks if canvas is supported
 * @returns {boolean} True if canvas is supported
 */
function hasCanvasSupport() {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
}

/**
 * Checks if ES6 features are supported
 * @returns {boolean} True if ES6 is supported
 */
function hasES6Support() {
    try {
        // Check for arrow functions
        eval('() => {}');
        
        // Check for let/const
        eval('let a = 1; const b = 2;');
        
        // Check for template literals
        eval('`template ${1 + 1}`');
        
        // Check for destructuring
        eval('const {a, b} = {a: 1, b: 2}');
        
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Checks if WebGL is supported
 * @returns {boolean} True if WebGL is supported
 */
function hasWebGLSupport() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

/**
 * Checks if touch events are supported
 * @returns {boolean} True if touch is supported
 */
function hasTouchSupport() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Shows compatibility error screen
 */
function showCompatibilityError() {
    // Hide loading screen
    hideLoadingScreen();
    
    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'compatibility-error';
    errorContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #1a2639; color: #e6e6e6; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px; z-index: 9999;';
    
    // Create error message
    const errorTitle = document.createElement('h1');
    errorTitle.textContent = 'Browser Not Supported';
    errorTitle.style.cssText = 'margin-bottom: 20px; font-size: 24px;';
    
    const errorMessage = document.createElement('p');
    errorMessage.innerHTML = 'Your browser does not support the required features for Match Monsters.<br>Please try a modern browser like Chrome, Firefox, Safari, or Edge.';
    errorMessage.style.cssText = 'margin-bottom: 30px; font-size: 16px; line-height: 1.5;';
    
    // Add browser links
    const browsersContainer = document.createElement('div');
    browsersContainer.style.cssText = 'display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;';
    
    const browsers = [
        { name: 'Chrome', url: 'https://www.google.com/chrome/' },
        { name: 'Firefox', url: 'https://www.mozilla.org/firefox/' },
        { name: 'Safari', url: 'https://www.apple.com/safari/' },
        { name: 'Edge', url: 'https://www.microsoft.com/edge' }
    ];
    
    browsers.forEach(browser => {
        const link = document.createElement('a');
        link.href = browser.url;
        link.target = '_blank';
        link.textContent = browser.name;
        link.style.cssText = 'color: #4a6fa5; text-decoration: none; padding: 10px 20px; background-color: #283b5b; border-radius: 4px; transition: background-color 0.3s;';
        link.onmouseover = () => { link.style.backgroundColor = '#3d5174'; };
        link.onmouseout = () => { link.style.backgroundColor = '#283b5b'; };
        browsersContainer.appendChild(link);
    });
    
    // Assemble error screen
    errorContainer.appendChild(errorTitle);
    errorContainer.appendChild(errorMessage);
    errorContainer.appendChild(browsersContainer);
    
    // Add to document
    document.body.appendChild(errorContainer);
}

// ==========================================================================\
// Device Optimization
// ==========================================================================

/**
 * Applies optimizations based on device capabilities
 */
function applyDeviceOptimizations() {
    // Detect device type
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    
    // Apply mobile optimizations
    if (isMobile || isTablet) {
        applyMobileOptimizations(isTablet);
    }
    
    // Apply high DPI optimizations
    if (window.devicePixelRatio > 1) {
        applyHighDPIOptimizations();
    }
    
    // Apply performance optimizations based on device performance
    applyPerformanceOptimizations();
}

/**
 * Applies mobile-specific optimizations
 * @param {boolean} isTablet - Whether the device is a tablet
 */
function applyMobileOptimizations(isTablet) {
    // Add mobile class to body
    document.body.classList.add('mobile');
    if (isTablet) {
        document.body.classList.add('tablet');
    }
    
    // Adjust tile size for mobile
    if (!isTablet) {
        GAME_CONFIG.TILE_SIZE = 50; // Smaller tiles on phones
        GAME_CONFIG.TILE_GAP = 4;
    }
    
    // Prevent unwanted touch behaviors
    document.addEventListener('touchmove', function(e) {
        if (e.target.closest('#game-board')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        if (now - lastTouchEnd < 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Add viewport meta tag if not present
    if (!document.querySelector('meta[name="viewport"]')) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(meta);
    }
    
    if (DEBUG_MODE) {
        console.log(`Applied ${isTablet ? 'tablet' : 'mobile'} optimizations`);
    }
}

/**
 * Applies optimizations for high DPI displays
 */
function applyHighDPIOptimizations() {
    // Scale canvas for high DPI displays
    const gameBoard = document.getElementById('game-board');
    if (gameBoard && gameBoard.getContext) {
        const ctx = gameBoard.getContext('2d');
        const dpr = window.devicePixelRatio || 1; // Fallback to 1 if undefined
        
        // Set canvas size accounting for device pixel ratio
        const styleWidth = gameBoard.clientWidth;
        const styleHeight = gameBoard.clientHeight;
        
        gameBoard.width = styleWidth * dpr;
        gameBoard.height = styleHeight * dpr;
        // gameBoard.style.width = `${styleWidth}px`; // Style width/height should be set by CSS
        // gameBoard.style.height = `${styleHeight}px`;
        
        // Scale context
        ctx.scale(dpr, dpr);
    }
    
    if (DEBUG_MODE) {
        console.log(`Applied high DPI optimizations (pixel ratio: ${window.devicePixelRatio || 1})`);
    }
}

/**
 * Applies optimizations based on device performance
 */
function applyPerformanceOptimizations() {
    // Measure device performance
    const startTime = performance.now();
    let iterations = 0;
    
    // Run a simple benchmark
    for (let i = 0; i < 1000000; i++) {
        iterations++;
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Determine performance level
    let performanceLevel = 'high';
    
    if (duration > 50) {
        performanceLevel = 'medium';
    }
    
    if (duration > 100) {
        performanceLevel = 'low';
    }
    
    // Apply optimizations based on performance level
    switch (performanceLevel) {
        case 'low':
            // Reduce visual effects
            document.body.classList.add('low-performance');
            break;
            
        case 'medium':
            // Moderate effects
            document.body.classList.add('medium-performance');
            break;
            
        case 'high':
            // Full effects
            document.body.classList.add('high-performance');
            break;
    }
    
    if (DEBUG_MODE) {
        console.log(`Performance level: ${performanceLevel} (benchmark: ${duration.toFixed(2)}ms)`);
    }
}

// ==========================================================================\
// Performance Monitoring
// ==========================================================================

/**
 * Initializes performance monitoring
 */
function initializePerformanceMonitoring() {
    // Create FPS counter if in debug mode
    if (DEBUG_MODE) {
        createFPSCounter();
        
        // Start monitoring FPS
        requestAnimationFrame(updateFPS);
        
        // Log memory usage periodically
        setInterval(logMemoryUsage, 10000);
    }
}

/**
 * Creates an FPS counter element
 */
function createFPSCounter() {
    const fpsCounter = document.createElement('div');
    fpsCounter.id = 'fps-counter';
    fpsCounter.style.cssText = 'position: fixed; top: 10px; right: 10px; background-color: rgba(0, 0, 0, 0.5); color: white; padding: 5px 10px; border-radius: 4px; font-size: 12px; z-index: 9999;';
    fpsCounter.textContent = 'FPS: 0';
    document.body.appendChild(fpsCounter);
}

/**
 * Updates the FPS counter
 * @param {number} timestamp - Current timestamp
 */
function updateFPS(timestamp) {
    // Calculate FPS
    if (!PERFORMANCE.fps.lastUpdate) {
        PERFORMANCE.fps.lastUpdate = timestamp;
    }
    
    const elapsed = timestamp - PERFORMANCE.fps.lastUpdate;
    
    if (elapsed >= 1000) {
        // Update FPS
        PERFORMANCE.fps.current = Math.round(PERFORMANCE.fps.history.length * 1000 / elapsed);
        
        // Update FPS counter
        const fpsCounter = document.getElementById('fps-counter');
        if (fpsCounter) {
            fpsCounter.textContent = `FPS: ${PERFORMANCE.fps.current}`;
            
            // Color code based on performance
            if (PERFORMANCE.fps.current < 30) {
                fpsCounter.style.color = '#ff5722'; // Red for low FPS
            } else if (PERFORMANCE.fps.current < 50) {
                fpsCounter.style.color = '#ffeb3b'; // Yellow for medium FPS
            } else {
                fpsCounter.style.color = '#4caf50'; // Green for high FPS
            }
        }
        
        // Reset history
        PERFORMANCE.fps.history = [];
        PERFORMANCE.fps.lastUpdate = timestamp;
    } else {
        // Add to history
        PERFORMANCE.fps.history.push(timestamp);
    }
    
    // Continue monitoring
    requestAnimationFrame(updateFPS);
}

/**
 * Logs memory usage information
 */
function logMemoryUsage() {
    if (window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        console.log(`Memory usage: ${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB / ${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`);
    }
}

// ==========================================================================\
// Service Worker
// ==========================================================================

/**
 * Registers the service worker for PWA functionality
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js') // Assuming service-worker.js is in root
            .then(registration => {
                if (DEBUG_MODE) {
                    console.log('Service Worker registered with scope:', registration.scope);
                }
            })
            .catch(error => {
                if (DEBUG_MODE) {
                    console.error('Service Worker registration failed:', error);
                }
            });
    }
}

// ==========================================================================\
// Loading Screen
// ==========================================================================

/**
 * Shows the loading screen
 */
function showLoadingScreen() {
    // Check if loading screen exists
    let loadingScreen = document.getElementById('loading-screen');
    
    if (!loadingScreen) {
        // Create loading screen
        loadingScreen = document.createElement('div');
        loadingScreen.id = 'loading-screen';
        // loadingScreen.className = 'loading-screen'; // Class is already in index.html
        // loadingScreen.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: #1a2639; display: flex; justify-content: center; align-items: center; z-index: 9999;';
        
        // Create loading content
        const loadingContent = document.createElement('div');
        loadingContent.className = 'loading-content';
        // loadingContent.style.cssText = 'text-align: center; width: 80%; max-width: 400px;';
        
        // Create title
        const title = document.createElement('h2');
        title.textContent = 'Loading Match Monsters';
        // title.style.cssText = 'color: #e6e6e6; margin-bottom: 20px; font-size: 24px;';
        
        // Create loading bar
        const loadingBar = document.createElement('div');
        loadingBar.className = 'loading-bar';
        // loadingBar.style.cssText = 'height: 20px; background-color: rgba(0, 0, 0, 0.3); border-radius: 10px; margin: 20px 0; overflow: hidden;';
        
        const loadingProgress = document.createElement('div');
        loadingProgress.className = 'loading-progress'; // This class is targeted by updateLoadingProgress
        // loadingProgress.style.cssText = 'height: 100%; width: 0%; background-color: #4a6fa5; border-radius: 10px; transition: width 0.3s ease;';
        
        // Create loading text
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text'; // This class is targeted by updateLoadingProgress
        loadingText.textContent = 'Preparing monsters...';
        // loadingText.style.cssText = 'color: #b0b0b0; font-style: italic; animation: textFade 2s infinite;';
        
        // Add animation style (if not already in CSS)
        // const style = document.createElement('style');
        // style.textContent = `
        //     @keyframes textFade {
        //         0% { opacity: 0.5; }
        //         50% { opacity: 1; }
        //         100% { opacity: 0.5; }
        //     }
        // `;
        
        // Assemble loading screen
        loadingBar.appendChild(loadingProgress);
        loadingContent.appendChild(title);
        loadingContent.appendChild(loadingBar);
        loadingContent.appendChild(loadingText);
        loadingScreen.appendChild(loadingContent);
        
        // Add to document
        // document.head.appendChild(style); // Assuming styles are in CSS
        document.body.appendChild(loadingScreen);
    }
    // Ensure it's visible
    loadingScreen.style.display = 'flex';
    loadingScreen.style.opacity = '1';
}

/**
 * Hides the loading screen
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    if (loadingScreen) {
        // Fade out loading screen
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';
        
        // Remove after animation
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            // if (loadingScreen.parentNode) { // Keep it in DOM for reuse
            //     loadingScreen.parentNode.removeChild(loadingScreen);
            // }
        }, 500);
    }
}

// ==========================================================================\
// Error Handling
// ==========================================================================

/**
 * Shows an error screen
 * @param {string} message - Error message
 */
function showErrorScreen(message) {
    // Hide loading screen
    hideLoadingScreen();
    
    // Create error container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-screen';
    errorContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(26, 38, 57, 0.9); color: #e6e6e6; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px; z-index: 9999;';
    
    // Create error message
    const errorTitle = document.createElement('h1');
    errorTitle.textContent = 'Oops, something went wrong!';
    errorTitle.style.cssText = 'margin-bottom: 20px; font-size: 24px;';
    
    const errorMessage = document.createElement('p');
    errorMessage.textContent = message || 'An unexpected error occurred. Please try refreshing the page.';
    errorMessage.style.cssText = 'margin-bottom: 30px; font-size: 16px;';
    
    // Create refresh button
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh Page';
    refreshButton.style.cssText = 'padding: 10px 20px; background-color: #4a6fa5; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;';
    refreshButton.onclick = () => window.location.reload();
    
    // Assemble error screen
    errorContainer.appendChild(errorTitle);
    errorContainer.appendChild(errorMessage);
    errorContainer.appendChild(refreshButton);
    
    // Add to document
    document.body.appendChild(errorContainer);
}

/**
 * Handles errors
 * @param {string} context - Error context
 * @param {Error} error - Error object
 */
function handleError(context, error) {
    // Log error
    if (DEBUG_MODE) {
        console.error(`${context}:`, error);
    }
    
    // Send error to analytics in production
    if (!DEBUG_MODE && window.gtag) { // Assuming gtag for Google Analytics
        gtag('event', 'exception', {
            'description': `${context}: ${error.message}`,
            'fatal': context.includes('critical') || context.includes('failed')
        });
    }
    
    // Show error in UI if it's a critical error
    if (context.includes('critical') || context.includes('failed')) {
        showErrorScreen(`${context}: ${error.message}`);
    }
}

// Set up global error handling
window.onerror = function(message, source, lineno, colno, error) {
    handleError('Uncaught exception', error || new Error(`${message} at ${source}:${lineno}:${colno}`));
    return false; // Let default handler run
};

window.addEventListener('unhandledrejection', function(event) {
    handleError('Unhandled promise rejection', event.reason);
});

// ==========================================================================\
// Startup
// ==========================================================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}

// Expose game to window for debugging
if (DEBUG_MODE) {
    window.MatchMonstersGame = game; // More specific global name
    window.MatchMonstersAssets = ASSETS;
    window.MatchMonstersPerformance = PERFORMANCE;
}
