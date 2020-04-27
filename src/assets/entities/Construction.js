class Construction {
    constructor(scene, object_name) {
        this.scene = scene;
        this.object_name = object_name;
        this.create(this.scene);
        this.createSpriteBody();
    }
    setPositionTile(x, y) {
        this.sprite.setPosition(x * 32 + 16, y * 32 + 16);
    }
    setPosition(x, y) {
        this.sprite.setPosition(x, y);
    }
}
