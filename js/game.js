/**
 * Match Monsters - Game Module
 * This file contains the main game logic and state management.
 */

// ==========================================================================
// Game Class
// ==========================================================================

/**
 * Main game class that manages the entire game state and flow
 */
class Game {
    /**
     * Creates a new game instance
     */
    constructor() {
        // Game systems
        this.board = null;
        this.monsterManager = null;
        this.ui = null;
        this.ai = null;
        
        // Game state
        this.state = {
            currentState: GAME_STATES.MENU,
            currentPlayer: null,
            firstPlayer: null,
            secondPlayer: null,
            gameMode: null,
            movesRemaining: {
                [PLAYERS.PLAYER1]: GAME_CONFIG.MOVES_PER_TURN,
                [PLAYERS.PLAYER2]: GAME_CONFIG.MOVES_PER_TURN
            },
            extraMoveAvailable: {
                [PLAYERS.PLAYER1]: false,
                [PLAYERS.PLAYER2]: false
            },
            playerHP: {
                [PLAYERS.PLAYER1]: GAME_CONFIG.STARTING_HP,
                [PLAYERS.PLAYER2]: GAME_CONFIG.STARTING_HP
            },
            turnCount: 0,
            matchCount: 0,
            moveCount: 0,
            gameStartTime: null,
            isPaused: false,
            isAIEnabled: false,
            aiDifficulty: 'normal',
            selectedStage: null
        };
        
        // Game statistics
        this.stats = {
            gamesPlayed: 0,
            gamesWon: {
                [PLAYERS.PLAYER1]: 0,
                [PLAYERS.PLAYER2]: 0
            },
            totalMatches: 0,
            totalMoves: 0,
            totalEvolutions: 0,
            totalBoosts: 0,
            totalDamageDealt: 0,
            longestGame: 0, // in turns
            fastestWin: Infinity, // in turns
            highestCombo: 0
        };
        
        // Bind event handlers
        this.handleTileClicked = this.handleTileClicked.bind(this);
        this.handleModeSelected = this.handleModeSelected.bind(this);
        this.handleMonsterSelected = this.handleMonsterSelected.bind(this);
        this.handleMonstersSelected = this.handleMonstersSelected.bind(this);
        this.handleMatchFound = this.handleMatchFound.bind(this);
        this.handleEvolveButtonClicked = this.handleEvolveButtonClicked.bind(this);
        this.handleBoostButtonClicked = this.handleBoostButtonClicked.bind(this);
        this.handleRequestMonsterInfo = this.handleRequestMonsterInfo.bind(this);
        
        // Initialize game
        this.initialize();
    }
    
    /**
     * Initializes the game systems and loads saved data
     */
    initialize() {
        // Create game systems
        this.ui = createUI();
        this.monsterManager = new MonsterManager();
        
        // Load saved statistics
        this.loadStats();
        
        // Register event listeners
        this.registerEventListeners();
        
        // Show loading screen
        this.ui.showLoadingScreen('Preparing Match Monsters...');
        
        // Initialize game with a delay to show loading screen
        setTimeout(() => {
            // Create and initialize board
            this.initializeBoard();
            
            // Hide loading screen
            this.ui.hideLoadingScreen();
            
            // Show game mode selection
            this.ui.showGameModeSelection();
        }, 1500);
    }
    
    /**
     * Initializes the game board
     */
    initializeBoard() {
        // Create board
        this.board = new Board({
            size: GAME_CONFIG.BOARD_SIZE,
            tileSize: GAME_CONFIG.TILE_SIZE,
            tileGap: GAME_CONFIG.TILE_GAP,
            minMatchSize: GAME_CONFIG.MIN_MATCH_SIZE
        });
        
        // Disable board until game starts
        this.board.disable();
        
        // Fill board with initial tiles
        this.board.fillBoard();
    }
    
