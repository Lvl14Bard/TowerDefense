//TODO: Add enemy that tracks player (this could be an object that is spawned on its own instead of part of a group)
//Add tutorial UI (Controls printed out at bottom of screen)
//Add exposition UI (Fade in, fade out)
//Add Beginning menu scene (Play, credits)
//Add ending scene or transition (Prints total crystals, says Thesis Denied or something)
//Add upgrade system (upgrade arrays loop through types of upgrades. Q increases Qasting, E increases towEr)
//Add particle effects
//Make enemies speed up overtime?
//Add UI to show the upgrade that you got
//

class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }

    preload(){
        //load character image
        //this.load.image('player', './assets/wizard.png');
        //load map image
        this.load.image('map', './assets/map.png');
        //load crawler image
        this.load.image('crawler', './assets/crawler.png');
        //load crystal tower image
        this.load.image('crystalTower', './assets/crystalTower.png');
        //load mouse image
        this.load.image('mouse', './assets/rocket.png');
        this.load.image('WizardSpell', './assets/WizardSpell.png');
        this.load.spritesheet({key: 'player',
                                url: './assets/wizard.png',
                            frameConfig:{
                                frameWidth: 31,
                                frameHeight: 53,
                                startFrame: 0,
                            }});
        this.load.image('staff', './assets/Staff.png')
    }

    create(){
        //init some vars
        crystals = 0;
        waveTimer = 6000;
        waveCounter = 1;
        upgradePrice = 1;

        //set world bounds
        this.physics.world.setBounds(0,0,1919,1079);

        //get keys ready
        keyQ = this.input.keyboard.addKey('Q');
        keyE = this.input.keyboard.addKey('E');
        keyR = this.input.keyboard.addKey('R');
        keyW = this.input.keyboard.addKey('W');
        keyA = this.input.keyboard.addKey('A');
        keyS = this.input.keyboard.addKey('S');
        keyD = this.input.keyboard.addKey('D');

        //place map
        this.map = this.add.sprite(0,0, 'map').setOrigin(0,0);

        //create character
        this.player = new Player(this, game.config.width/2 + 20, game.config.height/2 + 20, 'player');

        //place crystal tower
        this.crystalTower = new CrystalTower(this, game.config.width/2, game.config.height/2, 'crystalTower');

        //place mouse target
        this.mouse = this.add.image(0,0, 'mouse').setVisible(false);

        //create groups
        this.towerSpellGroup = new TowerSpellGroup(this);
        this.wizardSpellGroup = new WizardSpellGroup(this);
        this.crawlerGroup = new CrawlerGroup(this);
        //this.superCrawlerGroup = new SuperCrawlerGroup(this);

        //create ui
        this.cTHPUI = this.add.text(this.crystalTower.x, this.crystalTower.y-40, "HP: "+ this.crystalTower.hp, {fontsize: '32px'})
        .setOrigin(0.5, 0.5);
        this.wizHPUI = this.add.text(this.player.x, this.player.y-35, "HP: "+ this.player.hp, {fontsize: '32px'})
        .setOrigin(0.5, 0.5);
        this.crystalsUI = this.add.text(this.crystalTower.x, this.crystalTower.y + 40, "Crystals: " + crystals, {fontSize: '16px'})
        .setOrigin(0.5, 0.5);
        this.wizUpgradeUI = this.add.text(this.player.x - 60, this.player.y, "Q \n UPGRADE: \n" + wizardUpgradeText[wizardUpgradeCounter%3], {fontSize: '16px'})
        .setOrigin(0.5, 0.5);
        //this.towUpgradeUI = this.add.text(this.player.x + 70, this.player.y, "E \n UPGRADE: \n" + towerUpgradeText[towerUpgradeCounter%3], {fontSize: '16px'})
        //.setOrigin(0.5, 0.5);


        //initialize timers
        wizardTimer = this.wizardSpellGroup.fireRate;
        towerTimer = this.towerSpellGroup.fireRate;

        //collision decision
        this.player.body.collideWorldBounds = true;
        this.crystalTower.body.immovable = true;
        this.player.body.onCollide = true;
        this.crystalTower.onCollide = true;

        //spell destroys crawler and self. Adds crystal
        this.physics.add.overlap(this.wizardSpellGroup, this.crawlerGroup, (wizSpell, crawler) => {
            //wizSpell.destroy(true);
            crawler.destroy(true);
            crystals++;
        });

        //spell destorys super crawler and self. Adds crystal
        this.physics.add.overlap(this.wizardSpellGroup, this.superCrawlerGroup, (wizSpell, superCrawler) => {
            //wizSpell.destroy(true);
            superCrawler.destroy(true);
            //this.crystals += SC_VAL;
        });

        //spell destroys crawler and self. Adds crystal
        this.physics.add.overlap(this.towerSpellGroup, this.crawlerGroup, (towSpell, crawler) => {
            //towSpell.destroy(true);
            crawler.destroy(true);
            crystals++;
        });

        //spell destroys super crawler and self. Adds crystal
        // this.physics.add.collider(this.towerSpellGroup, this.superCrawlerGroup, (towSpell, superCrawler) => {
        //     towSpell.destroy(true);
        //     superCrawler.destroy(true);
        //     crystals += SC_VAL;
        // });

        //crawler damages tower and destroys self
        this.physics.add.overlap(this.crystalTower, this.crawlerGroup, (xxx, crawler) => {
            this.crystalTower.hp--;
            crawler.destroy(true);
            crystals++;
        });

        //super crawler damages tower and resets self
        // this.physics.add.collider(this.crystalTower, this.superCrawlerGroup, (tow, superCrawler) => {
        //     this.crystalTower.hp -= SC_DAM;
        //     superCrawler.destroy(true);
        // });

        //nothing special
        this.physics.add.collider(this.player, this.crystalTower);

        //crawler damages player and resets self
        this.physics.add.overlap(this.player, this.crawlerGroup, (xxx, crawler) => {
            this.player.hp--;
            crawler.destroy(true);
            crystals++;
        });

        //super crawler damages player and resets self
        // this.physics.add.collider(this.player, this.superCrawlerGroup, (xxx, superCrawler) => {
        //     this.player.hp -= SC_DAM;
        //     superCrawler.destroy(true);
        // });

        //nothing special
        //this.physics.add.collider(this.crystalTower, this.wizardSpellGroup);

        //input events
        this.input.on('pointerdown', (pointer) => {
            if(wizardTimer <= 0){
                this.mouse.copyPosition(pointer);
                this.fireWizardSpell(this.mouse);
                wizardTimer = this.wizardSpellGroup.fireRate;
            }
        })


    }

    update(time, delta){

        //timers
        if(delta >= 1){
            wizardTimer--;
            towerTimer--;
            waveTimer--;
        }

        //enemy wave spawner
        if(waveTimer%100==0){
            for(let i = waveCounter; i > 0; i--){
                let temp = this.spawnCircle();
                this.crawlerGroup.create().setX(temp[0]).setY(temp[1]).setScale(1.5,1.5);
                let last = this.crawlerGroup.getChildren().length-1;
                this.physics.moveToObject(this.crawlerGroup.getChildren()[last], this.crystalTower, this.crawlerGroup.moveSpeed);
            }
        }

        //increases wave intensity
        if(waveTimer%1500==0){
            waveCounter++;
        }

        //player movement
        this.direction = new Phaser.Math.Vector2(0);

        if(keyA.isDown)
        {
            this.direction.x = -1;
            this.player.setFrame(1);
        }
        else if (keyD.isDown)
        {
            this.player.setFrame(3);
            this.direction.x = 1;
        }

        if (keyW.isDown)
        {
            this.player.setFrame(0);
            this.direction.y = -1;
        }
        else if (keyS.isDown)
        {
            this.player.setFrame(2);
            this.direction.y = 1;
        }
        this.direction.normalize();
        this.player.setVelocity(this.direction.x * this.player.moveSpeed, this.direction.y * this.player.moveSpeed);

        //CT attacks
        if(towerTimer<0 && this.crawlerGroup.countActive(true)){
            this.fireTowerSpell();
            towerTimer = this.towerSpellGroup.fireRate;
        }

        //update UI
        this.cTHPUI.setText("HP: " + this.crystalTower.hp);
        this.wizHPUI.setText("HP: " + this.player.hp);
        this.wizHPUI.x = this.player.x;
        this.wizHPUI.y = this.player.y - 35;
        this.crystalsUI.setText("Crystals: " + crystals);
        this.wizUpgradeUI.setText("Q: \n" + wizardUpgradeText[wizardUpgradeCounter%3]);
        //this.towUpgradeUI.setText("E: \n" + towerUpgradeText[towerUpgradeCounter%3]);
        this.wizUpgradeUI.x = this.player.x - 60;
        this.wizUpgradeUI.y = this.player.y;
        // this.towUpgradeUI.x = this.player.x + 70;
        // this.towUpgradeUI.y = this.player.y;

        //UPGRADES
        if(Phaser.Input.Keyboard.JustDown(keyQ)) this.wizardUpgrade();
        // if(Phaser.Input.Keyboard.JustDown(keyE)) this.towerUpgrade();
    }
    
    fireTowerSpell() {
        let target = this.crawlerGroup.getRandomTarget();
        this.towerSpellGroup.castSpell(game.config.width/2, game.config.height/2, target);
    }

    fireWizardSpell(target) {
        this.wizardSpellGroup.castSpell(this.player.x, this.player.y, target);
    }

    spawnCircle(){
        let angle = Math.random()*Math.PI*2;
        let x = Math.cos(angle)*2000 + game.config.width/2;
        let y = Math.sin(angle)*2000 + game.config.height/2;
        return [x,y,angle];
    }

    wizardUpgrade(){
        if(crystals>=upgradePrice*2){
            switch(wizardUpgradeCounter%3){
                case 0:
                    this.wizardSpellGroup.fireRate = 200 / upgradePrice;
                    this.towerSpellGroup.fireRate = this.wizardSpellGroup.fireRate;
                    break;
                case 1:
                    this.wizardSpellGroup.fireSpeed = 200 + 50*upgradePrice;
                    this.towerSpellGroup.fireSpeed = this.wizardSpellGroup.fireSpeed;
                    break;
                case 2:
                    this.wizardSpellGroup.scl += upgradePrice*0.25;
                    this.towerSpellGroup.scl = this.wizardSpellGroup.scl;
                    break;
            }
            crystals -= upgradePrice*2;
            upgradePrice++;
            wizardUpgradeCounter++;
        }
    }

    // towerUpgrade(){
    //     if(crystals>=upgradePrice*2){
    //         switch(towerUpgradeCounter%3){
    //             case 0:
    //                 this.towerSpellGroup.fireRate = 1000 - 50 * upgradePrice;
    //                 break;
    //             case 1:
    //                 this.towerSpellGroup.fireSpeed = 200 + 50 * upgradePrice;
    //                 break;
    //             case 2:
    //                 this.crystalTower.hp += upgradePrice * 3;
    //                 break;
    //         }
    //         crystals -= upgradePrice*2;
    //         upgradePrice++;
    //         towerUpgradeCounter++;
    //     }
    // }
}