const gameScene = new Phaser.Scene('Game');

gameScene.init = function () {
    this.selectedItem = null;
    this.uiBlocked = false;
};

gameScene.preload = function () {
    this.load.image('backyard', 'assets/backyard.png');
    this.load.image('apple', 'assets/apple.png');
    this.load.image('candy', 'assets/candy.png');
    this.load.image('rotate', 'assets/rotate.png');
    this.load.image('toy', 'assets/rubber_duck.png');

    this.load.spritesheet('pet', 'assets/pet.png', {
        frameWidth: 97,
        frameHeight: 83,
        margin: 1,
        spacing: 1
    });
};

gameScene.create = function () {
    this.bg = this.add.sprite(0, 0, 'backyard').setOrigin(0, 0).setInteractive();
    this.bg.on('pointerdown', (pointer, localX, localY) => this.placeItem(localX, localY));

    this.pet = this.add.sprite(180, 250, 'pet', 0).setInteractive();
    this.pet.setDepth(1);
    this.input.setDraggable(this.pet);
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    this.anims.create({
        key: 'eat',
        duration: 600,
        frameRate: 7,
        frames: this.anims.generateFrameNames('pet', { frames: [1, 2, 3] }),
        repeat: 0,
        yoyo: true
    });

    this.appleBtn = this.add.sprite(72, 570, 'apple').setInteractive();
    this.appleBtn.on('pointerdown', () => this.pickItem(this.appleBtn));

    this.candyBtn = this.add.sprite(144, 570, 'candy').setInteractive();
    this.candyBtn.on('pointerdown', () => this.pickItem(this.candyBtn));

    this.toyBtn = this.add.sprite(216, 570, 'toy').setInteractive();
    this.toyBtn.on('pointerdown', () => this.pickItem(this.toyBtn));

    this.rotateBtn = this.add.sprite(288, 570, 'rotate').setInteractive();
};

gameScene.pickItem = function (item) {
    if (this.uiBlocked) {
        return;
    }

    this.setUIReady();
    item.alpha = 0.7;
    this.selectedItem = item;
};

gameScene.setUIReady = function () {
    this.selectedItem = null;
    this.appleBtn.alpha = 1;
    this.candyBtn.alpha = 1;
    this.toyBtn.alpha = 1;
    this.rotateBtn.alpha = 1;
    this.uiBlocked = false;
};

gameScene.placeItem = function (clickX, clickY) {
    if (!this.selectedItem || this.uiBlocked) {
        return;
    }

    this.uiBlocked = true;

    const newItem = this.add.sprite(clickX, clickY, this.selectedItem.texture.key);

    this.tweens.add({
        targets: this.pet,
        duration: 500,
        repeat: 0,
        x: newItem.x,
        y: newItem.y,
        paused: false,
        onComplete: () => {
            newItem.destroy();
            this.pet.play('eat');
            this.pet.on('animationcomplete', () => {
                this.pet.setFrame(0);
                this.setUIReady();
            });
        }
    });
};

gameScene.rotatePet = function () {};

const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    backgroundColor: '#ffffff',
    pixelArt: false,
    scene: gameScene
};

const game = new Phaser.Game(config);
