/**
 * Match Monsters - Monster Management
 * This file contains classes and functions for managing monsters in the game.
 */

// ==========================================================================
// Monster Class
// ==========================================================================

/**
 * Represents a monster in the game
 */
class Monster {
    /**
     * Create a new monster
     * @param {Object} data - Monster data from MONSTERS constant
     * @param {string} owner - Player ID who owns this monster
     */
    constructor(data, owner) {
        // Basic properties
        this.id = data.id;
        this.name = data.name;
        this.element = data.element;
        this.owner = owner;
        this.description = data.description;
        this.portrait = data.portrait;
        
        // Stats
        this.baseStats = { ...data.baseStats };
        this.currentStats = { ...data.baseStats };
        
        // Special ability
        this.ability = { ...data.ability };
        
        // Evolution data
        this.evolutionData = data.evolution;
        this.evolved = false;
        this.evolutionName = data.evolution.name;
        
        // Status
        this.currentMana = 0;
        this.berryCount = 0;
        this.statusEffects = [];
        this.isActive = false;
    }
    
    /**
     * Gets the current name (evolved or base)
     * @returns {string} Monster's current name
     */
    getCurrentName() {
        return this.evolved ? this.evolutionName : this.name;
    }
    
    /**
     * Gets the current mana capacity
     * @returns {number} Current mana capacity
     */
    getManaCapacity() {
        return this.currentStats.manaCapacity;
    }
    
    /**
     * Gets the current mana percentage (0-100)
     * @returns {number} Mana percentage
     */
    getManaPercentage() {
        return (this.currentMana / this.getManaCapacity()) * 100;
    }
    
    /**
     * Adds mana to the monster
     * @param {number} amount - Amount of mana to add
     * @returns {boolean} True if mana was filled completely
     */
    addMana(amount) {
        const oldMana = this.currentMana;
        this.currentMana = Math.min(this.currentMana + amount, this.getManaCapacity());
        
        // Emit mana updated event
        EventSystem.emit(EVENTS.MONSTER_MANA_UPDATED, {
            monster: this,
            oldMana,
            newMana: this.currentMana
        });
        
        // Return true if mana was filled
        return this.currentMana === this.getManaCapacity();
    }
    
    /**
     * Resets monster's mana to 0
     */
    resetMana() {
        const oldMana = this.currentMana;
        this.currentMana = 0;
        
        // Emit mana updated event
        EventSystem.emit(EVENTS.MONSTER_MANA_UPDATED, {
            monster: this,
            oldMana,
            newMana: 0
        });
    }
    
    /**
     * Adds berries to the monster
     * @param {number} count - Number of berries to add
     * @returns {number} New berry count
     */
    addBerries(count) {
        this.berryCount = Math.min(this.berryCount + count, GAME_CONFIG.BERRIES_FOR_EVOLUTION);
        
        // Emit berries updated event
        EventSystem.emit(EVENTS.PLAYER_BERRIES_UPDATED, {
            monster: this,
            berryCount: this.berryCount
        });
        
        return this.berryCount;
    }
    
    /**
     * Checks if monster can evolve
     * @returns {boolean} True if monster can evolve
     */
    canEvolve() {
        return !this.evolved && this.berryCount >= GAME_CONFIG.BERRIES_FOR_EVOLUTION;
    }
    
    /**
     * Evolves the monster if possible
     * @returns {boolean} True if evolution was successful
     */
    evolve() {
        if (!this.canEvolve()) {
            return false;
        }
        
        // Apply evolution stat boosts
        this.evolved = true;
        this.berryCount = 0;
        
        // Apply stat boosts
        for (const [stat, boost] of Object.entries(this.evolutionData.statBoosts)) {
            this.currentStats[stat] += boost;
        }
        
        // Apply ability boosts
        for (const [stat, boost] of Object.entries(this.evolutionData.abilityBoost)) {
            this.ability[stat] += boost;
        }
        
        // Emit evolution event
        EventSystem.emit(EVENTS.MONSTER_EVOLVED, {
            monster: this,
            evolutionName: this.evolutionName
        });
        
        // Log the evolution
        GameLogger.log(
            `${this.name} evolved into ${this.evolutionName}!`,
            this.owner
        );
        
        return true;
    }
    
