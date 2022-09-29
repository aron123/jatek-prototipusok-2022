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
};

gameScene.create = function () {
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('player', { frames: [0, 1, 2] }),
        frameRate: 7
    });

    const ground = this.add.sprite(0, 560, 'ground').setOrigin(0);
    this.physics.add.existing(ground, true);

    const blockWidth = this.textures.get('block').get(0).width;
    const blockHeight = this.textures.get('block').get(0).height;

    const platform = this.add.tileSprite(50, 500, 4 * blockWidth, blockHeight, 'block');
    platform.setOrigin(0);

    this.physics.add.existing(platform, true);

    this.player = this.add.sprite(300, 530, 'player', 3);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds();

    this.physics.add.collider(this.player, [ground, platform]);

    this.cursors = this.input.keyboard.createCursorKeys();
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
