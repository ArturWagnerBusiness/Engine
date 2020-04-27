class Spawn extends Phaser.Scene {
    constructor() {
        super({ key: CST.SCENES.SPAWN.name });
    }
    preload() {
        CST.ENTITIES.PLAYER.prototype.preload(this);
        CST.ENTITIES.ARROW.prototype.preload(this);
        CST.CONSTRUCTIONS.HOME.prototype.preload(this);
        CST.CONSTRUCTIONS.TREE.prototype.preload(this);
        this.load.image('tiles_outside', './assets/images/terrain.png');
        this.load.tilemapTiledJSON(CST.SCENES.SPAWN.name, "./assets/schematics/" + CST.SCENES.SPAWN.name + ".json");
        this.load.image('tiles_inside', './assets/images/house.png');
        this.load.tilemapTiledJSON(CST.SCENES.SPAWN_HOME.name, "./assets/schematics/" + CST.SCENES.SPAWN_HOME.name + ".json");
    }
    create() {
        this.map = this.make.tilemap({
            key: CST.SCENES.SPAWN.name
        });
        this.tileset = this.map.addTilesetImage(CST.SCENES.SPAWN.name, 'tiles_outside');
        this.below = this.map.createStaticLayer('Below', this.tileset);
        this.below.setCollisionByProperty({ "Collidable": true });
        this.middle = this.map.createDynamicLayer('Middle', this.tileset);
        this.middle.setCollisionByProperty({ "Collidable": true });
        this.matter.world.convertTilemapLayer(this.below);
        this.matter.world.convertTilemapLayer(this.middle);
        this.matter.world.setBounds(this.map.widthInPixels, this.map.heightInPixels);
        this.player = new CST.ENTITIES.PLAYER(this);
        this.house = new CST.CONSTRUCTIONS.HOME(this);
        global_storage.house = this.house;
        this.trees = [];
        global_storage.trees = this.trees;
        this.objects = this.map.getObjectLayer('Objects')['objects'];
        this.objects.forEach(object => {
            if (CST.CONSTRUCTIONS.HOME.name === object.name) {
                this.house.setPosition(object.x, object.y);
            }
            else if (CST.CONSTRUCTIONS.TREE.name === object.name) {
                let tree = new CST.CONSTRUCTIONS.TREE(this);
                tree.setPosition(object.x, object.y);
                this.trees.push(tree);
            }
        });
        this.portals = this.map.getObjectLayer('Portals')['objects'];
        this.portals_objects = [];
        this.portals.forEach(object => {
            this.portals_objects.push(new CST.ENTITIES.PORTAL(this, object.name, object.x, object.y));
        });
        global_storage.portals = this.portals_objects;
        this.spawn_points = this.map.getObjectLayer('SpawnPoints')['objects'];
        var spawn_point_default = { x: -1, y: -1 };
        var spawn_point_different = { x: -1, y: -1 };
        this.spawn_points.forEach((spawn_point) => {
            if (spawn_point.name === "Default") {
                spawn_point_default = { x: spawn_point.x, y: spawn_point.y };
            }
            else if (spawn_point.name === this.player.data.last_exit) {
                spawn_point_different = { x: spawn_point.x, y: spawn_point.y };
            }
        });
        var point = (spawn_point_different.x === -1 || spawn_point_different.y === -1) ? spawn_point_default : spawn_point_different;
        this.player.setPosition(point.x, point.y);
        this.above = this.map.createStaticLayer('Above', this.tileset);
        this.above.depth = 99999;
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.roundPixels = true;
        this.arrows = [];
        global_storage.arrows = this.arrows;
        this.matter.world.on('collisionstart', function (event) {
            for (var i = 0; i < event.pairs.length; i++) {
                var bodyA = getRootBody(event.pairs[i].bodyA);
                var bodyB = getRootBody(event.pairs[i].bodyB);
                global_storage.bodyA = bodyA;
                global_storage.bodyB = bodyB;
                if ((bodyA.label === CST.ENTITIES.PLAYER.name && bodyB.label === "Portal_" + CST.SCENES.SPAWN_HOME.name)
                    || (bodyB.label === "Portal_" + CST.SCENES.SPAWN_HOME.name && bodyA.label === CST.ENTITIES.PLAYER.name)) {
                    loadingScreen(true);
                    this.player.data.last_exit = CST.SCENES.SPAWN.name;
                    this.player.savePlayer();
                    this.scene.start(CST.SCENES.SPAWN_HOME.name);
                }
                else if ((bodyA.label === CST.ENTITIES.ARROW.name || bodyB.label === CST.ENTITIES.ARROW.name) &&
                    !(bodyA.label === CST.ENTITIES.ARROW.name && bodyB.label === CST.ENTITIES.ARROW.name) &&
                    (bodyA.label !== CST.ENTITIES.PLAYER.name && bodyB.label !== CST.ENTITIES.PLAYER.name)) {
                    var arrowBody = (bodyA.label === CST.ENTITIES.ARROW.name) ? bodyA : bodyB;
                    var arrow = arrowBody.gameObject;
                    var hitBody = (bodyA.label === CST.ENTITIES.ARROW.name) ? bodyB : bodyA;
                    var hit = hitBody.gameObject;
                    try {
                        this.matter.world.remove(arrowBody);
                        arrow.destroy();
                    }
                    catch (error) {
                        console.log("ERROR: ", error);
                        return;
                    }
                    this.arrows.forEach(a => {
                        if (a.sprite.scene === undefined) {
                            this.arrows.pop(a);
                        }
                    });
                }
            }
        }, this);
        this.last_regen = 0;
        loadingScreen(false);
        this.doc = document.getElementById("title");
    }
    update(time, delta) {
        if (this.last_regen > 1500) {
            if (this.player.data.hp < this.player.data.max_hp) {
                this.player.data.hp += 1;
            }
            ;
            if (this.player.data.mana < this.player.data.max_mana) {
                this.player.data.mana += 1;
            }
            ;
            this.player.savePlayer();
            this.last_regen -= 1500;
        }
        ;
        this.last_regen += delta;
        this.doc.innerHTML = `Application (${Math.round((16.666 / delta) * 60)})`;
        this.house.update(time, delta);
        this.trees.forEach(tree => {
            tree.update(time, delta);
        });
        this.player.update(time, delta);
    }
}
