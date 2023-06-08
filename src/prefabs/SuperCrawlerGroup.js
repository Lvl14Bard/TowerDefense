class SuperCrawlerGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: SuperCrawler,
            active: true,          
            visible: true,
            key: 'superCrawler'
        })
    }
}