/**************************************************************************************************
 *
 *    File: SpaceInvaders.js
 * 
 * Version: 1.0
 *
 *  Author: Simon Rybicki (SSR)
 * 
 *    Date: 29/08/19
 * 
 *    Info: Contains all of the game logic.
 */



// ************************************************************************************************
// Globals

// Game settings
let DEBUG_FPS_ON = false;
let GAME_FONT = FONT_TYPE.LUCIDA_CONSOLE;
let MAX_SCORE = 99999;
let MAX_LIVES = 5;
let START_LIVES = 3;
let GAME_STATES = { start: 0, level: 1, complete: 2, gameOver: 3 };
let UFO_STATES = { dead: 0, alive: 1, hit: 2 };
let UFO_SPAWN_TIME = 20.0;
let UFO_SCORE_POINTS = 1000;
let UFO_SPEED = 150;
let INVADER_STATES = { dead: 0, alive: 1, hit: 2 };
let INVADER_SPEED_X1 = { moveTimer: 2.5, moveSpeedX:  50, moveSpeedY:  50, fireRateMax: 15000, soundDelay: 0.8 };
let INVADER_SPEED_X2 = { moveTimer: 2.0, moveSpeedX:  60, moveSpeedY: 100, fireRateMax: 10000, soundDelay: 0.7 };
let INVADER_SPEED_X3 = { moveTimer: 1.5, moveSpeedX:  80, moveSpeedY: 150, fireRateMax:  5000, soundDelay: 0.6 };
let INVADER_SPEED_X4 = { moveTimer: 1.0, moveSpeedX: 120, moveSpeedY: 200, fireRateMax:  1000, soundDelay: 0.5 };
let INVADER_SPEED_X5 = { moveTimer: 0.5, moveSpeedX: 240, moveSpeedY: 250, fireRateMax:   500, soundDelay: 0.4 };
let INVADER_1_SCORE_POINTS = 100;
let INVADER_2_SCORE_POINTS = 50;
let INVADER_3_SCORE_POINTS = 25;
let INVADER_MOVE_SPEED_X = 50;
let INVADER_POS_Y_MAX = 540;
let INVADER_ANIMATION_SPEED = 0.333;
let SHIELD_TOTAL_HITS = 10;
let LASER_BASE_STATES = { dead: 0, alive: 1, hit: 2, out: 3 };
let LASER_BASE_SPAWN_TIME = 1.0;
let LASER_BASE_SPEED = 250;

// Game sprite sizes.
let UFO_SPRITE_SIZE = { w: 52, h: 24 };
let UFO_EXPLOSION_SPRITE_SIZE = { w: 40, h: 24 };
let INVADER_1_SPRITE_SIZE = { w: 26, h: 24 };
let INVADER_2_SPRITE_SIZE = { w: 34, h: 24 };
let INVADER_3_SPRITE_SIZE = { w: 38, h: 24 };
let INVADER_BULLET_SPRITE_SIZE = { w: 12, h: 22 };
let INVADER_EXPLOSION_SPRITE_SIZE = { w: 40, h: 24 };
let SHIELD_SPRITE_SIZE = { w: 68, h: 46 };
let LASER_BASE_SPRITE_SIZE = { w: 38, h: 24 };
let LASER_BASE_BULLET_SPRITE_SIZE = { w: 4, h: 22 };
let LASER_BASE_EXPLOSION_SPRITE_SIZE = { w: 40, h: 24 };
let RED_LINE_SPRITE_SIZE = { w: 650, h: 4 };



// ************************************************************************************************
// Game objects.

var Score = function (text) {

    this.text = text;
    this.scoreNumber = 0;
    this.scoreDisplay = '00000';

    this.reset = function () {

        this.scoreNumber = 0;
        this.text.setText('00000');
    }
    this.add = function (points) {

        if (this.scoreNumber + points < MAX_SCORE) {
            this.scoreNumber += points;
            this.scoreDisplay = '' + this.scoreNumber;
            switch (this.scoreDisplay.length) {
                case 1:
                    this.scoreDisplay = '0000' + this.scoreNumber;
                    break;
                case 2:
                    this.scoreDisplay = '000' + this.scoreNumber;
                    break;
                case 3:
                    this.scoreDisplay = '00' + this.scoreNumber;
                    break;
                case 4:
                    this.scoreDisplay = '0' + this.scoreNumber;
                    break;
            }
        } else {
            this.scoreNumber = MAX_SCORE;
            this.scoreDisplay = '' + this.scoreNumber;
        }

        this.text.setText(this.scoreDisplay);
    }
    this.getScore = function () {

        return this.scoreNumber;
    }
    this.setScore = function (number) {

        if (number < MAX_SCORE) {
            this.scoreNumber = number;
            this.scoreDisplay = '' + this.scoreNumber;
            switch (this.scoreDisplay.length) {
                case 1:
                    this.scoreDisplay = '0000' + this.scoreNumber;
                    break;
                case 2:
                    this.scoreDisplay = '000' + this.scoreNumber;
                    break;
                case 3:
                    this.scoreDisplay = '00' + this.scoreNumber;
                    break;
                case 4:
                    this.scoreDisplay = '0' + this.scoreNumber;
                    break;
            }
        } else {
            this.scoreNumber = MAX_SCORE;
            this.scoreDisplay = '' + this.scoreNumber;
        }
        this.text.setText(this.scoreDisplay);
    }
}

var Ufo = function (sprite, ufoTex, ufoExplosionTex, scorePoints, moveSpeed, startPosX, endPosX) {

    this.state = UFO_STATES.dead;
    this.sprite = sprite;
    this.ufoTex = ufoTex;
    this.ufoExplosionTex = ufoExplosionTex;
    this.scorePoints = scorePoints;
    this.moveSpeed = moveSpeed;
    this.startPosX = startPosX;
    this.endPosX = endPosX;
    this.deadTime = 0.5;

    this.getScorePoints = function () {

        return this.scorePoints;
    }
    this.isAlive = function () {

        if (this.state == UFO_STATES.alive) {

            return true;
        }

        return false;
    }
    this.isDead = function () {

        if (this.state == UFO_STATES.dead) {

            return true;
        }

        return false;
    }
    this.spawn = function () {

        this.state = UFO_STATES.alive;
        this.sprite.setTexture(this.ufoTex, UFO_SPRITE_SIZE);
        this.sprite.setX(this.startPosX);
        this.sprite.show();
    }
    this.hit = function () {

        this.state = UFO_STATES.hit;
        this.sprite.setTexture(this.ufoExplosionTex, UFO_EXPLOSION_SPRITE_SIZE);
    }
    this.dead = function () {

        this.state = UFO_STATES.dead;
        this.sprite.hide();
        this.deadTime = 0.5;
    }
    this.getPhysicsBody = function () {

        return this.sprite.getPhysicsBody();
    }
    this.getPosition = function () {

        return this.sprite.getPosition();
    }
    this.update = function (frameTime) {

        if (this.state == UFO_STATES.alive) {
            this.sprite.moveX(this.moveSpeed * frameTime);
            if (this.sprite.getX() > this.endPosX) {
                this.dead();
            }
        } else if (this.state == UFO_STATES.hit) {
            this.deadTime -= frameTime;
            if (this.deadTime < 0.0) {
                this.dead();
            }
        }
    }
}

