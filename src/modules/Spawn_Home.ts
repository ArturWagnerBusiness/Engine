class Spawn_Home extends Phaser.Scene{
    map: Phaser.Tilemaps.Tilemap;
    tileset: Phaser.Tilemaps.Tileset;
    below: Phaser.Tilemaps.StaticTilemapLayer;
    middle: Phaser.Tilemaps.DynamicTilemapLayer;
    player: Player;
    objects: Phaser.Types.Tilemaps.TiledObject[];
    portals: Phaser.Types.Tilemaps.TiledObject[];
    portals_objects: any[];
    spawn_points: Phaser.Types.Tilemaps.TiledObject[];
    above: Phaser.Tilemaps.StaticTilemapLayer;
    last_regen: number;
    doc: HTMLElement;
    arrows: any[];

    constructor(){
        super({key: CST.SCENES.SPAWN_HOME.name});
    }

    create(){
        this.map = this.make.tilemap({
            key: CST.SCENES.SPAWN_HOME.name
        });
        this.tileset = this.map.addTilesetImage(CST.SCENES.SPAWN_HOME.name, 'tiles_inside');

        this.below = this.map.createStaticLayer('Below', this.tileset);
        this.below.setCollisionByProperty({"Collidable": true})
        this.middle = this.map.createDynamicLayer('Middle', this.tileset);
        this.middle.setCollisionByProperty({"Collidable": true})

        // Load layers to matter
        this.matter.world.convertTilemapLayer(this.below);
        this.matter.world.convertTilemapLayer(this.middle);

        this.matter.world.setBounds(this.map.widthInPixels, this.map.heightInPixels);
        
        this.player = new CST.ENTITIES.PLAYER(this);

        // Load Objects     >>> (W.I.P) <<<
        this.objects = this.map.getObjectLayer('Objects')['objects'];
        this.objects.forEach(object => {
            
        });
        
        this.portals = this.map.getObjectLayer('Portals')['objects'];
        this.portals_objects = []; 
        this.portals.forEach(object => {
            this.portals_objects.push(new CST.ENTITIES.PORTAL(this, object.name, object.x, object.y))
        });

        global_storage.portals = this.portals_objects;
        
        this.spawn_points = this.map.getObjectLayer('SpawnPoints')['objects'];
        var spawn_point_default   = {x: -1, y: -1};
        var spawn_point_different = {x: -1, y: -1};
        this.spawn_points.forEach((spawn_point) => {
            console.log(spawn_point.name, this.player.data.last_exit);
            if(spawn_point.name==="Default"){spawn_point_default={x: spawn_point.x, y: spawn_point.y}}
            else if(spawn_point.name===this.player.data.last_exit){spawn_point_different={x: spawn_point.x, y: spawn_point.y}}
        });
        var point = (spawn_point_different.x===-1||spawn_point_different.y===-1) ? spawn_point_default : spawn_point_different;

        this.player.setPosition(point.x, point.y);

        // Set Above Layer
        this.above = this.map.createStaticLayer('Above', this.tileset);
        this.above.depth = 99999;

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.roundPixels = true;

        this.arrows = [];
        global_storage.arrows = this.arrows;

        this.matter.world.on('collisionstart', function (event: Phaser.Physics.Matter.Events.CollisionStartEvent) {
            for (var i = 0; i < event.pairs.length; i++) {
                var bodyA = getRootBody(event.pairs[i].bodyA);
                var bodyB = getRootBody(event.pairs[i].bodyB);
                global_storage.bodyA = bodyA;
                global_storage.bodyB = bodyB;
                if ((bodyA.label === CST.ENTITIES.PLAYER.name && bodyB.label === "Portal_"+CST.SCENES.SPAWN.name)
                 || (bodyB.label === "Portal_"+CST.SCENES.SPAWN.name && bodyA.label === CST.ENTITIES.PLAYER.name)){
                    
                    loadingScreen(true);
                    this.player.data.last_exit = CST.SCENES.SPAWN_HOME.name;
                    this.player.savePlayer();
                    this.scene.start(CST.SCENES.SPAWN.name);
                }
                else if ((bodyA.label === CST.ENTITIES.ARROW.name || bodyB.label === CST.ENTITIES.ARROW.name)&&
                        !(bodyA.label === CST.ENTITIES.ARROW.name && bodyB.label === CST.ENTITIES.ARROW.name)&&
                         (bodyA.label !== CST.ENTITIES.PLAYER.name && bodyB.label !== CST.ENTITIES.PLAYER.name)){
                    var arrowBody = (bodyA.label === CST.ENTITIES.ARROW.name)? bodyA : bodyB;
                    var arrow = arrowBody.gameObject;
                    var hitBody = (bodyA.label === CST.ENTITIES.ARROW.name)? bodyB : bodyA;
                    var hit = hitBody.gameObject;

                    try {
                        this.matter.world.remove(arrowBody);
                        arrow.destroy();
                    } catch (error) {
                        console.log("ERROR: ", error) // 2 objects reacted to the interraction! Ignoring the 2nd one.
                        return
                    }


                    //@ts-ignore
                    this.arrows.forEach(a => {
                        //@ts-ignore
                        if(a.sprite.scene === undefined){
                            //@ts-ignore
                            this.arrows.pop(a);
                        }
                    });
                }
            }
        }, this);

        loadingScreen(false);
        this.last_regen = 0;
        
        this.doc = document.getElementById("title");
    }
    update(time: any, delta: number){

        if(this.last_regen>100){
            if(this.player.data.hp<this.player.data.max_hp){
                this.player.data.hp+=1
            };
            if(this.player.data.mana<this.player.data.max_mana){
                this.player.data.mana+=1
            };
            this.player.savePlayer();
            this.last_regen-=100;
        };
        this.last_regen+=delta;
        
        this.doc.innerHTML = `Application (${Math.round((16.666/delta)*60)})`;

        this.player.update(time, delta);
    }
}