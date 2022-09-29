const gameScene = new Phaser.Scene('Game');

gameScene.init = function () {
    this.selectedItem = null;
    this.uiBlocked = false;

    this.stats = { health: 100, fun: 100 };

    this.statsDecay = { health: -15, fun: -15 };
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
    this.appleBtn.stats = { health: 20, fun: 0 };
    this.appleBtn.on('pointerdown', () => this.pickItem(this.appleBtn));

    this.candyBtn = this.add.sprite(144, 570, 'candy').setInteractive();
    this.candyBtn.stats = { health: -15, fun: 20 };
    this.candyBtn.on('pointerdown', () => this.pickItem(this.candyBtn));

    this.toyBtn = this.add.sprite(216, 570, 'toy').setInteractive();
    this.toyBtn.stats = { health: 5, fun: 15 };
    this.toyBtn.on('pointerdown', () => this.pickItem(this.toyBtn));

    this.rotateBtn = this.add.sprite(288, 570, 'rotate').setInteractive();
    this.rotateBtn.stats = { health: 0, fun: 10 };
    this.rotateBtn.on('pointerdown', () => this.rotatePet(this.rotateBtn));

    this.statsText = this.add.text(20, 20, '', {
        font: '20px Arial',
        fill: '#ffff00'
    });

    this.displayStats();

    const statsEvent = this.time.addEvent({
        delay: 1000,
        repeat: -1,
        callback: () => {
            this.refreshStats(this.statsDecay);
        }
    });
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
            this.refreshStats(this.selectedItem.stats);
            newItem.destroy();
            this.pet.play('eat');
            this.pet.on('animationcomplete', () => {
                this.pet.setFrame(0);
                this.setUIReady();
            });
        }
    });
};

gameScene.rotatePet = function (button) {
    if (this.uiBlocked) {
        return;
    }

    this.setUIReady();
    button.alpha = 0.7;
    this.uiBlocked = true;

    this.tweens.add({
        targets: this.pet,
        duration: 500,
        repeat: 0,
        angle: 360,
        paused: false,
        onComplete: () => {
            this.refreshStats(button.stats);
            this.setUIReady();
        }
    });
};

gameScene.displayStats = function () {
    this.statsText.setText(`Health: ${this.stats.health}, fun: ${this.stats.fun}`);
};

gameScene.refreshStats = function (statsDiff) {
    this.stats.health += statsDiff.health;
    this.stats.fun += statsDiff.fun;

    if (this.stats.health < 0 || this.stats.fun < 0) {
        this.stats.health = 0;
        this.stats.fun = 0;
    }

    if (this.stats.health == 0 || this.stats.fun == 0) {
        this.gameOver();
    }

    this.displayStats();
};

gameScene.gameOver = function () {
    this.pet.setFrame(4);

    this.uiBlocked = true;

    this.time.addEvent({
        delay: 2000,
        repeat: 0,
        callback: () => {
            this.scene.start('Home');
        }
    });
};
