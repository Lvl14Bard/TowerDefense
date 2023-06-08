class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }

    preload(){
        //load character image
        this.load.image('player', './assets/wizard.png');
        //load map image
        this.load.image('map', './assets/map.png');
        //load crawler image
        this.load.image('crawler', './assets/crawler.png');
        //load crystal tower image
        this.load.image('crystalTower', './assets/crystalTower.png');
        //load mouse image
        this.load.image('mouse', './assets/rocket.png');
        this.load.image('WizardSpell', './assets/WizardSpell.png');
    }

    create(){
        //init some vars
        crystals = 0;
        waveTimer = 6000;
        waveCounter = 1;

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

        //initialize timers
        wizardTimer = this.wizardSpellGroup.fireRate;
        towerTimer = this.towerSpellGroup.fireRate;

        //collision decision
        this.player.body.collideWorldBounds = true;
        this.crystalTower.body.immovable = true;
        this.player.body.onCollide = true;
        this.crystalTower.onCollide = true;

        //spell destroys crawler and self. Adds crystal
        this.physics.add.collider(this.wizardSpellGroup, this.crawlerGroup, (wizSpell, crawler) => {
            wizSpell.destroy(true);
            crawler.destroy(true);
            crystals++;
        });

        //spell destorys super crawler and self. Adds crystal
        this.physics.add.collider(this.wizardSpellGroup, this.superCrawlerGroup, (wizSpell, superCrawler) => {
            wizSpell.destroy(true);
            superCrawler.destroy(true);
            //this.crystals += SC_VAL;
        });

        //spell destroys crawler and self. Adds crystal
        this.physics.add.collider(this.towerSpellGroup, this.crawlerGroup, (towSpell, crawler) => {
            towSpell.destroy(true);
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
        this.physics.add.collider(this.crystalTower, this.crawlerGroup, (xxx, crawler) => {
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
        this.physics.add.collider(this.player, this.crawlerGroup, (xxx, crawler) => {
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
        this.physics.add.collider(this.crystalTower, this.wizardSpellGroup);

        //input events
        this.input.on('pointerdown', (pointer) => {
            if(wizardTimer>0) return;
            this.mouse.copyPosition(pointer);
            this.fireWizardSpell(this.mouse);
            wizardTimer = this.wizardSpellGroup.fireRate;
        })


    }

    update(time, delta){

        //timers
        if(delta >= 1){
            wizardTimer--;
            towerTimer--;
            waveTimer--;
            console.log(crystals);
        }

        //enemy wave spawner
        if(waveTimer%100==0){
            for(let i = waveCounter; i > 0; i--){
                let temp = this.spawnCircle();
                this.crawlerGroup.create().setX(temp[0]).setY(temp[1]);
                let last = this.crawlerGroup.getChildren().length-1;
                this.physics.moveToObject(this.crawlerGroup.getChildren()[last], this.crystalTower, this.crawlerGroup.moveSpeed);
            }
        }

        if(waveTimer%3000==0){
            waveCounter++;
        }

        //player movement
        this.direction = new Phaser.Math.Vector2(0);

        if(keyA.isDown)
        {
            this.direction.x = -1;
        }
        else if (keyD.isDown)
        {
            this.direction.x = 1;
        }

        if (keyW.isDown)
        {
            this.direction.y = -1;
        }
        else if (keyS.isDown)
        {
            this.direction.y = 1;
        }
        this.direction.normalize();
        this.player.setVelocity(this.direction.x * this.player.moveSpeed, this.direction.y * this.player.moveSpeed);

        //CT attacks
        if(towerTimer<0 && this.crawlerGroup.countActive(true)){
            this.fireTowerSpell();
            towerTimer = this.towerSpellGroup.fireRate;
        }
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
}