    /**
     * Registers event listeners for game events
     */
    registerEventListeners() {
        // Board events
        EventSystem.on(EVENTS.TILE_CLICKED, this.handleTileClicked);
        EventSystem.on(EVENTS.MATCH_FOUND, this.handleMatchFound);
        
        // UI events
        EventSystem.on(EVENTS.MODE_SELECTED, this.handleModeSelected);
        EventSystem.on(EVENTS.MONSTERS_SELECTED, this.handleMonstersSelected);
        EventSystem.on('ui:monsterSelected', this.handleMonsterSelected);
        EventSystem.on('ui:evolveButtonClicked', this.handleEvolveButtonClicked);
        EventSystem.on('ui:boostButtonClicked', this.handleBoostButtonClicked);
        EventSystem.on('ui:requestMonsterInfo', this.handleRequestMonsterInfo);
        
        // Game state events
        window.addEventListener('beforeunload', () => {
            this.saveGameState();
            this.saveStats();
        });
        
        // Add keyboard shortcuts
        window.addEventListener('keydown', (e) => {
            // Pause/Resume with 'P' key
            if (e.key === 'p' || e.key === 'P') {
                this.togglePause();
            }
            
            // Show hint with 'H' key
            if (e.key === 'h' || e.key === 'H') {
                if (this.state.currentState === GAME_STATES.PLAYER_TURN && !this.state.isPaused) {
                    this.board.showHint();
                }
            }
        });
    }
    
    /**
     * Starts a new game
     * @param {Object} gameData - Game initialization data
     */
    startGame(gameData) {
        // Set game state
        this.state.currentState = GAME_STATES.BATTLE;
        this.state.currentPlayer = gameData.firstPlayer;
        this.state.firstPlayer = gameData.firstPlayer;
        this.state.secondPlayer = gameData.secondPlayer;
        this.state.movesRemaining = {
            [PLAYERS.PLAYER1]: GAME_CONFIG.MOVES_PER_TURN,
            [PLAYERS.PLAYER2]: GAME_CONFIG.MOVES_PER_TURN
        };
        this.state.extraMoveAvailable = {
            [PLAYERS.PLAYER1]: false,
            [PLAYERS.PLAYER2]: false
        };
        this.state.playerHP = {
            [PLAYERS.PLAYER1]: GAME_CONFIG.STARTING_HP,
            [PLAYERS.PLAYER2]: GAME_CONFIG.STARTING_HP + 
                (gameData.secondPlayer === PLAYERS.PLAYER2 ? GAME_CONFIG.SECOND_PLAYER_BONUS_HP : 0)
        };
        this.state.turnCount = 0;
        this.state.matchCount = 0;
        this.state.moveCount = 0;
        this.state.gameStartTime = Date.now();
        this.state.isPaused = false;
        
        // Initialize AI if needed
        if (this.state.isAIEnabled) {
            this.ai = new MonsterAI(this.monsterManager);
        } else {
            this.ai = null;
        }
        
        // Initialize UI
        this.ui.initializeGame(gameData);
        
        // Reset and fill board
        this.board.reset();
        this.board.fillBoard();
        
        // Enable board
        this.board.enable();
        
        // Start first turn
        this.startTurn(this.state.currentPlayer);
        
        // Increment games played stat
        this.stats.gamesPlayed++;
        
        // Save game state
        this.saveGameState();
    }
    
    /**
     * Starts a player's turn
     * @param {string} player - Player ID
     */
    startTurn(player) {
        // Set current state
        this.state.currentState = GAME_STATES.PLAYER_TURN;
        this.state.currentPlayer = player;
        
        // Reset moves for this turn
        this.state.movesRemaining[player] = GAME_CONFIG.MOVES_PER_TURN;
        this.state.extraMoveAvailable[player] = false;
        
        // Increment turn count
        this.state.turnCount++;
        
        // Process start of turn effects
        const turnEffects = this.monsterManager.processStartOfTurnEffects(player);
        
        // Emit turn start event
        EventSystem.emit(EVENTS.TURN_START, {
            player,
            turnCount: this.state.turnCount,
            movesRemaining: this.state.movesRemaining[player],
            effects: turnEffects
        });
        
        // Check if board has valid moves
        if (!this.board.hasPossibleMoves()) {
            // Shuffle the board if no valid moves
            this.board.shuffleBoard();
        }
        
        // If AI player, make AI move
        if (this.ai && player === PLAYERS.PLAYER2 && this.state.isAIEnabled) {
            // Slight delay before AI move
            setTimeout(() => {
                this.makeAIMove();
            }, 1000);
        }
    }
    
