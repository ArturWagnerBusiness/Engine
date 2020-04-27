class Construction_Tree extends Construction {
    constructor(scene) {
        super(scene, CST.CONSTRUCTIONS.TREE.name);
    }
    preload(self) {
        self.load.image(CST.CONSTRUCTIONS.TREE.name, "./assets/images/" + CST.CONSTRUCTIONS.TREE.name + ".png");
    }
    createSpriteBody() {
        var M = Phaser.Physics.Matter.Matter;
        var buildingBody = M.Bodies.rectangle(0, 0, 32, 20, { chamfer: { radius: 8 } });
        var compoundBody = M.Body.create({
            parts: [
                buildingBody
            ],
            isStatic: true
        });
        compoundBody.position.y -= 50;
        this.sprite = this.scene.matter.add.sprite(0, 0, this.object_name).setExistingBody(compoundBody).setFixedRotation();
    }
    create(self) {
    }
    update(time, delta) {
        this.sprite.depth = this.sprite.y + 50;
    }
}
