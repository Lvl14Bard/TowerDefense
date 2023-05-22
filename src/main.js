/*
Sofia Petrova
Varick Santana
*/


let config = {
    type: Phaser.AUTO,
    width: 1230, //1230x1231
    height: 1231,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Play,Menu],
    physics: {
        default: 'arcade',
        arcade: {
            gravity:{y:0},
            debug: true
        }
    },

}
// create function in config

let game = new Phaser.Game(config);
