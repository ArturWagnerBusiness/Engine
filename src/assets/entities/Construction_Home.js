class Construction_Home extends Construction {
    constructor(scene) {
        super(scene, CST.CONSTRUCTIONS.HOME.name);
    }
    preload(self) {
        self.load.image(CST.CONSTRUCTIONS.HOME.name, "./assets/images/" + CST.CONSTRUCTIONS.HOME.name + ".png");
    }
    createSpriteBody() {
        var M = Phaser.Physics.Matter.Matter;
        var vectors = [
            { x: 6, y: 32 },
            { x: 90, y: 32 },
            { x: 90, y: 154 },
            { x: 83, y: 160 },
            { x: 64, y: 154 },
            { x: 64, y: 104 },
            { x: 32, y: 104 },
            { x: 32, y: 154 },
            { x: 13, y: 160 },
            { x: 6, y: 154 }
        ];
        var buildingBody = M.Bodies.fromVertices(0, 0, vectors);
        var compoundBody = M.Body.create({
            parts: [
                buildingBody
            ],
            isStatic: true
        });
        compoundBody.position.y -= 18;
        this.sprite = this.scene.matter.add.sprite(0, 0, this.object_name).setExistingBody(compoundBody).setFixedRotation();
    }
    create(self) {
    }
    update(time, delta) {
        this.sprite.depth = this.sprite.y + 64;
    }
}
