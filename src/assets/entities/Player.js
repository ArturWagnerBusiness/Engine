class Player extends Entity {
    constructor(scene) {
        super(scene, CST.ENTITIES.PLAYER.name);
        this.scene = scene;
        this.create();
        this.createSpriteBody();
        this.controls = this.scene.input.keyboard.createCursorKeys();
        global_storage.player = this;
        this.loadPlayer(false);
        this.updateDisplay();
    }
    preload(self) {
        self.load.spritesheet(CST.ENTITIES.PLAYER.name, "./assets/images/" + CST.ENTITIES.PLAYER.name + ".png", {
            frameWidth: 32,
            frameHeight: 32
        });
        document.getElementById("Manager");
    }
    updateDisplay() {
        $("#Player>.hp>.bar>.text").html(`${this.data.hp}/${this.data.max_hp}`);
        $("#Player>.hp>.bar>.fill").css("width", Math.round((this.data.hp / this.data.max_hp) * 100) + "%");
        $("#Player>.mana>.bar>.text").html(`${this.data.mana}`);
        $("#Player>.speed>.bar>.text").html(`${this.data.speed}`);
    }
    loadPlayer(force_new) {
        this.data = JSON.parse(localStorage.getItem('dataPlayer'));
        if (this.data === null || force_new) {
            this.data = {
                hp: 100,
                max_hp: 100,
                mana: 100,
                speed: 2,
                last_exit: ""
            };
        }
    }
    savePlayer() {
        localStorage.setItem('dataPlayer', JSON.stringify(this.data));
    }
    createSpriteBody() {
        var M = Phaser.Physics.Matter.Matter;
        var playerBody = M.Bodies.rectangle(0, 0, 26, 32, { chamfer: { radius: 8 } });
        var compoundBody = M.Body.create({
            parts: [
                playerBody
            ],
            label: this.object_name,
            friction: 0,
            restitution: 0
        });
        this.sprite = this.scene.matter.add.sprite(0, 0, this.object_name).setExistingBody(compoundBody).setFixedRotation();
    }
    create() {
        var object_name = CST.ENTITIES.PLAYER.name;
        this.scene.anims.create({
            key: object_name + '_left',
            frames: this.scene.anims.generateFrameNumbers(object_name, { frames: [12, 13, 14, 13] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: object_name + '_right',
            frames: this.scene.anims.generateFrameNumbers(object_name, { frames: [8, 9, 10, 9] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: object_name + '_up',
            frames: this.scene.anims.generateFrameNumbers(object_name, { frames: [16, 17, 18, 17] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: object_name + '_down',
            frames: this.scene.anims.generateFrameNumbers(object_name, { frames: [4, 5, 6, 5] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: object_name + '_idle',
            frames: this.scene.anims.generateFrameNumbers(object_name, { frames: [0, 0, 0, 0, 0, 1, 2, 3, 2, 1] }),
            frameRate: 6,
            repeat: -1
        });
    }
    update(time, delta) {
        this.sprite.depth = this.sprite.y + 10;
        this.updateDisplay();
        this.sprite.setVelocity(0);
        if (this.controls.left.isDown) {
            this.sprite.setVelocityX(-this.data.speed);
        }
        else if (this.controls.right.isDown) {
            this.sprite.setVelocityX(this.data.speed);
        }
        if (this.controls.up.isDown) {
            this.sprite.setVelocityY(-this.data.speed);
        }
        else if (this.controls.down.isDown) {
            this.sprite.setVelocityY(this.data.speed);
        }
        if (this.controls.left.isDown) {
            this.sprite.anims.play(this.object_name + '_left', true);
        }
        else if (this.controls.right.isDown) {
            this.sprite.anims.play(this.object_name + '_right', true);
        }
        else if (this.controls.up.isDown) {
            this.sprite.anims.play(this.object_name + '_up', true);
        }
        else if (this.controls.down.isDown) {
            this.sprite.anims.play(this.object_name + '_down', true);
        }
        else {
            this.sprite.anims.play(this.object_name + '_idle', true);
        }
    }
}
