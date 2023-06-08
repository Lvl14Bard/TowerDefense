class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture){
        super(scene, x, y, texture);

        //variables health, attack, attack speed (in frames), movement speed, and range
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.hp = 3;
        this.moveSpeed = 100;
    }
}