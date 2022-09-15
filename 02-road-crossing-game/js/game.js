const gameScene = new Phaser.Scene('Game');

gameScene.init = function () {
    this.playerSpeed = 3;

    this.enemySpeedMin = 1;
    this.enemySpeedMax = 3;

    this.enemyMinY = 90;
    this.enemyMaxY = 280;

    this.isTerminating = false;
};

gameScene.preload = function () {
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('goal', 'assets/treasure.png');
    this.load.image('enemy', 'assets/dragon.png');
};

gameScene.create = function () {
    this.bg = this.add.sprite(0, 0, 'background');
    this.bg.setOrigin(0, 0);

    this.player = this.add.sprite(30, this.sys.game.config.height / 2, 'player');
    this.player.setScale(0.6);

    this.goal = this.add.sprite(this.sys.game.config.width - 50, this.sys.game.config.height / 2, 'goal');
    this.goal.setScale(0.6);

    this.enemies = this.add.group({
        key: 'enemy',
        repeat: 5,
        setXY: {
            x: 80,
            y: 90,
            stepX: 90,
            stepY: 25
        }
    });

    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.3, -0.3);

    Phaser.Actions.Call(this.enemies.getChildren(), (enemy) => {
        enemy.flipX = true;
        const direction = Math.random() < 0.5 ? 1 : -1;
        const speed = this.enemySpeedMin + Math.random() * (this.enemySpeedMax - this.enemySpeedMin);
        enemy.speed = direction * speed;
    });
};

gameScene.update = function () {
    if (this.isTerminating) {
        return;
    }

    if (this.input.activePointer.isDown) {
        this.player.x += this.playerSpeed;
    }

    const playerRect = this.player.getBounds();
    const goalRect = this.goal.getBounds();

    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, goalRect)) {
        return this.scene.restart();
    }

    for (const enemy of this.enemies.getChildren()) {
        const isInTop = enemy.speed < 0 && enemy.y <= this.enemyMinY;
        const isInBottom = enemy.speed > 0 && enemy.y >= this.enemyMaxY;

        if (isInTop || isInBottom) {
            enemy.speed *= -1;
        }

        enemy.y += enemy.speed;

        const enemyRect = enemy.getBounds();
        if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
            return this.gameOver();
        }
    }
};

gameScene.gameOver = function () {
    this.isTerminating = true;

    this.cameras.main.shake(500);

    this.cameras.main.on('camerashakecomplete', () => {
        this.cameras.main.fade(500);
    });

    this.cameras.main.on('camerafadeoutcomplete', () => {
        this.scene.restart();
    });
};

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene
};

const game = new Phaser.Game(config);
