/**
 * Match Monsters - Utilities
 * This file contains utility functions used throughout the game.
 */

// ==========================================================================
// Array Utilities
// ==========================================================================

/**
 * Shuffles an array using the Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} A new shuffled array
 */
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * Gets a random element from an array
 * @param {Array} array - The array to select from
 * @returns {*} A random element from the array
 */
function getRandomArrayElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Gets a random subset of elements from an array
 * @param {Array} array - The array to select from
 * @param {number} count - The number of elements to select
 * @returns {Array} A new array with random elements
 */
function getRandomSubset(array, count) {
    const shuffled = shuffleArray(array);
    return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Filters an array to only include unique values
 * @param {Array} array - The array to filter
 * @returns {Array} A new array with only unique values
 */
function uniqueArray(array) {
    return [...new Set(array)];
}

// ==========================================================================
// Element and Damage Calculations
// ==========================================================================

/**
 * Calculates damage based on attacker, defender, and element relationships
 * @param {number} baseDamage - The base damage amount
 * @param {string} attackerElement - The element type of the attacker
 * @param {string} defenderElement - The element type of the defender
 * @returns {number} The calculated damage amount
 */
function calculateElementalDamage(baseDamage, attackerElement, defenderElement) {
    let damageMultiplier = 1.0;
    
    // Skip calculation for berry element as it's not an attack element
    if (attackerElement === ELEMENT_TYPES.BERRY) {
        return 0;
    }
    
    // Check element relationships
    if (ELEMENT_RELATIONSHIPS[attackerElement]) {
        // Strong against (1.5x damage)
        if (ELEMENT_RELATIONSHIPS[attackerElement].strong.includes(defenderElement)) {
            damageMultiplier = 1.5;
        }
        // Weak against (0.75x damage)
        else if (ELEMENT_RELATIONSHIPS[attackerElement].weak.includes(defenderElement)) {
            damageMultiplier = 0.75;
        }
    }
    
    // Calculate final damage (rounded to nearest integer)
    return Math.round(baseDamage * damageMultiplier);
}

/**
 * Determines if an element has advantage over another
 * @param {string} attackerElement - The element type of the attacker
 * @param {string} defenderElement - The element type of the defender
 * @returns {boolean} True if attacker has advantage
 */
function hasElementalAdvantage(attackerElement, defenderElement) {
    if (ELEMENT_RELATIONSHIPS[attackerElement]) {
        return ELEMENT_RELATIONSHIPS[attackerElement].strong.includes(defenderElement);
    }
    return false;
}

/**
 * Gets a random element type (excluding berry)
 * @returns {string} A random element type
 */
function getRandomElement() {
    const elements = Object.values(ELEMENT_TYPES).filter(el => el !== ELEMENT_TYPES.BERRY);
    return getRandomArrayElement(elements);
}

/**
 * Gets a weighted random element based on distribution
 * @returns {string} An element type
 */
function getWeightedRandomElement() {
    const random = Math.random();
    let cumulativeProbability = 0;
    
    for (const [element, probability] of Object.entries(GAME_CONFIG.ELEMENT_DISTRIBUTION)) {
        cumulativeProbability += probability;
        if (random <= cumulativeProbability) {
            return ELEMENT_TYPES[element];
        }
    }
    
    // Fallback to a random element
    return getRandomElement();
}

// ==========================================================================
// DOM Utilities
// ==========================================================================

/**
 * Shorthand for document.querySelector
 * @param {string} selector - CSS selector
 * @returns {Element} The found element or null
 */
function qs(selector) {
    return document.querySelector(selector);
}

/**
 * Shorthand for document.querySelectorAll
 * @param {string} selector - CSS selector
 * @returns {NodeList} List of found elements
 */
function qsa(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Creates a DOM element with optional attributes and children
 * @param {string} tag - The HTML tag name
 * @param {Object} attributes - Attributes to set on the element
 * @param {Array|Element|string} children - Child elements or text content
 * @returns {Element} The created element
 */
function createElement(tag, attributes = {}, children = null) {
    const element = document.createElement(tag);
    
    // Set attributes
    for (const [key, value] of Object.entries(attributes)) {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            for (const [dataKey, dataValue] of Object.entries(value)) {
                element.dataset[dataKey] = dataValue;
            }
        } else if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.substring(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    }
    
    // Add children
    if (children) {
        if (Array.isArray(children)) {
            children.forEach(child => {
                if (child instanceof Element) {
                    element.appendChild(child);
                } else if (child !== null && child !== undefined) {
                    element.appendChild(document.createTextNode(child.toString()));
                }
            });
        } else if (children instanceof Element) {
            element.appendChild(children);
        } else if (children !== null && children !== undefined) {
            element.textContent = children.toString();
        }
    }
    
    return element;
}

/**
 * Removes all children from a DOM element
 * @param {Element} element - The element to clear
 */
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Shows a DOM element by removing the 'hidden' class
 * @param {Element|string} element - The element or selector
 */
function showElement(element) {
    const el = typeof element === 'string' ? qs(element) : element;
    if (el) {
        el.classList.remove(CSS_CLASSES.HIDDEN);
        el.classList.add(CSS_CLASSES.VISIBLE);
    }
}

/**
 * Hides a DOM element by adding the 'hidden' class
 * @param {Element|string} element - The element or selector
 */
function hideElement(element) {
    const el = typeof element === 'string' ? qs(element) : element;
    if (el) {
        el.classList.add(CSS_CLASSES.HIDDEN);
        el.classList.remove(CSS_CLASSES.VISIBLE);
    }
}

/**
 * Toggles a class on an element
 * @param {Element|string} element - The element or selector
 * @param {string} className - The class to toggle
 * @param {boolean} [force] - Force add or remove
 * @returns {boolean} The new state
 */
function toggleClass(element, className, force) {
    const el = typeof element === 'string' ? qs(element) : element;
    if (el) {
        return el.classList.toggle(className, force);
    }
    return false;
}

/**
 * Adds a class to an element
 * @param {Element|string} element - The element or selector
 * @param {string} className - The class to add
 */
function addClass(element, className) {
    const el = typeof element === 'string' ? qs(element) : element;
    if (el) {
        el.classList.add(className);
    }
}

/**
 * Removes a class from an element
 * @param {Element|string} element - The element or selector
 * @param {string} className - The class to remove
 */
function removeClass(element, className) {
    const el = typeof element === 'string' ? qs(element) : element;
    if (el) {
        el.classList.remove(className);
    }
}

/**
 * Sets the text content of an element
 * @param {Element|string} element - The element or selector
 * @param {string} text - The text to set
 */
function setText(element, text) {
    const el = typeof element === 'string' ? qs(element) : element;
    if (el) {
        el.textContent = text;
    }
}

/**
 * Sets the HTML content of an element
 * @param {Element|string} element - The element or selector
 * @param {string} html - The HTML to set
 */
function setHTML(element, html) {
    const el = typeof element === 'string' ? qs(element) : element;
    if (el) {
        el.innerHTML = html;
    }
}

/**
 * Sets multiple styles on an element
 * @param {Element|string} element - The element or selector
 * @param {Object} styles - Object with style properties
 */
function setStyles(element, styles) {
    const el = typeof element === 'string' ? qs(element) : element;
    if (el) {
        Object.assign(el.style, styles);
    }
}

// ==========================================================================
// Time and Formatting Utilities
// ==========================================================================

/**
 * Formats seconds into MM:SS format
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Creates a delay using a promise
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} A promise that resolves after the delay
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounces a function to limit how often it can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

/**
 * Throttles a function to limit how often it can be called
 * @param {Function} func - The function to throttle
 * @param {number} limit - Milliseconds to limit
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==========================================================================
// Animation Utilities
// ==========================================================================

/**
 * Adds an animation class and removes it after animation completes
 * @param {Element|string} element - The element or selector
 * @param {string} animationClass - The animation class to add
 * @param {number} [duration=1000] - Animation duration in ms
 * @returns {Promise} Promise that resolves when animation completes
 */
function animateElement(element, animationClass, duration = 1000) {
    return new Promise(resolve => {
        const el = typeof element === 'string' ? qs(element) : element;
        if (!el) {
            resolve();
            return;
        }
        
        el.classList.add(animationClass);
        
        setTimeout(() => {
            el.classList.remove(animationClass);
            resolve();
        }, duration);
    });
}

/**
 * Creates a transition between two states of an element
 * @param {Element|string} element - The element or selector
 * @param {Object} properties - CSS properties to animate
 * @param {number} [duration=400] - Animation duration in ms
 * @param {string} [easing='ease'] - CSS easing function
 * @returns {Promise} Promise that resolves when transition completes
 */
function transitionElement(element, properties, duration = 400, easing = 'ease') {
    return new Promise(resolve => {
        const el = typeof element === 'string' ? qs(element) : element;
        if (!el) {
            resolve();
            return;
        }
        
        // Save original transition
        const originalTransition = el.style.transition;
        
        // Set new transition
        el.style.transition = `all ${duration}ms ${easing}`;
        
        // Force reflow
        el.offsetHeight;
        
        // Apply new styles
        Object.assign(el.style, properties);
        
        // Listen for transition end
        const onTransitionEnd = () => {
            el.removeEventListener('transitionend', onTransitionEnd);
            el.style.transition = originalTransition;
            resolve();
        };
        
        el.addEventListener('transitionend', onTransitionEnd);
        
        // Fallback in case transitionend doesn't fire
        setTimeout(onTransitionEnd, duration + 50);
    });
}

/**
 * Animates an element along a path
 * @param {Element|string} element - The element or selector
 * @param {Array} path - Array of {x, y} points
 * @param {number} duration - Total animation duration in ms
 * @returns {Promise} Promise that resolves when animation completes
 */
function animateAlongPath(element, path, duration) {
    return new Promise(resolve => {
        const el = typeof element === 'string' ? qs(element) : element;
        if (!el || !path.length) {
            resolve();
            return;
        }
        
        const startTime = performance.now();
        const originalTransform = el.style.transform;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            if (progress < 1) {
                // Calculate current position along the path
                const pathIndex = Math.min(
                    Math.floor(progress * path.length),
                    path.length - 1
                );
                
                // Set position
                el.style.transform = `translate(${path[pathIndex].x}px, ${path[pathIndex].y}px)`;
                
                // Continue animation
                requestAnimationFrame(animate);
            } else {
                // Animation complete
                el.style.transform = originalTransform;
                resolve();
            }
        };
        
        requestAnimationFrame(animate);
    });
}

// ==========================================================================
// Local Storage Utilities
// ==========================================================================

/**
 * Saves data to local storage
 * @param {string} key - Storage key
 * @param {*} data - Data to store
 * @returns {boolean} Success status
 */
function saveToStorage(key, data) {
    try {
        const serialized = JSON.stringify(data);
        localStorage.setItem(key, serialized);
        return true;
    } catch (error) {
        console.error('Error saving to local storage:', error);
        return false;
    }
}

/**
 * Loads data from local storage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*} The stored data or default value
 */
function loadFromStorage(key, defaultValue = null) {
    try {
        const serialized = localStorage.getItem(key);
        if (serialized === null) {
            return defaultValue;
        }
        return JSON.parse(serialized);
    } catch (error) {
        console.error('Error loading from local storage:', error);
        return defaultValue;
    }
}

/**
 * Removes data from local storage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from local storage:', error);
        return false;
    }
}

/**
 * Clears all game data from local storage
 * @returns {boolean} Success status
 */
function clearGameStorage() {
    try {
        for (const key of Object.values(STORAGE_KEYS)) {
            localStorage.removeItem(key);
        }
        return true;
    } catch (error) {
        console.error('Error clearing game storage:', error);
        return false;
    }
}

// ==========================================================================
// Event System
// ==========================================================================

// Event system for game communication
const EventSystem = {
    listeners: {},
    
    /**
     * Adds an event listener
     * @param {string} event - Event name
     * @param {Function} callback - Event handler
     * @returns {Function} Function to remove the listener
     */
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        
        this.listeners[event].push(callback);
        
        // Return a function to remove this listener
        return () => this.off(event, callback);
    },
    
    /**
     * Removes an event listener
     * @param {string} event - Event name
     * @param {Function} callback - Event handler to remove
     */
    off(event, callback) {
        if (!this.listeners[event]) return;
        
        this.listeners[event] = this.listeners[event].filter(
            listener => listener !== callback
        );
    },
    
    /**
     * Triggers an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data) {
        if (!this.listeners[event]) return;
        
        this.listeners[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event listener for ${event}:`, error);
            }
        });
    },
    
    /**
     * Removes all listeners for an event
     * @param {string} event - Event name
     */
    clearEvent(event) {
        this.listeners[event] = [];
    },
    
    /**
     * Removes all event listeners
     */
    clearAll() {
        this.listeners = {};
    }
};

