function getRootBody(body) {
    if (body.parent === body) {
        return body;
    }
    while (body.parent !== body) {
        body = body.parent;
    }
    return body;
}
class Object_manager {
    constructor(scene) {
        this.highscore = parseInt(localStorage.getItem("highscore"));
        this.highscore = (isNaN(this.highscore)) ? 0 : this.highscore;
        dropdowns.object_manager = this;
        this.scene = scene;
        this.isPaused = false;
        this.objects = [];
        this.arrows = [];
        this.goblins = [];
        this.boss = [];
        this.objects.push(new Player(this.scene));
        this.player = this.objects[this.objects.length - 1];
        for (let index = 0; index < 500; index++) {
            this.objects.push(new Arrow(this.scene, index));
            this.arrows.push(this.objects[this.objects.length - 1]);
        }
        for (let index = 0; index < 300; index++) {
            this.objects.push(new Goblin(this.scene, index));
            this.goblins.push(this.objects[this.objects.length - 1]);
        }
        for (let index = 0; index < 50; index++) {
            this.objects.push(new Boss(this.scene, index));
            this.boss.push(this.objects[this.objects.length - 1]);
        }
        this.ignoreObjectLabels = [];
        $("#content").append(`
<div id="overlay" style="color: black;pointer-events: none; position: absolute; width: 100%; height: 50%; top: 30px">
<div class="hp-bar" style="pointer-events: none; width: 100%; height: 30px; top: 30px; position: fixed; background-color:black;"></div>
<div class="highscore" style="pointer-events: none; position: fixed; top: 70px; left: 5px;"></div>
<div class="score" style="pointer-events: none;position: fixed; top: 100px; left: 5px;"></div>
<div class="reload" style="pointer-events: none;position: fixed; top: 130px; left: 5px;"></div>
<div class="arrows" style="pointer-events: none;position: fixed; top: 160px; left: 5px;"></div>
</div>
`);
    }
    collisionHandler(event) {
        for (var i = 0; i < event.pairs.length; i++) {
            var bodyA = getRootBody(event.pairs[i].bodyA);
            var bodyB = getRootBody(event.pairs[i].bodyB);
            var spriteA = bodyA.gameObject;
            var spriteB = bodyB.gameObject;
            var objectA = bodyA.label;
            if (this.ignoreObjectLabels.includes(objectA)) {
                pairs_found++;
            }
            var objectB = bodyB.label;
            if (this.ignoreObjectLabels.includes(objectB)) {
                pairs_found++;
            }
            var pairs_found = 0;
            if (pairs_found < 2) {
                for (let index = 0; index < this.objects.length; index++) {
                    const element = this.objects[index];
                    if (element.sprite === spriteA) {
                        objectA = element;
                        if (++pairs_found > 1) {
                            break;
                        }
                    }
                    else if (element.sprite === spriteB) {
                        objectB = element;
                        if (++pairs_found > 1) {
                            break;
                        }
                    }
                }
            }
            if (typeof objectA !== "string") {
                objectA.collision(objectB);
            }
            if (typeof objectB !== "string") {
                objectB.collision(objectA);
            }
        }
    }
    pause() {
        this.isPaused = true;
        for (let index = 0; index < this.objects.length; index++) {
            const iterator = this.objects[index];
            if (iterator.name === "arrow" || iterator.name === "goblin" || iterator.name === "boss") {
                if (iterator.reusable) {
                    continue;
                }
            }
            iterator.pause();
        }
    }
    unpause() {
        this.isPaused = false;
        for (let index = 0; index < this.objects.length; index++) {
            const iterator = this.objects[index];
            if (iterator.name === "arrow" || iterator.name === "goblin" || iterator.name === "boss") {
                if (iterator.reusable) {
                    continue;
                }
            }
            iterator.unpause();
        }
    }
    fireProjectileArrow(angle, speed, owner, dmg, ignore, lifespan) {
        for (let index = 0; index < this.arrows.length; index++) {
            const arrow = this.arrows[index];
            if (arrow.reusable) {
                arrow.fire(angle, speed, owner, dmg, ignore, lifespan);
                return;
            }
        }
    }
    toggleArrowSounds() {
        for (let index = 0; index < this.arrows.length; index++) {
            const arrow = this.arrows[index];
            arrow.muted = !arrow.muted;
        }
    }
    summonGoblin(hp, speed, x, y, reward) {
        for (let index = 0; index < this.goblins.length; index++) {
            const goblin = this.goblins[index];
            if (goblin.reusable) {
                goblin.summon(hp, speed, x, y, reward);
                return;
            }
        }
    }
    summonBoss(hp, speed, x, y, reward) {
        for (let index = 0; index < this.boss.length; index++) {
            const boss = this.boss[index];
            if (boss.reusable) {
                boss.summon(hp, speed, x, y, reward);
                return;
            }
        }
    }
    getPlayer() {
        return this.player;
    }
    getEntityBySprite(sprite) {
        for (let index = 0; index < this.objects.length; index++) {
            const element = this.objects[index];
            if (element.sprite === sprite) {
                return element;
            }
        }
        return undefined;
    }
    getEntities() {
        return this.objects;
    }
    loadData() {
        var save = JSON.parse(localStorage.getItem("currentSave"));
        var data;
        if (save = "savenew") {
            data = {};
        }
        else {
            data = JSON.parse(localStorage.getItem(save));
        }
    }
    saveData() {
        throw new Error("Method not implemented.");
    }
    update(time, delta) {
        if (this.player.data.gold > this.highscore) {
            localStorage.setItem("highscore", this.player.data.gold);
            this.highscore = this.player.data.gold;
        }
        if (this.player.data.hp <= 0) {
            this.scene.startscene("menu");
        }
        var color = "#00ff00";
        if (this.player.data.hp / this.player.data.max_hp < 0.25) {
            var color = "#ff0000";
        }
        else if (this.player.data.hp / this.player.data.max_hp < 0.5) {
            var color = "#ffaa00";
        }
        $("#overlay .hp-bar").html(`
<div style="position: absolute: left:0px;top:0px;background-color:${color};height: 100%; width:${100 * this.player.data.hp / this.player.data.max_hp}%"></div>
`);
        $("#overlay .highscore").html("Highscore: " + this.highscore);
        $("#overlay .score").html("Score: " + this.player.data.gold);
        $("#overlay .reload").html("Arrows: " + this.player.arrows);
        $("#overlay .arrows").html("Reload: 0." + Math.floor(this.player.cooldown) + "s");
        dropdowns.update(time, delta);
        if (!this.isPaused) {
            for (let index = 0; index < this.objects.length; index++) {
                const iterator = this.objects[index];
                if (iterator.name === "arrow" || iterator.name === "goblin" || iterator.name === "boss") {
                    if (iterator.reusable) {
                        continue;
                    }
                }
                iterator.update(time, delta);
            }
        }
    }
}
