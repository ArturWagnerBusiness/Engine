class Entity {
    constructor() {
    }
    setPositionTile(x, y) {
        this.sprite.setPosition(x * 32 + 16, y * 32 + 16);
    }
    setPosition(x, y) {
        this.sprite.setPosition(x, y);
    }
}
