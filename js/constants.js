/**
 * Match Monsters - Constants
 * This file contains all the constants and configuration values used throughout the game.
 */

// Game Configuration
const GAME_CONFIG = {
    // Board configuration
    BOARD_SIZE: 8,              // 8x8 grid
    TILE_SIZE: 60,              // Pixel size of tiles
    TILE_GAP: 6,                // Gap between tiles
    
    // Game mechanics
    MOVES_PER_TURN: 2,          // Each player gets 2 moves per turn
    STARTING_HP: 30,            // Starting HP for each player
    SECOND_PLAYER_BONUS_HP: 5,  // Bonus HP for the second player
    MIN_MATCH_SIZE: 3,          // Minimum tiles for a match
    EXTRA_MOVE_MATCH_SIZE: 4,   // Minimum match size to get an extra move
    MAX_EXTRA_MOVES_PER_TURN: 1,// Maximum extra moves allowed per turn
    
    // Evolution & Boost
    BERRIES_FOR_EVOLUTION: 4,   // Berries needed to evolve a monster
    BERRIES_FOR_BOOST: 4,       // Berries needed to boost a monster
    MANA_FROM_BOOST: 4,         // Mana points added from a boost
    
    // Animation speeds (in milliseconds)
    ANIMATION_SPEED: {
        FAST: 200,
        MEDIUM: 400,
        SLOW: 800,
        TILE_SWAP: 200,
        TILE_MATCH: 300,
        TILE_FALL: 400,
        MONSTER_ATTACK: 500,
        MONSTER_DAMAGE: 400,
        MONSTER_EVOLUTION: 800,
        MONSTER_BOOST: 500,
        NOTIFICATION: 2000
    },
    
    // Probabilities
    ELEMENT_DISTRIBUTION: {
        FIRE: 0.18,
        WATER: 0.18,
        EARTH: 0.18,
        AIR: 0.18,
        LIGHT: 0.18,
        BERRY: 0.1
    },
    
    // Game flow
    TURN_TRANSITION_DELAY: 1000, // Delay between turns in ms
    ATTACK_EFFECT_DURATION: 500, // Duration of attack visual effects
    
    // UI
    UI_UPDATE_DELAY: 100,        // Delay between UI updates
    LOG_MAX_ENTRIES: 50,         // Maximum number of log entries to keep
};

// Element Types
const ELEMENT_TYPES = {
    FIRE: 'fire',
    WATER: 'water',
    EARTH: 'earth',
    AIR: 'air',
    LIGHT: 'light',
    BERRY: 'berry'  // Special element for evolution
};

// Element Relationships (strengths and weaknesses)
const ELEMENT_RELATIONSHIPS = {
    [ELEMENT_TYPES.FIRE]: {
        strong: [ELEMENT_TYPES.EARTH],
        weak: [ELEMENT_TYPES.WATER]
    },
    [ELEMENT_TYPES.WATER]: {
        strong: [ELEMENT_TYPES.FIRE],
        weak: [ELEMENT_TYPES.EARTH]
    },
    [ELEMENT_TYPES.EARTH]: {
        strong: [ELEMENT_TYPES.AIR],
        weak: [ELEMENT_TYPES.FIRE]
    },
    [ELEMENT_TYPES.AIR]: {
        strong: [ELEMENT_TYPES.WATER],
        weak: [ELEMENT_TYPES.EARTH]
    },
    [ELEMENT_TYPES.LIGHT]: {
        strong: [ELEMENT_TYPES.AIR],
        weak: [ELEMENT_TYPES.LIGHT]
    }
};

// Game Modes
const GAME_MODES = {
    DRAFT: 'draft',
    ALL_PICK: 'allPick'
};

// Game States
const GAME_STATES = {
    MENU: 'menu',
    MODE_SELECTION: 'modeSelection',
    MONSTER_SELECTION: 'monsterSelection',
    BATTLE: 'battle',
    PLAYER_TURN: 'playerTurn',
    OPPONENT_TURN: 'opponentTurn',
    ANIMATION: 'animation',
    GAME_OVER: 'gameOver'
};

// Player IDs
const PLAYERS = {
    PLAYER1: 'player1',
    PLAYER2: 'player2'
};

