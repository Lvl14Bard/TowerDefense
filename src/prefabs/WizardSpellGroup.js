class WizardSpellGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);
        this.scene = scene;
        this.fireSpeed = 200;
        this.fireRate = 200;
        this.numSpellsUp = 1;
        this.damage = 1;
        this.createMultiple({
            classType: WizardSpell,
            frameQuantity: 999,
            active: false,
            visible: false,
            key: 'WizSpell'
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
        // let spell = this.getChildren()[this.getChildren().length];
        let spell = this.create(x, y, target).setBounce(1, 1).setActive(true).setVisible(true);
        this.scene.physics.moveToObject(spell, target, this.fireSpeed);
    }
}