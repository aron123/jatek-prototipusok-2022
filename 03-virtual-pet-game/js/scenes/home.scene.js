const homeScene = new Phaser.Scene('Home');

homeScene.create = function () {
    this.bg = this.add.sprite(0, 0, 'backyard').setOrigin(0, 0);
    this.bg.setInteractive();

    this.bg.on('pointerdown', () => {
        this.scene.start('Game');
    });

    this.text = this.add.text(180, 300, 'VIRTUAL PET', {
        font: '30px Arial'
    });
    this.text.setOrigin(0.5);
    this.text.setDepth(1);

    this.textBg = this.add.graphics();
    this.textBg.fillStyle(0x000000, 0.7);

    const gameW = this.sys.game.config.width;
    const gameH = this.sys.game.config.height;

    this.textBg.fillRect(
        gameW / 2 - this.text.width / 2 - 10, 
        this.text.y - this.text.height / 2 - 10,
        this.text.width + 20,
        this.text.height + 20
    );
};