    /**
     * Checks if monster can be boosted
     * @returns {boolean} True if monster can be boosted
     */
    canBoost() {
        return this.evolved && this.berryCount >= GAME_CONFIG.BERRIES_FOR_BOOST;
    }
    
    /**
     * Boosts the monster's mana if possible
     * @returns {boolean} True if boost was successful
     */
    boost() {
        if (!this.canBoost()) {
            return false;
        }
        
        // Use berries and add mana
        this.berryCount -= GAME_CONFIG.BERRIES_FOR_BOOST;
        const manaFilled = this.addMana(GAME_CONFIG.MANA_FROM_BOOST);
        
        // Emit boost event
        EventSystem.emit(EVENTS.MONSTER_BOOSTED, {
            monster: this,
            manaAdded: GAME_CONFIG.MANA_FROM_BOOST,
            manaFilled
        });
        
        // Log the boost
        GameLogger.log(
            `${this.getCurrentName()} received a mana boost!`,
            this.owner
        );
        
        return true;
    }
    
    /**
     * Activates the monster's special ability
     * @param {Array} targets - Potential targets for the ability
     * @returns {Object} Ability result with damage and effects
     */
    activateAbility(targets) {
        if (this.currentMana < this.getManaCapacity()) {
            return null;
        }
        
        // Select target (usually opponent's monster)
        const target = this.selectAbilityTarget(targets);
        if (!target) {
            return null;
        }
        
        // Calculate base damage
        let damage = this.ability.damage;
        
        // Apply elemental modifiers
        damage = calculateElementalDamage(damage, this.element, target.element);
        
        // Apply status effects if chance roll succeeds
        let appliedEffect = null;
        if (Math.random() < this.ability.effectChance) {
            appliedEffect = { ...this.ability.effect };
            
            // Apply the effect to the target
            target.applyStatusEffect(appliedEffect);
        }
        
        // Reset mana after ability use
        this.resetMana();
        
        // Emit ability activated event
        EventSystem.emit(EVENTS.MONSTER_ABILITY_ACTIVATED, {
            monster: this,
            target,
            damage,
            effect: appliedEffect
        });
        
        // Log the ability activation
        GameLogger.log(
            `${this.getCurrentName()} used ${this.ability.name} for ${damage} damage!`,
            this.owner
        );
        
        return {
            target,
            damage,
            effect: appliedEffect
        };
    }
    
    /**
     * Selects a target for the ability
     * @param {Array} targets - Potential targets
     * @returns {Monster} Selected target
     */
    selectAbilityTarget(targets) {
        // Filter out targets that belong to the same player
        const validTargets = targets.filter(target => target.owner !== this.owner);
        
        if (validTargets.length === 0) {
            return null;
        }
        
        // For now, simply select the first valid target
        // More complex targeting logic can be added here
        return validTargets[0];
    }
    
    /**
     * Applies a status effect to this monster
     * @param {Object} effect - Effect to apply
     */
    applyStatusEffect(effect) {
        // Clone the effect and add duration tracking
        const appliedEffect = { ...effect, turnsRemaining: effect.duration };
        
        // Add to status effects
        this.statusEffects.push(appliedEffect);
        
        // Log the effect application
        const effectName = this.getEffectName(effect.type);
        GameLogger.log(
            `${this.getCurrentName()} was affected by ${effectName}!`,
            this.owner === PLAYERS.PLAYER1 ? PLAYERS.PLAYER2 : PLAYERS.PLAYER1
        );
    }
    
    /**
     * Gets a user-friendly name for an effect type
     * @param {string} effectType - Effect type identifier
     * @returns {string} User-friendly effect name
     */
    getEffectName(effectType) {
        const effectNames = {
            'DOT': 'Damage Over Time',
            'DEBUFF': 'Stat Reduction',
            'BUFF': 'Stat Boost',
            'STUN': 'Stun',
            'SHIELD': 'Shield',
            'ACCURACY_DOWN': 'Accuracy Reduction',
            'FIELD_EFFECT': 'Field Effect',
            'RANDOM_ELEMENT': 'Elemental Shift'
        };
        
        return effectNames[effectType] || effectType;
    }
    