// Monster Data
const MONSTERS = [
    {
        id: 1,
        name: 'Emberclaw',
        element: ELEMENT_TYPES.FIRE,
        baseStats: {
            hp: 25,
            attack: 8,
            defense: 5,
            manaCapacity: 10
        },
        ability: {
            name: 'Flame Burst',
            description: 'Deals fire damage to the opponent and has a chance to burn, causing damage over time.',
            damage: 6,
            effectChance: 0.3,
            effect: {
                type: 'DOT',
                damage: 2,
                duration: 2
            }
        },
        evolution: {
            name: 'Infernofang',
            statBoosts: {
                hp: 5,
                attack: 3,
                defense: 2,
                manaCapacity: 2
            },
            abilityBoost: {
                damage: 2,
                effectChance: 0.4
            }
        },
        description: 'A fiery feline monster with blazing claws and a temperamental nature.',
        portrait: 'assets/images/monsters/emberclaw.png'
    },
    {
        id: 2,
        name: 'Aquafin',
        element: ELEMENT_TYPES.WATER,
        baseStats: {
            hp: 30,
            attack: 6,
            defense: 7,
            manaCapacity: 9
        },
        ability: {
            name: 'Tidal Wave',
            description: 'Unleashes a powerful wave that deals water damage and may reduce the opponent\'s attack.',
            damage: 5,
            effectChance: 0.4,
            effect: {
                type: 'DEBUFF',
                stat: 'attack',
                amount: -2,
                duration: 2
            }
        },
        evolution: {
            name: 'Tsunamiray',
            statBoosts: {
                hp: 7,
                attack: 2,
                defense: 3,
                manaCapacity: 2
            },
            abilityBoost: {
                damage: 2,
                effectChance: 0.5
            }
        },
        description: 'A graceful aquatic monster that can manipulate water currents with its elegant fins.',
        portrait: 'assets/images/monsters/aquafin.png'
    },
    {
        id: 3,
        name: 'Terravine',
        element: ELEMENT_TYPES.EARTH,
        baseStats: {
            hp: 35,
            attack: 5,
            defense: 9,
            manaCapacity: 11
        },
        ability: {
            name: 'Root Grasp',
            description: 'Entangles the opponent with roots, dealing earth damage and potentially immobilizing them.',
            damage: 4,
            effectChance: 0.3,
            effect: {
                type: 'STUN',
                duration: 1
            }
        },
        evolution: {
            name: 'Quakewood',
            statBoosts: {
                hp: 8,
                attack: 2,
                defense: 4,
                manaCapacity: 2
            },
            abilityBoost: {
                damage: 2,
                effectChance: 0.4
            }
        },
        description: 'A plant-like monster with vines that can burrow deep into the earth to draw power.',
        portrait: 'assets/images/monsters/terravine.png'
    },
    {
        id: 4,
        name: 'Zephyrwing',
        element: ELEMENT_TYPES.AIR,
        baseStats: {
            hp: 22,
            attack: 9,
            defense: 4,
            manaCapacity: 8
        },
        ability: {
            name: 'Cyclone Strike',
            description: 'Summons a whirlwind that deals air damage and increases the monster\'s speed.',
            damage: 7,
            effectChance: 0.5,
            effect: {
                type: 'BUFF',
                stat: 'speed',
                amount: 2,
                duration: 2
            }
        },
        evolution: {
            name: 'Stormtalon',
            statBoosts: {
                hp: 4,
                attack: 4,
                defense: 2,
                manaCapacity: 3
            },
            abilityBoost: {
                damage: 3,
                effectChance: 0.6
            }
        },
        description: 'A swift avian monster that can generate powerful gusts of wind with its wings.',
        portrait: 'assets/images/monsters/zephyrwing.png'
    },
    {
        id: 5,
        name: 'Lumiglow',
        element: ELEMENT_TYPES.LIGHT,
        baseStats: {
            hp: 28,
            attack: 7,
            defense: 6,
            manaCapacity: 10
        },
        ability: {
            name: 'Radiant Beam',
            description: 'Fires a beam of pure light that deals damage and may temporarily blind the opponent.',
            damage: 6,
            effectChance: 0.35,
            effect: {
                type: 'ACCURACY_DOWN',
                amount: -0.3,
                duration: 2
            }
        },
        evolution: {
            name: 'Solarflare',
            statBoosts: {
                hp: 6,
                attack: 3,
                defense: 2,
                manaCapacity: 3
            },
            abilityBoost: {
                damage: 2,
                effectChance: 0.45
            }
        },
        description: 'A luminous monster that absorbs and channels the power of light to create dazzling attacks.',
        portrait: 'assets/images/monsters/lumiglow.png'
    },
    {
        id: 6,
        name: 'Magmahorn',
        element: ELEMENT_TYPES.FIRE,
        baseStats: {
            hp: 32,
            attack: 7,
            defense: 6,
            manaCapacity: 9
        },
        ability: {
            name: 'Volcanic Charge',
            description: 'Charges at the opponent with a body cloaked in magma, dealing fire damage and leaving a trail of flames.',
            damage: 7,
            effectChance: 0.25,
            effect: {
                type: 'FIELD_EFFECT',
                effect: 'LAVA_FIELD',
                duration: 2
            }
        },
        evolution: {
            name: 'Eruption Beast',
            statBoosts: {
                hp: 7,
                attack: 4,
                defense: 2,
                manaCapacity: 2
            },
            abilityBoost: {
                damage: 3,
                effectChance: 0.35
            }
        },
        description: 'A rhinoceros-like monster with a body of hardened magma and a horn that can melt through steel.',
        portrait: 'assets/images/monsters/magmahorn.png'
    },
    {
        id: 7,
        name: 'Coralshell',
        element: ELEMENT_TYPES.WATER,
        baseStats: {
            hp: 33,
            attack: 5,
            defense: 10,
            manaCapacity: 10
        },
        ability: {
            name: 'Reef Barrier',
            description: 'Creates a protective coral barrier that reduces damage and counterattacks with water jets.',
            damage: 4,
            effectChance: 0.6,
            effect: {
                type: 'SHIELD',
                amount: 5,
                duration: 2
            }
        },
        evolution: {
            name: 'Abyssal Guardian',
            statBoosts: {
                hp: 8,
                attack: 2,
                defense: 5,
                manaCapacity: 2
            },
            abilityBoost: {
                damage: 2,
                effectChance: 0.7
            }
        },
        description: 'A defensive monster covered in vibrant coral that can manipulate water pressure to create powerful barriers.',
        portrait: 'assets/images/monsters/coralshell.png'
    },
    {
        id: 8,
        name: 'Crystalspike',
        element: ELEMENT_TYPES.EARTH,
        baseStats: {
            hp: 27,
            attack: 8,
            defense: 7,
            manaCapacity: 9
        },
        ability: {
            name: 'Gem Shatter',
            description: 'Launches razor-sharp crystal fragments that deal earth damage and may reduce defense.',
            damage: 6,
            effectChance: 0.4,
            effect: {
                type: 'DEBUFF',
                stat: 'defense',
                amount: -3,
                duration: 2
            }
        },
        evolution: {
            name: 'Geode Monarch',
            statBoosts: {
                hp: 6,
                attack: 4,
                defense: 3,
                manaCapacity: 2
            },
            abilityBoost: {
                damage: 3,
                effectChance: 0.5
            }
        },
        description: 'A monster with a body composed of glittering crystals that can be weaponized for devastating attacks.',
        portrait: 'assets/images/monsters/crystalspike.png'
    },
    {
        id: 9,
        name: 'Mistwisp',
        element: ELEMENT_TYPES.AIR,
        baseStats: {
            hp: 24,
            attack: 6,
            defense: 5,
            manaCapacity: 8
        },
        ability: {
            name: 'Fog Shroud',
            description: 'Surrounds the battlefield with thick fog, dealing air damage and increasing evasion.',
            damage: 5,
            effectChance: 0.5,
            effect: {
                type: 'BUFF',
                stat: 'evasion',
                amount: 0.3,
                duration: 2
            }
        },
        evolution: {
            name: 'Phantom Gale',
            statBoosts: {
                hp: 5,
                attack: 3,
                defense: 2,
                manaCapacity: 3
            },
            abilityBoost: {
                damage: 2,
                effectChance: 0.6
            }
        },
        description: 'An ethereal monster composed of swirling mist that can become nearly invisible during battle.',
        portrait: 'assets/images/monsters/mistwisp.png'
    },
    {
        id: 10,
        name: 'Prismbeam',
        element: ELEMENT_TYPES.LIGHT,
        baseStats: {
            hp: 26,
            attack: 8,
            defense: 5,
            manaCapacity: 9
        },
        ability: {
            name: 'Spectrum Blast',
            description: 'Fires a rainbow-colored beam that deals light damage and may hit with a random elemental effect.',
            damage: 6,
            effectChance: 0.4,
            effect: {
                type: 'RANDOM_ELEMENT',
                duration: 1
            }
        },
        evolution: {
            name: 'Chromaray',
            statBoosts: {
                hp: 5,
                attack: 4,
                defense: 2,
                manaCapacity: 3
            },
            abilityBoost: {
                damage: 3,
                effectChance: 0.5
            }
        },
        description: 'A monster that can refract light through its crystalline body to create powerful multi-colored attacks.',
        portrait: 'assets/images/monsters/prismbeam.png'
    }
];