    /**
     * Ends the current player's turn
     */
    endTurn() {
        const currentPlayer = this.state.currentPlayer;
        const nextPlayer = currentPlayer === PLAYERS.PLAYER1 ? PLAYERS.PLAYER2 : PLAYERS.PLAYER1;
        
        // Emit turn end event
        EventSystem.emit(EVENTS.TURN_END, {
            player: currentPlayer,
            nextPlayer: nextPlayer,
            turnCount: this.state.turnCount
        });
        
        // Process monster abilities that have full mana
        this.processMonsterAbilities(currentPlayer);
        
        // Check for win condition
        if (this.checkWinCondition()) {
            return;
        }
        
        // Start next player's turn after a delay
        setTimeout(() => {
            this.startTurn(nextPlayer);
        }, GAME_CONFIG.TURN_TRANSITION_DELAY);
    }
    
    /**
     * Handles a player's move
     * @param {Object} move - Move data
     * @returns {Promise} Promise that resolves when move is complete
     */
    async handlePlayerMove(move) {
        const player = this.state.currentPlayer;
        
        // Check if it's a valid move
        if (this.state.currentState !== GAME_STATES.PLAYER_TURN || 
            this.state.movesRemaining[player] <= 0 ||
            this.state.isPaused) {
            return false;
        }
        
        // Set state to animation to prevent input
        this.state.currentState = GAME_STATES.ANIMATION;
        
        // Decrement moves remaining
        this.state.movesRemaining[player]--;
        
        // Increment move count
        this.state.moveCount++;
        this.stats.totalMoves++;
        
        // Emit player move used event
        EventSystem.emit(EVENTS.PLAYER_MOVE_USED, {
            player,
            movesRemaining: this.state.movesRemaining[player],
            moveType: move.type,
            moveData: move
        });
        
        // Handle different move types
        let moveResult = false;
        
        switch (move.type) {
            case 'match':
                // Swap tiles to make a match
                moveResult = await this.board.swapTiles(move.tile1, move.tile2);
                break;
                
            case 'evolve':
                // Evolve a monster
                moveResult = this.evolveMonster(move.monster);
                break;
                
            case 'boost':
                // Boost a monster
                moveResult = this.boostMonster(move.monster);
                break;
        }
        
        // Check if player has moves left
        if (this.state.movesRemaining[player] <= 0 && !this.state.extraMoveAvailable[player]) {
            // End turn if no moves left
            this.state.currentState = GAME_STATES.PLAYER_TURN;
            this.endTurn();
        } else {
            // Return to player turn state
            this.state.currentState = GAME_STATES.PLAYER_TURN;
            
            // If AI player, make next move
            if (this.ai && player === PLAYERS.PLAYER2 && this.state.isAIEnabled) {
                // Slight delay before next AI move
                setTimeout(() => {
                    this.makeAIMove();
                }, 1000);
            }
        }
        
        // Save game state
        this.saveGameState();
        
        return moveResult;
    }
    
    /**
     * Makes an AI move
     */
    async makeAIMove() {
        if (!this.ai || this.state.currentPlayer !== PLAYERS.PLAYER2 || 
            !this.state.isAIEnabled || this.state.isPaused) {
            return;
        }
        
        // Get AI decision
        const decision = this.ai.makeDecision(
            PLAYERS.PLAYER2,
            this.board.getPossibleMatches(),
            this.state.movesRemaining[PLAYERS.PLAYER2]
        );
        
        // Execute the decision
        switch (decision.action) {
            case 'match':
                // Find the tiles to swap
                const match = decision.match;
                const tile1 = this.board.tiles[match.tile1.row][match.tile1.col];
                const tile2 = this.board.tiles[match.tile2.row][match.tile2.col];
                
                // Make the match move
                await this.handlePlayerMove({
                    type: 'match',
                    tile1,
                    tile2
                });
                break;
                
            case 'evolve':
                // Evolve a monster
                await this.handlePlayerMove({
                    type: 'evolve',
                    monster: decision.monster
                });
                break;
                
            case 'boost':
                // Boost a monster
                await this.handlePlayerMove({
                    type: 'boost',
                    monster: decision.monster
                });
                break;
                
            case 'none':
                // No valid moves, end turn
                this.endTurn();
                break;
        }
    }
    
    /**
     * Processes monster abilities for the current player
     * @param {string} player - Player ID
     */
    processMonsterAbilities(player) {
        // Get ability results
        const abilityResults = this.monsterManager.processMonsterAbilities(player);
        
        // Process each ability result
        abilityResults.forEach(result => {
            const { monster, target, damage } = result;
            
            // Apply damage to target
            if (target && damage > 0) {
                this.applyDamageToMonster(target, damage, monster);
            }
        });
    }
    