    /**
     * Processes status effects at the start of a turn
     * @returns {Array} Effects that were processed
     */
    processStatusEffects() {
        const processedEffects = [];
        
        // Process each status effect
        this.statusEffects = this.statusEffects.filter(effect => {
            // Decrement turns remaining
            effect.turnsRemaining--;
            
            // Process effect based on type
            switch (effect.type) {
                case 'DOT':
                    // Damage over time
                    this.takeDamage(effect.damage, null);
                    processedEffects.push({
                        type: effect.type,
                        value: effect.damage
                    });
                    break;
                    
                case 'DEBUFF':
                case 'BUFF':
                    // Stat effects are applied when the effect is first added
                    // and removed when the effect expires
                    processedEffects.push({
                        type: effect.type,
                        stat: effect.stat,
                        value: effect.amount
                    });
                    break;
                    
                // Other effect types can be processed here
            }
            
            // Keep effect if turns remaining > 0
            return effect.turnsRemaining > 0;
        });
        
        return processedEffects;
    }
    
    /**
     * Takes damage from an attack or effect
     * @param {number} amount - Amount of damage
     * @param {Monster} attacker - Monster that caused the damage (null for effects)
     * @returns {number} Actual damage dealt
     */
    takeDamage(amount, attacker) {
        // Calculate actual damage (considering defense)
        const actualDamage = Math.max(1, amount - Math.floor(this.currentStats.defense / 3));
        
        // Emit monster damaged event
        EventSystem.emit(EVENTS.MONSTER_DAMAGED, {
            monster: this,
            damage: actualDamage,
            attacker
        });
        
        // Log the damage
        if (attacker) {
            GameLogger.log(
                `${this.getCurrentName()} took ${actualDamage} damage from ${attacker.getCurrentName()}!`,
                this.owner
            );
        } else {
            GameLogger.log(
                `${this.getCurrentName()} took ${actualDamage} damage from an effect!`,
                this.owner
            );
        }
        
        return actualDamage;
    }
    
    /**
     * Gets the monster's current stats with all active effects applied
     * @returns {Object} Current stats with effects
     */
    getEffectiveStats() {
        // Start with current stats
        const stats = { ...this.currentStats };
        
        // Apply all active status effects that modify stats
        this.statusEffects.forEach(effect => {
            if ((effect.type === 'BUFF' || effect.type === 'DEBUFF') && effect.stat in stats) {
                stats[effect.stat] += effect.amount;
            }
        });
        
        // Ensure no stat goes below 1
        for (const key in stats) {
            if (typeof stats[key] === 'number') {
                stats[key] = Math.max(1, stats[key]);
            }
        }
        
        return stats;
    }
    
    /**
     * Checks if monster has a specific status effect
     * @param {string} effectType - Type of effect to check for
     * @returns {boolean} True if monster has the effect
     */
    hasStatusEffect(effectType) {
        return this.statusEffects.some(effect => effect.type === effectType);
    }
    
    /**
     * Removes all status effects
     */
    clearStatusEffects() {
        this.statusEffects = [];
    }
    
    /**
     * Gets a data object with all monster information
     * @returns {Object} Monster data
     */
    toJSON() {
        return {
            id: this.id,
            name: this.getCurrentName(),
            element: this.element,
            owner: this.owner,
            portrait: this.portrait,
            stats: this.getEffectiveStats(),
            currentMana: this.currentMana,
            manaCapacity: this.getManaCapacity(),
            manaPercentage: this.getManaPercentage(),
            berryCount: this.berryCount,
            evolved: this.evolved,
            ability: this.ability,
            statusEffects: this.statusEffects,
            canEvolve: this.canEvolve(),
            canBoost: this.canBoost()
        };
    }
}

// ==========================================================================
// Monster Manager Class
// ==========================================================================

/**
 * Manages monster collections and selections
 */
class MonsterManager {
    constructor() {
        // Available monsters for selection
        this.availableMonsters = [...MONSTERS];
        
        // Player monster collections
        this.playerMonsters = {
            [PLAYERS.PLAYER1]: [],
            [PLAYERS.PLAYER2]: []
        };
        
        // Current selection state
        this.selectionMode = null;
        this.selectionState = {
            currentPlayer: null,
            selectedMonsters: [],
            remainingSelections: 0,
            draftOrder: []
        };
        
        // Bind event handlers
        this.handleModeSelected = this.handleModeSelected.bind(this);
        
        // Listen for mode selection
        EventSystem.on(EVENTS.MODE_SELECTED, this.handleModeSelected);
    }
    
