class JimGame {
  constructor() {
    this.currentJim = 1;
    this.maxJim = GAME_CONFIG.MAX_JIM;
    this.hp = 0;
    this.maxHp = 0;
    this.clicksRequired = 1;
    this.currentClicks = 0;
    this.isMoving = false;
    this.moveInterval = null;
    this.particles = [];
    this.comboCount = 0;
    this.lastClickTime = 0;
    this.beetleClickCount = 0;
    this.minions = [];
    this.defeatedMinions = 0;
    this.goldEarned = 0;
    this.cupGame = { cups: [], correctCup: -1, gameActive: false };

    // Jim8 multi-click tracking
    this.jim8ClickCount = 0;

    // Get DOM elements
    this.jimImage = document.getElementById("jim-image");
    this.dialogueBox = document.getElementById("dialogue-box");
    this.dialogueText = document.getElementById("dialogue-text");
    this.hpContainer = document.getElementById("hp-bar-container");
    this.hpFill = document.getElementById("hp-fill");
    this.hpText = document.getElementById("hp-text");
    this.particleContainer = document.getElementById("particle-container");
    this.gameContainer = document.getElementById("game-container");
    this.progressFill = document.getElementById("progress-fill");
    this.comboCounter = document.getElementById("combo-counter");
    this.progressBar = document.querySelector(".progress-bar");

    this.init();
  }

  init() {
    this.updateDisplay();
    this.updateProgressBar();

    // Prevent dragging on main Jim image - using draggable attribute is more reliable
    this.jimImage.draggable = false;

    // Use mousedown instead of click for better responsiveness on moving elements
    this.jimImage.addEventListener("mousedown", (e) => this.handleClick(e));

    document.addEventListener("mousemove", (e) => this.handleMouseMove(e));

    // Add some initial sparkle
    this.createSparkle(this.jimImage.getBoundingClientRect());
  }

  // Helper function to keep positions within screen bounds
  keepWithinBounds(x, y, elementWidth, elementHeight) {
    const margin = 20;
    const maxX = window.innerWidth - elementWidth - margin;
    const maxY = window.innerHeight - elementHeight - margin;

    const boundedX = Math.max(margin, Math.min(maxX, x));
    const boundedY = Math.max(margin, Math.min(maxY, y));

    return { x: boundedX, y: boundedY };
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    // Special handling for button phases
    if (this.currentJim === 29) {
      // Finish button phase - award gold
      this.awardGold(e.clientX, e.clientY);

      // Check if we have enough gold to advance
      if (this.goldEarned >= GAME_CONFIG.UI.GOLD_TARGET) {
        setTimeout(() => {
          this.removeGoldCounter();
          this.currentJim = 30;
          this.updateDisplay();
          this.updateProgressBar();
        }, 1000);
      }
      return;
    } else if (this.currentJim === 30) {
      // Lose button phase - just advance
      this.currentJim = 31;
      this.updateDisplay();
      this.updateProgressBar();
      return;
    }

    const now = Date.now();

    // Combo system
    if (now - this.lastClickTime < 1000) {
      this.comboCount++;
    } else {
      this.comboCount = 1;
    }
    this.lastClickTime = now;
    this.updateComboCounter();

    // Visual feedback
    this.addClickEffect(e);
    this.jimImage.classList.add("clicked");
    setTimeout(
      () => this.jimImage.classList.remove("clicked"),
      GAME_CONFIG.TIMINGS.CLICK_ANIMATION
    );

    // Screen shake for impact
    if (this.currentJim >= 11) {
      this.screenShake();
    }

    // Special handling for Jim8 extended clicks
    if (this.currentJim === 8) {
      this.jim8ClickCount++;

      // Update dialogue based on click count
      if (this.jim8ClickCount <= 4) {
        this.dialogueText.textContent = JIM8_DIALOGUES[this.jim8ClickCount - 1];
        this.dialogueBox.style.animation = "dialoguePulse 0.5s ease-out";

        // After first click, start jumping animation
        if (this.jim8ClickCount === 2) {
          this.jimImage.classList.remove("dead-jim");
          this.jimImage.classList.add("dead-jim-jumping");
        }

        // Only advance to next Jim after 4 clicks
        if (this.jim8ClickCount >= 4) {
          this.jim8ClickCount = 0; // Reset for next time
          this.currentJim++;
          this.updateDisplay();
          this.updateProgressBar();
        }
      }
      return;
    }

    this.currentClicks++;

    if (
      (this.currentJim >= 11 && this.currentJim <= 18) ||
      (this.currentJim >= 25 && this.currentJim <= 27)
    ) {
      // HP system active
      this.hp = Math.max(0, this.hp - 1);
      this.updateHPBar();

      // Add damage animation
      this.jimImage.classList.add("damaged");
      setTimeout(
        () => this.jimImage.classList.remove("damaged"),
        GAME_CONFIG.TIMINGS.DAMAGE_ANIMATION
      );

      // Cycle beetle dialogue during combat
      if (this.currentJim >= 11 && this.currentJim <= 17) {
        this.beetleClickCount++;
        this.updateBeetleDialogue();
      }

      if (this.hp > 0) {
        return; // Don't advance until HP is 0
      }
    }

    if (this.currentJim >= 19 && this.currentJim <= 22) {
      // Hopping Jims need 2 clicks
      if (this.currentClicks < 2) {
        this.moveAwayFromCursor(e);
        return;
      }
    }

    // Advance to next Jim
    this.currentClicks = 0;
    this.beetleClickCount = 0; // Reset beetle click counter
    this.currentJim++;

    if (this.currentJim > this.maxJim) {
      this.startParticleShow();
      return;
    }

    // Special handling for new phases
    if (this.currentJim === 23) {
      this.startMinionPhase();
      return;
    } else if (this.currentJim === 24) {
      // Skip the broken "Find Still Jim" phase - go directly to fusion phase
      this.currentJim = 25;
      this.updateDisplay();
      this.updateProgressBar();
      return;
    } else if (this.currentJim === 28) {
      this.startGoldPhase();
      return;
    } else if (this.currentJim === 29) {
      this.startFinishButtonPhase();
      return;
    } else if (this.currentJim === 30) {
      this.startLoseButtonPhase();
      return;
    } else if (this.currentJim === 31) {
      // Brief pause, then advance to cup game
      setTimeout(() => {
        this.currentJim = 32;
        this.updateDisplay();
        this.updateProgressBar();
      }, 2000);
      return;
    } else if (this.currentJim === 32) {
      this.startCupGame();
      return;
    }

    this.updateDisplay();
    this.updateProgressBar();
  }

