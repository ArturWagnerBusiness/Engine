class Player extends Entity {
    constructor(scene) {
        super();
        this.object_name = CST.ENTITIES.PLAYER.name;
        this.last_shot = 0;
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
        $("#Player>.mana>.bar>.text").html(`${this.data.mana}/${this.data.max_mana}`);
        $("#Player>.mana>.bar>.fill").css("width", Math.round((this.data.mana / this.data.max_mana) * 100) + "%");
        $("#Player>.speed>.bar>.text").html(`${this.data.speed}`);
    }
    loadPlayer(force_new) {
        this.data = JSON.parse(localStorage.getItem('dataPlayer'));
        if (this.data === null || force_new) {
            this.data = {
                hp: 100,
                max_hp: 100,
                mana: 100,
                max_mana: 100,
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
        this.scene.input.on('pointerdown', () => {
            this.click();
        }, this);
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
    click() {
        if (this.last_shot > 250 && this.data.mana >= 5) {
            this.data.mana -= 5;
            this.shot(5, 0);
            this.savePlayer();
            this.last_shot = 0;
        }
        ;
    }
    shot(speed, angleOffset) {
        const crosshairX = this.scene.input.mousePointer.x + this.scene.cameras.main.worldView.x;
        const crosshairY = this.scene.input.mousePointer.y + this.scene.cameras.main.worldView.y;
        var rotation = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, crosshairX, crosshairY) + Math.PI;
        this.scene.arrows.push(new CST.ENTITIES.ARROW(this.scene, speed, rotation + angleOffset, this));
        this.last_shot = 0;
    }
    update(time, delta) {
        this.sprite.depth = this.sprite.y + 10;
        this.last_shot += delta;
        this.updateDisplay();
        if (this.controls.space.isDown) {
            if (this.last_shot > 1000 && this.data.mana >= 20) {
                this.data.mana -= 20;
                this.shot(5, 0);
                this.shot(5, -0.3);
                this.shot(5, 0.3);
                this.savePlayer();
            }
            ;
        }
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
