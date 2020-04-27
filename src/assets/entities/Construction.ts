abstract class Construction{
    object_name: string;
    scene: Phaser.Scene;
    sprite: Phaser.Physics.Matter.Sprite;
    constructor(scene: Phaser.Scene, object_name: string){
        this.scene = scene;
        this.object_name = object_name;
        this.create(this.scene)
        this.createSpriteBody()
    }
    setPositionTile(x:number,y:number){
        this.sprite.setPosition(x*32+16, y*32+16)
    }
    setPosition(x: number, y: number){
        this.sprite.setPosition(x, y)
    }
    abstract createSpriteBody(): void;
    abstract preload(self: Phaser.Scene, name: string): void;
    abstract create(self: Phaser.Scene): void;
    abstract update(time: any, delta: number):void;

}