    /**
     * Applies damage to a monster and updates player HP
     * @param {Monster} monster - Monster taking damage
     * @param {number} damage - Amount of damage
     * @param {Monster} attacker - Monster dealing damage
     */
    applyDamageToMonster(monster, damage, attacker) {
        // Apply damage to monster
        const actualDamage = monster.takeDamage(damage, attacker);
        
        // Update player HP
        const player = monster.owner;
        const oldHP = this.state.playerHP[player];
        const newHP = Math.max(0, oldHP - actualDamage);
        
        // Update state
        this.state.playerHP[player] = newHP;
        
        // Track total damage dealt
        this.stats.totalDamageDealt += actualDamage;
        
        // Emit player HP updated event
        EventSystem.emit(EVENTS.PLAYER_HP_UPDATED, {
            player,
            oldHP,
            newHP,
            damage: actualDamage,
            attacker: attacker ? attacker.getCurrentName() : null
        });
        
        // Check for win condition
        this.checkWinCondition();
    }
    
    /**
     * Evolves a monster
     * @param {Monster} monster - Monster to evolve
     * @returns {boolean} True if evolution was successful
     */
    evolveMonster(monster) {
        if (!monster || !monster.canEvolve() || 
            monster.owner !== this.state.currentPlayer ||
            this.state.movesRemaining[monster.owner] <= 0) {
            return false;
        }
        
        // Evolve the monster
        const evolved = monster.evolve();
        
        if (evolved) {
            // Track evolution stat
            this.stats.totalEvolutions++;
        }
        
        return evolved;
    }
    
    /**
     * Boosts a monster's mana
     * @param {Monster} monster - Monster to boost
     * @returns {boolean} True if boost was successful
     */
    boostMonster(monster) {
        if (!monster || !monster.canBoost() || 
            monster.owner !== this.state.currentPlayer ||
            this.state.movesRemaining[monster.owner] <= 0) {
            return false;
        }
        
        // Boost the monster
        const boosted = monster.boost();
        
        if (boosted) {
            // Track boost stat
            this.stats.totalBoosts++;
        }
        
        return boosted;
    }
    
    /**
     * Checks if a player has won the game
     * @returns {boolean} True if game is over
     */
    checkWinCondition() {
        // Check if either player's HP is 0
        if (this.state.playerHP[PLAYERS.PLAYER1] <= 0) {
            this.endGame(PLAYERS.PLAYER2);
            return true;
        } else if (this.state.playerHP[PLAYERS.PLAYER2] <= 0) {
            this.endGame(PLAYERS.PLAYER1);
            return true;
        }
        
        return false;
    }
    
    /**
     * Ends the game with a winner
     * @param {string} winner - Winning player
     */
    endGame(winner) {
        // Set game state
        this.state.currentState = GAME_STATES.GAME_OVER;
        
        // Disable board
        this.board.disable();
        
        // Update statistics
        this.stats.gamesWon[winner]++;
        this.stats.longestGame = Math.max(this.stats.longestGame, this.state.turnCount);
        
        if (winner === PLAYERS.PLAYER1 || winner === PLAYERS.PLAYER2) {
            this.stats.fastestWin = Math.min(this.stats.fastestWin, this.state.turnCount);
        }
        
        // Calculate game duration
        const gameDuration = Math.floor((Date.now() - this.state.gameStartTime) / 1000);
        
        // Prepare game statistics
        const gameStats = {
            turnCount: this.state.turnCount,
            moveCount: this.state.moveCount,
            matchCount: this.state.matchCount,
            duration: gameDuration,
            playerHP: { ...this.state.playerHP }
        };
        
        // Emit game end event
        EventSystem.emit(EVENTS.GAME_END, {
            winner,
            gameStats
        });
        
        // Save statistics
        this.saveStats();
    }
    
    /**
     * Toggles game pause state
     * @returns {boolean} New pause state
     */
    togglePause() {
        // Only allow pausing during active gameplay
        if (this.state.currentState !== GAME_STATES.PLAYER_TURN && 
            this.state.currentState !== GAME_STATES.ANIMATION) {
            return this.state.isPaused;
        }
        
        this.state.isPaused = !this.state.isPaused;
        
        if (this.state.isPaused) {
            // Disable board
            this.board.disable();
            
            // Show pause notification
            GameLogger.log('Game paused', 'system');
        } else {
            // Enable board
            this.board.enable();
            
            // Show resume notification
            GameLogger.log('Game resumed', 'system');
        }
        
        return this.state.isPaused;
    }
    
