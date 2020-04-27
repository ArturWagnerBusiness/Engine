class Portal{
    sprite: Phaser.Physics.Matter.Sprite;
    constructor(scene: Phaser.Scene, portal_name: string, x: any, y: any){
        //@ts-ignore
        var M: typeof Matter = Phaser.Physics.Matter.Matter;

        console.log(x, y)
        var playerBody = M.Bodies.rectangle(0, 0, 32, 32, { isSensor: true, chamfer: { radius: 8 } });

        var compoundBody = M.Body.create({
            parts: [
                playerBody
            ],
            label: "Portal_"+portal_name,
            friction: 0,
            restitution: 0 
            
        });

        //@ts-ignore
        this.sprite = scene.matter.add.sprite(0,0, null).setExistingBody(compoundBody).setFixedRotation();

        this.sprite.visible = false;
        this.sprite.x = x;
        this.sprite.y = y;
        
    }

}