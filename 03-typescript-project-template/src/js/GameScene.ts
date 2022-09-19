export default class GameScene extends Phaser.Scene {
  player: Phaser.GameObjects.Sprite;

  public preload() {
    this.load.image('example', 'assets/example.png');
  }
  
  public create() {
    this.player = this.add.sprite(this.sys.game.config.width as number / 2, this.sys.game.config.height as number / 2, 'example');
  }
}
