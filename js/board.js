/**
 * Match Monsters - Board Module
 * This file contains the board mechanics for the match-3 gameplay.
 */

// ==========================================================================
// Tile Class
// ==========================================================================

/**
 * Represents a single tile on the game board
 */
class Tile {
    /**
     * Create a new tile
     * @param {string} type - The element type of the tile
     * @param {number} row - Row position on the board
     * @param {number} col - Column position on the board
     */
    constructor(type, row, col) {
        this.type = type;
        this.row = row;
        this.col = col;
        this.selected = false;
        this.matched = false;
        this.falling = false;
        this.x = col * (GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_GAP);
        this.y = row * (GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_GAP);
        this.targetX = this.x;
        this.targetY = this.y;
        this.alpha = 1;
        this.scale = 1;
        this.rotation = 0;
        this.animating = false;
        this.special = false;
    }
    
    /**
     * Updates the tile's position during animations
     * @param {number} deltaTime - Time since last update
     * @returns {boolean} True if still animating
     */
    update(deltaTime) {
        const animationSpeed = this.falling ? 
            GAME_CONFIG.ANIMATION_SPEED.TILE_FALL : 
            GAME_CONFIG.ANIMATION_SPEED.TILE_SWAP;
        
        // Calculate animation progress (0 to 1)
        const step = deltaTime / animationSpeed;
        
        // Animate position
        if (this.x !== this.targetX || this.y !== this.targetY) {
            this.x = lerp(this.x, this.targetX, step * 5);
            this.y = lerp(this.y, this.targetY, step * 5);
            
            // Check if we're close enough to snap to target
            if (Math.abs(this.x - this.targetX) < 0.5 && Math.abs(this.y - this.targetY) < 0.5) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.falling = false;
            }
            
            return true;
        }
        
        // If matched, animate alpha
        if (this.matched) {
            this.alpha = Math.max(0, this.alpha - step * 2);
            this.scale = Math.max(0, this.scale + step * 2);
            return this.alpha > 0;
        }
        
        // If selected, animate scale
        if (this.selected) {
            this.scale = 1.1 + Math.sin(Date.now() / 200) * 0.05;
            return true;
        }
        
        // Reset animation properties if not animating
        if (!this.animating) {
            this.alpha = 1;
            this.scale = 1;
            this.rotation = 0;
        }
        