// Game Stages
const STAGES = [
    {
        id: 'volcano',
        name: 'Volcano Arena',
        description: 'A battlefield surrounded by active lava flows. Fire monsters gain a slight advantage here.',
        background: 'assets/images/stages/volcano.jpg',
        elementBonus: ELEMENT_TYPES.FIRE,
        bonusAmount: 1 // +1 to attack for fire monsters
    },
    {
        id: 'ocean',
        name: 'Deep Ocean Trench',
        description: 'A submerged arena deep beneath the waves. Water monsters thrive in this environment.',
        background: 'assets/images/stages/ocean.jpg',
        elementBonus: ELEMENT_TYPES.WATER,
        bonusAmount: 1
    },
    {
        id: 'forest',
        name: 'Ancient Forest',
        description: 'A battlefield among towering trees and dense vegetation. Earth monsters gain strength here.',
        background: 'assets/images/stages/forest.jpg',
        elementBonus: ELEMENT_TYPES.EARTH,
        bonusAmount: 1
    },
    {
        id: 'mountain',
        name: 'Floating Mountains',
        description: 'An arena set among mountains that hover in the sky. Air monsters have the advantage here.',
        background: 'assets/images/stages/mountain.jpg',
        elementBonus: ELEMENT_TYPES.AIR,
        bonusAmount: 1
    },
    {
        id: 'temple',
        name: 'Radiant Temple',
        description: 'A sacred temple bathed in brilliant light. Light monsters gain power in this hallowed place.',
        background: 'assets/images/stages/temple.jpg',
        elementBonus: ELEMENT_TYPES.LIGHT,
        bonusAmount: 1
    }
];

