

class Construction_Tree extends Construction{
    x: number;
    y: number;
    preload(self: Phaser.Scene){
        self.load.image(CST.CONSTRUCTIONS.TREE.name, "./assets/images/"+CST.CONSTRUCTIONS.TREE.name+".png");
    }
    constructor(scene: Phaser.Scene) {
        super(scene, CST.CONSTRUCTIONS.TREE.name)
    }
    createSpriteBody(){
        
        //@ts-ignore
        var M: typeof Matter = Phaser.Physics.Matter.Matter;

        
        var buildingBody = M.Bodies.rectangle(0,0, 32, 20,  { chamfer: { radius: 8 } });

        

        var compoundBody = M.Body.create({
            parts: [
                buildingBody
            ],
            isStatic: true
        });
        compoundBody.position.y -= 50;
        //@ts-ignore
        this.sprite = this.scene.matter.add.sprite(0, 0, this.object_name).setExistingBody(compoundBody).setFixedRotation();

    }
    create(self: Phaser.Scene){

    }
    update(time: any, delta: number){
        this.sprite.depth = this.sprite.y+50;
    }
}