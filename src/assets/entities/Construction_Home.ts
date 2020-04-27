

class Construction_Home extends Construction{
    x: number;
    y: number;
    preload(self: Phaser.Scene){
        self.load.image(CST.CONSTRUCTIONS.HOME.name, "./assets/images/"+CST.CONSTRUCTIONS.HOME.name+".png");
    }
    constructor(scene: Phaser.Scene) {
        super(scene, CST.CONSTRUCTIONS.HOME.name)
    }
    createSpriteBody(){
        
        //@ts-ignore
        var M: typeof Matter = Phaser.Physics.Matter.Matter;

        var vectors: any = [
            {x: 6, y: 32},
            {x: 90, y: 32},
            {x: 90, y: 154},
            {x: 83, y: 160},
            {x: 64, y: 154},
            {x: 64, y: 104},
            {x: 32, y: 104},
            {x: 32, y: 154},
            {x: 13, y: 160},
            {x: 6, y: 154}
        ]
        var buildingBody = M.Bodies.fromVertices(0, 0, vectors);

        

        var compoundBody = M.Body.create({
            parts: [
                buildingBody
            ],
            isStatic: true
        });
        compoundBody.position.y -= 18;
        //@ts-ignore
        this.sprite = this.scene.matter.add.sprite(0, 0, this.object_name).setExistingBody(compoundBody).setFixedRotation();

    }
    create(self: Phaser.Scene){

    }
    update(time: any, delta: number){
        this.sprite.depth = this.sprite.y+64;
    }
}