let config = {
    type: Phaser.AUTO,
    width: 1900,
    height: 1050,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Play],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
}

let cursor, keyQ, keyW, keyA, keyS, keyD, keyE, keyR, wizardTimer, towerTimer, waveTimer, waveCounter, crystals, upgradePrice;
let wizardUpgrade = [];
let towerUpgrade = [];
const SC_VAL = 10;
const SC_DAM = 10;

let game = new Phaser.Game(config);