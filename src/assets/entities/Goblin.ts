class Goblin extends Entity{
    scene: Phaser.Scene;
    sprite: Phaser.Physics.Matter.Sprite;
    data: {
        hp: number;
        max_hp: number;
        mana: number;
        speed: number;
    }
    constructor(scene: Phaser.Scene){
        super(scene, CST.ENTITIES.GOBLIN.name); // NAME
        this.scene = scene;
        this.create(this.scene);
        this.createSpriteBody()
        
        this.data = {
            hp: 10,
            max_hp: 10,
            mana: 0,
            speed: 1
        }
    }
    createSpriteBody(){
        //@ts-ignore
        var M: typeof Matter = Phaser.Physics.Matter.Matter;

        var playerBody = M.Bodies.rectangle(0, 0, 16, 8, { chamfer: { radius: 5 } });
        playerBody.position.y += 4;
        var compoundBody = M.Body.create({
            parts: [
                playerBody
            ],
            label: this.object_name,
            friction: 0,
            restitution: 0 
            
        });

        //@ts-ignore
        this.sprite = this.scene.matter.add.sprite(0,0, this.object_name).setExistingBody(compoundBody).setFixedRotation();
    }
    preload(self: Phaser.Scene){

        var object_name = CST.ENTITIES.GOBLIN.name

        self.load.spritesheet(object_name, "./assets/images/human.png", {
            frameWidth: 32,
            frameHeight: 32
        });
    }
    create(self: Phaser.Scene){

        var object_name = CST.ENTITIES.GOBLIN.name

        self.anims.create({
            key: object_name+'_idle',
            frames: self.anims.generateFrameNumbers(object_name, { frames: [0, 1, 2, 1] }),
            frameRate: 4,
            repeat: -1
        });
    }
    update(time: any, delta: number) {
        this.sprite.setVelocity(0);
        // Horizontal movement

        this.sprite.anims.play(this.object_name+'_idle', true);
    }

}