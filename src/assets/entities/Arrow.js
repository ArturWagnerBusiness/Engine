class Arrow extends Entity {
    constructor(scene, speed, angle, owner) {
        super();
        console.log(owner);
        this.owner = owner;
        this.object_name = CST.ENTITIES.ARROW.name;
        this.scene = scene;
        this.speed = speed;
        this.angle = angle;
        this.createSpriteBody();
        this.setPosition(this.owner.sprite.x, this.owner.sprite.y);
        this.sprite.rotation = this.angle;
        this.sprite.setVelocityX(Math.cos(this.angle + Math.PI) * this.speed);
        this.sprite.setVelocityY(Math.sin(this.angle + Math.PI) * this.speed);
    }
    preload(self) {
        self.load.spritesheet(CST.ENTITIES.ARROW.name, "./assets/images/" + CST.ENTITIES.ARROW.name + ".png", {
            frameWidth: 32,
            frameHeight: 8
        });
    }
    createSpriteBody() {
        this.sprite = this.scene.matter.add.image(0, 0, CST.ENTITIES.ARROW.name, 0, { isSensor: true, frictionAir: 0, label: this.object_name });
    }
    create() {
    }
    update(time, delta) {
        this.sprite.depth = this.sprite.y + 10;
    }
}
