const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    backgroundColor: '#ffffff',
    pixelArt: false,
    scene: [loadingScene, homeScene, gameScene]
};

const game = new Phaser.Game(config);
