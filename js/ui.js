/**
 * Match Monsters - UI Module
 * This file contains classes and functions for managing the game's user interface.
 */

// ==========================================================================
// UI Manager Class
// ==========================================================================

/**
 * Manages all UI elements and interactions
 */
class UI {
    /**
     * Creates a new UI manager
     */
    constructor() {
        // DOM element references
        this.elements = {
            // Main containers
            gameContainer: qs(UI_SELECTORS.GAME_CONTAINER),
            gameBoard: qs(UI_SELECTORS.GAME_BOARD),
            boardContainer: qs(UI_SELECTORS.BOARD_CONTAINER),
            gameHeader: qs(UI_SELECTORS.GAME_HEADER),
            gameControls: qs(UI_SELECTORS.GAME_CONTROLS),
            gameLog: qs(UI_SELECTORS.GAME_LOG),
            logContent: qs(UI_SELECTORS.LOG_CONTENT),
            
            // Player info
            player1Info: qs(UI_SELECTORS.PLAYER1_INFO),
            player2Info: qs(UI_SELECTORS.PLAYER2_INFO),
            player1HpFill: qs(UI_SELECTORS.PLAYER1_HP_FILL),
            player2HpFill: qs(UI_SELECTORS.PLAYER2_HP_FILL),
            player1HpValue: qs(UI_SELECTORS.PLAYER1_HP_VALUE),
            player2HpValue: qs(UI_SELECTORS.PLAYER2_HP_VALUE),
            player1Monsters: qs(UI_SELECTORS.PLAYER1_MONSTERS),
            player2Monsters: qs(UI_SELECTORS.PLAYER2_MONSTERS),
            player1Moves: qs(UI_SELECTORS.PLAYER1_MOVES),
            player2Moves: qs(UI_SELECTORS.PLAYER2_MOVES),
            
            // Game controls
            evolveBtn: qs(UI_SELECTORS.EVOLVE_BTN),
            boostBtn: qs(UI_SELECTORS.BOOST_BTN),
            monsterInfoBtn: qs(UI_SELECTORS.MONSTER_INFO_BTN),
            newGameBtn: qs(UI_SELECTORS.NEW_GAME_BTN),
            howToPlayBtn: qs(UI_SELECTORS.HOW_TO_PLAY_BTN),
            settingsBtn: qs(UI_SELECTORS.SETTINGS_BTN),
            
            // Modals
            gameModeModal: qs(UI_SELECTORS.GAME_MODE_MODAL),
            draftSelectionModal: qs(UI_SELECTORS.DRAFT_SELECTION_MODAL),
            allPickModal: qs(UI_SELECTORS.ALL_PICK_MODAL),
            monsterInfoModal: qs(UI_SELECTORS.MONSTER_INFO_MODAL),
            gameOverModal: qs(UI_SELECTORS.GAME_OVER_MODAL),
            howToPlayModal: qs(UI_SELECTORS.HOW_TO_PLAY_MODAL),
            
            // Modal content
            draftModeBtn: qs(UI_SELECTORS.DRAFT_MODE_BTN),
            allPickModeBtn: qs(UI_SELECTORS.ALL_PICK_MODE_BTN),
            modeDescription: qs(UI_SELECTORS.MODE_DESCRIPTION),
            draftStatus: qs(UI_SELECTORS.DRAFT_STATUS),
            allPickStatus: qs(UI_SELECTORS.ALL_PICK_STATUS),
            availableMonsters: qs(UI_SELECTORS.AVAILABLE_MONSTERS),
            allPickMonsters: qs(UI_SELECTORS.ALL_PICK_MONSTERS),
            confirmSelectionBtn: qs(UI_SELECTORS.CONFIRM_SELECTION_BTN),
            
            // Monster info
            monsterInfoName: qs(UI_SELECTORS.MONSTER_INFO_NAME),
            monsterInfoPortrait: qs(UI_SELECTORS.MONSTER_INFO_PORTRAIT),
            monsterInfoElement: qs(UI_SELECTORS.MONSTER_INFO_ELEMENT),
            monsterInfoHp: qs(UI_SELECTORS.MONSTER_INFO_HP),
            monsterInfoAttack: qs(UI_SELECTORS.MONSTER_INFO_ATTACK),
            monsterInfoAbility: qs(UI_SELECTORS.MONSTER_INFO_ABILITY),
            monsterInfoEvolution: qs(UI_SELECTORS.MONSTER_INFO_EVOLUTION),
            
            // Game over
            winnerDisplay: qs(UI_SELECTORS.WINNER_DISPLAY),
            matchDuration: qs(UI_SELECTORS.MATCH_DURATION),
            movesMade: qs(UI_SELECTORS.MOVES_MADE),
            matchesMade: qs(UI_SELECTORS.MATCHES_MADE),
            playAgainBtn: qs(UI_SELECTORS.PLAY_AGAIN_BTN),
            mainMenuBtn: qs(UI_SELECTORS.MAIN_MENU_BTN),
            
            // Loading screen
            loadingScreen: qs(UI_SELECTORS.LOADING_SCREEN),
            loadingProgress: qs(UI_SELECTORS.LOADING_PROGRESS),
            loadingText: qs(UI_SELECTORS.LOADING_TEXT),
            
            // Turn indicator
            turnIndicator: qs(UI_SELECTORS.TURN_INDICATOR)
        };
        
        // UI state
        this.state = {
            activePlayer: null,
            activeMonsters: {
                [PLAYERS.PLAYER1]: null,
                [PLAYERS.PLAYER2]: null
            },
            playerHP: {
                [PLAYERS.PLAYER1]: GAME_CONFIG.STARTING_HP,
                [PLAYERS.PLAYER2]: GAME_CONFIG.STARTING_HP
            },
            movesRemaining: {
                [PLAYERS.PLAYER1]: GAME_CONFIG.MOVES_PER_TURN,
                [PLAYERS.PLAYER2]: GAME_CONFIG.MOVES_PER_TURN
            },
            extraMoveAvailable: {
                [PLAYERS.PLAYER1]: false,
                [PLAYERS.PLAYER2]: false
            },
            gameStartTime: null,
            totalMoves: 0,
            totalMatches: 0,
            isGameOver: false,
            currentModal: null,
            notifications: [],
            selectedMonsters: {
                [PLAYERS.PLAYER1]: [],
                [PLAYERS.PLAYER2]: []
            }
        };
        
        // Modal managers
        this.modals = {
            gameMode: new ModalManager(this.elements.gameModeModal),
            draftSelection: new ModalManager(this.elements.draftSelectionModal),
            allPick: new ModalManager(this.elements.allPickModal),
            monsterInfo: new ModalManager(this.elements.monsterInfoModal),
            gameOver: new ModalManager(this.elements.gameOverModal),
            howToPlay: new ModalManager(this.elements.howToPlayModal)
        };
        
        // Notification manager
        this.notificationManager = new NotificationManager();
        
        // Bind event handlers
        this.bindEvents();
    }
    
