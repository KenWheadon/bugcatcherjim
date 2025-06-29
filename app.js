// Bug Catcher Jim - Main game application
const Game = {
  // Game state
  state: {
    screen: "start", // 'start', 'game', 'popup', 'ending'
    phase: "day", // 'day', 'night'
    score: 0,
    day: 1,
    completedOrders: 0,
    currentOrder: null,
    daylightTime: CONFIG.TIME.DAY_DURATION,
    nightTime: CONFIG.TIME.NIGHT_DURATION,
    gameLoopId: null,
    currentMusicTrack: null,

    // Player state
    player: {
      x: CONFIG.PLAYER.START_X,
      y: CONFIG.PLAYER.START_Y,
      size: CONFIG.PLAYER.SIZE,
      speed: CONFIG.PLAYER.SPEED,
      carrying: null,
    },

    // Camera state
    camera: {
      x: 0,
      y: 0,
    },

    // World entities
    bugs: [],
    monsters: [],

    // Collection bin
    collectionBin: {
      x: CONFIG.BIN.X,
      y: CONFIG.BIN.Y,
      size: CONFIG.BIN.SIZE,
    },
  },

  // Input handling
  keys: {},
  resizeTimeout: null,

  // Initialize the game
  init: async () => {
    console.log("Initializing Bug Catcher Jim...");

    // Calculate and set canvas dimensions based on screen size
    UTILS.updateCanvasDimensions();

    // Initialize achievement system
    AchievementManager.init();

    // Initialize achievement drawer
    AchievementDrawer.init();

    // Initialize start screen
    StartScreen.init();

    // Setup input handling
    Game.setupInput();

    // Setup canvas
    Game.setupCanvas();

    // Handle window resize
    Game.setupResizeHandler();
  },

  // Setup resize handler for responsive gameplay
  setupResizeHandler: () => {
    window.addEventListener("resize", () => {
      // Debounce resize events
      clearTimeout(Game.resizeTimeout);
      Game.resizeTimeout = setTimeout(() => {
        if (Game.state.screen === "game") {
          // Update canvas dimensions
          UTILS.updateCanvasDimensions();
          Game.setupCanvas();
          console.log("Canvas resized for gameplay");
        }
      }, 250);
    });
  },

  // Setup input event listeners
  setupInput: () => {
    document.addEventListener("keydown", (e) => {
      Game.keys[e.key.toLowerCase()] = true;
    });

    document.addEventListener("keyup", (e) => {
      Game.keys[e.key.toLowerCase()] = false;
    });
  },

  // Setup canvas
  setupCanvas: () => {
    let canvas = document.getElementById("gameCanvas");

    // Remove existing canvas if it exists
    if (canvas) {
      canvas.remove();
    }

    // Create new canvas with current dimensions
    canvas = document.createElement("canvas");
    canvas.id = "gameCanvas";
    canvas.width = CONFIG.WORLD.CANVAS_WIDTH;
    canvas.height = CONFIG.WORLD.CANVAS_HEIGHT;
    canvas.style.display = "none"; // Hidden by default

    // Add canvas to game container
    const gameContainer = document.getElementById("game-container");
    gameContainer.appendChild(canvas);

    console.log(
      `Canvas setup: ${CONFIG.WORLD.CANVAS_WIDTH}x${CONFIG.WORLD.CANVAS_HEIGHT}`
    );
  },

  // Start a new game
  startGame: () => {
    Game.resetGame();
    Game.state.screen = "popup";
    Game.state.phase = "day";
    Game.state.score = 0;
    Game.state.day = 1;
    Game.state.completedOrders = 0;
    Game.state.daylightTime = CONFIG.TIME.DAY_DURATION;
    Game.state.currentMusicTrack = UTILS.switchBackgroundMusic("day");

    // Track game started achievement
    AchievementManager.trackGameStarted();

    // Initialize world
    Game.initializeWorld();

    // Generate first order
    Game.state.currentOrder = OrderGenerator.generateOrder(
      Game.state.completedOrders
    );

    // Show order popup
    Game.showOrderPopup();
  },

  // Reset game state
  resetGame: () => {
    if (Game.state.gameLoopId) {
      cancelAnimationFrame(Game.state.gameLoopId);
      Game.state.gameLoopId = null;
    }

    Game.state = {
      screen: "start",
      phase: "day",
      score: 0,
      day: 1,
      completedOrders: 0,
      currentOrder: null,
      daylightTime: CONFIG.TIME.DAY_DURATION,
      nightTime: CONFIG.TIME.NIGHT_DURATION,
      gameLoopId: null,
      currentMusicTrack: null,

      player: {
        x: CONFIG.PLAYER.START_X,
        y: CONFIG.PLAYER.START_Y,
        size: CONFIG.PLAYER.SIZE,
        speed: CONFIG.PLAYER.SPEED,
        carrying: null,
      },

      camera: {
        x: 0,
        y: 0,
      },

      bugs: [],
      monsters: [],

      collectionBin: {
        x: CONFIG.BIN.X,
        y: CONFIG.BIN.Y,
        size: CONFIG.BIN.SIZE,
      },
    };
  },

  // Initialize world entities
  initializeWorld: () => {
    Game.state.bugs = [];
    Game.state.monsters = [];

    // Spawn bugs
    for (let i = 0; i < CONFIG.BUG_TYPES.length; i++) {
      Game.spawnBug(i);
    }
  },

  // Spawn a bug of specific type
  spawnBug: (typeIndex) => {
    let attempts = 0;
    let validPosition = false;
    let bug;

    while (!validPosition && attempts < 50) {
      const pos = UTILS.randomPosition(
        CONFIG.BUGS.SIZE,
        CONFIG.BUGS.SIZE,
        CONFIG.WORLD.WIDTH - CONFIG.BUGS.SIZE,
        CONFIG.WORLD.HEIGHT - CONFIG.BUGS.SIZE,
        CONFIG.BUGS.SPAWN_MARGIN
      );

      // Check distance from player and collection bin
      const playerDist = UTILS.distance(
        pos.x,
        pos.y,
        Game.state.player.x,
        Game.state.player.y
      );
      const binDist = UTILS.distance(
        pos.x,
        pos.y,
        Game.state.collectionBin.x,
        Game.state.collectionBin.y
      );

      if (playerDist > 150 && binDist > 150) {
        bug = {
          type: typeIndex,
          x: pos.x,
          y: pos.y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: CONFIG.BUGS.SIZE,
        };
        validPosition = true;
      }
      attempts++;
    }

    if (bug) {
      Game.state.bugs[typeIndex] = bug;
    }
  },

  // Show order popup
  showOrderPopup: () => {
    Game.state.screen = "popup";
    Game.renderOrderPopup();
  },

  // Start hunting (close popup and begin game)
  startHunting: () => {
    // Clear the popup overlay completely
    const container = document.getElementById("game-container");
    container.innerHTML = ""; // This removes the popup

    // Update canvas dimensions for current screen
    UTILS.updateCanvasDimensions();
    Game.setupCanvas();

    // Set game state and show UI
    Game.state.screen = "game";
    Game.showGameUI();
    Game.startGameLoop();
  },

  // Main game loop
  gameLoop: () => {
    if (Game.state.screen !== "game") return;

    Game.updateGame();
    Game.renderGame();
    Game.updateUI();

    Game.state.gameLoopId = requestAnimationFrame(Game.gameLoop);
  },

  // Start game loop
  startGameLoop: () => {
    if (Game.state.gameLoopId) {
      cancelAnimationFrame(Game.state.gameLoopId);
    }
    Game.gameLoop();
  },

  // Update game state
  updateGame: () => {
    if (Game.state.phase === "day") {
      Game.updateDayPhase();
    } else if (Game.state.phase === "night") {
      Game.updateNightPhase();
    }

    Game.updatePlayer();
    Game.updateCamera();
  },

  // Update day phase
  updateDayPhase: () => {
    // Update daylight timer
    Game.state.daylightTime -= 1 / 60;

    if (Game.state.daylightTime <= 0) {
      Game.startNightPhase();
      return;
    }

    // Update bugs
    Game.updateBugs();

    // Check bug collection
    Game.checkBugCollection();

    // Check bin deposit
    Game.checkBinDeposit();
  },

  // Update night phase
  updateNightPhase: () => {
    // Update night timer
    Game.state.nightTime -= 1 / 60;

    if (Game.state.nightTime <= 0) {
      Game.startDayPhase();
      return;
    }

    // Update monsters
    Game.updateMonsters();

    // Check monster collision
    Game.checkMonsterCollision();
  },

  // Update player
  updatePlayer: () => {
    let dx = 0,
      dy = 0;

    // Movement controls
    if (Game.keys["w"] || Game.keys["arrowup"]) dy = -Game.state.player.speed;
    if (Game.keys["s"] || Game.keys["arrowdown"]) dy = Game.state.player.speed;
    if (Game.keys["a"] || Game.keys["arrowleft"]) dx = -Game.state.player.speed;
    if (Game.keys["d"] || Game.keys["arrowright"]) dx = Game.state.player.speed;

    // Diagonal movement normalization
    if (dx && dy) {
      dx *= 0.707;
      dy *= 0.707;
    }

    // Update position with world bounds
    const newX = UTILS.clamp(
      Game.state.player.x + dx,
      Game.state.player.size,
      CONFIG.WORLD.WIDTH - Game.state.player.size
    );
    const newY = UTILS.clamp(
      Game.state.player.y + dy,
      Game.state.player.size,
      CONFIG.WORLD.HEIGHT - Game.state.player.size
    );

    Game.state.player.x = newX;
    Game.state.player.y = newY;
  },

  // Update camera
  updateCamera: () => {
    const targetCameraX = Game.state.player.x - CONFIG.WORLD.CANVAS_WIDTH / 2;
    const targetCameraY = Game.state.player.y - CONFIG.WORLD.CANVAS_HEIGHT / 2;

    // Smooth camera following
    Game.state.camera.x += (targetCameraX - Game.state.camera.x) * 0.1;
    Game.state.camera.y += (targetCameraY - Game.state.camera.y) * 0.1;

    // Clamp camera to world bounds
    Game.state.camera.x = UTILS.clamp(
      Game.state.camera.x,
      0,
      CONFIG.WORLD.WIDTH - CONFIG.WORLD.CANVAS_WIDTH
    );
    Game.state.camera.y = UTILS.clamp(
      Game.state.camera.y,
      0,
      CONFIG.WORLD.HEIGHT - CONFIG.WORLD.CANVAS_HEIGHT
    );
  },

  // Update bugs
  updateBugs: () => {
    Game.state.bugs.forEach((bug) => {
      if (!bug) return;

      // Random movement
      bug.vx += (Math.random() - 0.5) * 0.5;
      bug.vy += (Math.random() - 0.5) * 0.5;

      // Limit speed
      const speed = Math.sqrt(bug.vx ** 2 + bug.vy ** 2);
      if (speed > CONFIG.BUGS.MAX_SPEED) {
        bug.vx = (bug.vx / speed) * CONFIG.BUGS.MAX_SPEED;
        bug.vy = (bug.vy / speed) * CONFIG.BUGS.MAX_SPEED;
      }

      // Update position
      bug.x += bug.vx;
      bug.y += bug.vy;

      // Bounce off walls
      if (bug.x < bug.size || bug.x > CONFIG.WORLD.WIDTH - bug.size) {
        bug.vx *= -1;
        bug.x = UTILS.clamp(bug.x, bug.size, CONFIG.WORLD.WIDTH - bug.size);
      }
      if (bug.y < bug.size || bug.y > CONFIG.WORLD.HEIGHT - bug.size) {
        bug.vy *= -1;
        bug.y = UTILS.clamp(bug.y, bug.size, CONFIG.WORLD.HEIGHT - bug.size);
      }
    });
  },

  // Check bug collection
  checkBugCollection: () => {
    if (Game.state.player.carrying) return;

    Game.state.bugs.forEach((bug, index) => {
      if (!bug) return;

      const dist = UTILS.distance(
        bug.x,
        bug.y,
        Game.state.player.x,
        Game.state.player.y
      );
      if (dist < bug.size + Game.state.player.size) {
        // Pick up bug
        Game.state.player.carrying = {
          type: bug.type,
          name: CONFIG.BUG_TYPES[bug.type].name,
        };

        // Remove bug from world
        Game.state.bugs[index] = null;

        // Play collection sound
        UTILS.playAudio(CONFIG.AUDIO.COLLECT_SOUND);

        // Achievement tracking
        AchievementManager.trackBugCollected(bug.type);
      }
    });
  },

  // Check bin deposit
  checkBinDeposit: () => {
    if (!Game.state.player.carrying) return;

    const dist = UTILS.distance(
      Game.state.collectionBin.x,
      Game.state.collectionBin.y,
      Game.state.player.x,
      Game.state.player.y
    );

    if (dist < Game.state.collectionBin.size + Game.state.player.size) {
      // Deposit bug
      const carriedBugType = Game.state.player.carrying.type;
      Game.state.currentOrder.collected.push(carriedBugType);
      Game.state.player.carrying = null;

      // Respawn the bug
      Game.spawnBug(carriedBugType);

      // Play deposit sound
      UTILS.playAudio(CONFIG.AUDIO.UI_HOVER);

      // Check if order is complete
      if (OrderGenerator.isOrderComplete(Game.state.currentOrder)) {
        Game.completeOrder();
      }
    }
  },

  // Complete current order
  completeOrder: () => {
    Game.state.completedOrders++;
    Game.state.score += Game.state.currentOrder.bugs.length * 10;

    // Play completion sound
    UTILS.playAudio(CONFIG.AUDIO.ORDER_COMPLETE);

    // Achievement tracking
    AchievementManager.trackOrderCompleted();

    // Generate next order
    Game.state.currentOrder = OrderGenerator.generateOrder(
      Game.state.completedOrders
    );

    // Hide game UI temporarily
    Game.hideGameUI();

    // Show order popup after delay
    setTimeout(() => {
      Game.showOrderPopup();
    }, CONFIG.TIME.RESPONSE_TIME);
  },

  // Start night phase
  startNightPhase: () => {
    // Check if player is carrying a bug (instant death)
    if (Game.state.player.carrying) {
      Game.gameOver("night-death");
      return;
    }

    Game.state.phase = "night";
    Game.state.nightTime = CONFIG.TIME.NIGHT_DURATION;
    Game.state.currentMusicTrack = UTILS.switchBackgroundMusic(
      "night",
      Game.state.currentMusicTrack
    );

    // Transform bugs into monsters
    Game.transformBugsToMonsters();

    // Play night sound
    UTILS.playAudio(CONFIG.AUDIO.MONSTER_SPAWN);
  },

  // Start day phase
  startDayPhase: () => {
    Game.state.phase = "day";
    Game.state.daylightTime = CONFIG.TIME.DAY_DURATION;
    Game.state.day++;
    Game.state.currentMusicTrack = UTILS.switchBackgroundMusic(
      "day",
      Game.state.currentMusicTrack
    );

    // Achievement tracking
    AchievementManager.trackNightSurvived();
    AchievementManager.trackDaySurvived();

    // Transform monsters back to bugs
    Game.transformMonstersToBugs();

    // Play day sound
    UTILS.playAudio(CONFIG.AUDIO.DAY_TRANSITION);
  },

  // Transform bugs to monsters
  transformBugsToMonsters: () => {
    Game.state.monsters = [];
    Game.state.bugs.forEach((bug) => {
      if (!bug) return;

      const monsterType = Math.floor(
        Math.random() * CONFIG.MONSTERS.SPEEDS.length
      );
      const monster = {
        x: bug.x,
        y: bug.y,
        type: monsterType,
        size: CONFIG.MONSTERS.SIZE,
        angle: Math.random() * Math.PI * 2,
        speed: CONFIG.MONSTERS.SPEEDS[monsterType],
        alertLevel: 0,
        lastSeenX: 0,
        lastSeenY: 0,
      };

      Game.state.monsters.push(monster);
    });
  },

  // Transform monsters back to bugs
  transformMonstersToBugs: () => {
    Game.state.bugs = [];
    Game.state.monsters.forEach((monster, index) => {
      if (index < CONFIG.BUG_TYPES.length) {
        const bug = {
          type: index,
          x: monster.x,
          y: monster.y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: CONFIG.BUGS.SIZE,
        };
        Game.state.bugs[index] = bug;
      }
    });

    // Fill any missing bug slots
    for (let i = 0; i < CONFIG.BUG_TYPES.length; i++) {
      if (!Game.state.bugs[i]) {
        Game.spawnBug(i);
      }
    }

    Game.state.monsters = [];
  },

  // Update monsters
  updateMonsters: () => {
    Game.state.monsters.forEach((monster) => {
      const playerDist = UTILS.distance(
        monster.x,
        monster.y,
        Game.state.player.x,
        Game.state.player.y
      );

      // Check if player is in vision cone
      const canSeePlayer = UTILS.isInVisionCone(
        monster.x,
        monster.y,
        monster.angle,
        Game.state.player.x,
        Game.state.player.y,
        CONFIG.MONSTERS.VISION_RANGES[monster.type],
        CONFIG.MONSTERS.CONE_ANGLES[monster.type]
      );

      if (canSeePlayer) {
        monster.alertLevel = 1;
        monster.lastSeenX = Game.state.player.x;
        monster.lastSeenY = Game.state.player.y;
      }

      // Monster AI behavior
      if (monster.alertLevel === 0) {
        // Random movement while searching
        monster.angle += (Math.random() - 0.5) * 0.2;
        monster.x += Math.cos(monster.angle) * monster.speed;
        monster.y += Math.sin(monster.angle) * monster.speed;
      } else {
        // Chase player
        const dx = Game.state.player.x - monster.x;
        const dy = Game.state.player.y - monster.y;
        const dist = Math.sqrt(dx ** 2 + dy ** 2);

        if (dist > 0) {
          monster.x += (dx / dist) * monster.speed * 1.5;
          monster.y += (dy / dist) * monster.speed * 1.5;
          monster.angle = Math.atan2(dy, dx);
        }

        // Lose alert if too far and can't see player
        if (playerDist > 300 && !canSeePlayer) {
          monster.alertLevel = 0;
        }
      }

      // Keep monsters in bounds
      monster.x = UTILS.clamp(
        monster.x,
        monster.size,
        CONFIG.WORLD.WIDTH - monster.size
      );
      monster.y = UTILS.clamp(
        monster.y,
        monster.size,
        CONFIG.WORLD.HEIGHT - monster.size
      );
    });
  },

  // Check monster collision
  checkMonsterCollision: () => {
    Game.state.monsters.forEach((monster) => {
      const dist = UTILS.distance(
        monster.x,
        monster.y,
        Game.state.player.x,
        Game.state.player.y
      );
      if (dist < monster.size + Game.state.player.size) {
        Game.gameOver("monster-death");
      }
    });
  },

  // Game over
  gameOver: (reason) => {
    if (Game.state.gameLoopId) {
      cancelAnimationFrame(Game.state.gameLoopId);
      Game.state.gameLoopId = null;
    }

    // Hide game UI
    Game.hideGameUI();

    // Switch to death music
    Game.state.currentMusicTrack = UTILS.switchBackgroundMusic("death");

    // Play death sound
    UTILS.playAudio(CONFIG.AUDIO.DEATH_SOUND);

    // Track death achievement
    AchievementManager.trackDeath(reason);

    // Show ending screen
    setTimeout(() => {
      EndingScreen.init(Game.state, reason);
    }, CONFIG.TIME.RESPONSE_TIME);
  },

  // Render order popup
  renderOrderPopup: () => {
    const container = document.getElementById("game-container");
    const orderDisplay = OrderGenerator.getOrderDisplayText(
      Game.state.currentOrder
    );

    container.innerHTML = `
      <div class="popup-overlay">
        <div class="order-popup">
          <h3>${MESSAGES.ORDERS.ORDER_PREFIX}${Game.state.currentOrder.id}</h3>
          <p>${MESSAGES.ORDERS.LINDA_INTRO}</p>
          <p>${MESSAGES.ORDERS.ORDER_INTRO}${orderDisplay.needed}</p>
          <button id="hunt-button" class="start-button">${MESSAGES.ORDERS.HUNT_BUTTON}</button>
        </div>
      </div>
    `;

    // Attach event listener
    const huntButton = document.getElementById("hunt-button");
    if (huntButton) {
      huntButton.addEventListener("click", () => {
        UTILS.playAudio(CONFIG.AUDIO.COLLECT_SOUND);
        Game.startHunting();
      });
    }
  },

  // Render game
  renderGame: () => {
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up rendering
    Game.renderWorld(ctx);
    Game.renderEntities(ctx);
  },

  // Render world
  renderWorld: (ctx) => {
    // Background gradient
    const gradient = ctx.createRadialGradient(
      CONFIG.WORLD.CANVAS_WIDTH / 2,
      CONFIG.WORLD.CANVAS_HEIGHT / 2,
      0,
      CONFIG.WORLD.CANVAS_WIDTH / 2,
      CONFIG.WORLD.CANVAS_HEIGHT / 2,
      Math.max(CONFIG.WORLD.CANVAS_WIDTH, CONFIG.WORLD.CANVAS_HEIGHT)
    );

    if (Game.state.phase === "day") {
      gradient.addColorStop(0, "#87CEEB");
      gradient.addColorStop(1, "#4a90e2");
    } else {
      gradient.addColorStop(0, "#2c3e50");
      gradient.addColorStop(1, "#1a1a2e");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CONFIG.WORLD.CANVAS_WIDTH, CONFIG.WORLD.CANVAS_HEIGHT);

    // World bounds
    ctx.strokeStyle = Game.state.phase === "day" ? "#2c3e50" : "#4a90e2";
    ctx.lineWidth = 3;
    ctx.strokeRect(
      -Game.state.camera.x,
      -Game.state.camera.y,
      CONFIG.WORLD.WIDTH,
      CONFIG.WORLD.HEIGHT
    );
  },

  // Render entities
  renderEntities: (ctx) => {
    // Collection bin
    Game.renderCollectionBin(ctx);

    if (Game.state.phase === "day") {
      Game.renderBugs(ctx);
    } else {
      Game.renderMonsters(ctx);
    }

    // Player
    Game.renderPlayer(ctx);
  },

  // Render collection bin
  renderCollectionBin: (ctx) => {
    const binX = Game.state.collectionBin.x - Game.state.camera.x;
    const binY = Game.state.collectionBin.y - Game.state.camera.y;

    // Bin shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(
      binX - Game.state.collectionBin.size / 2 + 3,
      binY - Game.state.collectionBin.size / 2 + 3,
      Game.state.collectionBin.size,
      Game.state.collectionBin.size
    );

    // Bin body
    ctx.fillStyle = "#27ae60";
    ctx.fillRect(
      binX - Game.state.collectionBin.size / 2,
      binY - Game.state.collectionBin.size / 2,
      Game.state.collectionBin.size,
      Game.state.collectionBin.size
    );

    // Bin outline
    ctx.strokeStyle = "#1e8449";
    ctx.lineWidth = 3;
    ctx.strokeRect(
      binX - Game.state.collectionBin.size / 2,
      binY - Game.state.collectionBin.size / 2,
      Game.state.collectionBin.size,
      Game.state.collectionBin.size
    );

    // Bin label
    ctx.fillStyle = "white";
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🗑️", binX, binY + 10);
  },

  // Render bugs
  renderBugs: (ctx) => {
    Game.state.bugs.forEach((bug) => {
      if (!bug) return;

      const x = bug.x - Game.state.camera.x;
      const y = bug.y - Game.state.camera.y;

      // Skip if off-screen
      if (
        x < -100 ||
        x > CONFIG.WORLD.CANVAS_WIDTH + 100 ||
        y < -100 ||
        y > CONFIG.WORLD.CANVAS_HEIGHT + 100
      )
        return;

      // Bug shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.beginPath();
      ctx.arc(x + 3, y + 3, bug.size, 0, Math.PI * 2);
      ctx.fill();

      // Bug body
      ctx.fillStyle = CONFIG.BUG_TYPES[bug.type].color;
      ctx.beginPath();
      ctx.arc(x, y, bug.size, 0, Math.PI * 2);
      ctx.fill();

      // Bug outline
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Bug symbol
      ctx.fillStyle = "white";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.fillText(CONFIG.BUG_TYPES[bug.type].symbol, x, y + 7);
    });
  },

  // Render monsters
  renderMonsters: (ctx) => {
    Game.state.monsters.forEach((monster) => {
      const x = monster.x - Game.state.camera.x;
      const y = monster.y - Game.state.camera.y;

      // Skip if off-screen
      if (
        x < -200 ||
        x > CONFIG.WORLD.CANVAS_WIDTH + 200 ||
        y < -200 ||
        y > CONFIG.WORLD.CANVAS_HEIGHT + 200
      )
        return;

      // Vision cone
      const range = CONFIG.MONSTERS.VISION_RANGES[monster.type];
      const coneAngle = CONFIG.MONSTERS.CONE_ANGLES[monster.type];

      ctx.fillStyle =
        monster.alertLevel === 1
          ? "rgba(255, 0, 0, 0.3)"
          : "rgba(255, 255, 100, 0.15)";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(
        x,
        y,
        range,
        monster.angle - coneAngle,
        monster.angle + coneAngle
      );
      ctx.closePath();
      ctx.fill();

      // Vision cone outline
      ctx.strokeStyle =
        monster.alertLevel === 1
          ? "rgba(255, 0, 0, 0.6)"
          : "rgba(255, 255, 0, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Monster shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.beginPath();
      ctx.arc(x + 4, y + 4, monster.size, 0, Math.PI * 2);
      ctx.fill();

      // Monster body
      const colors = ["#8b0000", "#4b0082", "#006400"];
      ctx.fillStyle = colors[monster.type];
      ctx.beginPath();
      ctx.arc(x, y, monster.size, 0, Math.PI * 2);
      ctx.fill();

      // Monster outline
      ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Monster symbol
      ctx.fillStyle = "white";
      ctx.font = "bold 28px Arial";
      ctx.textAlign = "center";
      ctx.fillText("👹", x, y + 10);
    });
  },

  // Render player
  renderPlayer: (ctx) => {
    const playerX = Game.state.player.x - Game.state.camera.x;
    const playerY = Game.state.player.y - Game.state.camera.y;

    // Player shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.beginPath();
    ctx.arc(playerX + 3, playerY + 3, Game.state.player.size, 0, Math.PI * 2);
    ctx.fill();

    // Player body
    ctx.fillStyle = "#ff6b6b";
    ctx.beginPath();
    ctx.arc(playerX, playerY, Game.state.player.size, 0, Math.PI * 2);
    ctx.fill();

    // Player outline
    ctx.strokeStyle = "#d63031";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Player symbol
    ctx.fillStyle = "white";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("👨", playerX, playerY + 8);

    // Carried bug
    if (Game.state.player.carrying) {
      ctx.fillStyle = CONFIG.BUG_TYPES[Game.state.player.carrying.type].color;
      ctx.beginPath();
      ctx.arc(playerX, playerY - 50, 15, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "white";
      ctx.font = "bold 16px Arial";
      ctx.fillText(
        CONFIG.BUG_TYPES[Game.state.player.carrying.type].symbol,
        playerX,
        playerY - 44
      );
    }
  },

  // Update UI
  updateUI: () => {
    // Update score
    const scoreDisplay = document.getElementById("score-display");
    if (scoreDisplay) scoreDisplay.textContent = Game.state.score;

    // Update day counter
    const dayCounter = document.getElementById("day-counter");
    if (dayCounter) dayCounter.textContent = Game.state.day;

    // Update coordinates display
    const coordinatesDisplay = document.getElementById("coordinates-display");
    if (coordinatesDisplay) {
      const coords = UTILS.worldToDisplayCoords(
        Game.state.player.x,
        Game.state.player.y
      );
      coordinatesDisplay.textContent = `(${coords.x}, ${coords.y})`;
    }

    // Update carrying status
    const carryingDisplay = document.getElementById("carrying-display");
    if (carryingDisplay) {
      carryingDisplay.textContent = Game.state.player.carrying
        ? `${Game.state.player.carrying.name} ${
            CONFIG.BUG_TYPES[Game.state.player.carrying.type].symbol
          }`
        : "None";
    }

    // Update current order
    const orderDisplay = document.getElementById("current-order-display");
    if (orderDisplay && Game.state.currentOrder) {
      const orderText = OrderGenerator.getOrderDisplayText(
        Game.state.currentOrder
      );
      orderDisplay.innerHTML = orderText.needed;
    }

    // Update phase timer
    const phaseTimer = document.getElementById("phase-timer");
    const timerBarFill = document.getElementById("timer-bar-fill");

    if (phaseTimer && timerBarFill) {
      if (Game.state.phase === "day") {
        const timeLeft = Math.max(0, Math.ceil(Game.state.daylightTime));
        phaseTimer.textContent = `Daylight: ${timeLeft}s`;
        phaseTimer.className = timeLeft <= 10 ? "timer warning" : "timer";

        const percent = Math.max(
          0,
          (Game.state.daylightTime / CONFIG.TIME.DAY_DURATION) * 100
        );
        timerBarFill.style.width = percent + "%";
        timerBarFill.className =
          timeLeft <= 10 ? "timer-bar-fill warning" : "timer-bar-fill";
      } else {
        const timeLeft = Math.max(0, Math.ceil(Game.state.nightTime));
        phaseTimer.textContent = `Night: ${timeLeft}s`;
        phaseTimer.className = timeLeft <= 5 ? "timer warning" : "timer";

        const percent = Math.max(
          0,
          (Game.state.nightTime / CONFIG.TIME.NIGHT_DURATION) * 100
        );
        timerBarFill.style.width = percent + "%";
        timerBarFill.className = "timer-bar-fill night";
      }
    }
  },

  // Show game UI
  showGameUI: () => {
    const gameUI = document.getElementById("game-ui");
    const canvas = document.getElementById("gameCanvas");

    if (gameUI) gameUI.style.display = "block";
    if (canvas) canvas.style.display = "block";
  },

  // Hide game UI
  hideGameUI: () => {
    const gameUI = document.getElementById("game-ui");
    const canvas = document.getElementById("gameCanvas");

    if (gameUI) gameUI.style.display = "none";
    if (canvas) canvas.style.display = "none";
  },
};

// Initialize game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  Game.init();
});

// Handle page visibility changes to pause/resume music
document.addEventListener("visibilitychange", () => {
  const allMusicTracks = [
    CONFIG.AUDIO.BACKGROUND_MUSIC_DAY,
    CONFIG.AUDIO.BACKGROUND_MUSIC_NIGHT,
    CONFIG.AUDIO.BACKGROUND_MUSIC_DEATH,
  ];

  if (document.hidden) {
    // Pause all music tracks
    allMusicTracks.forEach((trackId) => {
      const audio = document.getElementById(trackId);
      if (audio && !audio.paused) {
        audio.pause();
      }
    });
  } else {
    // Resume the current track
    if (Game.state && Game.state.currentMusicTrack) {
      const currentAudio = document.getElementById(
        Game.state.currentMusicTrack
      );
      if (currentAudio) {
        currentAudio
          .play()
          .catch((e) => console.log("Music resume failed:", e));
      }
    }
  }
});
