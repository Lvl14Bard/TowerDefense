class TowerSpell extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, 'WizardSpell');
      scene.physics.add.existing(this);
      this.scene = scene;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if(this.y < 0 || this.y > game.config.height || this.x < 0 || this.x > game.config.width) {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}