    /**
     * Binds event listeners to UI elements
     */
    bindEvents() {
        // Button event listeners
        if (this.elements.newGameBtn) {
            this.elements.newGameBtn.addEventListener('click', () => this.showGameModeSelection());
        }
        
        if (this.elements.howToPlayBtn) {
            this.elements.howToPlayBtn.addEventListener('click', () => this.showHowToPlay());
        }
        
        if (this.elements.monsterInfoBtn) {
            this.elements.monsterInfoBtn.addEventListener('click', () => this.showMonsterInfoModal());
        }
        
        if (this.elements.evolveBtn) {
            this.elements.evolveBtn.addEventListener('click', () => {
                EventSystem.emit('ui:evolveButtonClicked', {
                    player: this.state.activePlayer
                });
            });
        }
        
        if (this.elements.boostBtn) {
            this.elements.boostBtn.addEventListener('click', () => {
                EventSystem.emit('ui:boostButtonClicked', {
                    player: this.state.activePlayer
                });
            });
        }
        
        // Game mode selection
        if (this.elements.draftModeBtn) {
            this.elements.draftModeBtn.addEventListener('click', () => {
                EventSystem.emit(EVENTS.MODE_SELECTED, { mode: GAME_MODES.DRAFT });
                this.modals.gameMode.hide();
                this.showDraftSelection();
            });
            
            // Update mode description on hover
            this.elements.draftModeBtn.addEventListener('mouseenter', () => {
                this.elements.modeDescription.textContent = 
                    'In Draft Mode, players take turns selecting monsters. ' +
                    'The 1st player selects one monster, then the 2nd player selects two monsters, ' +
                    'and finally the 1st player selects their second monster.';
            });
        }
        
        if (this.elements.allPickModeBtn) {
            this.elements.allPickModeBtn.addEventListener('click', () => {
                EventSystem.emit(EVENTS.MODE_SELECTED, { mode: GAME_MODES.ALL_PICK });
                this.modals.gameMode.hide();
                this.showAllPickSelection();
            });
            
            // Update mode description on hover
            this.elements.allPickModeBtn.addEventListener('mouseenter', () => {
                this.elements.modeDescription.textContent = 
                    'In All Pick Mode, each player chooses 2 monsters for battle. ' +
                    'You can only choose 1 monster from each element. ' +
                    'The 2nd player receives a 5 HP bonus.';
            });
        }
        
        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.hideModal(modal.id);
                }
            });
        });
        
        // Game over buttons
        if (this.elements.playAgainBtn) {
            this.elements.playAgainBtn.addEventListener('click', () => {
                this.modals.gameOver.hide();
                this.showGameModeSelection();
            });
        }
        
        if (this.elements.mainMenuBtn) {
            this.elements.mainMenuBtn.addEventListener('click', () => {
                this.modals.gameOver.hide();
                this.reset();
            });
        }
        
        // Confirm selection button for All Pick mode
        if (this.elements.confirmSelectionBtn) {
            this.elements.confirmSelectionBtn.addEventListener('click', () => {
                EventSystem.emit(EVENTS.MONSTERS_SELECTED, {
                    player1Monsters: this.state.selectedMonsters[PLAYERS.PLAYER1],
                    player2Monsters: this.state.selectedMonsters[PLAYERS.PLAYER2]
                });
                this.modals.allPick.hide();
            });
        }
        
        // Game event listeners
        EventSystem.on(EVENTS.TURN_START, this.handleTurnStart.bind(this));
        EventSystem.on(EVENTS.PLAYER_HP_UPDATED, this.updatePlayerHP.bind(this));
        EventSystem.on(EVENTS.PLAYER_MOVE_USED, this.updateMoveIndicators.bind(this));
        EventSystem.on(EVENTS.PLAYER_EXTRA_MOVE_GAINED, this.updateExtraMoveIndicator.bind(this));
        EventSystem.on(EVENTS.MONSTER_MANA_UPDATED, this.updateMonsterMana.bind(this));
        EventSystem.on(EVENTS.PLAYER_BERRIES_UPDATED, this.updateMonsterBerries.bind(this));
        EventSystem.on(EVENTS.MONSTER_EVOLVED, this.handleMonsterEvolution.bind(this));
        EventSystem.on(EVENTS.MONSTER_BOOSTED, this.handleMonsterBoost.bind(this));
        EventSystem.on(EVENTS.MONSTER_ABILITY_ACTIVATED, this.handleMonsterAbility.bind(this));
        EventSystem.on(EVENTS.MONSTER_DAMAGED, this.handleMonsterDamaged.bind(this));
        EventSystem.on(EVENTS.GAME_END, this.showGameOver.bind(this));
        EventSystem.on(EVENTS.MATCH_FOUND, this.handleMatchFound.bind(this));
    }
    
    /**
     * Initializes the UI for a new game
     * @param {Object} gameData - Initial game data
     */
    initializeGame(gameData) {
        // Reset UI state
        this.state.activePlayer = gameData.firstPlayer;
        this.state.playerHP = {
            [PLAYERS.PLAYER1]: GAME_CONFIG.STARTING_HP,
            [PLAYERS.PLAYER2]: GAME_CONFIG.STARTING_HP + 
                (gameData.secondPlayer === PLAYERS.PLAYER2 ? GAME_CONFIG.SECOND_PLAYER_BONUS_HP : 0)
        };
        this.state.movesRemaining = {
            [PLAYERS.PLAYER1]: GAME_CONFIG.MOVES_PER_TURN,
            [PLAYERS.PLAYER2]: GAME_CONFIG.MOVES_PER_TURN
        };
        this.state.extraMoveAvailable = {
            [PLAYERS.PLAYER1]: false,
            [PLAYERS.PLAYER2]: false
        };
        this.state.gameStartTime = Date.now();
        this.state.totalMoves = 0;
        this.state.totalMatches = 0;
        this.state.isGameOver = false;
        
        // Initialize player monsters
        this.renderPlayerMonsters(PLAYERS.PLAYER1, gameData.player1Monsters);
        this.renderPlayerMonsters(PLAYERS.PLAYER2, gameData.player2Monsters);
        
        // Update HP displays
        this.updatePlayerHP({
            player: PLAYERS.PLAYER1,
            oldHP: 0,
            newHP: this.state.playerHP[PLAYERS.PLAYER1]
        });
        this.updatePlayerHP({
            player: PLAYERS.PLAYER2,
            oldHP: 0,
            newHP: this.state.playerHP[PLAYERS.PLAYER2]
        });
        
        // Update move indicators
        this.updateMoveIndicators({
            player: PLAYERS.PLAYER1,
            movesRemaining: GAME_CONFIG.MOVES_PER_TURN
        });
        this.updateMoveIndicators({
            player: PLAYERS.PLAYER2,
            movesRemaining: GAME_CONFIG.MOVES_PER_TURN
        });
        
        // Update turn indicator
        this.updateTurnIndicator(this.state.activePlayer);
        
        // Enable/disable action buttons
        this.updateActionButtons();
        
        // Clear game log
        GameLogger.clear();
        
        // Add game start message to log
        GameLogger.log(`Game started! ${this.state.activePlayer} goes first.`, 'system');
    }
    
    /**
     * Renders player monsters on the UI
     * @param {string} player - Player ID
     * @param {Array} monsters - Array of monster objects
     */
    renderPlayerMonsters(player, monsters) {
        const monstersContainer = this.elements[`${player}Monsters`];
        if (!monstersContainer) return;
        
        // Clear container
        clearElement(monstersContainer);
        
        // Create monster slots
        monsters.forEach((monster, index) => {
            const monsterSlot = createElement('div', {
                className: 'monster-slot',
                dataset: { index, monsterId: monster.id }
            });
            
            // Monster portrait
            const portrait = createElement('div', {
                className: 'monster-portrait',
                style: `background-image: url(${monster.portrait || `assets/images/monsters/${monster.element}.png`})`
            });
            
            // Monster name (shown on hover)
            const nameOverlay = createElement('div', {
                className: 'monster-name-overlay',
                textContent: monster.getCurrentName()
            });
            
            // Mana bar
            const manaBar = createElement('div', {
                className: 'monster-mana-bar'
            });
            
            const manaFill = createElement('div', {
                className: 'mana-fill',
                style: `width: ${monster.getManaPercentage()}%`
            });
            
            // Evolution indicator
            const evolutionIndicator = createElement('div', {
                className: 'monster-evolution-indicator'
            });
            
            const berryCount = createElement('span', {
                className: 'berry-count',
                textContent: monster.berryCount
            });
            
            evolutionIndicator.appendChild(berryCount);
            evolutionIndicator.appendChild(document.createTextNode('/4'));
            
            // Add elements to monster slot
            manaBar.appendChild(manaFill);
            portrait.appendChild(nameOverlay);
            monsterSlot.appendChild(portrait);
            monsterSlot.appendChild(manaBar);
            monsterSlot.appendChild(evolutionIndicator);
            
            // Add evolved class if monster is evolved
            if (monster.evolved) {
                monsterSlot.classList.add(CSS_CLASSES.EVOLVED);
            }
            
            // Add click handler to show monster info
            monsterSlot.addEventListener('click', () => {
                this.showMonsterInfoModal(monster);
            });
            
            // Add to container
            monstersContainer.appendChild(monsterSlot);
        });
    }
    
    /**
     * Updates player HP display
     * @param {Object} data - HP update data
     */
    updatePlayerHP(data) {
        const { player, oldHP, newHP } = data;
        
        // Update state
        this.state.playerHP[player] = newHP;
        
        // Get HP elements
        const hpFill = this.elements[`${player}HpFill`];
        const hpValue = this.elements[`${player}HpValue`];
        
        if (!hpFill || !hpValue) return;
        
        // Calculate HP percentage
        const maxHP = player === PLAYERS.PLAYER2 && this.state.playerHP[PLAYERS.PLAYER2] > GAME_CONFIG.STARTING_HP
            ? GAME_CONFIG.STARTING_HP + GAME_CONFIG.SECOND_PLAYER_BONUS_HP
            : GAME_CONFIG.STARTING_HP;
        
        const hpPercentage = Math.max(0, Math.min(100, (newHP / maxHP) * 100));
        
        // Animate HP change
        const startWidth = (oldHP / maxHP) * 100;
        const endWidth = hpPercentage;
        
        // Set color based on HP percentage
        if (hpPercentage <= 25) {
            hpFill.style.backgroundColor = 'var(--hp-low-color)';
        } else {
            hpFill.style.backgroundColor = 'var(--hp-color)';
        }
        
        // Animate HP bar
        const animateHP = (timestamp, startTime, duration) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Calculate current width
            const currentWidth = startWidth + (endWidth - startWidth) * progress;
            hpFill.style.width = `${currentWidth}%`;
            
            // Update HP value
            const currentHP = Math.round(oldHP + (newHP - oldHP) * progress);
            hpValue.textContent = currentHP;
            
            // Continue animation if not complete
            if (progress < 1) {
                requestAnimationFrame((ts) => animateHP(ts, startTime, duration));
            }
        };
        
        // Start animation
        requestAnimationFrame((timestamp) => animateHP(timestamp, null, 500));
        
        // Add damage animation to player info container
        if (newHP < oldHP) {
            const playerInfo = this.elements[`${player}Info`];
            if (playerInfo) {
                playerInfo.classList.add(CSS_CLASSES.DAMAGE_ANIMATION);
                setTimeout(() => {
                    playerInfo.classList.remove(CSS_CLASSES.DAMAGE_ANIMATION);
                }, GAME_CONFIG.ANIMATION_SPEED.MONSTER_DAMAGE);
            }
        }
    }
    
    /**
     * Updates move indicators for a player
     * @param {Object} data - Move update data
     */
    updateMoveIndicators(data) {
        const { player, movesRemaining } = data;
        
        // Update state
        this.state.movesRemaining[player] = movesRemaining;
        
        // Get moves container
        const movesContainer = this.elements[`${player}Moves`];
        if (!movesContainer) return;
        
        // Get move indicators
        const moveIndicators = movesContainer.querySelectorAll('.move-indicator');
        
        // Update indicators
        moveIndicators.forEach((indicator, index) => {
            if (index < movesRemaining) {
                indicator.classList.add(CSS_CLASSES.ACTIVE);
            } else {
                indicator.classList.remove(CSS_CLASSES.ACTIVE);
            }
        });
        
        // Update action buttons if active player
        if (player === this.state.activePlayer) {
            this.updateActionButtons();
        }
    }
    
    /**
     * Updates extra move indicator for a player
     * @param {Object} data - Extra move update data
     */
    updateExtraMoveIndicator(data) {
        const { player, available } = data;
        
        // Update state
        this.state.extraMoveAvailable[player] = available;
        
        // Get moves container
        const movesContainer = this.elements[`${player}Moves`];
        if (!movesContainer) return;
        
        // Get extra move indicator
        const extraMoveIndicator = movesContainer.querySelector('.extra-move-indicator');
        if (!extraMoveIndicator) return;
        
        // Update indicator
        if (available) {
            extraMoveIndicator.classList.add(CSS_CLASSES.ACTIVE);
        } else {
            extraMoveIndicator.classList.remove(CSS_CLASSES.ACTIVE);
        }
    }
    
    /**
     * Updates monster mana display
     * @param {Object} data - Mana update data
     */
    updateMonsterMana(data) {
        const { monster, oldMana, newMana } = data;
        
        // Find monster slot
        const monsterSlot = this.getMonsterSlot(monster);
        if (!monsterSlot) return;
        
        // Get mana fill element
        const manaFill = monsterSlot.querySelector('.mana-fill');
        if (!manaFill) return;
        
        // Calculate mana percentage
        const manaPercentage = (newMana / monster.getManaCapacity()) * 100;
        
        // Animate mana change
        const startWidth = (oldMana / monster.getManaCapacity()) * 100;
        const endWidth = manaPercentage;
        
        // Animate mana bar
        const animateMana = (timestamp, startTime, duration) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Calculate current width
            const currentWidth = startWidth + (endWidth - startWidth) * progress;
            manaFill.style.width = `${currentWidth}%`;
            
            // Continue animation if not complete
            if (progress < 1) {
                requestAnimationFrame((ts) => animateMana(ts, startTime, duration));
            } else {
                // Check if mana is full
                if (manaPercentage >= 100) {
                    manaFill.classList.add(CSS_CLASSES.FULL);
                } else {
                    manaFill.classList.remove(CSS_CLASSES.FULL);
                }
            }
        };
        
        // Start animation
        requestAnimationFrame((timestamp) => animateMana(timestamp, null, 300));
    }
    
    /**
     * Updates monster berry count
     * @param {Object} data - Berry update data
     */
    updateMonsterBerries(data) {
        const { monster, berryCount } = data;
        
        // Find monster slot
        const monsterSlot = this.getMonsterSlot(monster);
        if (!monsterSlot) return;
        
        // Get berry count element
        const berryCountElement = monsterSlot.querySelector('.berry-count');
        if (!berryCountElement) return;
        
        // Update berry count
        berryCountElement.textContent = berryCount;
        
        // Update action buttons if active player
        if (monster.owner === this.state.activePlayer) {
            this.updateActionButtons();
        }
    }
    
    /**
     * Handles monster evolution
     * @param {Object} data - Evolution data
     */
    handleMonsterEvolution(data) {
        const { monster, evolutionName } = data;
        
        // Find monster slot
        const monsterSlot = this.getMonsterSlot(monster);
        if (!monsterSlot) return;
        
        // Add evolved class
        monsterSlot.classList.add(CSS_CLASSES.EVOLVED);
        
        // Update monster name
        const nameOverlay = monsterSlot.querySelector('.monster-name-overlay');
        if (nameOverlay) {
            nameOverlay.textContent = evolutionName;
        }
        
        // Add evolution animation
        monsterSlot.classList.add(CSS_CLASSES.EVOLVE_ANIMATION);
        setTimeout(() => {
            monsterSlot.classList.remove(CSS_CLASSES.EVOLVE_ANIMATION);
        }, GAME_CONFIG.ANIMATION_SPEED.MONSTER_EVOLUTION);
        
        // Show evolution notification
        this.notificationManager.show(`${monster.name} evolved into ${evolutionName}!`, 'evolution');
        
        // Update action buttons
        this.updateActionButtons();
    }
    
    /**
     * Handles monster boost
     * @param {Object} data - Boost data
     */
    handleMonsterBoost(data) {
        const { monster, manaAdded } = data;
        
        // Find monster slot
        const monsterSlot = this.getMonsterSlot(monster);
        if (!monsterSlot) return;
        
        // Add boost animation
        monsterSlot.classList.add(CSS_CLASSES.BOOST_ANIMATION);
        setTimeout(() => {
            monsterSlot.classList.remove(CSS_CLASSES.BOOST_ANIMATION);
        }, GAME_CONFIG.ANIMATION_SPEED.MONSTER_BOOST);
        
        // Show boost notification
        this.notificationManager.show(`${monster.getCurrentName()} received a mana boost!`, 'boost');
        
        // Update action buttons
        this.updateActionButtons();
    }
    
    /**
     * Handles monster ability activation
     * @param {Object} data - Ability data
     */
    handleMonsterAbility(data) {
        const { monster, target, damage, effect } = data;
        
        // Find monster slots
        const monsterSlot = this.getMonsterSlot(monster);
        const targetSlot = this.getMonsterSlot(target);
        
        if (!monsterSlot || !targetSlot) return;
        
        // Add attack animation to attacker
        monsterSlot.classList.add(CSS_CLASSES.ATTACK_ANIMATION);
        setTimeout(() => {
            monsterSlot.classList.remove(CSS_CLASSES.ATTACK_ANIMATION);
        }, GAME_CONFIG.ANIMATION_SPEED.MONSTER_ATTACK);
        
        // Add damage animation to target
        setTimeout(() => {
            targetSlot.classList.add(CSS_CLASSES.DAMAGE_ANIMATION);
            setTimeout(() => {
                targetSlot.classList.remove(CSS_CLASSES.DAMAGE_ANIMATION);
            }, GAME_CONFIG.ANIMATION_SPEED.MONSTER_DAMAGE);
        }, GAME_CONFIG.ANIMATION_SPEED.MONSTER_ATTACK / 2);
        
        // Show ability notification
        this.notificationManager.show(`${monster.getCurrentName()} used ${monster.ability.name}!`, 'ability');
    }
    
    /**
     * Handles monster damage
     * @param {Object} data - Damage data
     */
    handleMonsterDamaged(data) {
        const { monster, damage, attacker } = data;
        
        // Find monster slot
        const monsterSlot = this.getMonsterSlot(monster);
        if (!monsterSlot) return;
        
        // Add damage animation
        monsterSlot.classList.add(CSS_CLASSES.DAMAGE_ANIMATION);
        setTimeout(() => {
            monsterSlot.classList.remove(CSS_CLASSES.DAMAGE_ANIMATION);
        }, GAME_CONFIG.ANIMATION_SPEED.MONSTER_DAMAGE);
        
        // Show damage notification if significant
        if (damage >= 5) {
            this.notificationManager.show(`${monster.getCurrentName()} took ${damage} damage!`, 'damage');
        }
    }
    
    /**
     * Handles match found event
     * @param {Object} data - Match data
     */
    handleMatchFound(data) {
        const { matches, matchResults, comboCount } = data;
        
        // Update total matches
        this.state.totalMatches += matches.length;
        
        // Show notification for large matches
        if (matchResults.largestMatch >= 4) {
            this.notificationManager.show(`${matchResults.largestMatch}-tile match!`, 'match');
        }
        
        // Show notification for combos
        if (comboCount > 1) {
            this.notificationManager.show(`${comboCount}x Combo!`, 'combo');
        }
        
        // Show notification for extra move
        if (matchResults.extraMove) {
            this.notificationManager.show('Extra Move!', 'extra-move');
        }
    }
    
    /**
     * Handles turn start event
     * @param {Object} data - Turn data
     */
    handleTurnStart(data) {
        const { player, movesRemaining } = data;
        
        // Update state
        this.state.activePlayer = player;
        this.state.movesRemaining[player] = movesRemaining;
        
        // Update turn indicator
        this.updateTurnIndicator(player);
        
        // Update move indicators
        this.updateMoveIndicators({
            player,
            movesRemaining
        });
        
        // Update action buttons
        this.updateActionButtons();
    }
    
    /**
     * Updates the turn indicator
     * @param {string} player - Active player
     */
    updateTurnIndicator(player) {
        if (!this.elements.turnIndicator) return;
        
        // Update text
        this.elements.turnIndicator.textContent = `${player}'s Turn`;
        
        // Add highlight animation
        this.elements.turnIndicator.classList.add('highlight');
        setTimeout(() => {
            this.elements.turnIndicator.classList.remove('highlight');
        }, 1000);
        
        // Update player info highlight
        this.elements.player1Info.classList.toggle('active', player === PLAYERS.PLAYER1);
        this.elements.player2Info.classList.toggle('active', player === PLAYERS.PLAYER2);
    }
    
    /**
     * Updates action button states based on current game state
     */
    updateActionButtons() {
        const player = this.state.activePlayer;
        if (!player) return;
        
        // Get player monsters
        const playerMonsters = document.querySelectorAll(`#${player}-monsters .monster-slot`);
        
        // Check if any monster can evolve
        let canEvolve = false;
        let canBoost = false;
        
        playerMonsters.forEach(monsterSlot => {
            const monsterId = parseInt(monsterSlot.dataset.monsterId, 10);
            const berryCount = parseInt(monsterSlot.querySelector('.berry-count').textContent, 10);
            const isEvolved = monsterSlot.classList.contains(CSS_CLASSES.EVOLVED);
            
            if (!isEvolved && berryCount >= GAME_CONFIG.BERRIES_FOR_EVOLUTION) {
                canEvolve = true;
            }
            
            if (isEvolved && berryCount >= GAME_CONFIG.BERRIES_FOR_BOOST) {
                canBoost = true;
            }
        });
        
        // Update evolve button
        if (this.elements.evolveBtn) {
            this.elements.evolveBtn.disabled = !canEvolve || this.state.movesRemaining[player] <= 0;
        }
        
        // Update boost button
        if (this.elements.boostBtn) {
            this.elements.boostBtn.disabled = !canBoost || this.state.movesRemaining[player] <= 0;
        }
    }
    
    /**
     * Gets the DOM element for a monster
     * @param {Monster} monster - Monster object
     * @returns {Element|null} Monster slot element or null
     */
    getMonsterSlot(monster) {
        if (!monster) return null;
        
        const monstersContainer = this.elements[`${monster.owner}Monsters`];
        if (!monstersContainer) return null;
        
        return monstersContainer.querySelector(`.monster-slot[data-monster-id="${monster.id}"]`);
    }
    
    /**
     * Shows the game mode selection modal
     */
    showGameModeSelection() {
        this.hideAllModals();
        this.modals.gameMode.show();
    }
    
    /**
     * Shows the draft selection modal
     */
    showDraftSelection() {
        this.hideAllModals();
        this.modals.draftSelection.show();
        
        // Reset selected monsters
        this.state.selectedMonsters = {
            [PLAYERS.PLAYER1]: [],
            [PLAYERS.PLAYER2]: []
        };
    }
    
    /**
     * Shows the all pick selection modal
     */
    showAllPickSelection() {
        this.hideAllModals();
        this.modals.allPick.show();
        
        // Reset selected monsters
        this.state.selectedMonsters = {
            [PLAYERS.PLAYER1]: [],
            [PLAYERS.PLAYER2]: []
        };
    }
    
    /**
     * Updates the draft selection UI
     * @param {Object} data - Draft state data
     */
    updateDraftSelection(data) {
        const { currentPlayer, availableMonsters, remainingSelections } = data;
        
        // Update draft status text
        if (this.elements.draftStatus) {
            this.elements.draftStatus.textContent = `${currentPlayer}, select your monster (${remainingSelections} selections remaining)`;
        }
        
        // Render available monsters
        this.renderAvailableMonsters(availableMonsters, currentPlayer, GAME_MODES.DRAFT);
    }
    
    /**
     * Updates the all pick selection UI
     * @param {Object} data - All pick state data
     */
    updateAllPickSelection(data) {
        const { availableMonsters, selectedElements } = data;
        
        // Update all pick status text
        if (this.elements.allPickStatus) {
            const player1Count = this.state.selectedMonsters[PLAYERS.PLAYER1].length;
            const player2Count = this.state.selectedMonsters[PLAYERS.PLAYER2].length;
            
            if (player1Count < 2) {
                this.elements.allPickStatus.textContent = `Player 1, select ${2 - player1Count} more monster${player1Count === 1 ? '' : 's'}`;
            } else if (player2Count < 2) {
                this.elements.allPickStatus.textContent = `Player 2, select ${2 - player2Count} more monster${player2Count === 1 ? '' : 's'}`;
            } else {
                this.elements.allPickStatus.textContent = 'All monsters selected. Click Confirm to start the battle!';
            }
        }
        
        // Render available monsters
        this.renderAvailableMonsters(availableMonsters, null, GAME_MODES.ALL_PICK, selectedElements);
        
        // Update confirm button state
        if (this.elements.confirmSelectionBtn) {
            const allSelected = 
                this.state.selectedMonsters[PLAYERS.PLAYER1].length === 2 && 
                this.state.selectedMonsters[PLAYERS.PLAYER2].length === 2;
                
            this.elements.confirmSelectionBtn.disabled = !allSelected;
        }
    }
    
    /**
     * Renders available monsters for selection
     * @param {Array} monsters - Available monsters
     * @param {string} currentPlayer - Current player selecting
     * @param {string} mode - Selection mode
     * @param {Object} selectedElements - Already selected elements
     */
    renderAvailableMonsters(monsters, currentPlayer, mode, selectedElements = {}) {
        const container = mode === GAME_MODES.DRAFT 
            ? this.elements.availableMonsters 
            : this.elements.allPickMonsters;
            
        if (!container) return;
        
        // Clear container
        clearElement(container);
        
        // Create monster cards
        monsters.forEach(monster => {
            const card = createElement('div', {
                className: 'monster-card',
                dataset: { monsterId: monster.id, element: monster.element }
            });
            
            // Monster portrait
            const portrait = createElement('div', {
                className: 'monster-card-portrait',
                style: `background-image: url(${monster.portrait || `assets/images/monsters/${monster.element}.png`})`
            });
            
            // Monster name
            const name = createElement('div', {
                className: 'monster-card-name',
                textContent: monster.name
            });
            
            // Monster element
            const element = createElement('div', {
                className: 'monster-card-element'
            });
            
            const elementIndicator = createElement('span', {
                className: `element-indicator ${monster.element}`
            });
            
            element.appendChild(elementIndicator);
            element.appendChild(document.createTextNode(monster.element));
            
            // Add elements to card
            card.appendChild(portrait);
            card.appendChild(name);
            card.appendChild(element);
            
            // Check if monster should be disabled in all-pick mode
            if (mode === GAME_MODES.ALL_PICK) {
                // Determine which player is selecting
                let selectingPlayer;
                
                if (this.state.selectedMonsters[PLAYERS.PLAYER1].length < 2) {
                    selectingPlayer = PLAYERS.PLAYER1;
                } else if (this.state.selectedMonsters[PLAYERS.PLAYER2].length < 2) {
                    selectingPlayer = PLAYERS.PLAYER2;
                }
                
                // Disable if element already selected by this player
                if (selectingPlayer && selectedElements[selectingPlayer] && 
                    selectedElements[selectingPlayer].includes(monster.element)) {
                    card.classList.add(CSS_CLASSES.DISABLED);
                }
            }
            
            // Add click handler
            card.addEventListener('click', () => {
                if (card.classList.contains(CSS_CLASSES.DISABLED)) return;
                
                if (mode === GAME_MODES.DRAFT) {
                    // Draft mode - emit selection event
                    EventSystem.emit('ui:monsterSelected', {
                        monsterId: monster.id,
                        player: currentPlayer,
                        mode: GAME_MODES.DRAFT
                    });
                } else if (mode === GAME_MODES.ALL_PICK) {
                    // All pick mode - determine current player
                    let selectingPlayer;
                    
                    if (this.state.selectedMonsters[PLAYERS.PLAYER1].length < 2) {
                        selectingPlayer = PLAYERS.PLAYER1;
                    } else if (this.state.selectedMonsters[PLAYERS.PLAYER2].length < 2) {
                        selectingPlayer = PLAYERS.PLAYER2;
                    }
                    
                    if (selectingPlayer) {
                        // Add to selected monsters
                        this.state.selectedMonsters[selectingPlayer].push(monster.id);
                        
                        // Emit selection event
                        EventSystem.emit('ui:monsterSelected', {
                            monsterId: monster.id,
                            player: selectingPlayer,
                            mode: GAME_MODES.ALL_PICK
                        });
                        
                        // Update UI
                        this.updateAllPickSelection({
                            availableMonsters: monsters,
                            selectedElements: selectedElements
                        });
                    }
                }
            });
            
            // Add to container
            container.appendChild(card);
        });
    }
    
    /**
     * Shows the monster info modal
     * @param {Monster} monster - Monster to display info for
     */
    showMonsterInfoModal(monster = null) {
        // If no monster provided, show info for first selected monster
        if (!monster) {
            const activePlayerMonsters = document.querySelectorAll(`#${this.state.activePlayer}-monsters .monster-slot`);
            if (activePlayerMonsters.length > 0) {
                const monsterId = parseInt(activePlayerMonsters[0].dataset.monsterId, 10);
                // Emit event to get monster data
                EventSystem.emit('ui:requestMonsterInfo', { monsterId, player: this.state.activePlayer });
                return;
            }
        }
        
        if (!monster) return;
        
        // Update modal content
        if (this.elements.monsterInfoName) {
            this.elements.monsterInfoName.textContent = monster.getCurrentName();
        }
        
        if (this.elements.monsterInfoPortrait) {
            this.elements.monsterInfoPortrait.style.backgroundImage = `url(${monster.portrait || `assets/images/monsters/${monster.element}.png`})`;
        }
        
        if (this.elements.monsterInfoElement) {
            this.elements.monsterInfoElement.textContent = monster.element;
        }
        
        if (this.elements.monsterInfoHp) {
            this.elements.monsterInfoHp.textContent = monster.currentStats.hp;
        }
        
        if (this.elements.monsterInfoAttack) {
            this.elements.monsterInfoAttack.textContent = monster.currentStats.attack;
        }
        
        if (this.elements.monsterInfoAbility) {
            this.elements.monsterInfoAbility.textContent = monster.ability.description;
        }
        
        if (this.elements.monsterInfoEvolution) {
            if (monster.evolved) {
                this.elements.monsterInfoEvolution.textContent = 'This monster has evolved to its final form.';
            } else {
                this.elements.monsterInfoEvolution.textContent = 
                    `When evolved to ${monster.evolutionName}: +${monster.evolutionData.statBoosts.hp} HP, ` +
                    `+${monster.evolutionData.statBoosts.attack} Attack, ` +
                    `+${monster.evolutionData.abilityBoost.damage} Ability Damage`;
            }
        }
        
        // Show modal
        this.hideAllModals();
        this.modals.monsterInfo.show();
    }
    
    /**
     * Shows the how to play modal
     */
    showHowToPlay() {
        this.hideAllModals();
        this.modals.howToPlay.show();
    }
    
    /**
     * Shows the game over modal
     * @param {Object} data - Game over data
     */
    showGameOver(data) {
        const { winner, gameStats } = data;
        
        // Update state
        this.state.isGameOver = true;
        
        // Update modal content
        if (this.elements.winnerDisplay) {
            this.elements.winnerDisplay.textContent = `${winner} Wins!`;
        }
        
        // Calculate game duration
        const gameDuration = Math.floor((Date.now() - this.state.gameStartTime) / 1000);
        
        if (this.elements.matchDuration) {
            this.elements.matchDuration.textContent = `Match Duration: ${formatTime(gameDuration)}`;
        }
        
        if (this.elements.movesMade) {
            this.elements.movesMade.textContent = `Total Moves: ${this.state.totalMoves}`;
        }
        
        if (this.elements.matchesMade) {
            this.elements.matchesMade.textContent = `Total Matches: ${this.state.totalMatches}`;
        }
        
        // Show modal
        this.hideAllModals();
        this.modals.gameOver.show();
    }
    
    /**
     * Hides all modals
     */
    hideAllModals() {
        Object.values(this.modals).forEach(modal => modal.hide());
    }
    
    /**
     * Hides a specific modal by ID
     * @param {string} modalId - Modal ID
     */
    hideModal(modalId) {
        const modalName = modalId.replace('-modal', '');
        if (this.modals[modalName]) {
            this.modals[modalName].hide();
        }
    }
    
    /**
     * Shows the loading screen
     * @param {string} message - Loading message
     */
    showLoadingScreen(message = 'Loading...') {
        if (!this.elements.loadingScreen) return;
        
        // Set loading text
        if (this.elements.loadingText) {
            this.elements.loadingText.textContent = message;
        }
        
        // Show loading screen
        this.elements.loadingScreen.classList.add(CSS_CLASSES.VISIBLE);
        this.elements.loadingScreen.classList.remove(CSS_CLASSES.HIDDEN);
    }
    
    /**
     * Hides the loading screen
     */
    hideLoadingScreen() {
        if (!this.elements.loadingScreen) return;
        
        // Hide with fade out animation
        this.elements.loadingScreen.style.opacity = '0';
        
        setTimeout(() => {
            this.elements.loadingScreen.classList.add(CSS_CLASSES.HIDDEN);
            this.elements.loadingScreen.classList.remove(CSS_CLASSES.VISIBLE);
            this.elements.loadingScreen.style.opacity = '1';
        }, 500);
    }
    
    /**
     * Updates the loading progress
     * @param {number} progress - Progress percentage (0-100)
     */
    updateLoadingProgress(progress) {
        if (!this.elements.loadingProgress) return;
        
        this.elements.loadingProgress.style.width = `${progress}%`;
    }
    
    /**
     * Resets the UI to initial state
     */
    reset() {
        // Reset state
        this.state.activePlayer = null;
        this.state.activeMonsters = {
            [PLAYERS.PLAYER1]: null,
            [PLAYERS.PLAYER2]: null
        };
        this.state.playerHP = {
            [PLAYERS.PLAYER1]: GAME_CONFIG.STARTING_HP,
            [PLAYERS.PLAYER2]: GAME_CONFIG.STARTING_HP
        };
        this.state.movesRemaining = {
            [PLAYERS.PLAYER1]: GAME_CONFIG.MOVES_PER_TURN,
            [PLAYERS.PLAYER2]: GAME_CONFIG.MOVES_PER_TURN
        };
        this.state.extraMoveAvailable = {
            [PLAYERS.PLAYER1]: false,
            [PLAYERS.PLAYER2]: false
        };
        this.state.gameStartTime = null;
        this.state.totalMoves = 0;
        this.state.totalMatches = 0;
        this.state.isGameOver = false;
        
        // Hide all modals
        this.hideAllModals();
        
        // Clear monster containers
        if (this.elements.player1Monsters) {
            clearElement(this.elements.player1Monsters);
        }
        
        if (this.elements.player2Monsters) {
            clearElement(this.elements.player2Monsters);
        }
        
        // Reset HP displays
        this.updatePlayerHP({
            player: PLAYERS.PLAYER1,
            oldHP: 0,
            newHP: GAME_CONFIG.STARTING_HP
        });
        
        this.updatePlayerHP({
            player: PLAYERS.PLAYER2,
            oldHP: 0,
            newHP: GAME_CONFIG.STARTING_HP
        });
        
        // Reset move indicators
        this.updateMoveIndicators({
            player: PLAYERS.PLAYER1,
            movesRemaining: GAME_CONFIG.MOVES_PER_TURN
        });
        
        this.updateMoveIndicators({
            player: PLAYERS.PLAYER2,
            movesRemaining: GAME_CONFIG.MOVES_PER_TURN
        });
        
        // Clear game log
        GameLogger.clear();
        
        // Show game mode selection
        this.showGameModeSelection();
    }
}

