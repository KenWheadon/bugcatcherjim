// Bug Catcher Jim - Main game application (Game Jam Pivot)
const Game = {
  // Game state
  state: {
    screen: "start", // 'start', 'game', 'stage-transition', 'game-over'
    stage: 1, // 1, 2, or 3
    score: 0,
    stageScores: [0, 0, 0], // Scores for each stage
    gameLoopId: null,

    // Stamina system
    stamina: CONFIG.STAMINA.MAX,
    isSprinting: false,

    // Player state
    player: {
      x: CONFIG.PLAYER.START_X,
      y: CONFIG.PLAYER.START_Y,
      size: CONFIG.PLAYER.SIZE,
      speed: CONFIG.PLAYER.SPEED,
      carrying: [], // Array of carried bugs
    },

    // Camera state
    camera: {
      x: 0,
      y: 0,
    },

    // World entities
    bugs: [],
    monsters: [],
    particles: [], // Particle system

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

    // Load all images first
    try {
      await UTILS.loadImages();
      console.log("Images loaded successfully");
    } catch (error) {
      console.error("Error loading images:", error);
    }

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
      if (!Game.keys[e.key.toLowerCase()]) {
        Game.keys[e.key.toLowerCase()] = true;

        // Handle sprinting - only start if space was just pressed
        if (e.key === " " || e.key === "Space") {
          e.preventDefault();
          Game.startSprinting();
        }
      }
    });

    document.addEventListener("keyup", (e) => {
      Game.keys[e.key.toLowerCase()] = false;

      // Handle sprint stop - stop when space is released
      if (e.key === " " || e.key === "Space") {
        e.preventDefault();
        Game.stopSprinting();
      }
    });
  },

  // Start sprinting if allowed
  startSprinting: () => {
    const stageConfig = CONFIG.STAGES[`STAGE_${Game.state.stage}`];
    if (
      stageConfig.canSprint &&
      Game.state.stamina > 0 &&
      !Game.state.isSprinting
    ) {
      Game.state.isSprinting = true;
      UTILS.playAudio(CONFIG.AUDIO.SPRINT_START, 0.3);
    }
  },

  // Stop sprinting
  stopSprinting: () => {
    if (Game.state.isSprinting) {
      Game.state.isSprinting = false;
      UTILS.playAudio(CONFIG.AUDIO.SPRINT_STOP, 0.3);
    }
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
    Game.state.screen = "game";
    Game.state.stage = 1;
    Game.state.score = 0;
    Game.state.stageScores = [0, 0, 0];
    Game.state.stamina = CONFIG.STAMINA.MAX;

    // Start background music
    UTILS.switchBackgroundMusic(CONFIG.AUDIO.BACKGROUND_MUSIC);

    // Initialize world
    Game.initializeWorld();

    // Show game and start loop
    Game.showGameUI();
    Game.startGameLoop();
  },

  // Reset game state
  resetGame: () => {
    if (Game.state.gameLoopId) {
      cancelAnimationFrame(Game.state.gameLoopId);
      Game.state.gameLoopId = null;
    }

    Game.state = {
      screen: "start",
      stage: 1,
      score: 0,
      stageScores: [0, 0, 0],
      gameLoopId: null,
      stamina: CONFIG.STAMINA.MAX,
      isSprinting: false,

      player: {
        x: CONFIG.PLAYER.START_X,
        y: CONFIG.PLAYER.START_Y,
        size: CONFIG.PLAYER.SIZE,
        speed: CONFIG.PLAYER.SPEED,
        carrying: [],
      },

      camera: {
        x: 0,
        y: 0,
      },

      bugs: [],
      monsters: [],
      particles: [],

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
    Game.state.particles = [];

    // Spawn initial bugs (one of each type)
    for (let i = 0; i < CONFIG.BUG_TYPES.length; i++) {
      Game.spawnBug(i);
    }
  },

  // Spawn a bug of specific type
  spawnBug: (typeIndex, atEdge = false) => {
    let attempts = 0;
    let validPosition = false;
    let bug;

    while (!validPosition && attempts < 50) {
      const pos = atEdge
        ? UTILS.randomEdgePosition()
        : UTILS.randomPosition(
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
      Game.state.bugs.push(bug);
    }
  },

  // Spawn a monster of specific type
  spawnMonster: (typeIndex) => {
    const pos = UTILS.randomEdgePosition();

    const monster = {
      x: pos.x,
      y: pos.y,
      type: typeIndex,
      size: CONFIG.MONSTERS.SIZE,
      angle: Math.random() * Math.PI * 2,
      speed: CONFIG.MONSTERS.SPEEDS[typeIndex],
      huntPattern: CONFIG.MONSTERS.HUNT_PATTERNS[typeIndex],
      alertLevel: 0,
      lastSeenX: 0,
      lastSeenY: 0,
      wallCollisionCooldown: 0,
      patrolTarget: { x: pos.x, y: pos.y },
      aggressionLevel: 0,
    };

    Game.state.monsters.push(monster);
    UTILS.playAudio(CONFIG.AUDIO.MONSTER_SPAWN, 0.4);
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
    Game.updatePlayer();
    Game.updateStamina();
    Game.updateCamera();
    Game.updateBugs();
    Game.updateMonsters();

    // Check bug collection
    Game.checkBugCollection();

    // Check bin deposit
    Game.checkBinDeposit();

    // Check monster collision
    Game.checkMonsterCollision();

    // Update particles
    UTILS.updateParticles(Game.state.particles);
  },

  // Update player
  updatePlayer: () => {
    let dx = 0,
      dy = 0;

    // Movement controls
    if (Game.keys["w"] || Game.keys["arrowup"]) dy = -1;
    if (Game.keys["s"] || Game.keys["arrowdown"]) dy = 1;
    if (Game.keys["a"] || Game.keys["arrowleft"]) dx = -1;
    if (Game.keys["d"] || Game.keys["arrowright"]) dx = 1;

    // Diagonal movement normalization
    if (dx && dy) {
      dx *= 0.707;
      dy *= 0.707;
    }

    // Calculate speed based on stage and conditions
    let currentSpeed = Game.state.player.speed;
    const stageConfig = CONFIG.STAGES[`STAGE_${Game.state.stage}`];

    // Apply sprint multiplier if sprinting
    if (Game.state.isSprinting && stageConfig.canSprint) {
      currentSpeed *= CONFIG.PLAYER.SPRINT_MULTIPLIER;
    }

    // Apply head speed reduction when carrying (stage 3 only)
    if (Game.state.stage === 3 && Game.state.player.carrying.length > 0) {
      currentSpeed *= CONFIG.PLAYER.HEAD_SPEED_MULTIPLIER;
    }

    // Apply movement
    dx *= currentSpeed;
    dy *= currentSpeed;

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

  // Update stamina system
  updateStamina: () => {
    // Drain stamina while sprinting (1 point every 3 seconds)
    if (Game.state.isSprinting) {
      Game.state.stamina -= 1 / CONFIG.STAMINA.DRAIN_PER_SECOND; // Convert to per-frame

      // Stop sprinting if out of stamina
      if (Game.state.stamina <= 0) {
        Game.state.stamina = 0;
        Game.stopSprinting();
      }
    }
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

  // Update monsters with AI
  updateMonsters: () => {
    Game.state.monsters.forEach((monster) => {
      // Decrease wall collision cooldown
      if (monster.wallCollisionCooldown > 0) {
        monster.wallCollisionCooldown--;
      }

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
        Game.handleMonsterSearchBehavior(monster);
      } else {
        Game.handleMonsterChaseBehavior(monster, playerDist, canSeePlayer);
      }

      // Check for wall collisions
      Game.handleMonsterWallCollision(monster);

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

  // Handle monster search behavior
  handleMonsterSearchBehavior: (monster) => {
    switch (monster.huntPattern) {
      case "aggressive":
        monster.angle += (Math.random() - 0.5) * 0.3;
        monster.x += Math.cos(monster.angle) * monster.speed;
        monster.y += Math.sin(monster.angle) * monster.speed;
        break;

      case "stalker":
        monster.angle += (Math.random() - 0.5) * 0.1;
        monster.x += Math.cos(monster.angle) * monster.speed * 0.5;
        monster.y += Math.sin(monster.angle) * monster.speed * 0.5;
        break;

      case "patrol":
        const patrolDist = UTILS.distance(
          monster.x,
          monster.y,
          monster.patrolTarget.x,
          monster.patrolTarget.y
        );
        if (patrolDist < 50) {
          monster.patrolTarget = UTILS.randomPosition(
            monster.size,
            monster.size,
            CONFIG.WORLD.WIDTH - monster.size,
            CONFIG.WORLD.HEIGHT - monster.size
          );
        }
        const patrolAngle = Math.atan2(
          monster.patrolTarget.y - monster.y,
          monster.patrolTarget.x - monster.x
        );
        monster.angle = patrolAngle;
        monster.x += Math.cos(monster.angle) * monster.speed * 0.7;
        monster.y += Math.sin(monster.angle) * monster.speed * 0.7;
        break;

      default:
        monster.angle += (Math.random() - 0.5) * 0.2;
        monster.x += Math.cos(monster.angle) * monster.speed;
        monster.y += Math.sin(monster.angle) * monster.speed;
    }
  },

  // Handle monster chase behavior
  handleMonsterChaseBehavior: (monster, playerDist, canSeePlayer) => {
    const dx = Game.state.player.x - monster.x;
    const dy = Game.state.player.y - monster.y;
    const dist = Math.sqrt(dx ** 2 + dy ** 2);

    if (dist > 0) {
      let chaseSpeed = monster.speed * 1.5;
      monster.x += (dx / dist) * chaseSpeed;
      monster.y += (dy / dist) * chaseSpeed;
      monster.angle = Math.atan2(dy, dx);
    }

    // Lose alert if too far and can't see player
    if (playerDist > 400 && !canSeePlayer) {
      monster.alertLevel = 0;
    }
  },

  // Handle monster wall collision
  handleMonsterWallCollision: (monster) => {
    const margin = monster.size + 10;

    if (monster.x < margin || monster.x > CONFIG.WORLD.WIDTH - margin) {
      if (monster.wallCollisionCooldown === 0) {
        monster.angle = Math.PI - monster.angle;
        monster.wallCollisionCooldown = 30;
      }
    }

    if (monster.y < margin || monster.y > CONFIG.WORLD.HEIGHT - margin) {
      if (monster.wallCollisionCooldown === 0) {
        monster.angle = -monster.angle;
        monster.wallCollisionCooldown = 30;
      }
    }
  },

  // Check bug collection
  checkBugCollection: () => {
    const stageConfig = CONFIG.STAGES[`STAGE_${Game.state.stage}`];
    if (Game.state.player.carrying.length >= stageConfig.maxCarrying) return;

    for (let i = Game.state.bugs.length - 1; i >= 0; i--) {
      const bug = Game.state.bugs[i];
      if (!bug) continue;

      const dist = UTILS.distance(
        bug.x,
        bug.y,
        Game.state.player.x,
        Game.state.player.y
      );

      if (dist < bug.size + Game.state.player.size) {
        // Pick up bug
        Game.state.player.carrying.push({
          type: bug.type,
          name: CONFIG.BUG_TYPES[bug.type].name,
          points: CONFIG.BUG_TYPES[bug.type].points,
        });

        // Gain stamina
        Game.state.stamina = Math.min(
          CONFIG.STAMINA.MAX,
          Game.state.stamina + CONFIG.STAMINA.GAIN_PER_BUG
        );

        // Create particle effect
        const particles = UTILS.createParticles(bug.x, bug.y, "BUG_COLLECTION");
        Game.state.particles.push(...particles);

        // Remove bug from world
        Game.state.bugs.splice(i, 1);

        // Play collection sound
        UTILS.playAudio(CONFIG.AUDIO.COLLECT_SOUND);

        break; // Only collect one bug per frame
      }
    }
  },

  // Check bin deposit
  checkBinDeposit: () => {
    if (Game.state.player.carrying.length === 0) return;

    const dist = UTILS.distance(
      Game.state.collectionBin.x,
      Game.state.collectionBin.y,
      Game.state.player.x,
      Game.state.player.y
    );

    if (dist < Game.state.collectionBin.size + Game.state.player.size) {
      // Deposit all carried bugs
      let totalPoints = 0;

      Game.state.player.carrying.forEach((carriedBug) => {
        totalPoints += carriedBug.points;

        // Spawn new bug and monster at edge
        Game.spawnBug(carriedBug.type, true);
        Game.spawnMonster(carriedBug.type);
      });

      // Add points to current stage score
      Game.state.score += totalPoints;
      Game.state.stageScores[Game.state.stage - 1] += totalPoints;

      // Create particle effect for points
      const particles = UTILS.createParticles(
        Game.state.collectionBin.x,
        Game.state.collectionBin.y,
        "POINTS_GAINED"
      );
      Game.state.particles.push(...particles);

      // Clear carried bugs
      Game.state.player.carrying = [];

      // Play deposit sound
      UTILS.playAudio(CONFIG.AUDIO.DEPOSIT_SOUND || CONFIG.AUDIO.UI_HOVER);
    }
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
        Game.handleStageEnd();
      }
    });
  },

  // Handle end of stage (monster collision)
  handleStageEnd: () => {
    if (Game.state.gameLoopId) {
      cancelAnimationFrame(Game.state.gameLoopId);
      Game.state.gameLoopId = null;
    }

    // Play death sound
    UTILS.playAudio(CONFIG.AUDIO.DEATH_SOUND);

    if (Game.state.stage < 3) {
      // Move to next stage
      Game.state.stage++;
      Game.showStageTransition();
    } else {
      // Game over
      Game.gameOver();
    }
  },

  // Show stage transition popup
  showStageTransition: () => {
    Game.state.screen = "stage-transition";
    Game.hideGameUI();

    const container = document.getElementById("game-container");
    let title, message, imagePath;

    switch (Game.state.stage) {
      case 2:
        title = "You were mauled - but made it through!";
        message =
          "Your arms are gone, but you can still catch bugs! You can now only hold 1 bug at a time.";
        imagePath = UTILS.getJimImagePath(2);
        break;
      case 3:
        title = "You were mauled...again...";
        message =
          "Now you're just a head! You move slower when carrying bugs and can't sprint.";
        imagePath = UTILS.getJimImagePath(3);
        break;
    }

    container.innerHTML = `
      <div class="popup-overlay">
        <div class="stage-transition-popup">
          <h2>${title}</h2>
          <div class="jim-display">
            <img src="${imagePath}" alt="Jim Stage ${Game.state.stage}" class="jim-image" />
          </div>
          <p>${message}</p>
          <button id="continue-button" class="start-button">Continue Hunting!</button>
        </div>
      </div>
    `;

    // Attach event listener
    const continueButton = document.getElementById("continue-button");
    if (continueButton) {
      continueButton.addEventListener("click", () => {
        UTILS.playAudio(
          CONFIG.AUDIO.STAGE_TRANSITION || CONFIG.AUDIO.COLLECT_SOUND
        );
        Game.continueToNextStage();
      });
    }
  },

  // Continue to next stage
  continueToNextStage: () => {
    // Clear the popup overlay completely
    const container = document.getElementById("game-container");
    container.innerHTML = ""; // This removes the popup

    // Update canvas dimensions for current screen
    UTILS.updateCanvasDimensions();
    Game.setupCanvas();

    // Reset player position and clear carrying
    Game.state.player.x = CONFIG.PLAYER.START_X;
    Game.state.player.y = CONFIG.PLAYER.START_Y;
    Game.state.player.carrying = [];
    Game.state.stamina = CONFIG.STAMINA.MAX;
    Game.state.isSprinting = false;

    // Clear monsters but keep bugs
    Game.state.monsters = [];

    // Show game UI and restart loop
    Game.state.screen = "game";
    Game.showGameUI();
    Game.startGameLoop();
  },

  // Game over
  gameOver: () => {
    Game.state.screen = "game-over";
    Game.hideGameUI();
    EndingScreen.init(Game.state);
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

    // Render particles
    UTILS.renderParticles(
      ctx,
      Game.state.particles,
      Game.state.camera.x,
      Game.state.camera.y
    );
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

    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(1, "#4a90e2");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CONFIG.WORLD.CANVAS_WIDTH, CONFIG.WORLD.CANVAS_HEIGHT);

    // World bounds
    ctx.strokeStyle = "#2c3e50";
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

    // Bugs
    Game.renderBugs(ctx);

    // Monsters
    Game.renderMonsters(ctx);

    // Player
    Game.renderPlayer(ctx);
  },

  // Render collection bin
  renderCollectionBin: (ctx) => {
    const binX = Game.state.collectionBin.x - Game.state.camera.x;
    const binY = Game.state.collectionBin.y - Game.state.camera.y;

    // Bin image or emoji
    UTILS.drawImageOrEmoji(
      ctx,
      "collection_bin",
      "🗑️",
      binX,
      binY,
      Game.state.collectionBin.size,
      Game.state.collectionBin.size
    );
  },

  // Render bugs (no circles)
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

      // Bug image or emoji (no background circle)
      const imageKey = `bug_${CONFIG.BUG_TYPES[bug.type].image}`;
      const emoji = CONFIG.BUG_TYPES[bug.type].symbol;
      UTILS.drawImageOrEmoji(
        ctx,
        imageKey,
        emoji,
        x,
        y,
        bug.size * 1.6,
        bug.size * 1.6
      );
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

      // Monster image
      const monsterImageKeys = [
        "firefly_monster",
        "beetle_monster",
        "butterfly_monster",
        "ladybug_monster",
        "grasshopper_monster",
        "dragonfly_monster",
      ];

      const monsterEmojis = ["🔥", "🪲", "🦇", "🔴", "🦂", "🐉"];

      const imageKey = monsterImageKeys[monster.type] || "monster";
      const emoji = monsterEmojis[monster.type] || "👹";

      UTILS.drawImageOrEmoji(
        ctx,
        imageKey,
        emoji,
        x,
        y,
        monster.size * 1.6,
        monster.size * 1.6
      );
    });
  },

  // Render player (no circle)
  renderPlayer: (ctx) => {
    const playerX = Game.state.player.x - Game.state.camera.x;
    const playerY = Game.state.player.y - Game.state.camera.y;

    // Player image based on stage
    const imageKeys = ["", "jim_happy", "jim_armless", "jim_head_happy"];
    const imageKey = imageKeys[Game.state.stage];
    const emoji = "👨";

    UTILS.drawImageOrEmoji(
      ctx,
      imageKey,
      emoji,
      playerX,
      playerY,
      Game.state.player.size * 1.6,
      Game.state.player.size * 1.6
    );

    // Carried bugs above player
    Game.state.player.carrying.forEach((carriedBug, index) => {
      const bugX = playerX + (index - 1) * 25;
      const bugY = playerY - 50;

      const imageKey = `bug_${CONFIG.BUG_TYPES[carriedBug.type].image}`;
      const emoji = CONFIG.BUG_TYPES[carriedBug.type].symbol;
      UTILS.drawImageOrEmoji(ctx, imageKey, emoji, bugX, bugY, 24, 24);
    });
  },

  // Update UI
  updateUI: () => {
    // Update score
    const scoreDisplay = document.getElementById("score-display");
    if (scoreDisplay) scoreDisplay.textContent = Game.state.score;

    // Update stage
    const stageDisplay = document.getElementById("stage-display");
    if (stageDisplay) stageDisplay.textContent = Game.state.stage;

    // Update coordinates
    const coordinatesDisplay = document.getElementById("coordinates-display");
    if (coordinatesDisplay) {
      const coords = UTILS.worldToDisplayCoords(
        Game.state.player.x,
        Game.state.player.y
      );
      coordinatesDisplay.textContent = `(${coords.x}, ${coords.y})`;
    }

    // Update carrying count
    const carryingDisplay = document.getElementById("carrying-display");
    if (carryingDisplay) {
      const stageConfig = CONFIG.STAGES[`STAGE_${Game.state.stage}`];
      carryingDisplay.textContent = `${Game.state.player.carrying.length}/${stageConfig.maxCarrying}`;
    }

    // Update stamina bar
    const staminaBarFill = document.getElementById("stamina-bar-fill");
    if (staminaBarFill) {
      const percent = (Game.state.stamina / CONFIG.STAMINA.MAX) * 100;
      staminaBarFill.style.width = percent + "%";
      staminaBarFill.className = Game.state.isSprinting
        ? "stamina-bar-fill sprinting"
        : "stamina-bar-fill";
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
  if (document.hidden) {
    // Pause music
    const audio = document.getElementById(CONFIG.AUDIO.BACKGROUND_MUSIC);
    if (audio && !audio.paused) {
      audio.pause();
    }
  } else {
    // Resume music if game is running
    if (Game.state && Game.state.screen === "game") {
      const audio = document.getElementById(CONFIG.AUDIO.BACKGROUND_MUSIC);
      if (audio) {
        audio.play().catch((e) => console.log("Music resume failed:", e));
      }
    }
  }
});
