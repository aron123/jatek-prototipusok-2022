const gameScene = new Phaser.Scene('Game');

gameScene.init = function () {
    this.playerSpeed = 150;
    this.jumpSpeed = -600;
};

gameScene.preload = function () {
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('platform', 'assets/images/platform.png');
    this.load.image('block', 'assets/images/block.png');
    this.load.image('goal', 'assets/images/gorilla.png');
    this.load.image('barrel', 'assets/images/barrel.png');

    this.load.spritesheet('player', 'assets/images/player_spritesheet.png', {
        frameWidth: 28,
        frameHeight: 30,
        margin: 1,
        spacing: 1
    });

    this.load.spritesheet('fire', 'assets/images/fire_spritesheet.png', {
        frameWidth: 20,
        frameHeight: 21,
        margin: 1,
        spacing: 1
    });

    this.load.json('levelData', 'assets/jsons/levelData.json');
};

gameScene.create = function () {
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('player', { frames: [0, 1, 2] }),
        frameRate: 7
    });

    this.anims.create({
        key: 'burn',
        frames: this.anims.generateFrameNames('fire', { frames: [0, 1] }),
        frameRate: 4,
        repeat: -1
    });

    this.setupLevel();

    this.setupSpawner();

    this.physics.add.collider(this.player, [this.platforms]);
    this.physics.add.collider(this.goal, [this.platforms]);
    this.physics.add.collider(this.barrels, [this.platforms]);
    this.physics.add.overlap(this.player, [this.fires, this.goal, this.barrels], () => this.restartGame());

    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.on('drag', (pointer, gameObject, x, y) => {
        gameObject.x = x;
        gameObject.y = y;
        console.log(x, y);
    });
};

gameScene.update = function () {
    const onGround = this.player.body.blocked.down;

    if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(this.playerSpeed);
        this.player.flipX = true;
        if (onGround && !this.player.anims.isPlaying) {
            this.player.anims.play('walk');
        }
    } else if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-this.playerSpeed);
        this.player.flipX = false;
        if (onGround && !this.player.anims.isPlaying) {
            this.player.anims.play('walk');
        }
    } else {
        this.player.body.setVelocityX(0);
        this.player.anims.stop();
        if (onGround) {
            this.player.setFrame(3);
        }
    }

    if (onGround && (this.cursors.up.isDown || this.cursors.space.isDown)) {
        this.player.body.setVelocityY(this.jumpSpeed);
        this.player.setFrame(2);
    }
};

gameScene.setupLevel = function () {
    this.levelData = this.cache.json.get('levelData');

    this.platforms = this.physics.add.staticGroup();
    for (const platform of this.levelData.platforms) {
        let newPlatform;

        if (platform.numTiles === 1) {
            newPlatform = this.add.sprite(platform.x, platform.y, platform.key);
        } else {
            const blockWidth = this.textures.get(platform.key).get(0).width;
            const blockHeight = this.textures.get(platform.key).get(0).height;
            newPlatform = this.add.tileSprite(platform.x, platform.y, platform.numTiles * blockWidth, blockHeight, platform.key);
        }

        newPlatform.setOrigin(0);
        this.platforms.add(newPlatform);
    }

    this.fires = this.physics.add.staticGroup();
    for (const fire of this.levelData.fires) {
        let newFire = this.add.sprite(fire.x, fire.y, 'fire');
        newFire.setInteractive();
        this.input.setDraggable(newFire);

        newFire.setOrigin(0);
        newFire.anims.play('burn');
        this.fires.add(newFire);
    }

    this.goal = this.add.sprite(this.levelData.goal.x, this.levelData.goal.y, 'goal');
    this.goal.setInteractive();
    this.input.setDraggable(this.goal);
    this.physics.add.existing(this.goal);

    this.player = this.add.sprite(this.levelData.player.x, this.levelData.player.y, 'player', 3);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds();

    this.physics.world.bounds.width = this.levelData.world.width;
    this.physics.world.bounds.height = this.levelData.world.height;
    this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
    this.cameras.main.startFollow(this.player);
};

gameScene.restartGame = function () {
    this.cameras.main.fade(500);
    this.cameras.main.on('camerafadeoutcomplete', () => {
        this.scene.restart();
    });
};

gameScene.setupSpawner = function () {
    this.barrels = this.physics.add.group({
        collideWorldBounds: true,
        bounceX: 1,
        bounceY: 0.1
    });

    this.time.addEvent({
        delay: this.levelData.spawner.interval,
        loop: true,
        callback: () => {
            const barrel = this.barrels.get(this.levelData.goal.x, this.levelData.goal.y, 'barrel');

            barrel.setVisible(true);
            barrel.setActive(true);
            barrel.body.enable = true;

            barrel.body.setVelocityX(this.levelData.spawner.speed);

            this.time.addEvent({
                delay: this.levelData.spawner.lifespan,
                callback: () => {
                    this.barrels.killAndHide(barrel);
                    barrel.body.enable = false;
                }
            });
        }
    });
};

const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    scene: gameScene,
    pixelArt: false,
    title: 'Platformer game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: true
        }
    }
};

const game = new Phaser.Game(config);