    /**
     * Handles game mode selection
     * @param {Object} data - Mode selection data
     */
    handleModeSelected(data) {
        this.selectionMode = data.mode;
        this.initializeSelection();
    }
    
    /**
     * Initializes monster selection based on game mode
     */
    initializeSelection() {
        // Reset player monsters
        this.playerMonsters = {
            [PLAYERS.PLAYER1]: [],
            [PLAYERS.PLAYER2]: []
        };
        
        // Reset available monsters
        this.availableMonsters = [...MONSTERS];
        
        // Initialize selection state based on mode
        if (this.selectionMode === GAME_MODES.DRAFT) {
            this.initializeDraftMode();
        } else if (this.selectionMode === GAME_MODES.ALL_PICK) {
            this.initializeAllPickMode();
        }
    }
    
    /**
     * Initializes draft mode selection
     */
    initializeDraftMode() {
        // Randomly determine first player
        const firstPlayer = Math.random() < 0.5 ? PLAYERS.PLAYER1 : PLAYERS.PLAYER2;
        const secondPlayer = firstPlayer === PLAYERS.PLAYER1 ? PLAYERS.PLAYER2 : PLAYERS.PLAYER1;
        
        // Set up draft order: P1, P2, P2, P1
        this.selectionState = {
            currentPlayer: firstPlayer,
            selectedMonsters: [],
            remainingSelections: 4,
            draftOrder: [firstPlayer, secondPlayer, secondPlayer, firstPlayer]
        };
        
        // Log the draft start
        GameLogger.log(`Draft mode started. ${firstPlayer} selects first.`, 'system');
    }
    
    /**
     * Initializes all-pick mode selection
     */
    initializeAllPickMode() {
        this.selectionState = {
            currentPlayer: PLAYERS.PLAYER1,
            selectedMonsters: [],
            remainingSelections: 4, // 2 per player
            selectedElements: {
                [PLAYERS.PLAYER1]: [],
                [PLAYERS.PLAYER2]: []
            }
        };
        
        // Log the all-pick start
        GameLogger.log('All-pick mode started. Both players select their monsters.', 'system');
    }
    
    /**
     * Selects a monster in draft mode
     * @param {number} monsterId - ID of the selected monster
     * @returns {Object|null} Selection result or null if invalid
     */
    selectMonsterInDraft(monsterId) {
        // Find the monster in available monsters
        const monsterIndex = this.availableMonsters.findIndex(m => m.id === monsterId);
        if (monsterIndex === -1) {
            return null;
        }
        
        const monster = this.availableMonsters[monsterIndex];
        const currentPlayer = this.selectionState.currentPlayer;
        
        // Create a new monster instance for the player
        const playerMonster = new Monster(monster, currentPlayer);
        
        // Add to player's collection
        this.playerMonsters[currentPlayer].push(playerMonster);
        
        // Remove from available monsters
        this.availableMonsters.splice(monsterIndex, 1);
        
        // Remove all monsters of the same element from available monsters
        this.availableMonsters = this.availableMonsters.filter(
            m => m.element !== monster.element
        );
        
        // Update selection state
        this.selectionState.selectedMonsters.push(monster.id);
        this.selectionState.remainingSelections--;
        
        // Move to next player in draft order
        if (this.selectionState.remainingSelections > 0) {
            const nextPlayerIndex = 4 - this.selectionState.remainingSelections;
            this.selectionState.currentPlayer = this.selectionState.draftOrder[nextPlayerIndex];
        }
        
        // Log the selection
        GameLogger.log(
            `${currentPlayer} selected ${monster.name} (${monster.element})`,
            currentPlayer
        );
        
        // Return selection result
        return {
            monster: playerMonster,
            player: currentPlayer,
            remainingSelections: this.selectionState.remainingSelections,
            nextPlayer: this.selectionState.currentPlayer,
            isComplete: this.selectionState.remainingSelections === 0
        };
    }
    