var Bullet = function (sprite, moveSpeed, moveDir, maxPosY) {

    this.active = false;
    this.sprite = sprite;
    this.moveSpeed = moveSpeed;
    this.moveDir = moveDir;
    this.maxPosY = maxPosY;

    this.isActive = function () {

        return this.active;
    }
    this.activate = function () {

        this.active = true;
        this.sprite.show();
    }
    this.deactivate = function () {

        this.active = false;
        this.sprite.hide();
    }
    this.getPhysicsBody = function () {

        return this.sprite.getPhysicsBody();
    }
    this.getPosition = function () {

        return this.sprite.getPosition();
    }
    this.setPosition = function (x, y) {

        this.sprite.setPosition(x, y);
    }
    this.update = function (frameTime) {

        if (this.active) {
            this.sprite.moveY((this.moveSpeed * this.moveDir) * frameTime);
            if (this.moveDir == 1) {
                if (this.sprite.getY() > this.maxPosY) {
                    this.deactivate();
                }
            } else {
                if (this.sprite.getY() < this.maxPosY) {
                    this.deactivate();
                }
            }
        }
    }
}

var Invader = function (sprite, invaderTex, invaderExplosionTex, scorePoints, originalPos, restartPosY) {

    this.state = INVADER_STATES.alive;
    this.sprite = sprite;
    this.invaderTex = invaderTex;
    this.invaderExplosionTex = invaderExplosionTex;
    this.scorePoints = scorePoints;
    this.originalSize = this.sprite.getSize();
    this.originalPos = originalPos;
    this.restartPosY = restartPosY;
    this.deadTime = 0.25;

    this.getScorePoints = function () {

        return this.scorePoints;
    }
    this.isAlive = function () {

        if (this.state == INVADER_STATES.alive) {

            return true;
        }

        return false;
    }
    this.spawn = function () {

        this.state = INVADER_STATES.alive;
        this.sprite.setPosition(this.originalPos.x, this.originalPos.y);
        this.sprite.setTexture(this.invaderTex, this.originalSize);
        this.sprite.setAnimationFramePosX(0);
        this.sprite.playAnimation();
        this.sprite.show();
    }
    this.hit = function () {

        this.state = INVADER_STATES.hit;
        this.sprite.stopAnimation();
        this.sprite.setTexture(this.invaderExplosionTex, INVADER_EXPLOSION_SPRITE_SIZE);
    }
    this.dead = function () {

        this.state = INVADER_STATES.dead;
        this.active = false;
        this.sprite.hide();
        this.deadTime = 0.25;
    }
    this.movePosX = function (moveAmount) {

        this.sprite.moveX(moveAmount);
    }
    this.movePosY = function (moveAmount) {

        this.sprite.moveY(moveAmount);
    }
    this.getPosition = function () {

        return this.sprite.getPosition();
    }
    this.getPosX = function () {

        return this.sprite.getX();
    }
    this.getPosY = function () {

        return this.sprite.getY();
    }
    this.getPhysicsBody = function () {

        return this.sprite.getPhysicsBody();
    }
    this.update = function (frameTime) {

        if (this.state == INVADER_STATES.alive) {
            if (this.sprite.getY() > INVADER_POS_Y_MAX) {
                this.sprite.setY(this.restartPosY);
            }
        } else if (this.state == INVADER_STATES.hit) {
            this.deadTime -= frameTime;
            if (this.deadTime < 0) {
                this.dead();
            }
        }
    }
}

var Shield = function (sprite) {

    this.active = true;
    this.sprite = sprite;
    this.hits = 0;
    this.partHits = 0;

    this.isActive = function () {

        return this.active;
    }
    this.activate = function () {

        this.active = true;
        this.sprite.show();
    }
    this.deactivate = function () {

        this.active = false;
        this.sprite.hide();
    }
    this.reset = function () {

        this.hits = 0;
        this.partHits = 0;
        this.sprite.setAnimationFramePosX(0);
        this.activate();
    }
    this.updateStatus = function () {

        if (this.hits == SHIELD_TOTAL_HITS) {
            this.deactivate();
        }
    }
    this.gone = function () {

        if (this.hits == SHIELD_TOTAL_HITS) {

            return true;
        }

        return false;
    }
    this.hit = function () {

        if (this.hits != SHIELD_TOTAL_HITS) {
            this.partHits += 1;
            if (this.partHits == 4) {
                this.partHits = 0;
                this.hits += 1;
                this.sprite.setAnimationFramePosX(this.hits);
                this.updateStatus();
            }
        }
    }
    this.getPhysicsBody = function () {

        return this.sprite.getPhysicsBody();
    }
    this.getPosition = function () {

        return this.sprite.getPosition();
    }
}

