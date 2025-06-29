// Bug Catcher Jim - Game messages and UI text (Game Jam Pivot)
const MESSAGES = {
  // Game over messages
  ENDINGS: {
    FINAL_GAME_OVER: {
      title: "GAME OVER",
      message:
        "You've been completely consumed by the wilderness, but what a journey it was!",
      color: "#ff0000",
    },
  },

  // UI text
  UI: {
    GAME_TITLE: "Bug Catcher Jim",
    RESEARCH_STATION: "Research Station Alpha",
    START_DESCRIPTION: `Catch bugs and drop them in the collection bin for points!
Each bug type is worth different points (5-50).
You can carry multiple bugs at once - but watch out for monsters!
Use SPACE to sprint (consumes stamina).`,
    START_BUTTON: "Start Hunting",
    RESTART_BUTTON: "Hunt Again",
    SCORE_LABEL: "Score:",
    STAGE_LABEL: "Stage:",
    CARRYING_LABEL: "Carrying:",
    STAMINA_LABEL: "Stamina:",
    POSITION_LABEL: "Position:",
  },

  // Game state messages
  GAME_STATES: {
    STAGE_1: "Stage 1 - Full Body",
    STAGE_2: "Stage 2 - Armless",
    STAGE_3: "Stage 3 - Head Only",
    GAME_OVER: "Game Over",
  },

  // Stage transition messages
  STAGE_TRANSITIONS: {
    STAGE_2: {
      title: "You were mauled - but made it through!",
      message:
        "Your arms are gone, but you can still catch bugs! You can now only hold 1 bug at a time.",
    },
    STAGE_3: {
      title: "You were mauled...again...",
      message:
        "Now you're just a head! You move slower when carrying bugs and can't sprint.",
    },
  },

  // Tutorial messages
  TUTORIAL: {
    MOVEMENT: "Use WASD or Arrow Keys to move Jim around",
    COLLECTION: "Walk into bugs to collect them",
    DEPOSIT: "Walk into the collection bin to deposit bugs for points",
    SPRINTING: "Hold SPACE to sprint (uses stamina)",
    STAMINA: "Catch bugs to gain stamina",
    SURVIVAL: "Avoid monsters or they'll maul you!",
    STAGES: "Each mauling advances you to the next stage with new challenges",
  },

  // Bug point values for display
  BUG_POINTS: {
    FIREFLY: "5 pts",
    BEETLE: "10 pts",
    BUTTERFLY: "15 pts",
    LADYBUG: "25 pts",
    GRASSHOPPER: "35 pts",
    DRAGONFLY: "50 pts",
  },
};