  updateDisplay() {
    // Handle image loading - special cases for button phases
    let jimImageSrc;
    let hideJimOffscreen = false;

    if (this.currentJim === 29) {
      // Finish button phase - show finish.png instead of Jim
      jimImageSrc = "finish.png";
      hideJimOffscreen = true;
    } else if (this.currentJim === 30) {
      // Lose button phase - show lose.png instead of Jim
      jimImageSrc = "lose.png";
      hideJimOffscreen = true;
    } else if (GAME_CONFIG.FUSION_IMAGES.includes(this.currentJim)) {
      jimImageSrc = `jim${this.currentJim}.png`; // Use jim25.png, jim26.png, jim27.png
    } else {
      // Standard jim images (cap at jim22.png)
      jimImageSrc = `jim${Math.min(
        this.currentJim,
        GAME_CONFIG.MAX_JIM_IMAGES
      )}.png`;
    }

    this.jimImage.src = jimImageSrc;
    this.dialogueText.textContent = DIALOGUES[this.currentJim] || "...";

    // Add dialogue animation
    this.dialogueBox.style.animation = "dialoguePulse 0.5s ease-out";

    // Reset positioning and movement
    this.stopMovement();
    this.jimImage.className = "jim-image"; // Reset classes

    // Add button styling for button phases
    if (this.currentJim === 29 || this.currentJim === 30) {
      this.jimImage.classList.add("button-image");
    }

    // CRITICAL FIX: Ensure Jim image is visible by removing any display override
    this.jimImage.style.display = "";

    // Handle button phases - center the button images
    if (hideJimOffscreen) {
      this.jimImage.style.position = "static";
      this.jimImage.style.left = "";
      this.jimImage.style.top = "";
      this.jimImage.style.pointerEvents = "auto";
      this.jimImage.style.cursor = "pointer";
    } else {
      // Normal positioning for non-button phases
      this.jimImage.style.position = "static";
      this.jimImage.style.left = "";
      this.jimImage.style.top = "";
      this.jimImage.style.pointerEvents = "auto";
      this.jimImage.style.cursor = "pointer";
    }

    // Add personality-based animations (but not for button phases)
    if (!hideJimOffscreen) {
      this.addPersonalityAnimation();
    }

    // HP system for beetles (11-17), moth (18), and fusion phases (25-27)
    if (
      (this.currentJim >= 11 && this.currentJim <= 18) ||
      (this.currentJim >= 25 && this.currentJim <= 27)
    ) {
      this.setupHPSystem();
      // Fade out progress bar when entering beetle mode
      if (this.currentJim === 11) {
        this.progressBar.classList.add("fade-out");
      }
    } else {
      this.hpContainer.style.display = "none";
    }

    // Special behaviors (but not for button phases)
    if (!hideJimOffscreen) {
      if (this.currentJim === 18) {
        this.startFlyingBehavior();
      } else if (this.currentJim >= 19 && this.currentJim <= 22) {
        this.startHoppingBehavior();
      } else if (this.currentJim === 25) {
        this.startBeetleMothBehavior();
      } else if (this.currentJim === 26) {
        this.startChickenBeetleBehavior();
      } else if (this.currentJim === 27) {
        this.startGhostChickenBehavior();
      }
    }
  }