var LaserBase = function (sprite, laserbaseTex, laserbaseExplosionTex, bullet, moveSpeed, minPosX, maxPosX) {

    this.state = LASER_BASE_STATES.alive;
    this.sprite = sprite;
    this.laserbaseTex = laserbaseTex;
    this.laserbaseExplosionTex = laserbaseExplosionTex;
    this.moveSpeed = moveSpeed;
    this.originalPos = this.sprite.getPosition();
    this.xPosLimits = {
        min: minPosX,
        max: maxPosX
    };
    this.spawnTime = LASER_BASE_SPAWN_TIME;
    this.deadTime = 0.5;
    this.bullet = bullet;

    this.isAlive = function () {

        if (this.state == LASER_BASE_STATES.alive) {

            return true;
        }

        return false;
    }
    this.spawn = function () {

        this.state = LASER_BASE_STATES.alive;
        this.sprite.setPosition(this.originalPos.x, this.originalPos.y);
        this.sprite.setTexture(this.laserbaseTex, LASER_BASE_SPRITE_SIZE);
        this.sprite.show();
    }
    this.hit = function () {

        this.state = LASER_BASE_STATES.hit;
        this.sprite.setTexture(this.laserbaseExplosionTex, LASER_BASE_EXPLOSION_SPRITE_SIZE);
        this.bullet.deactivate();
    }
    this.dead = function () {

        this.state = LASER_BASE_STATES.dead;
        this.sprite.hide();
        this.spawnTime = LASER_BASE_SPAWN_TIME;
        this.deadTime = 0.5;
    }
    this.out = function () {

        this.state = LASER_BASE_STATES.out;
        this.sprite.hide();
    }
    this.moveLeft = function (frameTime) {

        if (this.sprite.getX() > this.xPosLimits.min) {
            this.sprite.moveX(this.moveSpeed * -frameTime);
        }
    }
    this.moveRight = function (frameTime) {

        if (this.sprite.getX() < this.xPosLimits.max) {
            this.sprite.moveX(this.moveSpeed * frameTime);
        }
    }
    this.fire = function () {

        this.bullet.setPosition(this.sprite.getX(), this.sprite.getY());
        this.bullet.activate();
    }
    this.getPosition = function () {

        return this.sprite.getPosition();
    }
    this.setPosition = function (x, y) {

        this.sprite.setPosition(x, y);
    }
    this.getPhysicsBody = function () {

        return this.sprite.getPhysicsBody();
    }
    this.isBulletActive = function () {

        return this.bullet.isActive();
    }
    this.deactiveBullet = function () {

        this.bullet.deactivate();
    }
    this.getBulletPosition = function () {

        return this.bullet.getPosition();
    }
    this.getBulletPhysicsBody = function () {

        return this.bullet.getPhysicsBody();
    }
    this.update = function (frameTime) {

        if (this.state == LASER_BASE_STATES.hit) {
            this.deadTime -= frameTime;
            if (this.deadTime < 0.0) {
                this.dead();
            }
        } else if (this.state == LASER_BASE_STATES.dead) {
            this.spawnTime -= frameTime;
            if (this.spawnTime < 0.0) {
                this.spawn();
            }
        }

        this.bullet.update(frameTime);
    }
}

var Lives = function (text, sprites, livesCount) {

    this.text = text;
    this.sprites = sprites;
    this.livesCount = livesCount;

    this.reset = function (livesCount) {

        if (livesCount > MAX_LIVES) {
            livesCount = MAX_LIVES;
        } else {
            this.livesCount = livesCount;
        }
        this.text.setText('' + this.livesCount);
        for (var i = 0; i < livesCount; i++) {
            this.sprites[i].show();
        }
    }
    this.extra = function () {

        if (this.livesCount + 1 != MAX_LIVES) {
            this.livesCount += 1;
            this.text.setText('' + this.livesCount);
            this.sprites[this.livesCount-1].show();
        }
    }
    this.lost = function () {

        if (this.livesCount != 0) {
            this.livesCount -= 1;
            this.text.setText('' + this.livesCount);
            this.sprites[this.livesCount].hide();
        }
    }
    this.noLives = function () {

        if (this.livesCount == 0) {

            return true;
        }

        return false;
    }
    this.show = function () {

        this.text.show();
        for (var i = 0; i < livesCount; i++) {
            this.sprites[i].show();
        }
    }
    this.hide = function () {

        this.text.hide();
        for (var i = 0; i < livesCount; i++) {
            this.sprites[i].hide();
        }
    }
}



// ************************************************************************************************
// Game functions.