    /**
     * Distributes mana and berries from matches
     * @param {Object} matchResults - Match results data
     */
    distributeMatchRewards(matchResults) {
        const currentPlayer = this.state.currentPlayer;
        const playerMonsters = this.monsterManager.getPlayerMonsters(currentPlayer);
        
        // Process each element type matched
        for (const [element, count] of Object.entries(matchResults.elements)) {
            if (element === ELEMENT_TYPES.BERRY) {
                // Distribute berries to all player monsters
                playerMonsters.forEach(monster => {
                    // Each berry match adds 1 berry
                    monster.addBerries(count);
                });
            } else {
                // Find monsters of this element
                playerMonsters.forEach(monster => {
                    if (monster.element === element) {
                        // Add mana based on match count
                        monster.addMana(count);
                    }
                });
            }
        }
        
        // Check for extra move
        if (matchResults.extraMove && !this.state.extraMoveAvailable[currentPlayer]) {
            this.state.extraMoveAvailable[currentPlayer] = true;
            
            // Emit extra move gained event
            EventSystem.emit(EVENTS.PLAYER_EXTRA_MOVE_GAINED, {
                player: currentPlayer,
                available: true
            });
            
            // Log extra move
            GameLogger.log(`${currentPlayer} gained an extra move!`, currentPlayer);
        }
    }
    
    /**
     * Saves the current game state to local storage
     */
    saveGameState() {
        // Only save during active game
        if (this.state.currentState === GAME_STATES.MENU || 
            this.state.currentState === GAME_STATES.MODE_SELECTION) {
            return;
        }
        
        // Prepare save data
        const saveData = {
            gameState: { ...this.state },
            playerHP: { ...this.state.playerHP },
            movesRemaining: { ...this.state.movesRemaining },
            extraMoveAvailable: { ...this.state.extraMoveAvailable },
            player1Monsters: this.monsterManager.getPlayerMonsters(PLAYERS.PLAYER1).map(m => m.toJSON()),
            player2Monsters: this.monsterManager.getPlayerMonsters(PLAYERS.PLAYER2).map(m => m.toJSON()),
            timestamp: Date.now()
        };
        
        // Save to local storage
        saveToStorage(STORAGE_KEYS.LAST_GAME, saveData);
    }
    
    /**
     * Loads a saved game state from local storage
     * @returns {boolean} True if game was loaded successfully
     */
    loadGameState() {
        // Load from local storage
        const saveData = loadFromStorage(STORAGE_KEYS.LAST_GAME);
        
        if (!saveData || !saveData.gameState) {
            return false;
        }
        
        // Check if save is too old (more than 1 day)
        const saveAge = Date.now() - saveData.timestamp;
        if (saveAge > 86400000) { // 24 hours in milliseconds
            return false;
        }
        
        try {
            // Restore game state
            this.state = { ...saveData.gameState };
            
            // Restore monster manager
            this.monsterManager.reset();
            
            // Recreate monsters
            const player1Monsters = saveData.player1Monsters.map(data => 
                createMonsterFromId(data.id, PLAYERS.PLAYER1));
            const player2Monsters = saveData.player2Monsters.map(data => 
                createMonsterFromId(data.id, PLAYERS.PLAYER2));
            
            // Initialize game with restored data
            const gameData = {
                firstPlayer: this.state.firstPlayer,
                secondPlayer: this.state.secondPlayer,
                player1Monsters,
                player2Monsters
            };
            
            // Start game with loaded data
            this.startGame(gameData);
            
            // Restore additional state
            this.state.playerHP = { ...saveData.playerHP };
            this.state.movesRemaining = { ...saveData.movesRemaining };
            this.state.extraMoveAvailable = { ...saveData.extraMoveAvailable };
            
            // Update UI
            this.ui.updatePlayerHP({
                player: PLAYERS.PLAYER1,
                oldHP: 0,
                newHP: this.state.playerHP[PLAYERS.PLAYER1]
            });
            
            this.ui.updatePlayerHP({
                player: PLAYERS.PLAYER2,
                oldHP: 0,
                newHP: this.state.playerHP[PLAYERS.PLAYER2]
            });
            
            this.ui.updateMoveIndicators({
                player: this.state.currentPlayer,
                movesRemaining: this.state.movesRemaining[this.state.currentPlayer]
            });
            
            // Log game loaded
            GameLogger.log('Saved game loaded', 'system');
            
            return true;
        } catch (error) {
            console.error('Error loading game state:', error);
            return false;
        }
    }
    