  updateBeetleDialogue() {
    if (BEETLE_TAUNTS[this.currentJim]) {
      const taunts = BEETLE_TAUNTS[this.currentJim];
      const tauntIndex = (this.beetleClickCount - 1) % taunts.length;
      this.dialogueText.textContent = taunts[tauntIndex];
      this.dialogueBox.style.animation = "dialoguePulse 0.5s ease-out";
    }
  }

  addPersonalityAnimation() {
    if (this.currentJim === 1) {
      this.jimImage.classList.add("happy-jim");
    } else if (this.currentJim === 2) {
      this.jimImage.classList.add("scared-jim");
    } else if (this.currentJim >= 6 && this.currentJim <= 7) {
      this.jimImage.classList.add("invincible-jim");
    } else if (this.currentJim === 8) {
      this.jimImage.classList.add("dead-jim");
    } else if (this.currentJim >= 11 && this.currentJim <= 17) {
      this.jimImage.classList.add("beetle-jim");
    }
  }

  setupHPSystem() {
    if (this.currentJim >= 11 && this.currentJim <= 17) {
      // Beetles: HP increases by 1 each time, starting at 2
      this.maxHp =
        GAME_CONFIG.HP_CONFIG.BEETLE_BASE_HP + (this.currentJim - 11);
    } else if (this.currentJim === 18) {
      // Moth: 6 HP
      this.maxHp = GAME_CONFIG.HP_CONFIG.MOTH_HP;
    } else if (this.currentJim === 25) {
      // Beetle-Moth fusion: 8 HP
      this.maxHp = GAME_CONFIG.HP_CONFIG.BEETLE_MOTH_HP;
    } else if (this.currentJim === 26) {
      // Chicken-Beetle fusion: 6 HP
      this.maxHp = GAME_CONFIG.HP_CONFIG.CHICKEN_BEETLE_HP;
    } else if (this.currentJim === 27) {
      // Ghost-Chicken fusion: 4 HP
      this.maxHp = GAME_CONFIG.HP_CONFIG.GHOST_CHICKEN_HP;
    }

    this.hp = this.maxHp;
    this.hpContainer.style.display = "block";
    this.hpContainer.style.animation = "hpBarSlideIn 0.5s ease-out";
    this.updateHPBar();
  }

  updateHPBar() {
    const percentage = (this.hp / this.maxHp) * 100;
    this.hpFill.style.width = percentage + "%";
    this.hpText.textContent = `❤️ ${this.hp} / ${this.maxHp} HP`;

    // Add critical health effects
    if (percentage <= 25) {
      this.hpFill.classList.add("critical");
      if (this.currentJim >= 11 && this.currentJim <= 17) {
        this.jimImage.classList.add("low-health");
      }
    } else {
      this.hpFill.classList.remove("critical");
      this.jimImage.classList.remove("low-health");
    }
  }

  updateProgressBar() {
    const percentage = (this.currentJim / this.maxJim) * 100;
    this.progressFill.style.width = percentage + "%";
  }

  updateComboCounter() {
    if (this.comboCount > 1) {
      this.comboCounter.textContent = `${this.comboCount}x COMBO!`;
      this.comboCounter.style.display = "block";
      this.comboCounter.style.animation = "comboPulse 0.5s ease-out";

      setTimeout(() => {
        if (Date.now() - this.lastClickTime > 2000) {
          this.comboCounter.style.display = "none";
          this.comboCount = 0;
        }
      }, 2000);
    }
  }

  addClickEffect(e) {
    const effect = document.createElement("div");
    effect.classList.add("click-effect");
    effect.textContent =
      CLICK_PHRASES[Math.floor(Math.random() * CLICK_PHRASES.length)];

    const rect = this.jimImage.getBoundingClientRect();
    effect.style.left = rect.left + Math.random() * rect.width + "px";
    effect.style.top = rect.top + Math.random() * rect.height + "px";
    effect.style.color = `hsl(${Math.random() * 360}, 100%, 70%)`;

    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
  }

  screenShake() {
    this.gameContainer.classList.add("screen-shake");
    setTimeout(
      () => this.gameContainer.classList.remove("screen-shake"),
      GAME_CONFIG.TIMINGS.SCREEN_SHAKE
    );
  }

