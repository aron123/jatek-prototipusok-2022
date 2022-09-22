const gameScene = new Phaser.Scene('Game');

gameScene.init = function () {
  this.words = [
    {
      key: 'building',
      spanish: 'edificio',
      setXY: {
        x: 80,
        y: 250
      }
    },
    {
      key: 'house',
      spanish: 'casa',
      setXY: {
        x: 250,
        y: 270
      }
    },
    {
      key: 'car',
      spanish: 'automovíl',
      setXY: {
        x: 430,
        y: 280
      },
      setScale: {
        x: 0.8,
        y: 0.8
      }
    },
    {
      key: 'tree',
      spanish: 'árbol',
      setXY: {
        x: 560,
        y: 230
      }
    }
  ];
};

gameScene.preload = function () {
  this.load.image('background', 'assets/images/background-city.png');
  this.load.image('building', 'assets/images/building.png');
  this.load.image('car', 'assets/images/car.png');
  this.load.image('house', 'assets/images/house.png');
  this.load.image('tree', 'assets/images/tree.png');

  this.load.audio('treeAudio', 'assets/audio/arbol.mp3');
  this.load.audio('carAudio', 'assets/audio/auto.mp3');
  this.load.audio('houseAudio', 'assets/audio/casa.mp3');
  this.load.audio('buildingAudio', 'assets/audio/edificio.mp3');
  this.load.audio('correct', 'assets/audio/correct.mp3');
  this.load.audio('wrong', 'assets/audio/wrong.mp3');
};

gameScene.create = function () {
  this.bg = this.add.sprite(0, 0, 'background').setOrigin(0, 0);

  this.items = this.add.group(this.words);

  this.correctAudio = this.sound.add('correct');
  this.wrongAudio = this.sound.add('wrong');

  this.items.getChildren().forEach((item, i) => {
    item.setInteractive();

    item.correctTween = this.tweens.add({
      targets: item,
      duration: 300,
      repeat: 0,
      paused: true,
      scaleX: 1.5,
      scaleY: 1.5,
      yoyo: true,
      ease: 'Quint.easeInOut',
      onComplete: () => this.showNextQuestion()
    });

    item.wrongTween = this.tweens.add({
      targets: item,
      duration: 300,
      repeat: 0,
      paused: true,
      scaleX: 1.5,
      scaleY: 1.5,
      angle: 90,
      yoyo: true,
      ease: 'Quint.easeInOut',
      onComplete: () => this.showNextQuestion()
    });

    item.on('pointerover', () => {
      item.alpha = 0.7;
    });

    item.on('pointerout', () => {
      item.alpha = 1;
    });

    item.on('pointerdown', () => {
      const tween = this.processAnswer(this.words[i].spanish) ? item.correctTween : item.wrongTween;
      tween.play();
    });

    this.words[i].sound = this.sound.add(item.texture.key + 'Audio');
  });

  this.wordText = this.add.text(30, 30, '', {
    font: 'bold 32px Open Sans',
    fill: '#ffff00'
  });

  this.showNextQuestion();
};

gameScene.showNextQuestion = function () {
  this.nextWord = Phaser.Math.RND.pick(this.words);
  this.wordText.setText(this.nextWord.spanish);
  this.nextWord.sound.play();
};

gameScene.processAnswer = function (userResponse) {
  if (this.nextWord.spanish === userResponse) {
    this.correctAudio.play();
    return true;
  } else {
    this.wrongAudio.play();
    return false;
  }
};

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene,
};

const game = new Phaser.Game(config);