    /**
     * Saves game statistics to local storage
     */
    saveStats() {
        saveToStorage(STORAGE_KEYS.STATS, this.stats);
    }
    
    /**
     * Loads game statistics from local storage
     */
    loadStats() {
        const savedStats = loadFromStorage(STORAGE_KEYS.STATS);
        
        if (savedStats) {
            this.stats = { ...this.stats, ...savedStats };
        }
    }
    
    /**
     * Resets the game to initial state
     */
    reset() {
        // Reset game state
        this.state.currentState = GAME_STATES.MENU;
        this.state.currentPlayer = null;
        this.state.firstPlayer = null;
        this.state.secondPlayer = null;
        this.state.gameMode = null;
        this.state.movesRemaining = {
            [PLAYERS.PLAYER1]: GAME_CONFIG.MOVES_PER_TURN,
            [PLAYERS.PLAYER2]: GAME_CONFIG.MOVES_PER_TURN
        };
        this.state.extraMoveAvailable = {
            [PLAYERS.PLAYER1]: false,
            [PLAYERS.PLAYER2]: false
        };
        this.state.playerHP = {
            [PLAYERS.PLAYER1]: GAME_CONFIG.STARTING_HP,
            [PLAYERS.PLAYER2]: GAME_CONFIG.STARTING_HP
        };
        this.state.turnCount = 0;
        this.state.matchCount = 0;
        this.state.moveCount = 0;
        this.state.gameStartTime = null;
        this.state.isPaused = false;
        
        // Reset monster manager
        this.monsterManager.reset();
        
        // Reset board
        if (this.board) {
            this.board.reset();
            this.board.disable();
        }
        
        // Reset UI
        this.ui.reset();
    }
    
    // ==========================================================================
    // Event Handlers
    // ==========================================================================
    
    /**
     * Handles tile clicked events
     * @param {Object} data - Tile click data
     */
    handleTileClicked(data) {
        // Only process during player turn
        if (this.state.currentState !== GAME_STATES.PLAYER_TURN || this.state.isPaused) {
            return;
        }
        
        // Only allow current player to make moves
        if (this.state.isAIEnabled && this.state.currentPlayer === PLAYERS.PLAYER2) {
            return;
        }
    }
    
    /**
     * Handles match found events
     * @param {Object} data - Match data
     */
    handleMatchFound(data) {
        const { matches, matchResults, comboCount } = data;
        
        // Update match count
        this.state.matchCount += matches.length;
        this.stats.totalMatches += matches.length;
        
        // Update highest combo stat
        this.stats.highestCombo = Math.max(this.stats.highestCombo, comboCount);
        
        // Distribute mana and berries
        this.distributeMatchRewards(matchResults);
    }
    
    /**
     * Handles game mode selection
     * @param {Object} data - Mode selection data
     */
    handleModeSelected(data) {
        this.state.gameMode = data.mode;
        this.state.currentState = GAME_STATES.MONSTER_SELECTION;
    }
    
    /**
     * Handles monster selection in draft or all-pick mode
     * @param {Object} data - Monster selection data
     */
    handleMonsterSelected(data) {
        const { monsterId, player, mode } = data;
        
        if (mode === GAME_MODES.DRAFT) {
            // Process draft selection
            const result = this.monsterManager.selectMonsterInDraft(monsterId);
            
            if (result) {
                // Update UI
                this.ui.updateDraftSelection({
                    currentPlayer: result.nextPlayer,
                    availableMonsters: this.monsterManager.getAvailableMonstersForSelection(result.nextPlayer),
                    remainingSelections: result.remainingSelections
                });
                
                // If draft is complete, start the game
                if (result.isComplete) {
                    const gameData = this.monsterManager.finalizeMonstersAndStartBattle();
                    this.startGame(gameData);
                }
            }
        } else if (mode === GAME_MODES.ALL_PICK) {
            // Process all-pick selection
            const result = this.monsterManager.selectMonsterInAllPick(monsterId, player);
            
            if (result && result.success) {
                // Update UI
                this.ui.updateAllPickSelection({
                    availableMonsters: this.monsterManager.getAvailableMonstersForSelection(player),
                    selectedElements: this.monsterManager.selectionState.selectedElements
                });
            }
        }
    }
    