// ==========================================================================
// Modal Manager Class
// ==========================================================================

/**
 * Manages modal dialogs
 */
class ModalManager {
    /**
     * Creates a new modal manager
     * @param {Element} modalElement - Modal DOM element
     */
    constructor(modalElement) {
        this.modal = modalElement;
        this.isVisible = false;
    }
    
    /**
     * Shows the modal
     */
    show() {
        if (!this.modal) return;
        
        // Add active class to display the modal
        this.modal.classList.add(CSS_CLASSES.ACTIVE);
        this.isVisible = true;
        
        // Emit modal opened event
        EventSystem.emit(EVENTS.MODAL_OPENED, {
            modalId: this.modal.id
        });
    }
    
    /**
     * Hides the modal
     */
    hide() {
        if (!this.modal || !this.isVisible) return;
        
        // Remove active class to hide the modal
        this.modal.classList.remove(CSS_CLASSES.ACTIVE);
        this.isVisible = false;
        
        // Emit modal closed event
        EventSystem.emit(EVENTS.MODAL_CLOSED, {
            modalId: this.modal.id
        });
    }
    
    /**
     * Toggles the modal visibility
     * @returns {boolean} New visibility state
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
        
        return this.isVisible;
    }
}

// ==========================================================================
// Notification Manager Class
// ==========================================================================

/**
 * Manages in-game notifications
 */
class NotificationManager {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.maxNotifications = 3;
        
