class Menu extends Phaser.Scene {
    constructor() {
        super({ key: "menu" });
    }
    preload() {
        Player.prototype.preload(this);
        Arrow.prototype.preload(this);
        this.load.image('tileset', './assets/images/terrain.png');
        this.load.tilemapTiledJSON("village", "./assets/schematics/village.json");
        this.load.audio('bgmusic', ['./assets/audio/bgmusic.mp3']);
    }
    create() {
        localStorage.setItem("currentSave", null);
        $("#overlay").remove();
        $("#content").append(`
        <div id="main-menu">
            <div class="title">Rise of Selior</div>
            <div class="options">
                
            </div>
        </div>
        `);
        this.showMain();
    }
    showMain() {
        $("#main-menu>.options").html(`<div class="play">New Game</div>`);
        if (localStorage.getItem("saveauto") !== null) {
            $("#main-menu>.options").append(`<div class="continue">Continue</div>`);
            $("#main-menu>.options").append(`<div class="saves">Saves</div>`);
        }
        var highscore = parseInt(localStorage.getItem("highscore"));
        highscore = (isNaN(highscore)) ? 0 : highscore;
        $("#main-menu>.options").append(`<div class="highscore">HighScore: ${highscore}</div>`);
        $("#main-menu>.options").append(`<div class="exit">Exit</div>`);
        $("#main-menu>.options>.highscore").click(() => {
            this.highscoreReset();
        });
        $("#main-menu>.options>.play").click(() => {
            this.startNewSave("savenew");
        });
        $("#main-menu>.options>.saves").click(() => {
            this.showSaves();
        });
        $("#main-menu>.options>.exit").click(() => {
            window.closeWindow();
        });
    }
    highscoreReset() {
        var highscore = parseInt(localStorage.getItem("highscore"));
        highscore = (isNaN(highscore)) ? 0 : highscore;
        $("#main-menu>.options").append(``);
        $("#main-menu>.options").html(`
        <div class="highscore">HighScore: ${highscore}</div>
        <div>Do you want to reset it?</div>
        <div class="yes">Yes</div>
        <div class="no">No</div>
        `);
        $("#main-menu>.options>.yes").click(() => {
            localStorage.setItem("highscore", "0");
            this.showMain();
        });
        $("#main-menu>.options>.no").click(() => {
            this.showMain();
        });
    }
    loadSave(save) {
        $("#main-menu").remove();
        this.scene.start("village");
    }
    startNewSave(save) {
        if (save === "savenew" && JSON.parse(localStorage.getItem("saveauto")) !== null) {
            $("#main-menu>.options").html(`
            <h4>This will overwrite Auto Save!</h4>
            <div class="yes">Yes, overwrite</div>
            <div class="no">No, go back</div>
            `);
            $("#main-menu>.options>.yes").click(() => { this.loadSave("savenew"); });
            $("#main-menu>.options>.no").click(() => { this.showSaves(); });
        }
        else {
            this.loadSave(save);
        }
    }
    showSaves() {
        $("#main-menu>.options").html("");
        var saveauto = JSON.parse(localStorage.getItem("saveauto"));
        if (saveauto !== null) {
            $("#main-menu>.options").append(`<div class="saveauto">Load Auto</div>`);
            $("#main-menu>.options>.saveauto").click(() => { this.loadSave("saveauto"); });
            var save = [];
            for (let x = 1; true; x++) {
                save[x] = JSON.parse(localStorage.getItem("save" + x));
                if (save[x] !== null) {
                    $("#main-menu>.options>.save" + x).append(`Save ${x} (${save[x].date})`)
                        .click(() => { this.loadSave("save" + x); });
                }
                else {
                    break;
                }
            }
        }
        $("#main-menu>.options").append(`<div class="back">Go back</div>`);
        $("#main-menu>.options>.back").click(() => { this.showMain(); });
    }
    update() {
    }
}
var GLOBAL_GAME_OBJECT;
$(document).ready(() => {
    GLOBAL_GAME_OBJECT = new Phaser.Game({
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight - 30,
        backgroundColor: "#2D3641",
        parent: "GameSpace",
        scale: {
            mode: Phaser.Scale.RESIZE,
            parent: 'GameSpace',
            width: '100%',
            height: '100%',
            min: {
                width: 1280,
                height: 720
            },
            max: {
                width: 1920,
                height: 1080
            }
        },
        zoom: 1,
        scene: [
            Menu,
            Village
        ],
        physics: {
            default: "matter",
            matter: {
                gravity: { y: 0 },
                debug: false
            }
        },
        render: {
            pixelArt: true,
            antialias: false
        }
    });
});
