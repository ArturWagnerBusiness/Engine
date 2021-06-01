class Village extends Phaser.Scene {
    constructor() {
        super({ key: "village" });
    }
    create() {
        this.map = this.make.tilemap({
            key: "village"
        });
        this.bgmusic = this.sound.add('bgmusic', {
            volume: 0.3,
            loop: true
        });
        this.sound.pauseOnBlur = false;
        this.bgmusic.play();
        this.tileset = this.map.addTilesetImage("village", 'tileset');
        this.below = this.map.createStaticLayer('Below', this.tileset);
        this.middle = this.map.createStaticLayer('Middle', this.tileset);
        this.middle.setCollisionByProperty({ "Collidable": true });
        this.matter.world.convertTilemapLayer(this.middle);
        this.tileset_objects = this.map.getObjectLayer('Objects')['objects'];
        this.spawn_points = [];
        for (let index = 0; index < this.tileset_objects.length; index++) {
            const element = this.tileset_objects[index];
            this.spawn_points.push({
                x: element.x,
                y: element.y
            });
        }
        this.object_manager = new Object_manager(this);
        this.above = this.map.createStaticLayer('Above', this.tileset);
        this.above.depth = 50000;
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.object_manager.getPlayer().sprite);
        this.cameras.main.roundPixels = true;
        this.matter.world.on('collisionstart', this.object_manager.collisionHandler, this.object_manager);
        this.scale.on('resize', this.resize, this);
        this.last_goblin = 0;
        this.last_boss = 0;
        this.spawn_interval = 3500;
        this.spawn_interval_reduce_timer = 0;
        this.spawn_attempts = 20;
    }
    update(time, delta) {
        this.object_manager.update(time, delta);
        if (this.object_manager.isPaused) {
            return;
        }
        this.last_goblin += delta;
        this.last_boss += delta;
        var rand;
        this.spawn_interval_reduce_timer += delta;
        if (this.spawn_interval_reduce_timer > 1500 && this.spawn_interval > 50) {
            this.spawn_interval *= 0.95;
            if (this.spawn_interval < 50) {
                this.spawn_interval = 50;
            }
            this.spawn_interval_reduce_timer = 0;
        }
        if (this.last_goblin > this.spawn_interval) {
            this.last_goblin = 0;
            console.log("Spawning minion");
            rand = Math.random();
            rand *= 50 / this.spawn_interval;
            var position = this.spawn_points[Math.floor(this.tileset_objects.length * Math.random())];
            for (let index = 0; index < this.spawn_attempts; index++) {
                if (600 < Phaser.Math.Distance.Between(position.x, position.y, this.object_manager.player.sprite.x, this.object_manager.player.sprite.y)) {
                    this.object_manager.summonGoblin(10 + Math.floor(rand * 200), 3 - rand * 1.5, position.x, position.y, 25);
                    return;
                }
            }
        }
        if (this.last_boss > 10000 + this.spawn_interval * 10) {
            this.last_boss = 0;
            console.log("Spawning boss");
            rand = Math.random();
            rand *= 50 / this.spawn_interval;
            var position = this.spawn_points[Math.floor(this.tileset_objects.length * Math.random())];
            for (let index = 0; index < this.spawn_attempts; index++) {
                if (600 < Phaser.Math.Distance.Between(position.x, position.y, this.object_manager.player.sprite.x, this.object_manager.player.sprite.y)) {
                    this.object_manager.summonBoss(500 + Math.floor(rand * 500), 0.3 - rand * 0.5, position.x, position.y, 300 + Math.floor(rand * 300));
                    return;
                }
            }
        }
    }
    startscene(name) {
        this.bgmusic.stop();
        this.scene.start(name);
    }
    resize(gameSize, baseSize, displaySize, resolution) {
        var width = gameSize.width;
        var height = gameSize.height;
        this.cameras.resize(width, height);
    }
}