    /**
     * Selects a monster in all-pick mode
     * @param {number} monsterId - ID of the selected monster
     * @param {string} player - Player making the selection
     * @returns {Object|null} Selection result or null if invalid
     */
    selectMonsterInAllPick(monsterId, player) {
        // Verify it's a valid player
        if (player !== PLAYERS.PLAYER1 && player !== PLAYERS.PLAYER2) {
            return null;
        }
        
        // Find the monster in available monsters
        const monsterIndex = this.availableMonsters.findIndex(m => m.id === monsterId);
        if (monsterIndex === -1) {
            return null;
        }
        
        const monster = this.availableMonsters[monsterIndex];
        
        // Check if player already has a monster of this element
        const hasElementAlready = this.playerMonsters[player].some(
            m => m.element === monster.element
        );
        
        if (hasElementAlready) {
            return {
                error: 'You already have a monster of this element',
                success: false
            };
        }
        
        // Check if player already has 2 monsters
        if (this.playerMonsters[player].length >= 2) {
            return {
                error: 'You already have the maximum number of monsters',
                success: false
            };
        }
        
        // Create a new monster instance for the player
        const playerMonster = new Monster(monster, player);
        
        // Add to player's collection
        this.playerMonsters[player].push(playerMonster);
        
        // Track selected element
        if (!this.selectionState.selectedElements[player]) {
            this.selectionState.selectedElements[player] = [];
        }
        this.selectionState.selectedElements[player].push(monster.element);
        
        // Update selection state
        this.selectionState.selectedMonsters.push(monster.id);
        this.selectionState.remainingSelections--;
        
        // Log the selection
        GameLogger.log(
            `${player} selected ${monster.name} (${monster.element})`,
            player
        );
        
        // Return selection result
        return {
            monster: playerMonster,
            player: player,
            remainingSelections: this.selectionState.remainingSelections,
            isComplete: this.isAllPickComplete(),
            success: true
        };
    }
    
    /**
     * Checks if all-pick selection is complete
     * @returns {boolean} True if selection is complete
     */
    isAllPickComplete() {
        return (
            this.playerMonsters[PLAYERS.PLAYER1].length === 2 &&
            this.playerMonsters[PLAYERS.PLAYER2].length === 2
        );
    }
    
    /**
     * Gets available monsters for selection
     * @param {string} player - Current player
     * @returns {Array} Available monsters
     */
    getAvailableMonstersForSelection(player) {
        if (this.selectionMode === GAME_MODES.DRAFT) {
            return this.availableMonsters;
        } else if (this.selectionMode === GAME_MODES.ALL_PICK) {
            // Filter out monsters with elements already selected by this player
            const selectedElements = this.selectionState.selectedElements[player] || [];
            return this.availableMonsters.filter(
                monster => !selectedElements.includes(monster.element)
            );
        }
        return this.availableMonsters;
    }
    
    /**
     * Finalizes monster selection and prepares for battle
     * @returns {Object} Battle initialization data
     */
    finalizeMonstersAndStartBattle() {
        // For all-pick mode, randomly determine first player
        let firstPlayer;
        let secondPlayer;
        
        if (this.selectionMode === GAME_MODES.ALL_PICK) {
            firstPlayer = Math.random() < 0.5 ? PLAYERS.PLAYER1 : PLAYERS.PLAYER2;
            secondPlayer = firstPlayer === PLAYERS.PLAYER1 ? PLAYERS.PLAYER2 : PLAYERS.PLAYER1;
            
            // Give second player bonus HP
            this.applySecondPlayerBonus(secondPlayer);
        } else {
            // For draft mode, the player who picked last goes first
            firstPlayer = this.selectionState.draftOrder[3];
            secondPlayer = firstPlayer === PLAYERS.PLAYER1 ? PLAYERS.PLAYER2 : PLAYERS.PLAYER1;
        }
        
        // Log battle start
        GameLogger.log(
            `Battle is starting! ${firstPlayer} goes first.`,
            'system'
        );
        
        // Return battle initialization data
        return {
            firstPlayer,
            secondPlayer,
            player1Monsters: this.playerMonsters[PLAYERS.PLAYER1],
            player2Monsters: this.playerMonsters[PLAYERS.PLAYER2]
        };
    }
    
    /**
     * Applies second player bonus HP
     * @param {string} player - Second player ID
     */
    applySecondPlayerBonus(player) {
        // Add bonus HP to all monsters of the second player
        this.playerMonsters[player].forEach(monster => {
            monster.currentStats.hp += GAME_CONFIG.SECOND_PLAYER_BONUS_HP;
        });
        
        // Log the bonus
        GameLogger.log(
            `${player} received a ${GAME_CONFIG.SECOND_PLAYER_BONUS_HP} HP bonus for going second.`,
            'system'
        );
    }
    