    /**
     * Handles final monster selections and starts the game
     * @param {Object} data - Selected monsters data
     */
    handleMonstersSelected(data) {
        // Finalize monster selection and start battle
        const gameData = this.monsterManager.finalizeMonstersAndStartBattle();
        this.startGame(gameData);
    }
    
    /**
     * Handles evolve button click
     * @param {Object} data - Button click data
     */
    handleEvolveButtonClicked(data) {
        const player = data.player;
        
        // Check if it's a valid action
        if (this.state.currentState !== GAME_STATES.PLAYER_TURN || 
            this.state.movesRemaining[player] <= 0 ||
            player !== this.state.currentPlayer ||
            this.state.isPaused) {
            return;
        }
        
        // Find a monster that can evolve
        const playerMonsters = this.monsterManager.getPlayerMonsters(player);
        const evolvableMonster = playerMonsters.find(monster => monster.canEvolve());
        
        if (evolvableMonster) {
            // Make the evolve move
            this.handlePlayerMove({
                type: 'evolve',
                monster: evolvableMonster
            });
        }
    }
    
    /**
     * Handles boost button click
     * @param {Object} data - Button click data
     */
    handleBoostButtonClicked(data) {
        const player = data.player;
        
        // Check if it's a valid action
        if (this.state.currentState !== GAME_STATES.PLAYER_TURN || 
            this.state.movesRemaining[player] <= 0 ||
            player !== this.state.currentPlayer ||
            this.state.isPaused) {
            return;
        }
        
        // Find a monster that can be boosted
        const playerMonsters = this.monsterManager.getPlayerMonsters(player);
        const boostableMonster = playerMonsters.find(monster => monster.canBoost());
        
        if (boostableMonster) {
            // Make the boost move
            this.handlePlayerMove({
                type: 'boost',
                monster: boostableMonster
            });
        }
    }
    
    /**
     * Handles requests for monster info
     * @param {Object} data - Monster info request data
     */
    handleRequestMonsterInfo(data) {
        const { monsterId, player } = data;
        
        // Get monster from manager
        const monster = this.monsterManager.getMonsterById(monsterId, player);
        
        if (monster) {
            // Show monster info modal
            this.ui.showMonsterInfoModal(monster);
        }
    }
}

// ==========================================================================
// Game Settings Class
// ==========================================================================

/**
 * Manages game settings
 */
class GameSettings {
    constructor() {
        // Default settings
        this.settings = {
            soundEnabled: true,
            musicEnabled: true,
            aiEnabled: false,
            aiDifficulty: 'normal',
            vibrationEnabled: true,
            autoSave: true,
            showHints: true,
            language: 'en',
            theme: 'default'
        };
        
        // Load saved settings
        this.loadSettings();
    }
    
    /**
     * Gets a setting value
     * @param {string} key - Setting key
     * @returns {*} Setting value
     */
    getSetting(key) {
        return this.settings[key];
    }
    
    /**
     * Updates a setting value
     * @param {string} key - Setting key
     * @param {*} value - New value
     */
    updateSetting(key, value) {
        if (key in this.settings) {
            this.settings[key] = value;
            this.saveSettings();
        }
    }
    
    /**
     * Saves settings to local storage
     */
    saveSettings() {
        saveToStorage(STORAGE_KEYS.SETTINGS, this.settings);
    }
    
    /**
     * Loads settings from local storage
     */
    loadSettings() {
        const savedSettings = loadFromStorage(STORAGE_KEYS.SETTINGS);
        
        if (savedSettings) {
            this.settings = { ...this.settings, ...savedSettings };
        }
    }
    
    /**
     * Resets settings to defaults
     */
    resetSettings() {
        this.settings = {
            soundEnabled: true,
            musicEnabled: true,
            aiEnabled: false,
            aiDifficulty: 'normal',
            vibrationEnabled: true,
            autoSave: true,
            showHints: true,
            language: 'en',
            theme: 'default'
        };
        
        this.saveSettings();
    }
}

// ==========================================================================
// Helper Functions
// ==========================================================================

/**
 * Creates and initializes a new game
 * @returns {Game} Game instance
 */
function createGame() {
    return new Game();
}

// Export classes and functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Game,
        GameSettings,
        createGame
    };
}
