class Dropdowns {
    constructor() {
        this.back_to_menu = false;
    }
    showOptions() {
        $("#dropdown-options").remove();
        this.object_manager.pause();
        $("#content").append(`
<div style="left:0px; top: 30px;"id="dropdown-options" class="drag-element shrink">
    <div class="drag-header">
        <div class="title">Options</div>
        <div class="minimise"></div>
        <div class="close"></div>
    </div>
    <div class="content">
        <div class="player-hp"><div class="fill"></div><div class="text"></div></div>
` +
            `       <div class="gold"></div>
        <div class="highscore"></div>
        <div class="togglemusic">Toggle Music</div>
        <div class="togglesound">Toggle Hitsounds</div>
        <div class="zoom-in">Zoom+</div>
        <div class="zoom-out">Zoom-</div>
        <div class="back-to-menu">Back to Menu</div>
    </div>
</div>
`);
        $("#dropdown-options .content .zoom-in").click(() => {
            if (this.object_manager.scene.cameras.main.zoom < 3) {
                this.object_manager.scene.cameras.main.zoom += 0.1;
            }
        });
        $("#dropdown-options .content .zoom-out").click(() => {
            if (this.object_manager.scene.cameras.main.zoom > 0.5) {
                this.object_manager.scene.cameras.main.zoom -= 0.1;
            }
        });
        $("#dropdown-options .content .togglemusic").click(() => {
            if (this.object_manager.scene.bgmusic.isPlaying) {
                this.object_manager.scene.bgmusic.stop();
            }
            else {
                this.object_manager.scene.bgmusic.play();
            }
        });
        $("#dropdown-options .content .togglesound").click(() => {
            this.object_manager.toggleArrowSounds();
        });
        $("#dropdown-options .content .back-to-menu").click(() => {
            $("#dropdown-options").remove();
            this.object_manager.scene.startscene("menu");
        });
        $("#dropdown-options .drag-header .minimise").click(() => {
            var x = $("#dropdown-options");
            x.toggleClass("expand");
            x.toggleClass("shrink");
        });
        $("#dropdown-options .drag-header .close").click(() => {
            $("#dropdown-options").remove();
            this.object_manager.unpause();
        });
        dragElement(document.getElementById("dropdown-options"));
    }
    update(time, delta) {
        $(".player-hp").html("HP: " + this.object_manager.player.data.hp + "/" + this.object_manager.player.data.max_hp);
        $(".highscore").html("HighScore: " + this.object_manager.highscore);
        $(".gold").html("Gold: " + this.object_manager.player.data.gold);
    }
}
const dropdowns = new Dropdowns();