        return false;
    }
    
    /**
     * Sets the target position for the tile
     * @param {number} row - Target row
     * @param {number} col - Target column
     * @param {boolean} [falling=false] - Whether tile is falling
     */
    setTargetPosition(row, col, falling = false) {
        this.row = row;
        this.col = col;
        this.targetX = col * (GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_GAP);
        this.targetY = row * (GAME_CONFIG.TILE_SIZE + GAME_CONFIG.TILE_GAP);
        this.falling = falling;
        this.animating = true;
    }
    
    /**
     * Marks the tile as matched
     */
    setMatched() {
        this.matched = true;
        this.animating = true;
    }
    
    /**
     * Sets the selected state of the tile
     * @param {boolean} selected - Whether tile is selected
     */
    setSelected(selected) {
        this.selected = selected;
        this.animating = selected;
    }
    
    /**
     * Checks if tile is at its target position
     * @returns {boolean} True if at target position
     */
    isAtTargetPosition() {
        return this.x === this.targetX && this.y === this.targetY;
    }
    
    /**
     * Draws the tile on the canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} assets - Game assets including images
     */
    draw(ctx, assets) {
        if (this.alpha <= 0) return;
        
        ctx.save();
        
        // Set up transformation
        const centerX = this.x + GAME_CONFIG.TILE_SIZE / 2;
        const centerY = this.y + GAME_CONFIG.TILE_SIZE / 2;
        
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        ctx.globalAlpha = this.alpha;
        
        // Draw tile background
        const radius = GAME_CONFIG.TILE_SIZE * 0.15;
        const size = GAME_CONFIG.TILE_SIZE * 0.9;
        
        ctx.beginPath();
        ctx.roundRect(-size/2, -size/2, size, size, radius);
        
        // Set fill color based on tile type
        switch (this.type) {
            case ELEMENT_TYPES.FIRE:
                ctx.fillStyle = '#ff5722';
                break;
            case ELEMENT_TYPES.WATER:
                ctx.fillStyle = '#2196f3';
                break;
            case ELEMENT_TYPES.EARTH:
                ctx.fillStyle = '#8bc34a';
                break;
            case ELEMENT_TYPES.AIR:
                ctx.fillStyle = '#9c27b0';
                break;
            case ELEMENT_TYPES.LIGHT:
                ctx.fillStyle = '#ffeb3b';
                break;
            case ELEMENT_TYPES.BERRY:
                ctx.fillStyle = '#e91e63';
                break;
            default:
                ctx.fillStyle = '#888888';
        }
        
        ctx.fill();
        
        // Add inner shadow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size/2);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw icon based on type
        const iconSize = size * 0.6;
        
        // If we have assets with icons, use them
        if (assets && assets.icons && assets.icons[this.type]) {
            ctx.drawImage(
                assets.icons[this.type],
                -iconSize/2,
                -iconSize/2,
                iconSize,
                iconSize
            );
        } else {
            // Fallback icons using canvas drawing
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            
            switch (this.type) {
                case ELEMENT_TYPES.FIRE:
                    // Simple flame
                    ctx.beginPath();
                    ctx.moveTo(-iconSize/4, iconSize/3);
                    ctx.quadraticCurveTo(-iconSize/8, 0, 0, -iconSize/3);
                    ctx.quadraticCurveTo(iconSize/8, 0, iconSize/4, iconSize/3);
                    ctx.quadraticCurveTo(0, iconSize/6, -iconSize/4, iconSize/3);
                    ctx.fill();
                    break;
                    
                case ELEMENT_TYPES.WATER:
                    // Water drop
                    ctx.beginPath();
                    ctx.arc(0, 0, iconSize/4, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.beginPath();
                    ctx.moveTo(-iconSize/4, -iconSize/8);
                    ctx.quadraticCurveTo(0, -iconSize/2, iconSize/4, -iconSize/8);
                    ctx.fill();
                    break;
                    
                case ELEMENT_TYPES.EARTH:
                    // Leaf
                    ctx.beginPath();
                    ctx.ellipse(0, 0, iconSize/4, iconSize/3, Math.PI/4, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(iconSize/6, iconSize/6);
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.stroke();
                    break;
                    
                case ELEMENT_TYPES.AIR:
                    // Wind swirl
                    ctx.beginPath();
                    ctx.arc(0, 0, iconSize/4, 0, Math.PI * 1.5);
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.arc(iconSize/8, -iconSize/8, iconSize/8, 0, Math.PI * 1.5);
                    ctx.stroke();
                    break;
                    
                case ELEMENT_TYPES.LIGHT:
                    // Sun/star
                    ctx.beginPath();
                    for (let i = 0; i < 8; i++) {
                        const angle = i * Math.PI / 4;
                        const innerRadius = iconSize/8;
                        const outerRadius = iconSize/3;
                        
                        ctx.lineTo(
                            Math.cos(angle) * outerRadius,
                            Math.sin(angle) * outerRadius
                        );
                        
                        ctx.lineTo(
                            Math.cos(angle + Math.PI/8) * innerRadius,
                            Math.sin(angle + Math.PI/8) * innerRadius
                        );
                    }
                    ctx.closePath();
                    ctx.fill();
                    break;
                    
                case ELEMENT_TYPES.BERRY:
                    // Berry
                    ctx.beginPath();
                    ctx.arc(-iconSize/8, -iconSize/8, iconSize/6, 0, Math.PI * 2);
                    ctx.arc(iconSize/8, -iconSize/8, iconSize/6, 0, Math.PI * 2);
                    ctx.arc(0, iconSize/8, iconSize/6, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Leaf
                    ctx.beginPath();
                    ctx.ellipse(0, -iconSize/4, iconSize/10, iconSize/6, 0, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(139, 195, 74, 0.9)';
                    ctx.fill();
                    break;
            }
        }
        
        // Draw selection indicator
        if (this.selected) {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Glow effect
            ctx.shadowColor = 'white';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        
        ctx.restore();
    }
}

// ==========================================================================
// Board Class
// ==========================================================================

/**
 * Manages the match-3 game board
 */
class Board {
    /**
     * Create a new game board
     * @param {Object} options - Board configuration options
     */
    constructor(options = {}) {
        // Configuration
        this.size = options.size || GAME_CONFIG.BOARD_SIZE;
        this.tileSize = options.tileSize || GAME_CONFIG.TILE_SIZE;
        this.tileGap = options.tileGap || GAME_CONFIG.TILE_GAP;
        this.minMatchSize = options.minMatchSize || GAME_CONFIG.MIN_MATCH_SIZE;
        
        // Canvas and rendering
        this.canvas = null;
        this.ctx = null;
        
        // Game state
        this.tiles = [];
        this.selectedTile = null;
        this.swappingTiles = false;
        this.matchingTiles = false;
        this.fillingBoard = false;
        this.animating = false;
        this.enabled = false;
        this.matchCount = 0;
        
        // Input state
        this.inputEnabled = true;
        this.touchStartPos = null;
        this.mouseDown = false;
        
        // Animation timing
        this.lastFrameTime = 0;
        this.animationFrameId = null;
        
        // Match data
        this.currentMatches = [];
        this.comboCount = 0;
        this.cascadeCount = 0;
        
        // Assets
        this.assets = {
            icons: {}
        };
        
        // Bind methods
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.animate = this.animate.bind(this);
        
        // Initialize board
        this.initialize();
    }
    
    /**
     * Initializes the board and sets up event listeners
     */
    initialize() {
        // Create canvas
        this.canvas = document.getElementById(UI_SELECTORS.GAME_BOARD.substring(1));
        
        if (!this.canvas) {
            console.error('Game board canvas not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        const boardPixelSize = this.size * this.tileSize + (this.size - 1) * this.tileGap;
        this.canvas.width = boardPixelSize;
        this.canvas.height = boardPixelSize;
        
        // Add event listeners
        this.addEventListeners();
        
        // Create empty board
        this.createEmptyBoard();
        
        // Emit board created event
        EventSystem.emit(EVENTS.BOARD_CREATED, { board: this });
    }
    
    /**
     * Adds event listeners for user input
     */
    addEventListeners() {
        // Mouse events
        this.canvas.addEventListener('click', this.handleClick);
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        
        // Touch events
        this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchEnd);
        
        // Prevent context menu
        this.canvas.addEventListener('contextmenu', e => e.preventDefault());
    }
    
    /**
     * Removes event listeners
     */
    removeEventListeners() {
        this.canvas.removeEventListener('click', this.handleClick);
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        
        this.canvas.removeEventListener('touchstart', this.handleTouchStart);
        this.canvas.removeEventListener('touchmove', this.handleTouchMove);
        this.canvas.removeEventListener('touchend', this.handleTouchEnd);
        
        this.canvas.removeEventListener('contextmenu', e => e.preventDefault());
    }
    
    /**
     * Creates an empty board grid
     */
    createEmptyBoard() {
        this.tiles = [];
        
        // Create 2D array of null values
        for (let row = 0; row < this.size; row++) {
            this.tiles[row] = [];
            for (let col = 0; col < this.size; col++) {
                this.tiles[row][col] = null;
            }
        }
    }
    
    /**
     * Fills the board with random tiles
     * @param {boolean} [checkForMatches=true] - Whether to check and prevent initial matches
     * @returns {Promise} Promise that resolves when board is filled
     */
    fillBoard(checkForMatches = true) {
        return new Promise(resolve => {
            this.fillingBoard = true;
            
            // Create tiles for each position
            for (let row = 0; row < this.size; row++) {
                for (let col = 0; col < this.size; col++) {
                    // Generate a valid tile type
                    let tileType;
                    
                    if (checkForMatches) {
                        // Keep generating types until we find one that doesn't create a match
                        do {
                            tileType = this.getRandomTileType();
                        } while (this.wouldCreateMatch(row, col, tileType));
                    } else {
                        tileType = this.getRandomTileType();
                    }
                    
                    // Create the tile
                    const tile = new Tile(tileType, row, col);
                    this.tiles[row][col] = tile;
                }
            }
            
            // Verify board has valid moves
            if (!this.hasPossibleMoves()) {
                // If no valid moves, refill the board
                this.fillBoard(checkForMatches);
                return;
            }
            
            // Start animation loop if not already running
            if (!this.animationFrameId) {
                this.lastFrameTime = performance.now();
                this.animationFrameId = requestAnimationFrame(this.animate);
            }
            
            this.fillingBoard = false;
            
            // Emit board refilled event
            EventSystem.emit(EVENTS.BOARD_REFILLED, { board: this });
            
            resolve();
        });
    }
    
    /**
     * Gets a random tile type based on element distribution
     * @returns {string} Random element type
     */
    getRandomTileType() {
        return getWeightedRandomElement();
    }
    
    /**
     * Checks if placing a tile type at a position would create a match
     * @param {number} row - Row position
     * @param {number} col - Column position
     * @param {string} tileType - Element type to check
     * @returns {boolean} True if it would create a match
     */
    wouldCreateMatch(row, col, tileType) {
        // Check horizontal match (need at least 2 same tiles to the left)
        if (col >= 2) {
            if (this.tiles[row][col-1] && 
                this.tiles[row][col-2] && 
                this.tiles[row][col-1].type === tileType && 
                this.tiles[row][col-2].type === tileType) {
                return true;
            }
        }
        
        // Check vertical match (need at least 2 same tiles above)
        if (row >= 2) {
            if (this.tiles[row-1][col] && 
                this.tiles[row-2][col] && 
                this.tiles[row-1][col].type === tileType && 
                this.tiles[row-2][col].type === tileType) {
                return true;
            }
        }
        
        // Check for "split" matches (e.g. X O X, where O is the new tile)
        // Horizontal split
        if (col >= 1 && col < this.size - 1) {
            if (this.tiles[row][col-1] && 
                this.tiles[row][col+1] && 
                this.tiles[row][col-1].type === tileType && 
                this.tiles[row][col+1].type === tileType) {
                return true;
            }
        }
        
        // Vertical split
        if (row >= 1 && row < this.size - 1) {
            if (this.tiles[row-1][col] && 
                this.tiles[row+1][col] && 
                this.tiles[row-1][col].type === tileType && 
                this.tiles[row+1][col].type === tileType) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Checks if the board has any possible moves
     * @returns {boolean} True if there are possible moves
     */
    hasPossibleMoves() {
        // Check each tile for potential swaps that would create a match
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const tile = this.tiles[row][col];
                if (!tile) continue;
                
                // Check swap with right neighbor
                if (col < this.size - 1) {
                    const rightTile = this.tiles[row][col + 1];
                    if (rightTile) {
                        // Temporarily swap tiles
                        this.tiles[row][col] = rightTile;
                        this.tiles[row][col + 1] = tile;
                        
                        // Check for matches
                        const hasMatch = this.findMatchesAt(row, col).length > 0 || 
                                         this.findMatchesAt(row, col + 1).length > 0;
                        
                        // Swap back
                        this.tiles[row][col] = tile;
                        this.tiles[row][col + 1] = rightTile;
                        
                        if (hasMatch) {
                            return true;
                        }
                    }
                }
                
                // Check swap with bottom neighbor
                if (row < this.size - 1) {
                    const bottomTile = this.tiles[row + 1][col];
                    if (bottomTile) {
                        // Temporarily swap tiles
                        this.tiles[row][col] = bottomTile;
                        this.tiles[row + 1][col] = tile;
                        
                        // Check for matches
                        const hasMatch = this.findMatchesAt(row, col).length > 0 || 
                                         this.findMatchesAt(row + 1, col).length > 0;
                        
                        // Swap back
                        this.tiles[row][col] = tile;
                        this.tiles[row + 1][col] = bottomTile;
                        
                        if (hasMatch) {
                            return true;
                        }
                    }
                }
            }
        }
        
        return false;
    }
    
    /**
     * Finds all matches on the board
     * @returns {Array} Array of matches, each containing tiles
     */
    findAllMatches() {
        const allMatches = [];
        const matchedTiles = new Set();
        
        // Check horizontal matches
        for (let row = 0; row < this.size; row++) {
            let matchStart = 0;
            let matchLength = 1;
            let currentType = null;
            
            for (let col = 0; col < this.size; col++) {
                const tile = this.tiles[row][col];
                
                if (tile && currentType === tile.type) {
                    // Continue current match
                    matchLength++;
                } else {
                    // Check if previous sequence was a match
                    if (matchLength >= this.minMatchSize && currentType) {
                        const match = {
                            type: 'horizontal',
                            element: currentType,
                            row: row,
                            startCol: matchStart,
                            endCol: col - 1,
                            length: matchLength,
                            tiles: []
                        };
                        
                        // Add tiles to match
                        for (let i = matchStart; i < col; i++) {
                            const matchTile = this.tiles[row][i];
                            match.tiles.push(matchTile);
                            matchedTiles.add(`${row},${i}`);
                        }
                        
                        allMatches.push(match);
                    }
                    
                    // Start new potential match
                    currentType = tile ? tile.type : null;
                    matchStart = col;
                    matchLength = currentType ? 1 : 0;
                }
            }
            
            // Check for match at the end of the row
            if (matchLength >= this.minMatchSize && currentType) {
                const match = {
                    type: 'horizontal',
                    element: currentType,
                    row: row,
                    startCol: matchStart,
                    endCol: this.size - 1,
                    length: matchLength,
                    tiles: []
                };
                
                for (let i = matchStart; i < this.size; i++) {
                    const matchTile = this.tiles[row][i];
                    match.tiles.push(matchTile);
                    matchedTiles.add(`${row},${i}`);
                }
                
                allMatches.push(match);
            }
        }
        
        // Check vertical matches
        for (let col = 0; col < this.size; col++) {
            let matchStart = 0;
            let matchLength = 1;
            let currentType = null;
            
            for (let row = 0; row < this.size; row++) {
                const tile = this.tiles[row][col];
                
                if (tile && currentType === tile.type) {
                    // Continue current match
                    matchLength++;
                } else {
                    // Check if previous sequence was a match
                    if (matchLength >= this.minMatchSize && currentType) {
                        const match = {
                            type: 'vertical',
                            element: currentType,
                            col: col,
                            startRow: matchStart,
                            endRow: row - 1,
                            length: matchLength,
                            tiles: []
                        };
                        
                        // Add tiles to match
                        for (let i = matchStart; i < row; i++) {
                            const matchTile = this.tiles[i][col];
                            match.tiles.push(matchTile);
                            matchedTiles.add(`${i},${col}`);
                        }
                        
                        allMatches.push(match);
                    }
                    
                    // Start new potential match
                    currentType = tile ? tile.type : null;
                    matchStart = row;
                    matchLength = currentType ? 1 : 0;
                }
            }
            
            // Check for match at the end of the column
            if (matchLength >= this.minMatchSize && currentType) {
                const match = {
                    type: 'vertical',
                    element: currentType,
                    col: col,
                    startRow: matchStart,
                    endRow: this.size - 1,
                    length: matchLength,
                    tiles: []
                };
                
                for (let i = matchStart; i < this.size; i++) {
                    const matchTile = this.tiles[i][col];
                    match.tiles.push(matchTile);
                    matchedTiles.add(`${i},${col}`);
                }
                
                allMatches.push(match);
            }
        }
        
        // Populate match size and other metadata
        allMatches.forEach(match => {
            match.size = match.tiles.length;
        });
        
        return allMatches;
    }
    
    /**
     * Finds matches at a specific position
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {Array} Array of matches
     */
    findMatchesAt(row, col) {
        const matches = [];
        const tile = this.tiles[row][col];
        
        if (!tile) return matches;
        
        const tileType = tile.type;
        
        // Check horizontal matches
        let horizontalMatch = [{ row, col }];
        
        // Check left
        let leftCol = col - 1;
        while (leftCol >= 0 && this.tiles[row][leftCol] && this.tiles[row][leftCol].type === tileType) {
            horizontalMatch.push({ row, col: leftCol });
            leftCol--;
        }
        
        // Check right
        let rightCol = col + 1;
        while (rightCol < this.size && this.tiles[row][rightCol] && this.tiles[row][rightCol].type === tileType) {
            horizontalMatch.push({ row, col: rightCol });
            rightCol++;
        }
        
        // If we have at least 3 in a row
        if (horizontalMatch.length >= this.minMatchSize) {
            matches.push({
                type: 'horizontal',
                element: tileType,
                row: row,
                startCol: leftCol + 1,
                endCol: rightCol - 1,
                length: horizontalMatch.length,
                tiles: horizontalMatch.map(pos => this.tiles[pos.row][pos.col]),
                size: horizontalMatch.length
            });
        }
        
        // Check vertical matches
        let verticalMatch = [{ row, col }];
        
        // Check up
        let upRow = row - 1;
        while (upRow >= 0 && this.tiles[upRow][col] && this.tiles[upRow][col].type === tileType) {
            verticalMatch.push({ row: upRow, col });
            upRow--;
        }
        
        // Check down
        let downRow = row + 1;
        while (downRow < this.size && this.tiles[downRow][col] && this.tiles[downRow][col].type === tileType) {
            verticalMatch.push({ row: downRow, col });
            downRow++;
        }
        
        // If we have at least 3 in a column
        if (verticalMatch.length >= this.minMatchSize) {
            matches.push({
                type: 'vertical',
                element: tileType,
                col: col,
                startRow: upRow + 1,
                endRow: downRow - 1,
                length: verticalMatch.length,
                tiles: verticalMatch.map(pos => this.tiles[pos.row][pos.col]),
                size: verticalMatch.length
            });
        }
        
        return matches;
    }
    
    /**
     * Processes matches by removing matched tiles and updating the board
     * @param {Array} matches - Array of matches to process
     * @returns {Object} Match results with elements and counts
     */
    processMatches(matches) {
        if (matches.length === 0) return null;
        
        this.matchingTiles = true;
        this.currentMatches = matches;
        
        // Track matched elements for gameplay effects
        const matchResults = {
            elements: {},
            totalTiles: 0,
            largestMatch: 0,
            extraMove: false
        };
        
        // Mark all tiles in matches as matched
        matches.forEach(match => {
            // Track match statistics
            matchResults.totalTiles += match.tiles.length;
            matchResults.largestMatch = Math.max(matchResults.largestMatch, match.tiles.length);
            
            // Track elements matched
            if (!matchResults.elements[match.element]) {
                matchResults.elements[match.element] = 0;
            }
            matchResults.elements[match.element] += match.tiles.length;
            
            // Check for extra move (match of 4 or more)
            if (match.tiles.length >= GAME_CONFIG.EXTRA_MOVE_MATCH_SIZE) {
                matchResults.extraMove = true;
            }
            
            // Mark tiles as matched
            match.tiles.forEach(tile => {
                tile.setMatched();
            });
        });
        
        // Increment match count
        this.matchCount++;
        
        // Emit match found event
        EventSystem.emit(EVENTS.MATCH_FOUND, {
            matches,
            matchResults,
            comboCount: this.comboCount,
            cascadeCount: this.cascadeCount
        });
        
        return matchResults;
    }
    
    /**
     * Removes matched tiles from the board
     * @returns {boolean} True if any tiles were removed
     */
    removeMatchedTiles() {
        let tilesRemoved = false;
        
        // Check each position for matched tiles
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const tile = this.tiles[row][col];
                
                if (tile && tile.matched && tile.alpha <= 0.1) {
                    // Remove the tile
                    this.tiles[row][col] = null;
                    tilesRemoved = true;
                }
            }
        }
        
        return tilesRemoved;
    }
    
    /**
     * Makes tiles fall to fill empty spaces
     * @returns {boolean} True if any tiles were moved
     */
    applyGravity() {
        let tilesMoved = false;
        
        // Process each column from bottom to top
        for (let col = 0; col < this.size; col++) {
            // Find the lowest empty space
            for (let row = this.size - 1; row >= 0; row--) {
                if (this.tiles[row][col] === null) {
                    // Find the nearest tile above this empty space
                    let sourceRow = row - 1;
                    while (sourceRow >= 0 && this.tiles[sourceRow][col] === null) {
                        sourceRow--;
                    }
                    
                    // If we found a tile, move it down
                    if (sourceRow >= 0) {
                        const tile = this.tiles[sourceRow][col];
                        this.tiles[sourceRow][col] = null;
                        this.tiles[row][col] = tile;
                        
                        // Update tile position
                        tile.setTargetPosition(row, col, true);
                        tilesMoved = true;
                    }
                }
            }
        }
        
        return tilesMoved;
    }
    
    /**
     * Fills empty spaces with new tiles
     * @returns {boolean} True if any new tiles were created
     */
    fillEmptySpaces() {
        let tilesCreated = false;
        
        // Check each position for empty spaces
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.tiles[row][col] === null) {
                    // Create a new tile
                    const tileType = this.getRandomTileType();
                    const tile = new Tile(tileType, row, col);
                    
                    // Start the tile above the board
                    tile.y = -this.tileSize;
                    tile.setTargetPosition(row, col, true);
                    
                    // Add to board
                    this.tiles[row][col] = tile;
                    tilesCreated = true;
                }
            }
        }
        
        return tilesCreated;
    }
    
    /**
     * Handles the complete match-cascade cycle
     * @returns {Promise} Promise that resolves when all cascades are complete
     */
    async handleMatchCascade() {
        this.cascadeCount = 0;
        let cascading = true;
        
        while (cascading) {
            // Find and process matches
            const matches = this.findAllMatches();
            
            if (matches.length > 0) {
                // Process matches
                this.processMatches(matches);
                
                // Wait for match animations to complete
                await this.waitForAnimationsToComplete();
                
                // Remove matched tiles
                this.removeMatchedTiles();
                
                // Apply gravity to make tiles fall
                this.applyGravity();
                
                // Wait for falling animations to complete
                await this.waitForAnimationsToComplete();
                
                // Fill empty spaces with new tiles
                this.fillEmptySpaces();
                
                // Wait for new tiles to fall into place
                await this.waitForAnimationsToComplete();
                
                // Increment cascade count
                this.cascadeCount++;
            } else {
                // No more matches, end cascade
                cascading = false;
            }
        }
        
        // Reset cascade count
        this.cascadeCount = 0;
        this.matchingTiles = false;
        
        // Emit board refilled event
        EventSystem.emit(EVENTS.BOARD_REFILLED, { board: this });
        
        return true;
    }
    
    /**
     * Waits for all tile animations to complete
     * @returns {Promise} Promise that resolves when animations complete
     */
    waitForAnimationsToComplete() {
        return new Promise(resolve => {
            const checkAnimations = () => {
                let stillAnimating = false;
                
                // Check all tiles for ongoing animations
                for (let row = 0; row < this.size; row++) {
                    for (let col = 0; col < this.size; col++) {
                        const tile = this.tiles[row][col];
                        if (tile && (tile.animating || !tile.isAtTargetPosition())) {
                            stillAnimating = true;
                            break;
                        }
                    }
                    if (stillAnimating) break;
                }
                
                if (stillAnimating) {
                    // Check again in the next frame
                    requestAnimationFrame(checkAnimations);
                } else {
                    // All animations complete
                    resolve();
                }
            };
            
            // Start checking animations
            checkAnimations();
        });
    }
    
    /**
     * Swaps two tiles on the board
     * @param {Tile} tile1 - First tile
     * @param {Tile} tile2 - Second tile
     * @returns {Promise} Promise that resolves when swap is complete
     */
    swapTiles(tile1, tile2) {
        return new Promise(async (resolve) => {
            if (!tile1 || !tile2) {
                resolve(false);
                return;
            }
            
            // Prevent input during swap
            this.swappingTiles = true;
            
            // Get tile positions
            const row1 = tile1.row;
            const col1 = tile1.col;
            const row2 = tile2.row;
            const col2 = tile2.col;
            
            // Swap tiles in the grid
            this.tiles[row1][col1] = tile2;
            this.tiles[row2][col2] = tile1;
            
            // Update tile positions
            tile1.setTargetPosition(row2, col2);
            tile2.setTargetPosition(row1, col1);
            
            // Emit tile swapped event
            EventSystem.emit(EVENTS.TILE_SWAPPED, {
                tile1,
                tile2,
                validSwap: true
            });
            
            // Wait for swap animation to complete
            await this.waitForAnimationsToComplete();
            
            // Check for matches after swap
            const matches = this.findAllMatches();
            
            if (matches.length > 0) {
                // Valid swap with matches
                this.comboCount = 0;
                await this.handleMatchCascade();
                this.swappingTiles = false;
                resolve(true);
            } else {
                // Invalid swap, swap back
                this.tiles[row1][col1] = tile1;
                this.tiles[row2][col2] = tile2;
                
                tile1.setTargetPosition(row1, col1);
                tile2.setTargetPosition(row2, col2);
                
                // Emit tile swapped event for the swap back
                EventSystem.emit(EVENTS.TILE_SWAPPED, {
                    tile1,
                    tile2,
                    validSwap: false
                });
                
                // Wait for swap back animation to complete
                await this.waitForAnimationsToComplete();
                
                this.swappingTiles = false;
                resolve(false);
            }
        });
    }
    
    /**
     * Gets the tile at a specific pixel position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Tile|null} Tile at position or null
     */
    getTileAtPosition(x, y) {
        // Convert pixel position to grid coordinates
        const col = Math.floor(x / (this.tileSize + this.tileGap));
        const row = Math.floor(y / (this.tileSize + this.tileGap));
        
        // Check if coordinates are within bounds
        if (row >= 0 && row < this.size && col >= 0 && col < this.size) {
            return this.tiles[row][col];
        }
        
        return null;
    }
    
    /**
     * Handles mouse click on the board
     * @param {MouseEvent} event - Click event
     */
    handleClick(event) {
        if (!this.inputEnabled || this.swappingTiles || this.matchingTiles || !this.enabled) {
            return;
        }
        
        // Get click position relative to canvas
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Get tile at position
        const tile = this.getTileAtPosition(x, y);
        
        // Emit tile clicked event
        EventSystem.emit(EVENTS.TILE_CLICKED, { tile });
        
        if (!tile) return;
        
        // Handle tile selection
        if (!this.selectedTile) {
            // Select this tile
            this.selectedTile = tile;
            tile.setSelected(true);
        } else if (this.selectedTile === tile) {
            // Deselect if clicking the same tile
            this.selectedTile.setSelected(false);
            this.selectedTile = null;
        } else {
            // Check if tiles are adjacent
            const isAdjacent = (
                (Math.abs(this.selectedTile.row - tile.row) === 1 && this.selectedTile.col === tile.col) ||
                (Math.abs(this.selectedTile.col - tile.col) === 1 && this.selectedTile.row === tile.row)
            );
            
            if (isAdjacent) {
                // Attempt to swap tiles
                const firstTile = this.selectedTile;
                this.selectedTile.setSelected(false);
                this.selectedTile = null;
                
                this.swapTiles(firstTile, tile);
            } else {
                // Not adjacent, select the new tile instead
                this.selectedTile.setSelected(false);
                this.selectedTile = tile;
                tile.setSelected(true);
            }
        }
    }
    
    /**
     * Handles mouse down event
     * @param {MouseEvent} event - Mouse down event
     */
    handleMouseDown(event) {
        if (!this.inputEnabled || this.swappingTiles || this.matchingTiles || !this.enabled) {
            return;
        }
        
        this.mouseDown = true;
        
        // Get position relative to canvas
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Store the starting tile
        this.startTile = this.getTileAtPosition(x, y);
    }
    
    /**
     * Handles mouse move event
     * @param {MouseEvent} event - Mouse move event
     */
    handleMouseMove(event) {
        if (!this.mouseDown || !this.startTile || !this.inputEnabled || 
            this.swappingTiles || this.matchingTiles || !this.enabled) {
            return;
        }
        
        // Get position relative to canvas
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Get current tile
        const currentTile = this.getTileAtPosition(x, y);
        
        // Check if we've moved to a different tile
        if (currentTile && currentTile !== this.startTile) {
            // Check if tiles are adjacent
            const isAdjacent = (
                (Math.abs(this.startTile.row - currentTile.row) === 1 && this.startTile.col === currentTile.col) ||
                (Math.abs(this.startTile.col - currentTile.col) === 1 && this.startTile.row === currentTile.row)
            );
            
            if (isAdjacent) {
                // Attempt to swap tiles
                this.mouseDown = false;
                this.swapTiles(this.startTile, currentTile);
                this.startTile = null;
            }
        }
    }
    
    /**
     * Handles mouse up event
     * @param {MouseEvent} event - Mouse up event
     */
    handleMouseUp(event) {
        this.mouseDown = false;
        this.startTile = null;
    }
    
    /**
     * Handles touch start event
     * @param {TouchEvent} event - Touch start event
     */
    handleTouchStart(event) {
        if (!this.inputEnabled || this.swappingTiles || this.matchingTiles || !this.enabled) {
            return;
        }
        
        // Prevent default to avoid scrolling
        event.preventDefault();
        
        // Get position relative to canvas
        const rect = this.canvas.getBoundingClientRect();
        const touch = event.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        // Store the starting position and tile
        this.touchStartPos = { x, y };
        this.startTile = this.getTileAtPosition(x, y);
        
        // If a tile is already selected, handle it like a click
        if (this.selectedTile && this.startTile) {
            if (this.selectedTile === this.startTile) {
                // Deselect if touching the same tile
                this.selectedTile.setSelected(false);
                this.selectedTile = null;
            } else {
                // Check if tiles are adjacent
                const isAdjacent = (
                    (Math.abs(this.selectedTile.row - this.startTile.row) === 1 && this.selectedTile.col === this.startTile.col) ||
                    (Math.abs(this.selectedTile.col - this.startTile.col) === 1 && this.selectedTile.row === this.startTile.row)
                );
                
                if (isAdjacent) {
                    // Attempt to swap tiles
                    const firstTile = this.selectedTile;
                    this.selectedTile.setSelected(false);
                    this.selectedTile = null;
                    
                    this.swapTiles(firstTile, this.startTile);
                    this.startTile = null;
                } else {
                    // Not adjacent, select the new tile instead
                    this.selectedTile.setSelected(false);
                    this.selectedTile = this.startTile;
                    this.startTile.setSelected(true);
                }
            }
        }
    }
    
    /**
     * Handles touch move event
     * @param {TouchEvent} event - Touch move event
     */
    handleTouchMove(event) {
        if (!this.startTile || !this.touchStartPos || !this.inputEnabled || 
            this.swappingTiles || this.matchingTiles || !this.enabled) {
            return;
        }
        
        // Prevent default to avoid scrolling
        event.preventDefault();
        
        // Get position relative to canvas
        const rect = this.canvas.getBoundingClientRect();
        const touch = event.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        // Calculate distance moved
        const dx = x - this.touchStartPos.x;
        const dy = y - this.touchStartPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only process if moved enough distance
        if (distance > this.tileSize / 3) {
            // Determine swipe direction
            let direction;
            if (Math.abs(dx) > Math.abs(dy)) {
                direction = dx > 0 ? 'right' : 'left';
            } else {
                direction = dy > 0 ? 'down' : 'up';
            }
            
            // Find the adjacent tile in that direction
            let adjacentTile = null;
            
            switch (direction) {
                case 'right':
                    if (this.startTile.col < this.size - 1) {
                        adjacentTile = this.tiles[this.startTile.row][this.startTile.col + 1];
                    }
                    break;
                case 'left':
                    if (this.startTile.col > 0) {
                        adjacentTile = this.tiles[this.startTile.row][this.startTile.col - 1];
                    }
                    break;
                case 'down':
                    if (this.startTile.row < this.size - 1) {
                        adjacentTile = this.tiles[this.startTile.row + 1][this.startTile.col];
                    }
                    break;
                case 'up':
                    if (this.startTile.row > 0) {
                        adjacentTile = this.tiles[this.startTile.row - 1][this.startTile.col];
                    }
                    break;
            }
            
            // If we found an adjacent tile, attempt to swap
            if (adjacentTile) {
                this.touchStartPos = null;
                this.swapTiles(this.startTile, adjacentTile);
                this.startTile = null;
            }
        }
    }
    
    /**
     * Handles touch end event
     * @param {TouchEvent} event - Touch end event
     */
    handleTouchEnd(event) {
        // If the touch didn't move much, treat it as a tap/click
        if (this.startTile && this.touchStartPos && !this.selectedTile) {
            // Select the tile
            this.selectedTile = this.startTile;
            this.startTile.setSelected(true);
        }
        
        this.touchStartPos = null;
        this.startTile = null;
    }
    
    /**
     * Renders the game board
     * @param {number} deltaTime - Time since last frame in milliseconds
     */
    render(deltaTime) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background grid
        this.drawGrid();
        
        // Update and draw tiles
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const tile = this.tiles[row][col];
                if (tile) {
                    // Update tile animation
                    tile.update(deltaTime);
                    
                    // Draw tile
                    tile.draw(this.ctx, this.assets);
                }
            }
        }
        
        // Draw selection highlight if needed
        if (this.selectedTile) {
            this.drawSelectionHighlight(this.selectedTile);
        }
    }
    
    /**
     * Draws the background grid
     */
    drawGrid() {
        // Draw board background
        this.ctx.fillStyle = 'rgba(40, 59, 91, 0.6)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid lines
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let i = 1; i < this.size; i++) {
            const x = i * (this.tileSize + this.tileGap) - this.tileGap / 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let i = 1; i < this.size; i++) {
            const y = i * (this.tileSize + this.tileGap) - this.tileGap / 2;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    /**
     * Draws a highlight around the selected tile
     * @param {Tile} tile - The selected tile
     */
    drawSelectionHighlight(tile) {
        // Draw a pulsing glow around the selected tile
        const time = Date.now() / 1000;
        const pulseSize = 4 + Math.sin(time * 4) * 2;
        
        this.ctx.save();
        
        // Draw outer glow
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.lineWidth = pulseSize;
        this.ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        this.ctx.shadowBlur = 15;
        
        const x = tile.x + this.tileSize / 2;
        const y = tile.y + this.tileSize / 2;
        const size = this.tileSize * 0.9;
        
        this.ctx.beginPath();
        this.ctx.roundRect(
            x - size/2 - pulseSize/2,
            y - size/2 - pulseSize/2,
            size + pulseSize,
            size + pulseSize,
            this.tileSize * 0.15
        );
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    /**
     * Animation loop
     * @param {number} timestamp - Current timestamp
     */
    animate(timestamp) {
        // Calculate delta time
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        
        // Render the board
        this.render(deltaTime);
        
        // Continue animation loop
        this.animationFrameId = requestAnimationFrame(this.animate);
    }
    
    /**
     * Enables the board for player interaction
     */
    enable() {
        this.enabled = true;
        this.inputEnabled = true;
    }
    
    /**
     * Disables the board to prevent player interaction
     */
    disable() {
        this.enabled = false;
        this.inputEnabled = false;
        
        // Deselect any selected tile
        if (this.selectedTile) {
            this.selectedTile.setSelected(false);
            this.selectedTile = null;
        }
    }
    
    /**
     * Shuffles the board when no moves are available
     * @returns {Promise} Promise that resolves when shuffle is complete
     */
    shuffleBoard() {
        return new Promise(async (resolve) => {
            // Disable input during shuffle
            this.disable();
            
            // Collect all tiles
            const allTiles = [];
            for (let row = 0; row < this.size; row++) {
                for (let col = 0; col < this.size; col++) {
                    if (this.tiles[row][col]) {
                        allTiles.push(this.tiles[row][col]);
                    }
                }
            }
            
            // Shuffle tile positions
            const shuffledPositions = [];
            for (let row = 0; row < this.size; row++) {
                for (let col = 0; col < this.size; col++) {
                    if (this.tiles[row][col]) {
                        shuffledPositions.push({ row, col });
                    }
                }
            }
            
            // Shuffle positions
            shuffleArray(shuffledPositions);
            
            // Clear the board
            this.createEmptyBoard();
            
            // Place tiles in new positions
            for (let i = 0; i < allTiles.length; i++) {
                const tile = allTiles[i];
                const newPos = shuffledPositions[i];
                
                tile.setTargetPosition(newPos.row, newPos.col);
                this.tiles[newPos.row][newPos.col] = tile;
            }
            
            // Wait for animations to complete
            await this.waitForAnimationsToComplete();
            
            // Check if the new board has valid moves
            if (!this.hasPossibleMoves()) {
                // If still no valid moves, try again
                await this.shuffleBoard();
            } else {
                // Re-enable the board
                this.enable();
                
                // Log the shuffle
                GameLogger.log('Board has been shuffled to create new matches!', 'system');
                
                resolve();
            }
        });
    }
    
    /**
     * Gets possible matches that can be made with the current board
     * @returns {Array} Array of possible matches
     */
    getPossibleMatches() {
        const possibleMatches = [];
        
        // Check each tile for potential swaps that would create a match
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const tile = this.tiles[row][col];
                if (!tile) continue;
                
                // Check swap with right neighbor
                if (col < this.size - 1) {
                    const rightTile = this.tiles[row][col + 1];
                    if (rightTile) {
                        // Temporarily swap tiles
                        this.tiles[row][col] = rightTile;
                        this.tiles[row][col + 1] = tile;
                        
                        // Check for matches
                        const matches = [
                            ...this.findMatchesAt(row, col),
                            ...this.findMatchesAt(row, col + 1)
                        ];
                        
                        // Swap back
                        this.tiles[row][col] = tile;
                        this.tiles[row][col + 1] = rightTile;
                        
                        if (matches.length > 0) {
                            possibleMatches.push({
                                tile1: { row, col, type: tile.type },
                                tile2: { row, col: col + 1, type: rightTile.type },
                                matches,
                                direction: 'right',
                                element: matches[0].element,
                                size: matches[0].size
                            });
                        }
                    }
                }
                
                // Check swap with bottom neighbor
                if (row < this.size - 1) {
                    const bottomTile = this.tiles[row + 1][col];
                    if (bottomTile) {
                        // Temporarily swap tiles
                        this.tiles[row][col] = bottomTile;
                        this.tiles[row + 1][col] = tile;
                        
                        // Check for matches
                        const matches = [
                            ...this.findMatchesAt(row, col),
                            ...this.findMatchesAt(row + 1, col)
                        ];
                        
                        // Swap back
                        this.tiles[row][col] = tile;
                        this.tiles[row + 1][col] = bottomTile;
                        
                        if (matches.length > 0) {
                            possibleMatches.push({
                                tile1: { row, col, type: tile.type },
                                tile2: { row: row + 1, col, type: bottomTile.type },
                                matches,
                                direction: 'down',
                                element: matches[0].element,
                                size: matches[0].size
                            });
                        }
                    }
                }
            }
        }
        
        return possibleMatches;
    }
    
    /**
     * Provides a hint by highlighting a possible match
     * @returns {boolean} True if a hint was shown
     */
    showHint() {
        // Get possible matches
        const possibleMatches = this.getPossibleMatches();
        
        if (possibleMatches.length === 0) {
            return false;
        }
        
        // Select a random match from the possibilities
        const hint = getRandomArrayElement(possibleMatches);
        
        // Highlight the tiles
        const tile1 = this.tiles[hint.tile1.row][hint.tile1.col];
        const tile2 = this.tiles[hint.tile2.row][hint.tile2.col];
        
        // Animate the hint
        const animateHint = async () => {
            // Pulse animation on both tiles
            for (let i = 0; i < 3; i++) {
                tile1.scale = 1.2;
                tile2.scale = 1.2;
                tile1.animating = true;
                tile2.animating = true;
                
                await delay(300);
                
                tile1.scale = 1.0;
                tile2.scale = 1.0;
                
                await delay(200);
            }
            
            tile1.animating = false;
            tile2.animating = false;
        };
        
        animateHint();
        
        return true;
    }
    
    /**
     * Makes an AI move on the board
     * @param {Function} aiDecisionCallback - Callback to get AI decision
     * @returns {Promise} Promise that resolves when AI move is complete
     */
    async makeAIMove(aiDecisionCallback) {
        // Disable player input
        this.disable();
        
        // Get possible matches
        const possibleMatches = this.getPossibleMatches();
        
        if (possibleMatches.length === 0) {
            // No possible matches, shuffle the board
            await this.shuffleBoard();
            this.enable();
            return null;
        }
        
        // Get AI decision
        const decision = aiDecisionCallback(possibleMatches);
        
        if (!decision || decision.action !== 'match') {
            this.enable();
            return null;
        }
        
        // Get the chosen match
        const match = decision.match;
        
        // Get the tiles
        const tile1 = this.tiles[match.tile1.row][match.tile1.col];
        const tile2 = this.tiles[match.tile2.row][match.tile2.col];
        
        // Highlight the chosen tiles briefly
        tile1.scale = 1.2;
        tile2.scale = 1.2;
        tile1.animating = true;
        tile2.animating = true;
        
        await delay(500);
        
        tile1.scale = 1.0;
        tile2.scale = 1.0;
        
        // Swap the tiles
        const swapResult = await this.swapTiles(tile1, tile2);
        
        // Re-enable player input
        this.enable();
        
        return {
            tile1,
            tile2,
            match,
            success: swapResult
        };
    }
    
    /**
     * Cleans up resources when board is destroyed
     */
    destroy() {
        // Stop animation loop
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Remove event listeners
        this.removeEventListeners();
        
        // Clear board data
        this.tiles = [];
        this.selectedTile = null;
    }
    
    /**
     * Resets the board for a new game
     */
    reset() {
        // Clear board
        this.createEmptyBoard();
        
        // Reset state
        this.selectedTile = null;
        this.swappingTiles = false;
        this.matchingTiles = false;
        this.fillingBoard = false;
        this.animating = false;
        this.matchCount = 0;
        this.comboCount = 0;
        this.cascadeCount = 0;
        
        // Enable the board
        this.enable();
    }
}

// Export the Board class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Tile,
        Board
    };
}