    /**
     * Gets a player's monsters
     * @param {string} player - Player ID
     * @returns {Array} Player's monsters
     */
    getPlayerMonsters(player) {
        return this.playerMonsters[player] || [];
    }
    
    /**
     * Gets a monster by ID and owner
     * @param {number} monsterId - Monster ID
     * @param {string} owner - Owner player ID
     * @returns {Monster|null} Monster object or null
     */
    getMonsterById(monsterId, owner) {
        if (!this.playerMonsters[owner]) {
            return null;
        }
        
        return this.playerMonsters[owner].find(monster => monster.id === monsterId) || null;
    }
    
    /**
     * Processes monster abilities when mana is full
     * @param {string} player - Current player
     * @returns {Array} Ability results
     */
    processMonsterAbilities(player) {
        const results = [];
        const playerMonsters = this.getPlayerMonsters(player);
        const opponentMonsters = this.getPlayerMonsters(
            player === PLAYERS.PLAYER1 ? PLAYERS.PLAYER2 : PLAYERS.PLAYER1
        );
        
        // Check each monster for full mana
        playerMonsters.forEach(monster => {
            if (monster.getManaPercentage() >= 100) {
                // Activate ability targeting opponent monsters
                const abilityResult = monster.activateAbility(opponentMonsters);
                
                if (abilityResult) {
                    results.push({
                        monster,
                        ...abilityResult
                    });
                }
            }
        });
        
        return results;
    }
    
    /**
     * Processes start of turn effects for a player's monsters
     * @param {string} player - Current player
     * @returns {Object} Processed effects
     */
    processStartOfTurnEffects(player) {
        const effects = {
            statusEffects: []
        };
        
        // Process status effects for all player monsters
        this.getPlayerMonsters(player).forEach(monster => {
            const processedEffects = monster.processStatusEffects();
            if (processedEffects.length > 0) {
                effects.statusEffects.push({
                    monster,
                    effects: processedEffects
                });
            }
        });
        
        return effects;
    }
    
    /**
     * Calculates total player HP
     * @param {string} player - Player ID
     * @returns {number} Total HP
     */
    calculatePlayerTotalHP(player) {
        return this.getPlayerMonsters(player).reduce(
            (total, monster) => total + monster.currentStats.hp,
            0
        );
    }
    
    /**
     * Resets the monster manager for a new game
     */
    reset() {
        // Reset collections
        this.playerMonsters = {
            [PLAYERS.PLAYER1]: [],
            [PLAYERS.PLAYER2]: []
        };
        
        // Reset available monsters
        this.availableMonsters = [...MONSTERS];
        
        // Reset selection state
        this.selectionMode = null;
        this.selectionState = {
            currentPlayer: null,
            selectedMonsters: [],
            remainingSelections: 0,
            draftOrder: []
        };
    }
}

// ==========================================================================
// Monster AI
// ==========================================================================

/**
 * AI for monster decision making
 */
class MonsterAI {
    /**
     * Creates a new Monster AI
     * @param {MonsterManager} monsterManager - Reference to monster manager
     */
    constructor(monsterManager) {
        this.monsterManager = monsterManager;
    }
    
    /**
     * Decides which monster to evolve
     * @param {string} player - AI player ID
     * @returns {Monster|null} Monster to evolve or null
     */
    decideEvolution(player) {
        const monsters = this.monsterManager.getPlayerMonsters(player);
        
        // Filter monsters that can evolve
        const evolvableMonsters = monsters.filter(monster => monster.canEvolve());
        
        if (evolvableMonsters.length === 0) {
            return null;
        }
        
        // For now, simply pick the first monster that can evolve
        // More sophisticated logic can be added here
        return evolvableMonsters[0];
    }
    
