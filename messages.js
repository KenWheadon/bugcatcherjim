// Bug Catcher Jim - Game messages and UI text
const MESSAGES = {
  // Game over messages
  ENDINGS: {
    MONSTER_DEATH: {
      title: "MONSTER MEAL",
      message:
        "A creature of the night found you. Jim becomes part of the ecosystem in a very literal way.",
      color: "#ff0000",
    },
    NIGHT_DEATH: {
      title: "CAUGHT RED-HANDED",
      message:
        "You were holding a bug when night fell. The transformation was... unpleasant.",
      color: "#ff6600",
    },
    SURVIVED: {
      title: "BUG HUNTER EXTRAORDINAIRE",
      message:
        "You successfully helped Linda with her research! The bugs and monsters return to their eternal dance.",
      color: "#00ff00",
    },
  },

  // UI text
  UI: {
    GAME_TITLE: "🐛 Bug Catcher Jim 🐛",
    RESEARCH_STATION: "Research Station Alpha",
    TIMER_LABEL: "Daylight:",
    NIGHT_TIMER_LABEL: "Survive the Night!",
    START_DESCRIPTION: `Help Jim catch bugs for Linda's research orders!
Collect the right bugs during the day and deposit them in the collection bin.
But when night falls, drop everything and hide - the bugs become something much more dangerous.
Survive until dawn to continue your work.`,
    START_BUTTON: "Start Hunting",
    RESTART_BUTTON: "Hunt Again",
    SCORE_LABEL: "Score:",
    CURRENT_ORDER_LABEL: "Current Order:",
    CARRYING_LABEL: "Carrying:",
    DAY_LABEL: "Day:",
    ORDERS_COMPLETED_LABEL: "Orders Completed:",
    DAYS_SURVIVED_LABEL: "Days Survived:",
  },

  // Order generation messages
  ORDERS: {
    LINDA_INTRO: "Linda needs you to catch specific bugs for her research.",
    ORDER_PREFIX: "Research Order #",
    ORDER_INTRO: "Please collect: ",
    HUNT_BUTTON: "Start Hunting!",
    ORDER_COMPLETE: "Order Complete!",
    NEW_ORDER: "New research request from Linda",
  },

  // Game state messages
  GAME_STATES: {
    DAY_PHASE: "Day - Catch bugs and complete orders",
    NIGHT_PHASE: "Night - Survive until dawn!",
    ORDER_POPUP: "New research order from Linda",
    GAME_OVER: "Game Over",
    PAUSED: "Game Paused",
  },

  // Tutorial messages
  TUTORIAL: {
    MOVEMENT: "Use WASD or Arrow Keys to move Jim around",
    COLLECTION: "Walk into bugs to collect them",
    DEPOSIT: "Walk into the collection bin to deposit bugs",
    SURVIVAL: "Don't get caught by monsters at night!",
    NIGHT_WARNING: "Drop any bugs you're carrying before night falls!",
    ORDER_COMPLETION:
      "Complete Linda's orders by collecting the requested bugs",
  },
};

// Order generation system
const OrderGenerator = {
  // Generate a new order based on progress
  generateOrder: (completedOrders) => {
    const orderSize = Math.min(
      Math.max(1, completedOrders + 1),
      CONFIG.BUG_TYPES.length
    );
    const order = [];

    // Create array of bug type indices
    const availableBugs = [...Array(CONFIG.BUG_TYPES.length).keys()];

    // Randomly select bugs for the order
    for (let i = 0; i < orderSize; i++) {
      const randomIndex = Math.floor(Math.random() * availableBugs.length);
      const bugType = availableBugs.splice(randomIndex, 1)[0];
      order.push(bugType);
    }

    return {
      bugs: order,
      collected: [],
      id: completedOrders + 1,
    };
  },

  // Check if order is complete
  isOrderComplete: (order) => {
    const required = [...order.bugs].sort();
    const collected = [...order.collected].sort();

    if (required.length !== collected.length) return false;

    for (let i = 0; i < required.length; i++) {
      if (required[i] !== collected[i]) return false;
    }

    return true;
  },

  // Get order display text
  getOrderDisplayText: (order) => {
    if (!order) return "No active order";

    const neededText = order.bugs
      .map(
        (bugIndex) =>
          `${CONFIG.BUG_TYPES[bugIndex].name} ${CONFIG.BUG_TYPES[bugIndex].symbol}`
      )
      .join(", ");

    const collectedText =
      order.collected.length > 0
        ? order.collected
            .map(
              (bugIndex) =>
                `${CONFIG.BUG_TYPES[bugIndex].name} ${CONFIG.BUG_TYPES[bugIndex].symbol}`
            )
            .join(", ")
        : "";

    return {
      needed: neededText,
      collected: collectedText,
      remaining: order.bugs
        .filter((bugType) => !order.collected.includes(bugType))
        .map(
          (bugIndex) =>
            `${CONFIG.BUG_TYPES[bugIndex].name} ${CONFIG.BUG_TYPES[bugIndex].symbol}`
        )
        .join(", "),
    };
  },
};