window.onload = function () {

    // Initialise the game engine.
    let gameEngine = new Engine('viewport', '#1A1A1A');


    // Get play area size.
    let winWidth = gameEngine.getWindowWidth();
    let winHeight = gameEngine.getWindowHeight();


    // Load all sprite textures.
    var ufoTex = gameEngine.createTexture('assets/sprite/ufo.png');
    var ufoExplosionTex = gameEngine.createTexture('assets/sprite/ufo_explosion.png');
    var invaderTex1 = gameEngine.createTexture('assets/sprite/invader_spritesheet_1.png');
    var invaderTex2 = gameEngine.createTexture('assets/sprite/invader_spritesheet_2.png');
    var invaderTex3 = gameEngine.createTexture('assets/sprite/invader_spritesheet_3.png');
    var invaderExplosionTex1 = gameEngine.createTexture('assets/sprite/invader_explosion_1.png');
    var invaderExplosionTex2 = gameEngine.createTexture('assets/sprite/invader_explosion_2.png');
    var invaderExplosionTex3 = gameEngine.createTexture('assets/sprite/invader_explosion_3.png');
    var invaderBulletTex = gameEngine.createTexture('assets/sprite/invader_bullet.png');
    var shieldTex = gameEngine.createTexture('assets/sprite/shield_spritesheet.png');
    var laserBaseTex1 = gameEngine.createTexture('assets/sprite/laser_base_1.png');
    var laserBaseTex2 = gameEngine.createTexture('assets/sprite/laser_base_2.png');
    var laserBaseExplosionTex1 = gameEngine.createTexture('assets/sprite/laser_base_explosion_1.png');
    var laserBaseExplosionTex2 = gameEngine.createTexture('assets/sprite/laser_base_explosion_2.png');
    var laserBaseBulletTex = gameEngine.createTexture('assets/sprite/laser_base_bullet.png');
    var redLineTex = gameEngine.createTexture('assets/sprite/red_line.png');


    // Load screen effect textures.
    var screenEffectTex1 = gameEngine.createTexture('assets/screen/screen_backlight.png');
    var screenEffectTex2 = gameEngine.createTexture('assets/screen/screen_scanline.png');


    // Create all sound effects.
    var shootSnd = gameEngine.createSound('assets/audio/shoot.mp3'); 
    var explosionSnd = gameEngine.createSound('assets/audio/explosion.mp3'); 
    var invaderKilledSnd = gameEngine.createSound('assets/audio/invader_killed.mp3'); 
    var invaderStepSnds = [
        gameEngine.createSound('assets/audio/fast_invader1.mp3'),
        gameEngine.createSound('assets/audio/fast_invader2.mp3'),
        gameEngine.createSound('assets/audio/fast_invader3.mp3'),
        gameEngine.createSound('assets/audio/fast_invader4.mp3')
    ];
    var ufoFlyingSnd = gameEngine.createSound('assets/audio/ufo_lowpitch.mp3');


    // Create score titles.
    gameEngine.createText('SCORE-1', FONT_SIZE._28, GAME_FONT, FONT_WEIGHT.NORMAL, COLOUR_RGB.AQUA, { x: 24, y: 55 });
    gameEngine.createText('HI-SCORE', FONT_SIZE._28, GAME_FONT, FONT_WEIGHT.NORMAL, COLOUR_RGB.RED, { x: 258, y: 55 });
    gameEngine.createText('SCORE-2', FONT_SIZE._28, GAME_FONT, FONT_WEIGHT.NORMAL, COLOUR_RGB.YELLOW, { x: 508, y: 55 });


    // Create score objects.
    var scoreValue1 = gameEngine.createText('00000', FONT_SIZE._24, GAME_FONT, FONT_WEIGHT.NORMAL, COLOUR_RGB.WHITE, { x: 50, y: 95 });
    var scoreP1 = new Score(scoreValue1);
    var hiScoreValue = gameEngine.createText('00000', FONT_SIZE._24, GAME_FONT, FONT_WEIGHT.NORMAL, COLOUR_RGB.LIME, { x: 290, y: 95 });
    var scoreHi = new Score(hiScoreValue);
    var scoreValue2 = gameEngine.createText('00000', FONT_SIZE._24, GAME_FONT, FONT_WEIGHT.NORMAL, COLOUR_RGB.WHITE, { x: 532, y: 95 });
    var scoreP2 = new Score(scoreValue2);


    // Create start screen objects.
    var gameTitle = gameEngine.createText('SPACE INVADERS II', FONT_SIZE._36, GAME_FONT, FONT_WEIGHT.NORMAL, COLOUR_RGB.WHITE, { x: 141, y: 230 });
    var infoUfoSpr = gameEngine.createSprite(ufoTex, UFO_SPRITE_SIZE, { x: 230, y: 310 });
    var infoInvader1Spr = gameEngine.createSprite(invaderTex1, INVADER_1_SPRITE_SIZE, { x: 230, y: 360 });
    var infoInvader2Spr = gameEngine.createSprite(invaderTex2, INVADER_2_SPRITE_SIZE, { x: 230, y: 410 });
    var infoInvader3Spr = gameEngine.createSprite(invaderTex3, INVADER_3_SPRITE_SIZE, { x: 230, y: 460 });
    var infoPointsUfo = gameEngine.createText(UFO_SCORE_POINTS + ' POINTS', FONT_SIZE._28, GAME_FONT, FONT_WEIGHT.NORMAL, COLOUR_RGB.RED, { x: 290, y: 320 });
    var infoPointsInvader1 = gameEngine.createText(INVADER_1_SCORE_POINTS + ' POINTS', FONT_SIZE._28, GAME_FONT, FONT_WEIGHT.NORMAL, COLOUR_RGB.LIME, { x: 290, y: 370 });
    var infoPointsInvader2 = gameEngine.createText(INVADER_2_SCORE_POINTS + ' POINTS', FONT_SIZE._28, GAME_FONT, FONT_WEIGHT.NORMAL, COLOUR_RGB.AQUA, { x: 290, y: 420 });
    var infoPointsInvader3 = gameEngine.createText(INVADER_3_SCORE_POINTS + ' POINTS', FONT_SIZE._28, GAME_FONT, FONT_WEIGHT.NORMAL, COLOUR_RGB.FUCHSIA, { x: 290, y: 470 });
    var playMessage = gameEngine.createText('PRESS SPACEBAR TO PLAY', FONT_SIZE._24, GAME_FONT, FONT_WEIGHT.NORMAL, COLOUR_RGB.WHITE, { x: 175, y: 670 });


    // Create ufo object.
    var ufoSpr = gameEngine.createSprite(ufoTex, UFO_SPRITE_SIZE, { x: 0, y: 150 }, true);
    ufoSpr.hide();
    let ufoStartPoxX = (-UFO_SPRITE_SIZE.w * 0.5);
    let ufoEndPosX = (winWidth + UFO_SPRITE_SIZE.w * 0.5);
    var ufo = new Ufo(ufoSpr, ufoTex, ufoExplosionTex, UFO_SCORE_POINTS, UFO_SPEED, ufoStartPoxX, ufoEndPosX);

  
    // Create invader bullets.
    let totalInvaderBullets = 5;
    var invaderBullets = [];
    for (var i = 0; i < totalInvaderBullets; i++) {
        var invaderBulletSpr = gameEngine.createSprite(invaderBulletTex, INVADER_BULLET_SPRITE_SIZE, { x: 0, y: 0 }, true);
        var invaderBullet = new Bullet(invaderBulletSpr, 250, 1, 690);
        invaderBullet.deactivate();
        invaderBullets.push(invaderBullet);
    }


    // Create invaders.
    let totalInvaderRows = 5;
    let totalInvaderCols = 11;
    let invaderStartPosX = 25;
    let invaderStartPosY = 201;
    let invaderStep = 48;
    var posX = invaderStartPosX;
    var posY = invaderStartPosY;
    var totalInvaders = 0;
    var rowIndex = 0;
    var invaders = Array.from(Array(totalInvaderRows), () => new Array(totalInvaderCols));
    for (var i = 0; i < totalInvaderCols; i++) {
        var invaderSpr = gameEngine.createSprite(invaderTex1, INVADER_1_SPRITE_SIZE, { x: posX, y: posY }, true);
        invaderSpr.setupAnimation(INVADER_1_SPRITE_SIZE, 2, INVADER_ANIMATION_SPEED, true);
        invaderSpr.playAnimation();
        var invader = new Invader(invaderSpr, invaderTex1, invaderExplosionTex1, INVADER_1_SCORE_POINTS, { x: posX, y: posY }, invaderStartPosY);
        invaders[rowIndex][i] = invader;
        posX += invaderStep;
        totalInvaders += 1;
    }
    posX = invaderStartPosX;
    posY += invaderStep;
    rowIndex += 1;
    for (var i = 0; i < totalInvaderCols; i++) {
        var invaderSpr = gameEngine.createSprite(invaderTex2, INVADER_2_SPRITE_SIZE, { x: posX, y: posY }, true);
        invaderSpr.setupAnimation(INVADER_2_SPRITE_SIZE, 2, INVADER_ANIMATION_SPEED, true);
        invaderSpr.playAnimation();
        var invader = new Invader(invaderSpr, invaderTex2, invaderExplosionTex2, INVADER_2_SCORE_POINTS, { x: posX, y: posY }, invaderStartPosY);
        invaders[rowIndex][i] = invader;
        posX += invaderStep;
        totalInvaders += 1;
    }
    posX = invaderStartPosX;
    posY += invaderStep;
    rowIndex += 1;
    for (var i = 0; i < totalInvaderCols; i++) {
        var invaderSpr = gameEngine.createSprite(invaderTex2, INVADER_2_SPRITE_SIZE, { x: posX, y: posY }, true);
        invaderSpr.setupAnimation(INVADER_2_SPRITE_SIZE, 2, INVADER_ANIMATION_SPEED, true);
        invaderSpr.playAnimation();
        var invader = new Invader(invaderSpr, invaderTex2, invaderExplosionTex2, INVADER_2_SCORE_POINTS, { x: posX, y: posY }, invaderStartPosY);
        invaders[rowIndex][i] = invader;
        posX += invaderStep;
        totalInvaders += 1;
    }
    posX = invaderStartPosX;
    posY += invaderStep;
    rowIndex += 1;
    for (var i = 0; i < totalInvaderCols; i++) {
        var invaderSpr = gameEngine.createSprite(invaderTex3, INVADER_3_SPRITE_SIZE, { x: posX, y: posY }, true);
        invaderSpr.setupAnimation(INVADER_3_SPRITE_SIZE, 2, INVADER_ANIMATION_SPEED, true);
        invaderSpr.playAnimation();
        var invader = new Invader(invaderSpr, invaderTex3, invaderExplosionTex3, INVADER_3_SCORE_POINTS, { x: posX, y: posY }, invaderStartPosY);
        invaders[rowIndex][i] = invader;
        posX += invaderStep;
        totalInvaders += 1;
    }
    posX = invaderStartPosX;
    posY += invaderStep;
    rowIndex += 1;
    for (var i = 0; i < totalInvaderCols; i++) {
        var invaderSpr = gameEngine.createSprite(invaderTex3, INVADER_3_SPRITE_SIZE, { x: posX, y: posY }, true);
        invaderSpr.setupAnimation(INVADER_3_SPRITE_SIZE, 2, INVADER_ANIMATION_SPEED, true);
        invaderSpr.playAnimation();
        var invader = new Invader(invaderSpr, invaderTex3, invaderExplosionTex3, INVADER_3_SCORE_POINTS, { x: posX, y: posY }, invaderStartPosY);
        invaders[rowIndex][i] = invader;
        posX += invaderStep;
        totalInvaders += 1;
    }


    // Create shields.
    let totalShields = 4;
    let shieldSpacing = 150;
    let shieldStartPosX = 100;
    let shieldStartPosY = 590;
    posX = shieldStartPosX;
    posY = shieldStartPosY;
    var shields = [];
    for (var i = 0; i < totalShields; i++) {
        var shieldSpr = gameEngine.createSprite(shieldTex, SHIELD_SPRITE_SIZE, { x: posX, y: posY }, true);
        shieldSpr.setupAnimation(SHIELD_SPRITE_SIZE, 10, 0, false);
        shields.push(new Shield(shieldSpr));
        posX += shieldSpacing;
    }


    // Create laser base bullet for player 1.
    var laserBaseBulletSpr1 = gameEngine.createSprite(laserBaseBulletTex, LASER_BASE_BULLET_SPRITE_SIZE, { x: 0, y: 0 }, true);
    var laserBaseBulletP1 = new Bullet(laserBaseBulletSpr1, 650, -1, 110);
    laserBaseBulletP1.deactivate();


    // Create laser base bullet for player 2.
    var laserBaseBulletSpr2 = gameEngine.createSprite(laserBaseBulletTex, LASER_BASE_BULLET_SPRITE_SIZE, { x: 0, y: 0 }, true);
    var laserBaseBulletP2 = new Bullet(laserBaseBulletSpr2, 650, -1, 110);
    laserBaseBulletP2.deactivate();


    // Create laser base player 1.
    let laserBaseStartPosXP1 = (winWidth * 0.5) - 150;
    let laserBaseStartPoxYP1 = 645;
    var laserBaseSpr1 = gameEngine.createSprite(laserBaseTex1, LASER_BASE_SPRITE_SIZE, { x: laserBaseStartPosXP1, y: laserBaseStartPoxYP1 }, true);
    let minPosX = laserBaseSpr1.getHalfWidth();
    let maxPosX = winWidth - laserBaseSpr1.getHalfWidth();
    var laserBaseP1 = new LaserBase(laserBaseSpr1, laserBaseTex1, laserBaseExplosionTex1, laserBaseBulletP1, LASER_BASE_SPEED, minPosX, maxPosX);


    // Create laser base player 2.
    let laserBaseStartPosXP2 = (winWidth * 0.5) + 150;
    let laserBaseStartPoxYP2 = 680;
    var laserBaseSpr2 = gameEngine.createSprite(laserBaseTex2, LASER_BASE_SPRITE_SIZE, { x: laserBaseStartPosXP2, y: laserBaseStartPoxYP2 }, true);
    var laserBaseP2 = new LaserBase(laserBaseSpr2, laserBaseTex2, laserBaseExplosionTex2, laserBaseBulletP2, LASER_BASE_SPEED, minPosX, maxPosX);


    // Create red line.
    gameEngine.createSprite(redLineTex, RED_LINE_SPRITE_SIZE, { x: (winWidth * 0.5), y: 702 });


    // Create lives player 1.
    var livesValue1 = gameEngine.createText('' + START_LIVES, FONT_SIZE._26, GAME_FONT, FONT_WEIGHT.NORMAL, COLOUR_RGB.WHITE, { x: 24, y: 734 });
    let livesSpacing = 50;
    posX = 84;
    var livesLaserBaseSprites1 = [];
    for (var i = 0; i < MAX_LIVES; i++) {
        var livesLaserBaseSpr = gameEngine.createSprite(laserBaseTex1, LASER_BASE_SPRITE_SIZE, { x: posX, y: 723 });
        livesLaserBaseSprites1.push(livesLaserBaseSpr);
        posX += livesSpacing;
    }
    livesLaserBaseSprites1[3].hide();
    livesLaserBaseSprites1[4].hide();
    var livesP1 = new Lives(livesValue1, livesLaserBaseSprites1, START_LIVES);


    // Create lives player 2.
    var livesValue2 = gameEngine.createText('' + START_LIVES, FONT_SIZE._26, GAME_FONT, FONT_WEIGHT.NORMAL, COLOUR_RGB.WHITE, { x: 610, y: 734 });
    posX = 568;
    var livesLaserBaseSprites2 = [];
    for (var i = 0; i < MAX_LIVES; i++) {
        var livesLaserBaseSpr = gameEngine.createSprite(laserBaseTex2, LASER_BASE_SPRITE_SIZE, { x: posX, y: 723 });
        livesLaserBaseSprites2.push(livesLaserBaseSpr);
        posX -= livesSpacing;
    }
    livesLaserBaseSprites2[3].hide();
    livesLaserBaseSprites2[4].hide();
    var livesP2 = new Lives(livesValue2, livesLaserBaseSprites2, START_LIVES);


    // Create level complete message.
    var levelCompleteMessage = gameEngine.createText('LEVEL COMPLETE', FONT_SIZE._28, GAME_FONT, FONT_WEIGHT.NORMAL, COLOUR_RGB.WHITE, { x: 207, y: 360 });


    // Create player 1 and 2 message.
    var messageP1 = gameEngine.createText('PLAYER 1', FONT_SIZE._24, GAME_FONT, FONT_WEIGHT.NORMAL, COLOUR_RGB.AQUA, { x: 65, y: 734 });
    var messageP2 = gameEngine.createText('', FONT_SIZE._24, GAME_FONT, FONT_WEIGHT.NORMAL, COLOUR_RGB.FUCHSIA, { x: 470, y: 734 });


    // Create screen effects.
    var screenEffect1 = gameEngine.createSprite(screenEffectTex1, { w: winWidth, h: winHeight }, { x: (winWidth * 0.5), y: (winHeight * 0.5) });
    var screenEffect2 = gameEngine.createSprite(screenEffectTex2, { w: winWidth, h: winHeight }, { x: (winWidth * 0.5), y: (winHeight * 0.5) });
    //screenEffect1.hide();
    //screenEffect2.hide();


    // Flag to see if player 2 is available.
    var player2Enabled = false;

    // Set ufo spawn timer.
    var ufoSpawnTime = UFO_SPAWN_TIME;

    // Set countdown timers for when to fire invader bullets.
    var invaderFireCountdowns = [5000, 5000, 10000, 15000, 15000];

    // Set movement setting for invaders.
    var invaderSpeedSettings = INVADER_SPEED_X1;
    var invaderMoveDirX = 1;
    var invaderMoveDown = false;
    var invaderMoveTimer = 2.5;
    var invaderStepSoundDelay = invaderSpeedSettings.soundDelay;
    var invaderStepSoundIndex = 0;

    // Number of invaders shot by the laser base.
    var invaderKillCount = 0;

    // Timer to flash the play message text on the start state.
    playMessageShowHideTimer = 0.5;

    // Set the time taken to change game state.
    var gameStateChangeTimer = 2.0;

    // List of game screens
    var gameScreens = 
    [
        updateStartScreen,
        updateLevelScreen,
        updateCompleteScreen,
        updateGameOverScreen
    ];

    // Set the first active screen to show and update
    var activeScreenID = GAME_STATES.start;

    // Reset first game state.
    resetStartScreen();

    // Start the game engine.
    gameEngine.start(gameLoop);
    gameEngine.enableJoypad();
    if (DEBUG_FPS_ON) {
        gameEngine.showFps();
    }

    function gameLoop(elapsedTime) {

        // Get current frame time.
        var frameTime = gameEngine.frameTime();

        // Update current game screen.
        gameScreens[activeScreenID](frameTime);

        // Engine draw and update process.
        gameEngine.draw();
        gameEngine.update(elapsedTime);
    }

    function updateStartScreen(frameTime) {

        // Flash the play message.
        playMessageShowHideTimer -= frameTime;
        if (playMessageShowHideTimer < 0) {
            playMessageShowHideTimer = 0.5;
            if (playMessage.draw() == true) {
                playMessage.hide();
            } else {
                playMessage.show();
            }
        }

        // Check if screen effect toggle keys are pressed.
        if (gameEngine.keyPress(KEY.ONE)) {
            // Screen backlight effect.
            if (screenEffect1.draw() == false) {
                screenEffect1.show();
            } else {
                screenEffect1.hide();
            }
        }
        if (gameEngine.keyPress(KEY.TWO)) {
            // Screen scan line effect.
            if (screenEffect2.draw() == false) {
                screenEffect2.show();
            } else {
                screenEffect2.hide();
            }
        }

        // Check if player 2 controller is connected.
        if (player2Enabled == false) {
            if (gameEngine.isJoypadConnected()) {
                player2Enabled = true;
                messageP2.setText('PLAYER 2');
                messageP2.show();
            }
        }

        // Check if play button is pressed.
        if (gameEngine.keyPress(KEY.SPACE)) {
            gameTitle.hide();
            infoUfoSpr.hide();
            infoInvader1Spr.hide();
            infoInvader2Spr.hide();
            infoInvader3Spr.hide();
            infoPointsUfo.hide();
            infoPointsInvader1.hide();
            infoPointsInvader2.hide();
            infoPointsInvader3.hide();
            playMessage.hide();
            messageP1.hide();
            messageP2.hide();
            resetLevelScreen();
            activeScreenID = GAME_STATES.level;
        }
    }

    function resetStartScreen() {

        // Hide level complete and game over messages.
        levelCompleteMessage.hide();
        messageP1.setText('PLAYER 1');
        messageP1.show();
        if (player2Enabled == true) {
            messageP2.setText('PLAYER 2');
            messageP2.show();
        }

        // Reset flash play message timer.
        playMessageShowHideTimer = 0.5;

        // Hide some game objects and reset the shields.
        ufo.dead();
        for (var i = 0; i < totalInvaderBullets; i++) {
            invaderBullets[i].deactivate();
        }
        for (var row = 0; row < totalInvaderRows; row++) {
            for (var col = 0; col < totalInvaderCols; col++) {
                invaders[row][col].dead();
            }
        }
        for (var i = 0; i < totalShields; i++) {
            shields[i].reset();
        }
        laserBaseP1.deactiveBullet();
        laserBaseP1.dead();
        laserBaseP2.deactiveBullet();
        laserBaseP2.dead();
        livesP1.hide();
        livesP2.hide();
        
        // Show objects.
        gameTitle.show();
        infoUfoSpr.show();
        infoInvader1Spr.show();
        infoInvader2Spr.show();
        infoInvader3Spr.show();
        infoPointsUfo.show();
        infoPointsInvader1.show();
        infoPointsInvader2.show();
        infoPointsInvader3.show();
        playMessage.show();
    }

    function updateLevelScreen(frameTime) {

        // Check if the level is complete or game over.
        if (isLevelComplete()) {
            livesP1.extra();
            if (player2Enabled) {
                livesP2.extra();
            }
            resetCompleteScreen();
            activeScreenID = GAME_STATES.complete;
        } else if (isGameOver()) {
            resetGameOverScreen();
            activeScreenID = GAME_STATES.gameOver;
        }

        // Spaceship update.
        if ((laserBaseP1.isAlive() && player2Enabled == false) || (laserBaseP1.isAlive() && laserBaseP2.isAlive())) {
            if (gameEngine.keyHold(KEY.LEFT)) {
                laserBaseP1.moveLeft(frameTime);
            } else if (gameEngine.keyHold(KEY.RIGHT)) {
                laserBaseP1.moveRight(frameTime);
            } else if (gameEngine.keyPress(KEY.SPACE)) {
                if (laserBaseP1.isBulletActive() == false) {
                    laserBaseP1.fire();
                    shootSnd.play();
                }
            }
            if (player2Enabled) {
                if (gameEngine.joyHold(JOY.LEFT)) {
                    laserBaseP2.moveLeft(frameTime);
                } else if (gameEngine.joyHold(JOY.RIGHT)) {
                    laserBaseP2.moveRight(frameTime);
                } else if (gameEngine.joyPress(JOY.BUTTON_1)) {
                    if (laserBaseP2.isBulletActive() == false) {
                        laserBaseP2.fire();
                        shootSnd.play();
                    }
                }
            }
        }
        laserBaseP1.update(frameTime);
        if (player2Enabled) {
            laserBaseP2.update(frameTime);
        }

        if ((laserBaseP1.isAlive() && player2Enabled == false) || (laserBaseP1.isAlive() && laserBaseP2.isAlive())) {

            // Ufo update.
            if (ufo.isDead()) {
                ufoSpawnTime -= frameTime;
                if (ufoSpawnTime < 0) {
                    ufoSpawnTime = UFO_SPAWN_TIME;
                    ufo.spawn();
                    ufoFlyingSnd.play();
                }
            }
            ufo.update(frameTime);

            // Invaders update.
            for (var row = 0; row < totalInvaderRows; row++) {
                for (var col = 0; col < totalInvaderCols; col++) {
                    if (invaderMoveDown == false) {
                        invaders[row][col].movePosX((INVADER_MOVE_SPEED_X * invaderMoveDirX) * frameTime);
                    } else {
                        invaders[row][col].movePosY(invaderSpeedSettings.moveSpeedY * frameTime);
                    }
                    
                    invaders[row][col].update(frameTime);
                    if (invaders[row][col].isAlive()) {
                        if (laserBaseP1.isBulletActive()) {
                            if (gameEngine.spriteCollision(invaders[row][col].getPhysicsBody(), laserBaseP1.getBulletPhysicsBody(), invaders[row][col].getPosition(), laserBaseP1.getBulletPosition())) {
                                invaders[row][col].hit();
                                laserBaseP1.deactiveBullet();
                                scoreP1.add(invaders[row][col].getScorePoints());
                                invaderShotDown();
                            }
                        }
                        if (player2Enabled && laserBaseP2.isBulletActive()) {
                            if (gameEngine.spriteCollision(invaders[row][col].getPhysicsBody(), laserBaseP2.getBulletPhysicsBody(), invaders[row][col].getPosition(), laserBaseP2.getBulletPosition())) {
                                invaders[row][col].hit();
                                laserBaseP2.deactiveBullet();
                                scoreP2.add(invaders[row][col].getScorePoints());
                                invaderShotDown();
                            }
                        }
                        for (var i = 0; i < totalInvaderBullets; i++) {
                            invaderFireCountdowns[i] -= 1;
                            if (invaderFireCountdowns[i] == 0) {
                                invaderFireCountdowns[i] = gameEngine.randomNumber(500, invaderSpeedSettings.fireRateMax);
                                if (invaderBullets[i].isActive() == false) {
                                    invaderBullets[i].setPosition(invaders[row][col].getPosX(), invaders[row][col].getPosY());
                                    invaderBullets[i].activate();
                                }
                                continue;
                            }
                        }
                    }
                }
            }

            // Update invaders move timer and direction. 
            invaderMoveTimer -= frameTime;
            if (invaderMoveTimer < 0) {
                invaderMoveDown = !invaderMoveDown;
                if (invaderMoveDown) {
                    invaderMoveTimer = 0.1;
                } else {
                    invaderMoveTimer = 2.5;
                    invaderMoveDirX *= -1;
                }
            }

            // Update invaders step sound effect.
            invaderStepSoundDelay -= frameTime;
            if (invaderStepSoundDelay < 0) {
                invaderStepSoundDelay = invaderSpeedSettings.soundDelay;
                invaderStepSnds[invaderStepSoundIndex].play();
                if (invaderStepSoundIndex + 1 != 4) {
                    invaderStepSoundIndex += 1;
                } else {
                    invaderStepSoundIndex = 0;
                }
            }

            // Invader bullets update.
            for (var i = 0; i < totalInvaderBullets; i++) {
                invaderBullets[i].update(frameTime);
                if (invaderBullets[i].isActive()) {

                    // Check collision between invader bullet and shields.
                    for (var j = 0; j < totalShields; j++) {
                        if (shields[j].isActive()) {
                            if (shields[j].gone() == false) {
                                if (gameEngine.spriteCollision(invaderBullets[i].getPhysicsBody(), shields[j].getPhysicsBody(), invaderBullets[i].getPosition(), shields[j].getPosition())) {
                                    shields[j].hit();
                                    invaderBullets[i].deactivate();
                                    break;
                                }
                            }
                        }
                    }

                    // Check collision between invader bullet and laser base bullet.
                    if (laserBaseP1.isBulletActive()) {
                        if (gameEngine.spriteCollision(invaderBullets[i].getPhysicsBody(), laserBaseP1.getBulletPhysicsBody(), invaderBullets[i].getPosition(), laserBaseP1.getBulletPosition())) {
                            laserBaseP1.deactiveBullet();
                            invaderBullets[i].deactivate();
                            continue;
                        }
                    }
                    if (player2Enabled && laserBaseP2.isBulletActive()) {
                        if (gameEngine.spriteCollision(invaderBullets[i].getPhysicsBody(), laserBaseP2.getBulletPhysicsBody(), invaderBullets[i].getPosition(), laserBaseP2.getBulletPosition())) {
                            laserBaseP2.deactiveBullet();
                            invaderBullets[i].deactivate();
                            continue;
                        }
                    } 

                    // Check collision between invader bullet and laser base.
                    if (laserBaseP1.isAlive()) {
                        if (gameEngine.spriteCollision(invaderBullets[i].getPhysicsBody(), laserBaseP1.getPhysicsBody(), invaderBullets[i].getPosition(), laserBaseP1.getPosition())) {
                            laserBaseP1.hit();
                            livesP1.lost();
                            laserBaseShot();
                            continue;
                        }
                    }
                    if (player2Enabled && laserBaseP2.isAlive()) {
                        if (gameEngine.spriteCollision(invaderBullets[i].getPhysicsBody(), laserBaseP2.getPhysicsBody(), invaderBullets[i].getPosition(), laserBaseP2.getPosition())) {
                            laserBaseP2.hit();
                            livesP2.lost();
                            laserBaseShot();
                        }
                    }
                }
            }

            if (laserBaseP1.isBulletActive()) {

                // Check collision between laser base bullet and shields.
                for (var j = 0; j < totalShields; j++) {
                    if (shields[j].isActive()) {
                        if (shields[j].gone() == false) {
                            if (gameEngine.spriteCollision(laserBaseP1.getBulletPhysicsBody(), shields[j].getPhysicsBody(), laserBaseP1.getBulletPosition(), shields[j].getPosition())) {
                                shields[j].hit();
                                laserBaseP1.deactiveBullet();
                                break;
                            }
                        }
                    }
                }

                // Check collsion between laser base bullet and ufo.
                if (ufo.isAlive()) {
                    if (gameEngine.spriteCollision(laserBaseP1.getBulletPhysicsBody(), ufo.getPhysicsBody(), laserBaseP1.getBulletPosition(), ufo.getPosition())) {
                        laserBaseP1.deactiveBullet();
                        ufoShotDown();
                        scoreP1.add(ufo.getScorePoints());
                    }
                }
            }

            if (player2Enabled && laserBaseP2.isBulletActive()) {

                // Check collision between laser base bullet and laser base (P1).
                if (laserBaseP1.isAlive()) {
                    if (gameEngine.spriteCollision(laserBaseP2.getBulletPhysicsBody(), laserBaseP1.getPhysicsBody(), laserBaseP2.getBulletPosition(), laserBaseP1.getPosition())) {
                        laserBaseP2.deactiveBullet();
                        laserBaseP1.hit();
                        livesP1.lost();
                        laserBaseShot();
                    }
                }

                // Check collision between laser base bullet and shields.
                for (var j = 0; j < totalShields; j++) {
                    if (shields[j].isActive()) {
                        if (shields[j].gone() == false) {
                            if (gameEngine.spriteCollision(laserBaseP2.getBulletPhysicsBody(), shields[j].getPhysicsBody(), laserBaseP2.getBulletPosition(), shields[j].getPosition())) {
                                shields[j].hit();
                                laserBaseP2.deactiveBullet();
                                break;
                            }
                        }
                    }
                }

                // Check collsion between laser base bullet and ufo.
                if (ufo.isAlive()) {
                    if (gameEngine.spriteCollision(laserBaseP2.getBulletPhysicsBody(), ufo.getPhysicsBody(), laserBaseP2.getBulletPosition(), ufo.getPosition())) {
                        laserBaseP2.deactiveBullet();
                        ufoShotDown();
                        scoreP2.add(ufo.getScorePoints());
                    }
                }
            }
        }
    }

    function resetLevelScreen() {

        // Reset score and show lives.
        if (activeScreenID == GAME_STATES.start) {
            scoreP1.reset();
            livesP1.show();
            livesP1.reset(START_LIVES);
            if (player2Enabled) {
                scoreP2.reset();
                livesP2.show();
                livesP2.reset(START_LIVES);
            }
        }

        // Reset game state delay.
        gameStateChangeTimer = 2.0;

        // Reset invader fire timers.
        invaderFireCountdowns = [5000, 5000, 10000, 15000, 15000];

        // Reset ufo swawn timer and hide ufo.
        ufoSpawnTime = UFO_SPAWN_TIME;
        ufo.dead();

        // Reset kill count.
        invaderKillCount = 0;

        // Reset invader settings.
        invaderSpeedSettings = INVADER_SPEED_X1;
        invaderMoveDirX = 1;
        invaderMoveDown = false;
        invaderMoveTimer = 2.5;
        invaderStepSoundDelay = invaderSpeedSettings.soundDelay;
        invaderStepSoundIndex = 0;

        // Hide invader bullets and show invaders.
        for (var i = 0; i < totalInvaderBullets; i++) {
            invaderBullet.deactivate();
        }
        for (var row = 0; row < totalInvaderRows; row++) {
            for (var col = 0; col < totalInvaderCols; col++) {
                invaders[row][col].spawn();
            }
        }

        // Hide laser base bullets and show laser base.
        laserBaseP1.deactiveBullet();
        laserBaseP1.spawn();
        if (player2Enabled == false) {
            laserBaseP1.setPosition((winWidth * 0.5), laserBaseStartPoxYP1);
        } else {
            laserBaseP2.deactiveBullet();
            laserBaseP2.spawn();
        }
    }

    function updateCompleteScreen(frameTime) {

        // Delay change to new level state.
        gameStateChangeTimer -= frameTime;
        if (gameStateChangeTimer < 0) {
            levelCompleteMessage.hide();
            resetLevelScreen();
            activeScreenID = GAME_STATES.level;
        }
    }

    function resetCompleteScreen() {

        levelCompleteMessage.show();
    }

    function updateGameOverScreen(frameTime) {

        // Delay change to start state.
        gameStateChangeTimer -= frameTime;
        if (gameStateChangeTimer < 0) {
            updateHighScore();
            resetStartScreen();
            activeScreenID = GAME_STATES.start;
        }
    }

    function resetGameOverScreen() {

        if (livesP1.noLives()) {
            messageP1.setText('GAME OVER');
            messageP1.show();
        }
        if (player2Enabled && livesP2.noLives()) {
            messageP2.setText('GAME OVER');
            messageP2.show();
        }
    }

    function isLevelComplete() {

        // Check if all invaders shot down.
        if (invaderKillCount == totalInvaders) {

            return true;
        }

        return false;
    }

    function isGameOver() {

        // Check if player 1 or 2 has no lives left.
        if ((livesP1.noLives() && player2Enabled == false) || (livesP1.noLives() || livesP2.noLives())) {

            return true;
        }

        return false;
    }

    function ufoShotDown() {

        // Update ufo status and stop ufo sound.
        ufo.hit();
        ufoFlyingSnd.stop();
    }

    function invaderShotDown() {

        // Play sound effect and increase kill count.
        invaderKilledSnd.play();
        invaderKillCount += 1;

        // Update invader speed settings.
        if (invaderKillCount < 11) {
            invaderSpeedSettings = INVADER_SPEED_X1;
        } else if (invaderKillCount < 22) {
            invaderSpeedSettings = INVADER_SPEED_X2;
        } else if (invaderKillCount < 33) {
            invaderSpeedSettings = INVADER_SPEED_X3;
        } else if (invaderKillCount < 44) {
            invaderSpeedSettings = INVADER_SPEED_X4;
        } else {
            invaderSpeedSettings = INVADER_SPEED_X5;
        }
    }

    function laserBaseShot() {

        // Hide laser base bullets.
        laserBaseP1.deactiveBullet();
        if (player2Enabled) {
            laserBaseP2.deactiveBullet();
        }

        // Stop the ufo sound and play the explosion sound.
        ufoFlyingSnd.stop();
        explosionSnd.play();
        
        // Hide all invader bullets.
        for (var i = 0; i < totalInvaderBullets; i++) {
            invaderBullets[i].deactivate();
        }
    }

    function updateHighScore() {

        // Check if the score for player 1 is the new high score.
        if (scoreP1.getScore() > scoreHi.getScore()) {
            scoreHi.setScore(scoreP1.getScore());
        }
        // Check if the score for player 2 is the new high score.
        if (scoreP2.getScore() > scoreHi.getScore()) {
            scoreHi.setScore(scoreP2.getScore());
        } 
    }
};