// UI Element Selectors
const UI_SELECTORS = {
    // Main containers
    GAME_CONTAINER: '#game-container',
    GAME_BOARD: '#game-board',
    BOARD_CONTAINER: '#board-container',
    GAME_HEADER: '#game-header',
    GAME_CONTROLS: '#game-controls',
    GAME_LOG: '#game-log',
    LOG_CONTENT: '#log-content',
    
    // Player info
    PLAYER1_INFO: '#player1-info',
    PLAYER2_INFO: '#player2-info',
    PLAYER1_HP_FILL: '#player1-hp-fill',
    PLAYER2_HP_FILL: '#player2-hp-fill',
    PLAYER1_HP_VALUE: '#player1-hp-value',
    PLAYER2_HP_VALUE: '#player2-hp-value',
    PLAYER1_MONSTERS: '#player1-monsters',
    PLAYER2_MONSTERS: '#player2-monsters',
    PLAYER1_MOVES: '#player1-moves',
    PLAYER2_MOVES: '#player2-moves',
    
    // Game controls
    EVOLVE_BTN: '#evolve-btn',
    BOOST_BTN: '#boost-btn',
    MONSTER_INFO_BTN: '#monster-info-btn',
    NEW_GAME_BTN: '#new-game-btn',
    HOW_TO_PLAY_BTN: '#how-to-play-btn',
    SETTINGS_BTN: '#settings-btn',
    
    // Modals
    GAME_MODE_MODAL: '#game-mode-modal',
    DRAFT_SELECTION_MODAL: '#draft-selection-modal',
    ALL_PICK_MODAL: '#all-pick-modal',
    MONSTER_INFO_MODAL: '#monster-info-modal',
    GAME_OVER_MODAL: '#game-over-modal',
    HOW_TO_PLAY_MODAL: '#how-to-play-modal',
    
    // Modal content
    DRAFT_MODE_BTN: '#draft-mode-btn',
    ALL_PICK_MODE_BTN: '#all-pick-mode-btn',
    MODE_DESCRIPTION: '#mode-description',
    DRAFT_STATUS: '#draft-status',
    ALL_PICK_STATUS: '#all-pick-status',
    AVAILABLE_MONSTERS: '#available-monsters',
    ALL_PICK_MONSTERS: '#all-pick-monsters',
    CONFIRM_SELECTION_BTN: '#confirm-selection-btn',
    
    // Monster info
    MONSTER_INFO_NAME: '#monster-info-name',
    MONSTER_INFO_PORTRAIT: '#monster-info-portrait',
    MONSTER_INFO_ELEMENT: '#monster-info-element',
    MONSTER_INFO_HP: '#monster-info-hp',
    MONSTER_INFO_ATTACK: '#monster-info-attack',
    MONSTER_INFO_ABILITY: '#monster-info-ability',
    MONSTER_INFO_EVOLUTION: '#monster-info-evolution',
    
    // Game over
    WINNER_DISPLAY: '#winner-display',
    MATCH_DURATION: '#match-duration',
    MOVES_MADE: '#moves-made',
    MATCHES_MADE: '#matches-made',
    PLAY_AGAIN_BTN: '#play-again-btn',
    MAIN_MENU_BTN: '#main-menu-btn',
    
    // Loading screen
    LOADING_SCREEN: '#loading-screen',
    LOADING_PROGRESS: '.loading-progress',
    LOADING_TEXT: '.loading-text',
    
    // Turn indicator
    TURN_INDICATOR: '#turn-indicator'
};

