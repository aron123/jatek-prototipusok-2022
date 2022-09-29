const loadingScene = new Phaser.Scene('Loading');

loadingScene.preload = function () {
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

    const barW = 250;
    const barH = 30;
    const gameW = this.sys.game.config.width;
    const gameH = this.sys.game.config.height;

    this.barBg = this.add.graphics();
    this.barBg.fillStyle(0x000000, 0.3);
    this.barBg.fillRect(
        gameW / 2 - barW / 2,
        gameH / 2 - barH / 2,
        barW,
        barH
    );

    this.progressBar = this.add.graphics();

    this.load.on('progress', (progress) => {
        this.progressBar.clear();
        this.progressBar.fillStyle(0x28D139, 1);
        this.progressBar.fillRect(
            gameW / 2 - barW / 2,
            gameH / 2 - barH / 2,
            progress * barW,
            barH
        );
    });
};

loadingScene.create = function () {
    this.scene.start('Home');
};