// ==========================================================================
// Validation Utilities
// ==========================================================================

/**
 * Checks if two tiles can be swapped (adjacent)
 * @param {Object} tile1 - First tile with row and col properties
 * @param {Object} tile2 - Second tile with row and col properties
 * @returns {boolean} True if tiles are adjacent
 */
function areAdjacentTiles(tile1, tile2) {
    const rowDiff = Math.abs(tile1.row - tile2.row);
    const colDiff = Math.abs(tile1.col - tile2.col);
    
    // Adjacent if exactly one step away in exactly one direction
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

/**
 * Checks if a swap would create a match
 * @param {Array} board - 2D array representing the board
 * @param {Object} tile1 - First tile with row, col, and type properties
 * @param {Object} tile2 - Second tile with row, col, and type properties
 * @returns {boolean} True if swap creates a match
 */
function wouldCreateMatch(board, tile1, tile2) {
    // Create a copy of the board
    const boardCopy = board.map(row => [...row]);
    
    // Swap tiles in the copy
    const temp = boardCopy[tile1.row][tile1.col];
    boardCopy[tile1.row][tile1.col] = boardCopy[tile2.row][tile2.col];
    boardCopy[tile2.row][tile2.col] = temp;
    
    // Check for matches at both positions
    return (
        findMatchesAt(boardCopy, tile1.row, tile1.col).length > 0 ||
        findMatchesAt(boardCopy, tile2.row, tile2.col).length > 0
    );
}

/**
 * Finds matches at a specific position
 * @param {Array} board - 2D array representing the board
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {Array} Array of matched positions
 */
function findMatchesAt(board, row, col) {
    const matches = [];
    const tileType = board[row][col];
    
    // Check horizontal matches
    let horizontalMatches = [{row, col}];
    
    // Check left
    let leftCol = col - 1;
    while (leftCol >= 0 && board[row][leftCol] === tileType) {
        horizontalMatches.push({row, col: leftCol});
        leftCol--;
    }
    
    // Check right
    let rightCol = col + 1;
    while (rightCol < board[0].length && board[row][rightCol] === tileType) {
        horizontalMatches.push({row, col: rightCol});
        rightCol++;
    }
    
    // If we have at least 3 in a row
    if (horizontalMatches.length >= 3) {
        matches.push(...horizontalMatches);
    }
    
    // Check vertical matches
    let verticalMatches = [{row, col}];
    
    // Check up
    let upRow = row - 1;
    while (upRow >= 0 && board[upRow][col] === tileType) {
        verticalMatches.push({row: upRow, col});
        upRow--;
    }
    
    // Check down
    let downRow = row + 1;
    while (downRow < board.length && board[downRow][col] === tileType) {
        verticalMatches.push({row: downRow, col});
        downRow++;
    }
    
    // If we have at least 3 in a column
    if (verticalMatches.length >= 3) {
        matches.push(...verticalMatches);
    }
    
    // Return unique matches
    return uniquePositions(matches);
}

/**
 * Removes duplicate positions from an array
 * @param {Array} positions - Array of {row, col} objects
 * @returns {Array} Array with unique positions
 */
function uniquePositions(positions) {
    const seen = new Set();
    return positions.filter(pos => {
        const key = `${pos.row},${pos.col}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

/**
 * Checks if a board has any possible moves
 * @param {Array} board - 2D array representing the board
 * @returns {boolean} True if there are possible moves
 */
function hasPossibleMoves(board) {
    const rows = board.length;
    const cols = board[0].length;
    
    // Check each tile
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Check right swap
            if (col < cols - 1) {
                const tile1 = {row, col, type: board[row][col]};
                const tile2 = {row, col: col + 1, type: board[row][col + 1]};
                
                if (wouldCreateMatch(board, tile1, tile2)) {
                    return true;
                }
            }
            
            // Check down swap
            if (row < rows - 1) {
                const tile1 = {row, col, type: board[row][col]};
                const tile2 = {row: row + 1, col, type: board[row + 1][col]};
                
                if (wouldCreateMatch(board, tile1, tile2)) {
                    return true;
                }
            }
        }
    }
    
    return false;
}

// ==========================================================================
// Math Utilities
// ==========================================================================

/**
 * Clamps a value between min and max
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} The clamped value
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
function lerp(start, end, t) {
    return start + (end - start) * clamp(t, 0, 1);
}

/**
 * Calculates the distance between two points
 * @param {number} x1 - X coordinate of first point
 * @param {number} y1 - Y coordinate of first point
 * @param {number} x2 - X coordinate of second point
 * @param {number} y2 - Y coordinate of second point
 * @returns {number} The distance
 */
function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Converts degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Converts radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random float between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random float
 */
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// ==========================================================================
// Logging Utilities
// ==========================================================================

/**
 * Game logger for tracking game events
 */
const GameLogger = {
    logEntries: [],
    maxEntries: GAME_CONFIG.LOG_MAX_ENTRIES,
    
    /**
     * Adds a log entry
     * @param {string} message - Log message
     * @param {string} [type='system'] - Log type (player1, player2, system)
     */
    log(message, type = 'system') {
        const entry = {
            message,
            type,
            timestamp: new Date().toISOString()
        };
        
        this.logEntries.unshift(entry);
        
        // Trim log if it exceeds max entries
        if (this.logEntries.length > this.maxEntries) {
            this.logEntries = this.logEntries.slice(0, this.maxEntries);
        }
        
        // Update the log display
        this.updateLogDisplay();
        
        // Also console log for debugging
        console.log(`[${type}] ${message}`);
    },
    
    /**
     * Updates the log display in the UI
     */
    updateLogDisplay() {
        const logContent = qs(UI_SELECTORS.LOG_CONTENT);
        if (!logContent) return;
        
        clearElement(logContent);
        
        this.logEntries.forEach(entry => {
            const logEntry = createElement('div', {
                className: `${CSS_CLASSES.LOG_ENTRY} ${entry.type}`
            }, entry.message);
            
            logContent.appendChild(logEntry);
        });
    },
    
    /**
     * Clears all log entries
     */
    clear() {
        this.logEntries = [];
        this.updateLogDisplay();
    },
    
    /**
     * Gets all log entries
     * @returns {Array} Array of log entries
     */
    getEntries() {
        return [...this.logEntries];
    }
};

// Export all utilities
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Array utilities
        shuffleArray,
        getRandomArrayElement,
        getRandomSubset,
        uniqueArray,
        
        // Element and damage calculations
        calculateElementalDamage,
        hasElementalAdvantage,
        getRandomElement,
        getWeightedRandomElement,
        
        // DOM utilities
        qs,
        qsa,
        createElement,
        clearElement,
        showElement,
        hideElement,
        toggleClass,
        addClass,
        removeClass,
        setText,
        setHTML,
        setStyles,
        
        // Time and formatting utilities
        formatTime,
        delay,
        debounce,
        throttle,
        
        // Animation utilities
        animateElement,
        transitionElement,
        animateAlongPath,
        
        // Local storage utilities
        saveToStorage,
        loadFromStorage,
        removeFromStorage,
        clearGameStorage,
        
        // Event system
        EventSystem,
        
        // Validation utilities
        areAdjacentTiles,
        wouldCreateMatch,
        findMatchesAt,
        uniquePositions,
        hasPossibleMoves,
        
        // Math utilities
        clamp,
        lerp,
        distance,
        toRadians,
        toDegrees,
        randomInt,
        randomFloat,
        
        // Logging utilities
        GameLogger
    };
}