    /**
     * Decides which monster to boost
     * @param {string} player - AI player ID
     * @returns {Monster|null} Monster to boost or null
     */
    decideBoost(player) {
        const monsters = this.monsterManager.getPlayerMonsters(player);
        
        // Filter monsters that can be boosted
        const boostableMonsters = monsters.filter(monster => monster.canBoost());
        
        if (boostableMonsters.length === 0) {
            return null;
        }
        
        // Prioritize monsters with more mana
        boostableMonsters.sort((a, b) => b.currentMana - a.currentMana);
        
        // Boost the monster with the most mana
        return boostableMonsters[0];
    }
    
    /**
     * Decides the best match to make on the board
     * @param {Array} possibleMatches - Array of possible matches
     * @param {string} player - AI player ID
     * @returns {Object|null} Best match or null
     */
    decideBestMatch(possibleMatches, player) {
        if (possibleMatches.length === 0) {
            return null;
        }
        
        const monsters = this.monsterManager.getPlayerMonsters(player);
        const monsterElements = monsters.map(monster => monster.element);
        
        // Score each match
        const scoredMatches = possibleMatches.map(match => {
            let score = 0;
            
            // Prioritize matches of elements that match our monsters
            if (monsterElements.includes(match.element)) {
                score += 5;
                
                // Extra points for monsters with more mana
                const monster = monsters.find(m => m.element === match.element);
                if (monster) {
                    // Prioritize monsters closer to full mana
                    const manaPercentage = monster.getManaPercentage();
                    score += manaPercentage / 20; // 0-5 points based on mana
                }
            }
            
            // Prioritize berry matches if monsters need evolution
            if (match.element === ELEMENT_TYPES.BERRY) {
                const needsEvolution = monsters.some(m => !m.evolved && m.berryCount < GAME_CONFIG.BERRIES_FOR_EVOLUTION);
                if (needsEvolution) {
                    score += 4;
                }
                
                const needsBoost = monsters.some(m => m.evolved && m.berryCount < GAME_CONFIG.BERRIES_FOR_BOOST);
                if (needsBoost) {
                    score += 3;
                }
            }
            
            // Bonus for larger matches
            score += match.size - 3; // 0 points for 3-match, 1 for 4-match, etc.
            
            return { ...match, score };
        });
        
        // Sort by score (highest first)
        scoredMatches.sort((a, b) => b.score - a.score);
        
        // Return the highest scored match
        return scoredMatches[0];
    }
    
    /**
     * Makes AI decisions for a turn
     * @param {string} player - AI player ID
     * @param {Array} possibleMatches - Array of possible matches
     * @param {number} movesRemaining - Number of moves remaining
     * @returns {Object} AI decision
     */
    makeDecision(player, possibleMatches, movesRemaining) {
        // First check if we should evolve
        const evolutionCandidate = this.decideEvolution(player);
        if (evolutionCandidate && movesRemaining > 0) {
            return {
                action: 'evolve',
                monster: evolutionCandidate
            };
        }
        
        // Then check if we should boost
        const boostCandidate = this.decideBoost(player);
        if (boostCandidate && movesRemaining > 0) {
            return {
                action: 'boost',
                monster: boostCandidate
            };
        }
        
        // Otherwise make a match
        const bestMatch = this.decideBestMatch(possibleMatches, player);
        if (bestMatch) {
            return {
                action: 'match',
                match: bestMatch
            };
        }
        
        // No valid moves
        return { action: 'none' };
    }
}

// ==========================================================================
// Helper Functions
// ==========================================================================

/**
 * Gets a random subset of monsters for selection
 * @param {number} count - Number of monsters to select
 * @returns {Array} Random monsters
 */
function getRandomMonsterSelection(count) {
    return getRandomSubset(MONSTERS, count);
}

/**
 * Gets monsters filtered by element
 * @param {string} element - Element type
 * @returns {Array} Filtered monsters
 */
function getMonstersByElement(element) {
    return MONSTERS.filter(monster => monster.element === element);
}

/**
 * Creates a monster instance from data
 * @param {number} monsterId - Monster ID
 * @param {string} owner - Owner player ID
 * @returns {Monster|null} Monster instance or null
 */
function createMonsterFromId(monsterId, owner) {
    const monsterData = MONSTERS.find(monster => monster.id === monsterId);
    if (!monsterData) {
        return null;
    }
    
    return new Monster(monsterData, owner);
}

// Export classes and functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Monster,
        MonsterManager,
        MonsterAI,
        getRandomMonsterSelection,
        getMonstersByElement,
        createMonsterFromId
    };
}
