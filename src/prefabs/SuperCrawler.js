class SuperCrawler extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'superCrawler');
        this.hp = 10;
    }
}