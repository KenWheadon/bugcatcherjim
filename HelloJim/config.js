// Game configuration constants
const GAME_CONFIG = {
  MAX_JIM: 32,
  MAX_JIM_IMAGES: 22, // Standard jim images (jim1-22)
  FUSION_IMAGES: [25, 26, 27], // Special fusion images that exist

  // HP configuration for different phases
  HP_CONFIG: {
    BEETLE_BASE_HP: 2,
    MOTH_HP: 6,
    BEETLE_MOTH_HP: 8,
    CHICKEN_BEETLE_HP: 10,
    GHOST_CHICKEN_HP: 4,
  },

  // Animation timings
  TIMINGS: {
    CLICK_ANIMATION: 300,
    DAMAGE_ANIMATION: 400,
    SCREEN_SHAKE: 500,
    DIALOGUE_PULSE: 500,
    FLYING_MOVEMENT: 1500,
    CHICKEN_SPEED: 0.0025,
    MOTH_FLUTTER_INTERVAL: 50,
    PARTICLE_SHOW_DURATION: 10000,
  },

  // UI Constants
  UI: {
    JIM_MAX_WIDTH: 300,
    PROGRESS_BAR_WIDTH: 300,
    MINION_COUNT: 21,
    STILL_JIM_COUNT: 21,
    GOLD_TARGET: 10,
    CUP_COUNT: 3,
  },
};

// Dialogue data
const DIALOGUES = {
  1: "🐸 Hello there! I'm Jim! Please don't click me!",
  2: "😱 Oh no! You're going to click me! I'm SO scared!",
  3: "😵 Ow! That hurt!",
  4: "😖 My arm! OMG please stop, it's starting to bleed.",
  5: "💫 You vaporized my hand! I'm losing so much blood now!",
  6: "😏 Haha! Just kidding! You can't actually hurt me!",
  7: "✨ I'm INVINCIBLE! Your clicks are powerless against me!",
  8: "💀 Bleh... I'm dead...",
  9: "🗣️ Even as just a head, I CANNOT DIE! Mwahahaha!",
  10: "👻 Seriously, I'm immortal! Watch me transform...",
  11: "🪲 BEETLE MODE ACTIVATED! I have 2 HP now!",
  12: "🪲 Stronger beetle form! 3 HP of pure bug power!",
  13: "🪲 Even MORE beetle! 4 HP! I'm getting tougher!",
  14: "🪲 MEGA beetle! 5 HP! Try to stop me now!",
  15: "🪲 ULTRA beetle! 6 HP! I'm nearly unstoppable!",
  16: "🪲 SUPREME beetle! 7 HP! Peak beetle performance!",
  17: "🪲 LEGENDARY beetle! 8 HP! Maximum bug evolution!",
  18: "🦋 Now I'm a MOTH! Catch me if you can! 6 HP!",
  19: "🐔 Hop hop! I'm chicken-Jim! 2 HP with this speedy guy!",
  20: "🐔 Still hopping! Can't catch me! 2 clicks needed!",
  21: "🐔 Bawk bawk! I'm getting away! Another two clicks please!",
  22: "🐔 FINAL FORM! Two more clicks and... CHAOS ERUPTS!",
  23: "😈 You thought that was the end? I have MINIONS! Defeat all 21!",
  24: "🎯 Find the Jim who ISN'T wiggling! Only one stands still!",
  25: "🪲🦋 BEETLE-MOTH FUSION! I fly with beetle armor! 8 HP!",
  26: "🪲🐔 CHICKEN-BEETLE! I hop around edges with armor! 6 HP!",
  27: "👻🐔 GHOST-CHICKEN! I phase in and out! Can you catch me? 4 HP!",
  28: "💰 Congratulations! You've earned GOLD! Collect 10 pieces!",
  29: "💰 Click the FINISH button to collect gold! You need 10 pieces!",
  30: "😂 HAHAHAHA! You can't finish me! Try the LOSE button!",
  31: "😔 Oh... you actually want to lose? How sad... Let's play FIND THE JIM!",
  32: "🎪 I'm under one of these cups! Pick wisely... HAHAHAHA!",
};

// Jim8 extended dialogues for multiple clicks
const JIM8_DIALOGUES = [
  "💀 Bleh... I'm dead...",
  "💀 ooooh still dead",
  "💀 dead heads can still roll you know",
  "💀 deader then a doornail",
];

// Beetle battle taunts for cycling dialogue
const BEETLE_TAUNTS = {
  11: [
    "🪲 BEETLE MODE ACTIVATED! I have 2 HP now!",
    "🪲 You can't hurt me! I'm a bug now!",
    "🪲 My exoskeleton is impenetrable!",
    "🪲 Buzz buzz! Try harder!",
    "🪲 Is that the best you can do?",
  ],
  12: [
    "🪲 Stronger beetle form! 3 HP of pure bug power!",
    "🪲 I'm evolving with each hit!",
    "🪲 My carapace grows stronger!",
    "🪲 You're making me tougher!",
    "🪲 Keep clicking, I love it!",
  ],
  13: [
    "🪲 Even MORE beetle! 4 HP! I'm getting tougher!",
    "🪲 My mandibles are getting sharper!",
    "🪲 I'm becoming the ultimate bug!",
    "🪲 Your clicks fuel my transformation!",
    "🪲 I'm unstoppable now!",
  ],
  14: [
    "🪲 MEGA beetle! 5 HP! Try to stop me now!",
    "🪲 I'm reaching peak beetle form!",
    "🪲 My wings are growing stronger!",
    "🪲 You cannot comprehend my power!",
    "🪲 I am become bug, destroyer of clicks!",
  ],
  15: [
    "🪲 ULTRA beetle! 6 HP! I'm nearly unstoppable!",
    "🪲 I transcend normal beetle limits!",
    "🪲 My chitinous armor is legendary!",
    "🪲 You're witnessing bug perfection!",
    "🪲 I am the alpha and omega of beetles!",
  ],
  16: [
    "🪲 SUPREME beetle! 7 HP! Peak beetle performance!",
    "🪲 I am the pinnacle of bug evolution!",
    "🪲 My beetle form knows no equal!",
    "🪲 You face the ultimate arthropod!",
    "🪲 I am the beetle final boss!",
  ],
  17: [
    "🪲 LEGENDARY beetle! 8 HP! Maximum bug evolution!",
    "🪲 I have achieved beetle enlightenment!",
    "🪲 My form is beyond mortal comprehension!",
    "🪲 I am the stuff of beetle legends!",
    "🪲 Witness my ultimate beetle majesty!",
  ],
};

// Click effect phrases
const CLICK_PHRASES = [
  "POW!",
  "BAM!",
  "WHACK!",
  "BONK!",
  "SMASH!",
  "HIT!",
  "CRACK!",
  "THWAP!",
  "BOOM!",
  "ZAP!",
];