// Event Names
const EVENTS = {
    // Game state events
    GAME_INIT: 'game:init',
    GAME_START: 'game:start',
    GAME_END: 'game:end',
    TURN_START: 'turn:start',
    TURN_END: 'turn:end',
    MODE_SELECTED: 'mode:selected',
    MONSTERS_SELECTED: 'monsters:selected',
    
    // Board events
    BOARD_CREATED: 'board:created',
    TILE_CLICKED: 'tile:clicked',
    TILE_SWAPPED: 'tile:swapped',
    MATCH_FOUND: 'match:found',
    BOARD_REFILLED: 'board:refilled',
    
    // Monster events
    MONSTER_ATTACK: 'monster:attack',
    MONSTER_DAMAGED: 'monster:damaged',
    MONSTER_MANA_UPDATED: 'monster:manaUpdated',
    MONSTER_ABILITY_ACTIVATED: 'monster:abilityActivated',
    MONSTER_EVOLVED: 'monster:evolved',
    MONSTER_BOOSTED: 'monster:boosted',
    
    // Player events
    PLAYER_HP_UPDATED: 'player:hpUpdated',
    PLAYER_MOVE_USED: 'player:moveUsed',
    PLAYER_EXTRA_MOVE_GAINED: 'player:extraMoveGained',
    PLAYER_BERRIES_UPDATED: 'player:berriesUpdated',
    
    // UI events
    UI_UPDATED: 'ui:updated',
    MODAL_OPENED: 'modal:opened',
    MODAL_CLOSED: 'modal:closed',
    
    // Animation events
    ANIMATION_STARTED: 'animation:started',
    ANIMATION_COMPLETED: 'animation:completed'
};

// CSS Classes
const CSS_CLASSES = {
    ACTIVE: 'active',
    SELECTED: 'selected',
    DISABLED: 'disabled',
    HIDDEN: 'hidden',
    VISIBLE: 'visible',
    HIGHLIGHT: 'highlight',
    EVOLVED: 'evolved',
    
    // Animation classes
    ATTACK_ANIMATION: 'attack-animation',
    DAMAGE_ANIMATION: 'damage-animation',
    EVOLVE_ANIMATION: 'evolve-animation',
    BOOST_ANIMATION: 'boost-animation',
    MATCHED: 'matched',
    FALLING: 'falling',
    
    // Element classes
    FIRE: ELEMENT_TYPES.FIRE,
    WATER: ELEMENT_TYPES.WATER,
    EARTH: ELEMENT_TYPES.EARTH,
    AIR: ELEMENT_TYPES.AIR,
    LIGHT: ELEMENT_TYPES.LIGHT,
    BERRY: ELEMENT_TYPES.BERRY,
    
    // Log entry classes
    LOG_ENTRY: 'log-entry',
    PLAYER1: 'player1',
    PLAYER2: 'player2',
    SYSTEM: 'system'
};

// Local Storage Keys
const STORAGE_KEYS = {
    SETTINGS: 'matchMonsters.settings',
    STATS: 'matchMonsters.stats',
    LAST_GAME: 'matchMonsters.lastGame'
};

// Export all constants
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GAME_CONFIG,
        ELEMENT_TYPES,
        ELEMENT_RELATIONSHIPS,
        GAME_MODES,
        GAME_STATES,
        PLAYERS,
        MONSTERS,
        STAGES,
        UI_SELECTORS,
        EVENTS,
        CSS_CLASSES,
        STORAGE_KEYS
    };
}
