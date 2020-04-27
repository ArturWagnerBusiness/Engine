function loadingScreen(state) {
    document.getElementById("loading").className = state ? "appear" : "disappear";
}
function getRootBody(body) {
    if (body.parent === body) {
        return body;
    }
    while (body.parent !== body) {
        body = body.parent;
    }
    return body;
}
var dragging = false;
class WindowState {
    constructor() {
        this.loadWindow(false);
    }
    loadWindow(force_new) {
        this.data = JSON.parse(localStorage.getItem('dataWindow'));
        if (this.data === null || force_new) {
            this.data = {
                game_zoom: 2,
                manager_width: 300
            };
        }
        GLOBAL_GAME_OBJECT.scale.setZoom(this.data.game_zoom);
        $("#Manager").css("width", this.data.manager_width);
    }
    saveWindow() {
        this.data = {
            game_zoom: GLOBAL_GAME_OBJECT.scale.zoom,
            manager_width: $("#Manager").width()
        };
        localStorage.setItem('dataWindow', JSON.stringify(this.data));
    }
}
$("#Manager .dragbar").mousedown(function (e) {
    e.preventDefault();
    dragging = true;
    var main = $("body");
    var ghostbar = $("<div>", { id: "ghostbar",
        css: { left: 0 }
    }).appendTo("body");
    var dragbar = $("#Manager .dragbar");
    $(document).mousemove(function (e) {
        if ($("#Phaser canvas").innerWidth() > e.pageX) {
            $("#Manager").css("width", (window.innerWidth - $("#Phaser canvas").innerWidth()));
            ghostbar.css("left", $("#Phaser canvas").innerWidth());
        }
        else if (e.pageX > main.outerWidth() - 300) {
            $("#Manager").css("width", (300));
            ghostbar.css("left", main.outerWidth() - 300);
        }
        else {
            $("#Manager").css("width", (window.innerWidth - e.pageX));
            dragbar.css("opacity", 0);
            ghostbar.css("opacity", 1);
            ghostbar.css("left", e.pageX);
        }
    });
});
$(document).mouseup(function (e) {
    if (dragging) {
        if ($("#Phaser canvas").innerWidth() > e.pageX) {
            $("#Manager").css("width", (window.innerWidth - $("#Phaser canvas").innerWidth()));
        }
        else if (e.pageX > $("body").outerWidth() - 300) {
            $("#Manager").css("width", (300));
        }
        else {
            $("#Manager").css("width", (window.innerWidth - e.pageX));
        }
        $("#Manager .dragbar").css("opacity", 1);
        $("#ghostbar").remove();
        $(document).unbind("mousemove");
        windowState.saveWindow();
        dragging = false;
    }
});
var windowState;
var GLOBAL_GAME_OBJECT;
GLOBAL_GAME_OBJECT;
window.onload = () => {
    GLOBAL_GAME_OBJECT = new Phaser.Game({
        type: Phaser.AUTO,
        width: 450,
        height: 320,
        backgroundColor: "#2d2d2d",
        parent: "Phaser",
        zoom: 2,
        scene: [
            CST.SCENES.SPAWN,
            CST.SCENES.SPAWN_HOME
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
    windowState = new WindowState();
    global_storage.game = GLOBAL_GAME_OBJECT;
};
