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
    
    // Boost
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
        ELECTRIC: 0.18,
        PSYCHIC: 0.18,
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
    ELECTRIC: 'electric',
    PSYCHIC: 'psychic',
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
        weak: [ELEMENT_TYPES.ELECTRIC]
    },
    [ELEMENT_TYPES.EARTH]: {
        strong: [ELEMENT_TYPES.ELECTRIC],
        weak: [ELEMENT_TYPES.FIRE]
    },
    [ELEMENT_TYPES.ELECTRIC]: {
        strong: [ELEMENT_TYPES.WATER],
        weak: [ELEMENT_TYPES.EARTH]
    },
    [ELEMENT_TYPES.PSYCHIC]: {
        strong: [ELEMENT_TYPES.ELECTRIC],
        weak: [ELEMENT_TYPES.PSYCHIC]
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
        name: 'Bonzumi',
        element: ELEMENT_TYPES.FIRE,
        baseStats: {
            hp: 25,
            attack: 8,
            defense: 5,
            manaCost: 8
        },
        ability: {
            name: 'Flare',
            description: 'Attacks for 20 HP and matches a random column.',
            damage: 20,
            effect: {
                type: 'MATCH_COLUMN',
                columns: 1
            }
        },
        evolution: {
            name: 'Bonzire',
            id: 2,
            statBoosts: {
                hp: 5,
                attack: 3,
                defense: 2
            },
            abilityBoost: {
                damage: 5,
                effect: {
                    type: 'MATCH_COLUMN',
                    columns: 2
                }
            }
        },
        description: 'A fiery monkey-like monster with a blazing tail.',
        portrait: 'assets/images/monsters/bonzumi.webp',
        rarity: 'common'
    },
    {
        id: 2,
        name: 'Bonzire',
        element: ELEMENT_TYPES.FIRE,
        baseStats: {
            hp: 30,
            attack: 11,
            defense: 7,
            manaCost: 8
        },
        ability: {
            name: 'Flare+',
            description: 'Attacks for 25 HP and matches 2 random columns.',
            damage: 25,
            effect: {
                type: 'MATCH_COLUMN',
                columns: 2
            }
        },
        evolution: null,
        description: 'An evolved form of Bonzumi with greater fire manipulation abilities.',
        portrait: 'assets/images/monsters/bonzire.webp',
        rarity: 'common'
    },
    {
        id: 3,
        name: 'Pelijet',
        element: ELEMENT_TYPES.WATER,
        baseStats: {
            hp: 28,
            attack: 6,
            defense: 7,
            manaCost: 6
        },
        ability: {
            name: 'Hydro Rush',
            description: 'Attacks for 10 HP and converts 3 random tiles to Water.',
            damage: 10,
            effect: {
                type: 'CONVERT_TILES',
                element: ELEMENT_TYPES.WATER,
                count: 3
            }
        },
        evolution: {
            name: 'Sephanix',
            id: 4,
            statBoosts: {
                hp: 7,
                attack: 4,
                defense: 3
            },
            abilityBoost: {
                damage: 10,
                effect: {
                    type: 'CONVERT_TILES',
                    element: ELEMENT_TYPES.WATER,
                    count: 3
                }
            }
        },
        description: 'A water-dwelling creature that can propel itself with powerful jets of water.',
        portrait: 'assets/images/monsters/pelijet.webp',
        rarity: 'common'
    },
    {
        id: 4,
        name: 'Sephanix',
        element: ELEMENT_TYPES.WATER,
        baseStats: {
            hp: 35,
            attack: 10,
            defense: 10,
            manaCost: 6
        },
        ability: {
            name: 'Hydro Rush+',
            description: 'Attacks for 20 HP and converts 3 random tiles to Water.',
            damage: 20,
            effect: {
                type: 'CONVERT_TILES',
                element: ELEMENT_TYPES.WATER,
                count: 3
            }
        },
        evolution: null,
        description: 'An evolved form of Pelijet with enhanced water manipulation abilities.',
        portrait: 'assets/images/monsters/sephanix.webp',
        rarity: 'common'
    },
    {
        id: 5,
        name: 'Turtlelisk',
        element: ELEMENT_TYPES.EARTH,
        baseStats: {
            hp: 32,
            attack: 5,
            defense: 10,
            manaCost: 6
        },
        ability: {
            name: 'Heal Leaf',
            description: 'Attacks for 10 HP and heals you for 10 HP.',
            damage: 10,
            effect: {
                type: 'HEAL',
                amount: 10
            }
        },
        evolution: {
            name: 'Karaggon',
            id: 6,
            statBoosts: {
                hp: 8,
                attack: 3,
                defense: 5
            },
            abilityBoost: {
                damage: 5,
                effect: {
                    type: 'HEAL',
                    amount: 5
                }
            }
        },
        description: 'A turtle-like monster with a shell covered in vegetation and healing properties.',
        portrait: 'assets/images/monsters/turtlelisk.webp',
        rarity: 'common'
    },
    {
        id: 6,
        name: 'Karaggon',
        element: ELEMENT_TYPES.EARTH,
        baseStats: {
            hp: 40,
            attack: 8,
            defense: 15,
            manaCost: 6
        },
        ability: {
            name: 'Heal Leaf+',
            description: 'Attacks for 15 HP and heals you for 15 HP.',
            damage: 15,
            effect: {
                type: 'HEAL',
                amount: 15
            }
        },
        evolution: null,
        description: 'An evolved form of Turtlelisk with enhanced healing capabilities.',
        portrait: 'assets/images/monsters/karaggon.webp',
        rarity: 'common'
    },
    {
        id: 7,
        name: 'Slickitty',
        element: ELEMENT_TYPES.ELECTRIC,
        baseStats: {
            hp: 22,
            attack: 9,
            defense: 4,
            manaCost: 4
        },
        ability: {
            name: 'Electroclaw',
            description: 'Attacks for 5 HP and matches a random 2x2 grid.',
            damage: 5,
            effect: {
                type: 'MATCH_GRID',
                width: 2,
                height: 2
            }
        },
        evolution: {
            name: 'Axelraze',
            id: 8,
            statBoosts: {
                hp: 4,
                attack: 4,
                defense: 2
            },
            abilityBoost: {
                damage: 5,
                effect: {
                    type: 'MATCH_GRID',
                    width: 3,
                    height: 2
                }
            }
        },
        description: 'A quick feline monster that can generate electricity through its fur.',
        portrait: 'assets/images/monsters/slickitty.webp',
        rarity: 'common'
    },
    {
        id: 8,
        name: 'Axelraze',
        element: ELEMENT_TYPES.ELECTRIC,
        baseStats: {
            hp: 26,
            attack: 13,
            defense: 6,
            manaCost: 4
        },
        ability: {
            name: 'Electroclaw+',
            description: 'Attacks for 10 HP and matches a random 3x2 grid.',
            damage: 10,
            effect: {
                type: 'MATCH_GRID',
                width: 3,
                height: 2
            }
        },
        evolution: null,
        description: 'An evolved form of Slickitty with enhanced electric abilities and speed.',
        portrait: 'assets/images/monsters/axelraze.webp',
        rarity: 'common'
    },
    {
        id: 9,
        name: 'Barbenin',
        element: ELEMENT_TYPES.PSYCHIC,
        baseStats: {
            hp: 24,
            attack: 7,
            defense: 6,
            manaCost: 6
        },
        ability: {
            name: 'Psycho Bite',
            description: 'Attacks for 10 HP and drains 2 Mana from opponent\'s monsters.',
            damage: 10,
            effect: {
                type: 'DRAIN_MANA',
                amount: 2
            }
        },
        evolution: {
            name: 'Scoprikon',
            id: 10,
            statBoosts: {
                hp: 6,
                attack: 4,
                defense: 3
            },
            abilityBoost: {
                damage: 5,
                effect: {
                    type: 'DRAIN_MANA',
                    amount: 1
                }
            }
        },
        description: 'A scorpion-like monster with psychic abilities that can drain energy from opponents.',
        portrait: 'assets/images/monsters/barbenin.webp',
        rarity: 'common'
    },
    {
        id: 10,
        name: 'Scoprikon',
        element: ELEMENT_TYPES.PSYCHIC,
        baseStats: {
            hp: 30,
            attack: 11,
            defense: 9,
            manaCost: 6
        },
        ability: {
            name: 'Psycho Bite+',
            description: 'Attacks for 15 HP and drains 3 Mana from opponent\'s monsters.',
            damage: 15,
            effect: {
                type: 'DRAIN_MANA',
                amount: 3
            }
        },
        evolution: null,
        description: 'An evolved form of Barbenin with enhanced psychic abilities and a more powerful stinger.',
        portrait: 'assets/images/monsters/scoprikon.webp',
        rarity: 'common'
    },
    {
        id: 11,
        name: 'Pyrokun',
        element: ELEMENT_TYPES.FIRE,
        baseStats: {
            hp: 28,
            attack: 10,
            defense: 6,
            manaCost: 10
        },
        ability: {
            name: 'Pyro Blitz',
            description: 'Attacks for 20 HP and matches a random row.',
            damage: 20,
            effect: {
                type: 'MATCH_ROW',
                rows: 1
            }
        },
        evolution: {
            name: 'Magnooki',
            id: 12,
            statBoosts: {
                hp: 7,
                attack: 5,
                defense: 3
            },
            abilityBoost: {
                damage: 10,
                effect: {
                    type: 'MATCH_CROSS',
                    rows: 1,
                    columns: 1
                }
            }
        },
        description: 'A raccoon-like monster with the ability to create and manipulate fire.',
        portrait: 'assets/images/monsters/pyrokun.webp',
        rarity: 'common'
    },
    {
        id: 12,
        name: 'Magnooki',
        element: ELEMENT_TYPES.FIRE,
        baseStats: {
            hp: 35,
            attack: 15,
            defense: 9,
            manaCost: 10
        },
        ability: {
            name: 'Pyro Blitz+',
            description: 'Attacks for 30 HP and matches a random row and column.',
            damage: 30,
            effect: {
                type: 'MATCH_CROSS',
                rows: 1,
                columns: 1
            }
        },
        evolution: null,
        description: 'An evolved form of Pyrokun with mastery over fire and explosive abilities.',
        portrait: 'assets/images/monsters/magnooki.webp',
        rarity: 'common'
    },
    {
        id: 13,
        name: 'Trashark',
        element: ELEMENT_TYPES.WATER,
        baseStats: {
            hp: 30,
            attack: 9,
            defense: 8,
            manaCost: 8
        },
        ability: {
            name: 'Aqua Blast',
            description: 'Attacks for 20 HP and converts 2 random tiles to Water.',
            damage: 20,
            effect: {
                type: 'CONVERT_TILES',
                element: ELEMENT_TYPES.WATER,
                count: 2
            }
        },
        evolution: {
            name: 'Shardivore',
            id: 14,
            statBoosts: {
                hp: 8,
                attack: 4,
                defense: 3
            },
            abilityBoost: {
                damage: 5,
                effect: {
                    type: 'CONVERT_TILES',
                    element: ELEMENT_TYPES.WATER,
                    count: 1
                }
            }
        },
        description: 'A shark-like monster that thrives in polluted waters and can manipulate water currents.',
        portrait: 'assets/images/monsters/trashark.webp',
        rarity: 'common'
    },
    {
        id: 14,
        name: 'Shardivore',
        element: ELEMENT_TYPES.WATER,
        baseStats: {
            hp: 38,
            attack: 13,
            defense: 11,
            manaCost: 8
        },
        ability: {
            name: 'Aqua Blast+',
            description: 'Attacks for 25 HP and converts 3 random tiles to Water.',
            damage: 25,
            effect: {
                type: 'CONVERT_TILES',
                element: ELEMENT_TYPES.WATER,
                count: 3
            }
        },
        evolution: null,
        description: 'An evolved form of Trashark with razor-sharp fins and enhanced water manipulation.',
        portrait: 'assets/images/monsters/shardivore.webp',
        rarity: 'common'
    },
    {
        id: 15,
        name: 'Elfini',
        element: ELEMENT_TYPES.EARTH,
        baseStats: {
            hp: 25,
            attack: 6,
            defense: 7,
            manaCost: 6
        },
        ability: {
            name: 'Flower Dance',
            description: 'Attacks for 5 HP and heals 5 HP at the end of turn for 3 turns.',
            damage: 5,
            effect: {
                type: 'HEAL_OVER_TIME',
                amount: 5,
                duration: 3
            }
        },
        evolution: {
            name: 'Eidelf',
            id: 16,
            statBoosts: {
                hp: 5,
                attack: 3,
                defense: 3
            },
            abilityBoost: {
                damage: 5,
                effect: {
                    type: 'HEAL_OVER_TIME',
                    amount: 5,
                    duration: -1 // Duration changed to 2 turns in evolved form, -1 means no change from base
                }
            }
        },
        description: 'A small, fairy-like monster that can harness the healing power of nature.',
        portrait: 'assets/images/monsters/elfini.webp',
        rarity: 'common'
    },
    {
        id: 16,
        name: 'Eidelf',
        element: ELEMENT_TYPES.EARTH,
        baseStats: {
            hp: 30,
            attack: 9,
            defense: 10,
            manaCost: 6
        },
        ability: {
            name: 'Flower Dance+',
            description: 'Attacks for 10 HP and heals 10 HP at the end of turn for 2 turns.',
            damage: 10,
            effect: {
                type: 'HEAL_OVER_TIME',
                amount: 10,
                duration: 2
            }
        },
        evolution: null,
        description: 'An evolved form of Elfini with enhanced healing abilities and nature manipulation.',
        portrait: 'assets/images/monsters/eidelf.webp',
        rarity: 'common'
    },
    {
        id: 17,
        name: 'Winklit',
        element: ELEMENT_TYPES.ELECTRIC,
        baseStats: {
            hp: 24,
            attack: 8,
            defense: 5,
            manaCost: 7
        },
        ability: {
            name: 'Starblitz',
            description: 'Attacks for 15 HP and grants 1 extra move for the next turn.',
            damage: 15,
            effect: {
                type: 'EXTRA_MOVE',
                moves: 1,
                duration: 1
            }
        },
        evolution: {
            name: 'Gleamur',
            id: 18,
            statBoosts: {
                hp: 6,
                attack: 4,
                defense: 2
            },
            abilityBoost: {
                damage: 5,
                effect: {
                    type: 'EXTRA_MOVE',
                    moves: 0, // The base ability grants 1 move, the evolution changes duration
                    duration: 1 // Total duration becomes 2 turns
                }
            }
        },
        description: 'A star-shaped monster that can manipulate electricity and generate bright flashes of light.',
        portrait: 'assets/images/monsters/winklit.webp',
        rarity: 'common'
    },
    {
        id: 18,
        name: 'Gleamur',
        element: ELEMENT_TYPES.ELECTRIC,
        baseStats: {
            hp: 30,
            attack: 12,
            defense: 7,
            manaCost: 7
        },
        ability: {
            name: 'Starblitz+',
            description: 'Attacks for 20 HP and grants 1 extra move for the next 2 turns.',
            damage: 20,
            effect: {
                type: 'EXTRA_MOVE',
                moves: 1,
                duration: 2
            }
        },
        evolution: null,
        description: 'An evolved form of Winklit with enhanced electric abilities and the power to manipulate time.',
        portrait: 'assets/images/monsters/gleamur.webp',
        rarity: 'common'
    },
    {
        id: 19,
        name: 'Timingo',
        element: ELEMENT_TYPES.FIRE,
        baseStats: {
            hp: 26,
            attack: 7,
            defense: 6,
            manaCost: 7
        },
        ability: {
            name: 'Hugs',
            description: 'Attacks for 10 HP and gives 2 mana to your other monster.',
            damage: 10,
            effect: {
                type: 'GIVE_MANA',
                amount: 2
            }
        },
        evolution: {
            name: 'Flambagant',
            id: 20,
            statBoosts: {
                hp: 6,
                attack: 4,
                defense: 3
            },
            abilityBoost: {
                damage: 10,
                effect: {
                    type: 'GIVE_MANA',
                    amount: 1 // Total becomes 3 mana
                }
            }
        },
        description: 'Only appears when true love is in the air...',
        portrait: 'assets/images/monsters/timingo.webp',
        rarity: 'rare'
    },
    {
        id: 20,
        name: 'Flambagant',
        element: ELEMENT_TYPES.FIRE,
        baseStats: {
            hp: 32,
            attack: 11,
            defense: 9,
            manaCost: 7
        },
        ability: {
            name: 'Hugs+',
            description: 'Attacks for 20 HP and gives 3 mana to your other monster.',
            damage: 20,
            effect: {
                type: 'GIVE_MANA',
                amount: 3
            }
        },
        evolution: null,
        description: 'Only appears when true love is in the air...',
        portrait: 'assets/images/monsters/flambagant.webp',
        rarity: 'rare'
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
        description: 'An arena set among mountains that hover in the sky. Electric monsters have the advantage here.',
        background: 'assets/images/stages/mountain.jpg',
        elementBonus: ELEMENT_TYPES.ELECTRIC,
        bonusAmount: 1
    },
    {
        id: 'temple',
        name: 'Radiant Temple',
        description: 'A sacred temple bathed in psychic energy. Psychic monsters gain power in this hallowed place.',
        background: 'assets/images/stages/temple.jpg',
        elementBonus: ELEMENT_TYPES.PSYCHIC,
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
    ELECTRIC: ELEMENT_TYPES.ELECTRIC,
    PSYCHIC: ELEMENT_TYPES.PSYCHIC,
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
