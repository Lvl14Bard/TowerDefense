class TowerSpellGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);
        this.scene = scene;
        this.fireSpeed = 200;
        this.fireRate = 600;
        this.numSpellsUp = 1;
        this.damage = 500;
        this.scl = 1;
        this.createMultiple({
            classType: TowerSpell,
            frameQuantity: this.numSpellsUp,
            active: false,
            visible: false,
            key: 'TowSpell',
            collideWorldBounds: true,
        })
    }

    castSpell(x, y, target) {
        // if(this.countActive(false) >= this.numSpellsUp) {
        //     for(let i = 0; i < this.numSpellsUp; i++) {
        //         let spell = this.getFirstDead(false);
        //         if (spell) {
        //             spell.setBounce(1,1);
        //             spell.body.reset(x, y);
        //             spell.setActive(true);
        //             spell.setVisible(true);
        //             this.scene.physics.moveToObject(spell, target, this.fireSpeed);
        //         }
        //     }
        // }
        let spell = this.create(x, y, target).setActive(true).setVisible(true).setScale(this.scl, this.scl);
        this.scene.physics.moveToObject(spell, target, this.fireSpeed);
    }
}