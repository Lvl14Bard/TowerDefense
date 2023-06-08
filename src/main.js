let config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Play],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        },
    },
}

let cursor, keyQ, keyW, keyA, keyS, keyD, keyE, keyR, wizardTimer, towerTimer, waveTimer, waveCounter, crystals;
const SC_VAL = 10;
const SC_DAM = 10;

let game = new Phaser.Game(config);