        // Create notification container
        this.createContainer();
    }
    
    /**
     * Creates the notification container
     */
    createContainer() {
        // Check if container already exists
        if (document.getElementById('notification-container')) {
            this.container = document.getElementById('notification-container');
            return;
        }
        
        // Create container
        this.container = createElement('div', {
            id: 'notification-container',
            className: 'notification-container'
        });
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 1000;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                pointer-events: none;
            }
            
            .notification {
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                font-weight: bold;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                opacity: 0;
                transform: translateY(-20px);
                animation: notification 3s forwards;
            }
            
            .notification.match {
                background-color: rgba(74, 111, 165, 0.9);
            }
            
            .notification.combo {
                background-color: rgba(255, 152, 0, 0.9);
            }
            
            .notification.extra-move {
                background-color: rgba(76, 175, 80, 0.9);
            }
            
            .notification.evolution {
                background-color: rgba(233, 30, 99, 0.9);
            }
            
            .notification.ability {
                background-color: rgba(156, 39, 176, 0.9);
            }
            
            .notification.damage {
                background-color: rgba(244, 67, 54, 0.9);
            }
            
            .notification.boost {
                background-color: rgba(33, 150, 243, 0.9);
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(this.container);
    }
    
    /**
     * Shows a notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type
     */
    show(message, type = '') {
        if (!this.container) {
            this.createContainer();
        }
        
        // Create notification element
        const notification = createElement('div', {
            className: `notification ${type}`
        }, message);
        
        // Add to container
        this.container.appendChild(notification);
        
        // Add to notifications array
        this.notifications.push(notification);
        
        // Remove oldest notification if exceeding max
        if (this.notifications.length > this.maxNotifications) {
            const oldestNotification = this.notifications.shift();
            if (oldestNotification.parentNode) {
                oldestNotification.parentNode.removeChild(oldestNotification);
            }
        }
        
        // Remove notification after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            
            // Remove from array
            const index = this.notifications.indexOf(notification);
            if (index !== -1) {
                this.notifications.splice(index, 1);
            }
        }, 3000);
    }
}