  createSparkle(rect) {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const sparkle = document.createElement("div");
        sparkle.style.position = "absolute";
        sparkle.style.left = rect.left + Math.random() * rect.width + "px";
        sparkle.style.top = rect.top + Math.random() * rect.height + "px";
        sparkle.style.width = "4px";
        sparkle.style.height = "4px";
        sparkle.style.background = "#ffff00";
        sparkle.style.borderRadius = "50%";
        sparkle.style.pointerEvents = "none";
        sparkle.style.animation = "clickEffectFloat 1s ease-out forwards";
        sparkle.style.zIndex = "100";

        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
      }, i * 100);
    }
  }

  startFlyingBehavior() {
    this.jimImage.classList.add("flying-jim");
    this.jimImage.style.position = "absolute";

    // Center Jim initially when switching to absolute positioning
    const jimRect = this.jimImage.getBoundingClientRect();
    const jimWidth = jimRect.width;
    const jimHeight = jimRect.height;

    // Center Jim on screen
    const centerX = (window.innerWidth - jimWidth) / 2;
    const centerY = (window.innerHeight - jimHeight) / 2;

    this.jimImage.style.left = centerX + "px";
    this.jimImage.style.top = centerY + "px";

    this.isMoving = true;

    this.moveInterval = setInterval(() => {
      const randomX = Math.random() * (window.innerWidth - jimWidth);
      const randomY = Math.random() * (window.innerHeight - jimHeight);

      const boundedPos = this.keepWithinBounds(
        randomX,
        randomY,
        jimWidth,
        jimHeight
      );

      this.jimImage.style.left = boundedPos.x + "px";
      this.jimImage.style.top = boundedPos.y + "px";

      this.createFlutterTrail(boundedPos.x, boundedPos.y);
    }, GAME_CONFIG.TIMINGS.FLYING_MOVEMENT);
  }

  createFlutterTrail(x, y) {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const trail = document.createElement("div");
        trail.style.position = "absolute";
        trail.style.left = x + Math.random() * 50 + "px";
        trail.style.top = y + Math.random() * 50 + "px";
        trail.style.width = "6px";
        trail.style.height = "6px";
        trail.style.background = "rgba(255, 255, 255, 0.6)";
        trail.style.borderRadius = "50%";
        trail.style.pointerEvents = "none";
        trail.style.animation = "clickEffectFloat 0.8s ease-out forwards";

        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 800);
      }, i * GAME_CONFIG.TIMINGS.MOTH_FLUTTER_INTERVAL);
    }
  }

  startHoppingBehavior() {
    this.jimImage.classList.add("hopping-jim");
    this.jimImage.style.position = "absolute";

    this.chickenDirection = Math.random() < 0.5 ? 1 : -1;
    this.chickenPosition = 0;
    this.chickenSpeed = GAME_CONFIG.TIMINGS.CHICKEN_SPEED;

    this.positionChickenOnEdge();
    this.startChickenRunning();
  }

  positionChickenOnEdge() {
    const margin = 20;
    const jimWidth = GAME_CONFIG.UI.JIM_MAX_WIDTH;
    const jimHeight = jimWidth * 0.75;

    const screenWidth = window.innerWidth - margin * 2 - jimWidth;
    const screenHeight = window.innerHeight - margin * 2 - jimHeight;
    const perimeter = (screenWidth + screenHeight) * 2;
    const bumppx = window.innerWidth * 0.3;
    const bumppy = window.innerHeight * 0.3;

    const distanceAlongPerimeter = this.chickenPosition * perimeter;
    let x, y;

    if (distanceAlongPerimeter <= screenWidth) {
      x = margin + distanceAlongPerimeter;
      y = margin;
    } else if (distanceAlongPerimeter <= screenWidth + screenHeight) {
      x = margin + screenWidth;
      y = margin + (distanceAlongPerimeter - screenWidth);
    } else if (distanceAlongPerimeter <= screenWidth * 2 + screenHeight) {
      x =
        margin +
        screenWidth -
        (distanceAlongPerimeter - screenWidth - screenHeight);
      y = margin + screenHeight;
    } else {
      x = margin;
      y =
        margin +
        screenHeight -
        (distanceAlongPerimeter - screenWidth * 2 - screenHeight);
    }

    this.jimImage.style.left = x - bumppx + "px";
    this.jimImage.style.top = y - bumppy + "px";
  }

  startChickenRunning() {
    this.isMoving = true;

    this.moveInterval = setInterval(() => {
      this.chickenPosition += this.chickenSpeed * this.chickenDirection;

      if (this.chickenPosition < 0) {
        this.chickenPosition = 1;
      } else if (this.chickenPosition > 1) {
        this.chickenPosition = 0;
      }

      this.positionChickenOnEdge();
    }, 16); // ~60fps
  }

  moveAwayFromCursor(e) {
    this.chickenDirection *= -1;
    const rect = this.jimImage.getBoundingClientRect();
    this.createEscapeDust(rect.left, rect.top);
  }

  createEscapeDust(x, y) {
    for (let i = 0; i < 5; i++) {
      const dust = document.createElement("div");
      dust.style.position = "absolute";
      dust.style.left = x + Math.random() * 100 + "px";
      dust.style.top = y + Math.random() * 100 + "px";
      dust.style.width = "8px";
      dust.style.height = "8px";
      dust.style.background = "rgba(255, 255, 255, 0.4)";
      dust.style.borderRadius = "50%";
      dust.style.pointerEvents = "none";
      dust.style.animation = "clickEffectFloat 1.2s ease-out forwards";

      document.body.appendChild(dust);
      setTimeout(() => dust.remove(), 1200);
    }
  }

  handleMouseMove(e) {
    // Mouse move handling if needed for specific phases
  }

  stopMovement() {
    this.isMoving = false;
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }
    // Reset opacity for ghost chicken phase
    this.jimImage.style.opacity = "1";
  }

  startParticleShow() {
    this.dialogueText.textContent = "🎉 ULTIMATE PARTICLE EXPLOSION! 🎉";
    this.jimImage.style.display = "none";
    this.hpContainer.style.display = "none";
    this.comboCounter.style.display = "none";

    // Clean up any remaining gold counter
    const goldCounter = document.getElementById("gold-counter-above-jim");
    if (goldCounter) goldCounter.remove();

    this.gameContainer.classList.add("screen-shake");

    const particleCount = 500;
    const duration = GAME_CONFIG.TIMINGS.PARTICLE_SHOW_DURATION;

    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        this.createParticle();
      }, Math.random() * duration);
    }

    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        this.createFireworkBurst();
      }, Math.random() * duration);
    }

    setTimeout(() => {
      this.resetGame();
    }, duration);
  }

  startMinionPhase() {
    this.jimImage.style.display = "none";
    this.hpContainer.style.display = "none";
    this.minions = [];
    this.defeatedMinions = 0;

    for (let i = 0; i < GAME_CONFIG.UI.MINION_COUNT; i++) {
      const minion = document.createElement("img");
      minion.src = Math.random() > 0.5 ? "thumbs.png" : "hand.png";
      minion.style.position = "absolute";
      minion.style.width = "80px";
      minion.style.height = "80px";
      minion.style.cursor = "pointer";
      minion.style.transition = "all 0.3s ease";
      minion.style.userSelect = "none";
      minion.draggable = false;

      // Use jim images 1-22 only
      minion.dataset.jimFrame = (i % GAME_CONFIG.MAX_JIM_IMAGES) + 1;

      const x = Math.random() * (window.innerWidth - 80);
      const y = Math.random() * (window.innerHeight - 80);
      minion.style.left = x + "px";
      minion.style.top = y + "px";

      minion.addEventListener("mousedown", (e) =>
        this.handleMinionClick(e, minion)
      );

      minion.style.animation = `mothFlutter ${
        1 + Math.random()
      }s infinite ease-in-out`;

      this.gameContainer.appendChild(minion);
      this.minions.push(minion);
    }
  }

  handleMinionClick(e, minion) {
    e.stopPropagation();
    e.preventDefault();

    const jimFrame = minion.dataset.jimFrame;
    minion.src = `jim${jimFrame}.png`;
    minion.style.width = "60px";
    minion.style.height = "60px";
    minion.style.pointerEvents = "none";
    minion.style.animation = "clickPulse 0.5s ease-out";

    this.defeatedMinions++;

    if (this.defeatedMinions >= GAME_CONFIG.UI.MINION_COUNT) {
      setTimeout(() => {
        this.currentJim = 25; // Skip directly to fusion phase
        this.cleanupMinions();
        this.updateDisplay();
      }, 1000);
    }
  }

  cleanupMinions() {
    this.minions.forEach((minion) => minion.remove());
    this.minions = [];
  }

  startFindStillJim() {
    this.jimImage.style.display = "none";
    this.minions = [];

    const stillJimIndex = Math.floor(
      Math.random() * GAME_CONFIG.UI.STILL_JIM_COUNT
    );

    for (let i = 0; i < GAME_CONFIG.UI.STILL_JIM_COUNT; i++) {
      const jimCopy = document.createElement("img");
      // Use jim images 1-22 only
      const jimImageNumber = (i % GAME_CONFIG.MAX_JIM_IMAGES) + 1;
      jimCopy.src = `jim${jimImageNumber}.png`;
      jimCopy.style.position = "absolute";
      jimCopy.style.width = "80px";
      jimCopy.style.height = "80px";
      jimCopy.style.cursor = "pointer";
      jimCopy.style.userSelect = "none";
      jimCopy.draggable = false;

      const x = Math.random() * (window.innerWidth - 80);
      const y = Math.random() * (window.innerHeight - 80);
      jimCopy.style.left = x + "px";
      jimCopy.style.top = y + "px";

      if (i !== stillJimIndex) {
        jimCopy.style.animation = "scaredShiver 0.2s infinite ease-in-out";
      }

      jimCopy.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (i === stillJimIndex) {
          this.cleanupMinions();
          this.currentJim = 25;
          this.updateDisplay();
        } else {
          this.cleanupMinions();
          this.startFindStillJim();
        }
      });

      this.gameContainer.appendChild(jimCopy);
      this.minions.push(jimCopy);
    }
  }

  startBeetleMothBehavior() {
    this.jimImage.classList.add("beetle-jim", "flying-jim");
    this.jimImage.style.position = "absolute";
    this.startFlyingBehavior();
  }

  startChickenBeetleBehavior() {
    this.jimImage.classList.add("beetle-jim", "hopping-jim");
    this.jimImage.style.position = "absolute";
    this.startHoppingBehavior();
  }

  startGhostChickenBehavior() {
    this.jimImage.classList.add("hopping-jim");
    this.jimImage.style.position = "absolute";

    // Phase in/out behavior
    this.isMoving = true;
    this.moveInterval = setInterval(() => {
      this.jimImage.style.opacity =
        this.jimImage.style.opacity === "0.3" ? "1" : "0.3";
    }, 800);

    this.startHoppingBehavior();
  }

  startGoldPhase() {
    // Skip the automatic gold phase - go directly to finish button phase
    this.currentJim = 29;
    this.updateDisplay();
    this.updateProgressBar();
  }

  createGoldCounterAboveJim() {
    // Remove any existing gold counter
    this.removeGoldCounter();

    const goldCounter = document.createElement("div");
    goldCounter.id = "gold-counter-above-jim";
    goldCounter.classList.add("gold-counter");
    goldCounter.textContent = `💰 ${this.goldEarned}/${GAME_CONFIG.UI.GOLD_TARGET}`;

    // Position it relative to Jim's container
    const jimContainer = document.querySelector(".jim-container");
    jimContainer.appendChild(goldCounter);
  }

  updateGoldCounter() {
    const goldCounter = document.getElementById("gold-counter-above-jim");
    if (goldCounter) {
      goldCounter.textContent = `💰 ${this.goldEarned}/${GAME_CONFIG.UI.GOLD_TARGET}`;
      goldCounter.classList.add("gold-counter-update");

      // Remove animation class after animation completes
      setTimeout(() => {
        goldCounter.classList.remove("gold-counter-update");
      }, 800);
    }
  }

  removeGoldCounter() {
    const goldCounter = document.getElementById("gold-counter-above-jim");
    if (goldCounter) {
      goldCounter.style.transition = "opacity 0.5s ease-out";
      goldCounter.style.opacity = "0";
      setTimeout(() => goldCounter.remove(), 500);
    }
  }

  awardGold(clickX, clickY) {
    this.goldEarned++;

    // Create animated coin at click position
    const coin = document.createElement("div");
    coin.classList.add("animated-coin");
    coin.textContent = "💰";
    coin.style.left = clickX - 20 + "px";
    coin.style.top = clickY - 20 + "px";

    document.body.appendChild(coin);

    // After coin appears, animate it to the counter
    setTimeout(() => {
      const goldCounter = document.getElementById("gold-counter-above-jim");
      if (goldCounter) {
        const counterRect = goldCounter.getBoundingClientRect();
        const targetX = counterRect.left + counterRect.width / 2 - 20;
        const targetY = counterRect.top + counterRect.height / 2 - 20;

        // Calculate the path to counter
        coin.style.setProperty("--target-x", targetX + "px");
        coin.style.setProperty("--target-y", targetY + "px");
        coin.classList.add("coin-fly-animation");

        // Custom animation to fly to counter
        coin.animate(
          [
            {
              left: coin.style.left,
              top: coin.style.top,
              transform: "scale(1) rotate(0deg)",
              opacity: 1,
            },
            {
              left: targetX + "px",
              top: targetY + "px",
              transform: "scale(0.3) rotate(1080deg)",
              opacity: 0,
            },
          ],
          {
            duration: 1500,
            easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }
        );

        // Update counter after coin starts flying
        setTimeout(() => {
          this.updateGoldCounter();
        }, 200);

        // Remove coin after animation
        setTimeout(() => {
          coin.remove();
        }, 1500);
      }
    }, 500);
  }

  createGoldCounter() {
    const goldCounter = document.createElement("div");
    goldCounter.id = "gold-counter";
    goldCounter.style.position = "fixed";
    goldCounter.style.top = "80px";
    goldCounter.style.right = "30px";
    goldCounter.style.fontSize = "1.5em";
    goldCounter.style.fontWeight = "bold";
    goldCounter.style.color = "#FFD700";
    goldCounter.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.8)";
    goldCounter.textContent = `💰 Gold: ${this.goldEarned}/${GAME_CONFIG.UI.GOLD_TARGET}`;
    document.body.appendChild(goldCounter);

    const goldInterval = setInterval(() => {
      this.goldEarned++;
      goldCounter.textContent = `💰 Gold: ${this.goldEarned}/${GAME_CONFIG.UI.GOLD_TARGET}`;

      if (this.goldEarned >= GAME_CONFIG.UI.GOLD_TARGET) {
        clearInterval(goldInterval);
        goldCounter.style.transition = "opacity 2s ease-out";
        goldCounter.style.opacity = "0";
        setTimeout(() => goldCounter.remove(), 2000);
      }
    }, 1000);
  }

  startFinishButtonPhase() {
    // Reset gold counter for this phase
    this.goldEarned = 0;

    // Create gold counter above Jim
    this.createGoldCounterAboveJim();

    // updateDisplay() will handle showing finish.png and hiding Jim offscreen
  }

  startLoseButtonPhase() {
    // updateDisplay() will handle showing lose.png and hiding Jim offscreen
  }

  startCupGame() {
    // Hide Jim initially
    this.jimImage.style.display = "none";

    // Re-enable Jim clicking for after cup game
    this.jimImage.style.pointerEvents = "auto";
    this.jimImage.style.cursor = "pointer";

    this.cupGame.gameActive = false; // Start with cups non-clickable
    this.cupGame.cups = [];

    // Create 3 cups
    for (let i = 0; i < GAME_CONFIG.UI.CUP_COUNT; i++) {
      const cup = document.createElement("div");
      cup.style.position = "absolute";
      cup.style.width = "120px";
      cup.style.height = "150px";
      cup.style.background = "linear-gradient(135deg, #8B4513, #A0522D)";
      cup.style.borderRadius = "60px 60px 10px 10px";
      cup.style.left = window.innerWidth / 2 - 180 + i * 120 + "px";
      cup.style.top = window.innerHeight / 2 + "px";
      cup.style.cursor = "not-allowed";
      cup.style.border = "3px solid #654321";
      cup.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.5)";
      cup.style.transition = "transform 0.3s ease";
      cup.dataset.cupIndex = i;

      this.gameContainer.appendChild(cup);
      this.cupGame.cups.push(cup);
    }

    // Show Jim under middle cup briefly
    const jimUnderCup = document.createElement("img");
    jimUnderCup.src = "jim1.png";
    jimUnderCup.style.position = "absolute";
    jimUnderCup.style.width = "60px";
    jimUnderCup.style.height = "60px";
    jimUnderCup.style.left = window.innerWidth / 2 - 30 + "px";
    jimUnderCup.style.top = window.innerHeight / 2 + 100 + "px";
    jimUnderCup.style.zIndex = "50";
    this.gameContainer.appendChild(jimUnderCup);

    // Show initial dialogue
    this.dialogueText.textContent = "🎪 Catch me if you can!";

    // After 2 seconds, hide Jim and make cups clickable
    setTimeout(() => {
      jimUnderCup.remove();
      this.dialogueText.textContent =
        "🎪 I'm under one of these cups! Pick one!";

      // Make cups clickable
      this.cupGame.gameActive = true;
      this.cupGame.cups.forEach((cup) => {
        cup.style.cursor = "pointer";
        cup.addEventListener("click", () => this.handleCupClick());
        cup.addEventListener("mouseenter", () => {
          if (this.cupGame.gameActive) {
            cup.style.transform = "scale(1.05)";
          }
        });
        cup.addEventListener("mouseleave", () => {
          cup.style.transform = "scale(1)";
        });
      });
    }, 2000);
  }

  handleCupClick() {
    if (!this.cupGame.gameActive) return;

    this.cupGame.gameActive = false;

    // Show all cups are empty
    this.dialogueText.textContent = "😈 HAHAHAHA! I wasn't under ANY cup!";

    // Animate cups lifting to show they're empty
    this.cupGame.cups.forEach((cup, index) => {
      setTimeout(() => {
        cup.style.transform = "translateY(-50px)";
        cup.style.cursor = "default";
      }, index * 200);
    });

    // After revealing all cups, bring Jim back to center
    setTimeout(() => {
      // Clean up cups
      this.cupGame.cups.forEach((cup) => cup.remove());
      this.cupGame.cups = [];

      // Restore Jim to center and make game continue
      this.jimImage.style.display = "block";
      this.jimImage.style.position = "static";
      this.jimImage.style.left = "";
      this.jimImage.style.top = "";
      this.jimImage.style.opacity = "1";

      // Continue to next phase or trigger particle show
      if (this.currentJim >= this.maxJim) {
        this.startParticleShow();
      } else {
        this.currentJim++;
        this.updateDisplay();
        this.updateProgressBar();
      }
    }, 3000);
  }

  createParticle() {
    const particle = document.createElement("img");
    particle.classList.add("particle", "rainbow-effect");
    particle.src = Math.random() > 0.5 ? "thumbs.png" : "hand.png";

    particle.style.left = Math.random() * window.innerWidth + "px";
    particle.style.top = "-50px";
    particle.style.width = 30 + Math.random() * 50 + "px";
    particle.style.height = "auto";
    particle.style.position = "absolute";
    particle.style.zIndex = "1000";

    this.particleContainer.appendChild(particle);

    let yPos = -50;
    let xVel = (Math.random() - 0.5) * 8;
    let yVel = 2 + Math.random() * 4;
    let rotation = Math.random() * 360;
    let rotVel = (Math.random() - 0.5) * 20;

    const animateParticle = () => {
      yPos += yVel;
      yVel += 0.2; // gravity
      rotation += rotVel;

      particle.style.top = yPos + "px";
      particle.style.left = parseFloat(particle.style.left) + xVel + "px";
      particle.style.transform = `rotate(${rotation}deg) scale(${
        1 + Math.sin(yPos * 0.01) * 0.2
      })`;

      if (yPos < window.innerHeight + 100) {
        requestAnimationFrame(animateParticle);
      } else {
        particle.remove();
      }
    };

    requestAnimationFrame(animateParticle);
  }

  createFireworkBurst() {
    const centerX = Math.random() * window.innerWidth;
    const centerY = Math.random() * (window.innerHeight * 0.6);

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const burst = document.createElement("div");
      burst.style.position = "absolute";
      burst.style.left = centerX + "px";
      burst.style.top = centerY + "px";
      burst.style.width = "4px";
      burst.style.height = "4px";
      burst.style.background = `hsl(${Math.random() * 360}, 100%, 70%)`;
      burst.style.borderRadius = "50%";
      burst.style.pointerEvents = "none";

      document.body.appendChild(burst);

      let distance = 0;
      const animateBurst = () => {
        distance += 5;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        burst.style.left = x + "px";
        burst.style.top = y + "px";
        burst.style.opacity = Math.max(0, 1 - distance / 200);

        if (distance < 200) {
          requestAnimationFrame(animateBurst);
        } else {
          burst.remove();
        }
      };

      requestAnimationFrame(animateBurst);
    }
  }

  resetGame() {
    // Clear particles
    this.particleContainer.innerHTML = "";

    // Reset game state
    this.currentJim = 1;
    this.hp = 0;
    this.maxHp = 0;
    this.clicksRequired = 1;
    this.currentClicks = 0;
    this.comboCount = 0;
    this.beetleClickCount = 0;
    this.jim8ClickCount = 0;
    this.chickenDirection = 0;
    this.chickenPosition = 0;
    this.chickenSpeed = 0;
    this.minions = [];
    this.defeatedMinions = 0;
    this.goldEarned = 0;
    this.cupGame = { cups: [], correctCup: -1, gameActive: false };
    this.stopMovement();

    // Clean up any remaining elements
    const goldCounter = document.getElementById("gold-counter-above-jim");
    if (goldCounter) goldCounter.remove();
    this.cleanupMinions();

    // Clean up any remaining cups
    this.cupGame.cups.forEach((cup) => cup.remove());
    this.cupGame = { cups: [], correctCup: -1, gameActive: false };

    // Reset display
    this.jimImage.style.display = "block";
    this.jimImage.style.position = "static";
    this.jimImage.className = "jim-image happy-jim";
    this.gameContainer.classList.remove("screen-shake");
    this.comboCounter.style.display = "none";
    this.progressBar.classList.remove("fade-out");

    this.updateDisplay();
    this.updateProgressBar();

    // Welcome back sparkle
    setTimeout(() => {
      this.createSparkle(this.jimImage.getBoundingClientRect());
    }, 500);
  }
}

// Start the game when page loads
window.addEventListener("load", () => {
  new JimGame();
});
