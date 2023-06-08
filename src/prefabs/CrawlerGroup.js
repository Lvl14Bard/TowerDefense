class CrawlerGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Crawler,
            active: true,          
            visible: true,
            key: 'crawler'
        })
    }

    getRandomTarget() {
        return Phaser.Utils.Array.GetRandom(Phaser.Utils.Array.GetAll(this.getChildren(), 'active', true));
    }
}