// ==========================================================================
// Responsive UI Handler
// ==========================================================================

/**
 * Handles responsive UI adjustments
 */
class ResponsiveUI {
    constructor() {
        this.breakpoints = {
            small: 480,
            medium: 768,
            large: 1024
        };
        
        this.currentBreakpoint = this.getCurrentBreakpoint();
        
        // Bind methods
        this.handleResize = this.handleResize.bind(this);
        
        // Add resize listener
        window.addEventListener('resize', this.handleResize);
        
        // Initial adjustment
        this.adjustUI();
    }
    
    /**
     * Gets the current breakpoint based on window width
     * @returns {string} Breakpoint name
     */
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width <= this.breakpoints.small) {
            return 'small';
        } else if (width <= this.breakpoints.medium) {
            return 'medium';
        } else if (width <= this.breakpoints.large) {
            return 'large';
        } else {
            return 'xlarge';
        }
    }
    
    /**
     * Handles window resize events
     */
    handleResize() {
        const newBreakpoint = this.getCurrentBreakpoint();
        
        // Only adjust if breakpoint changed
        if (newBreakpoint !== this.currentBreakpoint) {
            this.currentBreakpoint = newBreakpoint;
            this.adjustUI();
        }
    }
    
    /**
     * Adjusts UI based on current breakpoint
     */
    adjustUI() {
        const gameContainer = document.getElementById('game-container');
        const gameBoardSection = document.getElementById('game-board-section');
        
        if (!gameContainer || !gameBoardSection) return;
        
        // Adjust layout based on breakpoint
        switch (this.currentBreakpoint) {
            case 'small':
                // Mobile layout
                gameBoardSection.style.gridTemplateColumns = '1fr';
                gameBoardSection.style.gridTemplateRows = 'auto 1fr auto';
                break;
                
            case 'medium':
                // Tablet layout
                gameBoardSection.style.gridTemplateColumns = '1fr';
                gameBoardSection.style.gridTemplateRows = 'auto 1fr auto';
                break;
                
            case 'large':
                // Small desktop
                gameBoardSection.style.gridTemplateColumns = '200px 1fr 200px';
                gameBoardSection.style.gridTemplateRows = '1fr';
                break;
                
            case 'xlarge':
                // Large desktop
                gameBoardSection.style.gridTemplateColumns = '250px 1fr 250px';
                gameBoardSection.style.gridTemplateRows = '1fr';
                break;
        }
        
        // Emit UI updated event
        EventSystem.emit(EVENTS.UI_UPDATED, {
            breakpoint: this.currentBreakpoint
        });
    }
}

// ==========================================================================
// Helper Functions
// ==========================================================================

/**
 * Creates a UI instance
 * @returns {UI} UI manager instance
 */
function createUI() {
    const ui = new UI();
    
    // Initialize responsive UI
    const responsiveUI = new ResponsiveUI();
    
    return ui;
}

// Export classes and functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UI,
        ModalManager,
        NotificationManager,
        ResponsiveUI,
        createUI
    };
}
