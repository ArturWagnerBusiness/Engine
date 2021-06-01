class Player {
    constructor(scene, data) {
        this.name = "player";
        this.last_shot = 0;
        this.arrows = 1;
        this.scene = scene;
        this.esc_pressed = false;
        this.data = data;
        this.createSpriteBody();
        this.createSpriteAnimations();
        this.setPositionTile(30, 30);
        this.cooldown = 0;
        this.controls = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            esc: Phaser.Input.Keyboard.KeyCodes.ESC
        });
        this.healthbar = this.scene.add.graphics();
        this.loadPlayerData();
    }
    preload(self) {
        self.load.spritesheet("player", "./assets/images/player.png", {
            frameWidth: 32,
            frameHeight: 32
        });
    }
    setPositionTile(x, y) {
        this.sprite.setPosition(x * 32 + 16, y * 32 + 16);
    }
    setPosition(x, y) {
        this.sprite.setPosition(x, y);
    }
    loadPlayerData() {
        if (this.data === undefined) {
            this.data = {
                hp: 250,
                max_hp: 250,
                mana: 100,
                max_mana: 100,
                speed: 4,
                gold: 0,
                location_current: "village",
                location_last: "village"
            };
        }
    }
    save() {
        return this.data;
    }
    createSpriteBody() {
        var M = Phaser.Physics.Matter.Matter;
        var playerBody = M.Bodies.rectangle(0, 0, 26, 32, { chamfer: { radius: 12 } });
        this.compoundBody = M.Body.create({
            parts: [
                playerBody
            ],
            label: this.name,
            friction: 0,
            restitution: 0
        });
        this.sprite = this.scene.matter.add.sprite(0, 0, this.object_name).setExistingBody(this.compoundBody).setFixedRotation();
    }
    createSpriteAnimations() {
        this.scene.anims.create({
            key: this.name + '_left',
            frames: this.scene.anims.generateFrameNumbers(this.name, { frames: [12, 13, 14, 13] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: this.name + '_right',
            frames: this.scene.anims.generateFrameNumbers(this.name, { frames: [8, 9, 10, 9] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: this.name + '_up',
            frames: this.scene.anims.generateFrameNumbers(this.name, { frames: [16, 17, 18, 17] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: this.name + '_down',
            frames: this.scene.anims.generateFrameNumbers(this.name, { frames: [4, 5, 6, 5] }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: this.name + '_idle',
            frames: this.scene.anims.generateFrameNumbers(this.name, { frames: [0, 0, 0, 0, 0, 1, 2, 3, 2, 1] }),
            frameRate: 6,
            repeat: -1
        });
    }
    killed(entity) {
        this.data.gold += entity.data.reward;
    }
    collision(entity) {
        if (entity.name === "arrow") {
            if (entity.owner !== this) {
                this.data.hp -= entity.dmg;
            }
        }
    }
    pause() {
        this.sprite.setStatic(true);
    }
    unpause() {
        this.sprite.setStatic(false);
    }
    shot(speed, angleOffset, dmg) {
        const crosshairX = this.scene.input.mousePointer.x / this.scene.cameras.main.zoom + this.scene.cameras.main.worldView.x;
        const crosshairY = this.scene.input.mousePointer.y / this.scene.cameras.main.zoom + this.scene.cameras.main.worldView.y;
        var rotation = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, crosshairX, crosshairY) + Math.PI;
        this.scene.object_manager.fireProjectileArrow(rotation + angleOffset, speed, this, dmg, ["player", "arrow"], 1000);
        this.last_shot = 0;
    }
    update(time, delta) {
        this.sprite.depth = this.sprite.y + 16;
        this.last_shot += delta;
        var speed = this.data.speed * (delta / 16);
        if (this.controls.esc.isDown && !this.esc_pressed) {
            dropdowns.showOptions();
            this.esc_pressed = true;
        }
        else if (!this.controls.esc.isDown && this.esc_pressed) {
            this.esc_pressed = false;
        }
        this.cooldown = 750 - this.data.gold / 5;
        this.cooldown = (this.cooldown < 100) ? 100 : this.cooldown;
        if (this.controls.space.isDown) {
            if (this.last_shot > this.cooldown) {
                if (this.data.gold < 100) {
                    this.shot(8, 0, 5);
                }
                else if (this.data.gold < 200) {
                    this.arrows = 2;
                    this.shot(9, -0.05, 5);
                    this.shot(9, 0.05, 5);
                }
                else if (this.data.gold < 400) {
                    this.arrows = 3;
                    this.shot(9, -0.1, 5);
                    this.shot(10, 0, 6);
                    this.shot(9, 0.1, 5);
                }
                else if (this.data.gold < 600) {
                    this.arrows = 4;
                    this.shot(10, -0.2, 6);
                    this.shot(11, -0.05, 7);
                    this.shot(11, 0.05, 7);
                    this.shot(10, 0.2, 6);
                }
                else if (this.data.gold < 1000) {
                    this.arrows = 5;
                    this.shot(10, -0.2, 6);
                    this.shot(12, -0.1, 7);
                    this.shot(13, 0, 8);
                    this.shot(12, 0.1, 7);
                    this.shot(10, 0.2, 6);
                }
                else if (this.data.gold < 1400) {
                    this.arrows = 6;
                    this.shot(10, -0.4, 7);
                    this.shot(12, -0.2, 8);
                    this.shot(13, -0.05, 9);
                    this.shot(13, 0.05, 9);
                    this.shot(12, 0.2, 8);
                    this.shot(10, 0.4, 7);
                }
                else if (this.data.gold < 1700) {
                    this.arrows = 7;
                    this.shot(10, -0.4, 7);
                    this.shot(12, -0.2, 8);
                    this.shot(14, -0.1, 9);
                    this.shot(15, 0, 10);
                    this.shot(14, 0.1, 9);
                    this.shot(12, 0.2, 8);
                    this.shot(10, 0.4, 7);
                }
                else if (this.data.gold < 2000) {
                    this.arrows = 8;
                    this.shot(10, -0.4, 8);
                    this.shot(12, -0.2, 9);
                    this.shot(14, -0.1, 10);
                    this.shot(15, -0.05, 11);
                    this.shot(15, 0.05, 11);
                    this.shot(14, 0.1, 10);
                    this.shot(12, 0.2, 9);
                    this.shot(10, 0.4, 8);
                }
                else if (this.data.gold < 2400) {
                    this.arrows = 9;
                    this.shot(10, -0.4, 8);
                    this.shot(12, -0.2, 9);
                    this.shot(14, -0.1, 10);
                    this.shot(15, -0.05, 11);
                    this.shot(16, 0, 12);
                    this.shot(15, 0.05, 11);
                    this.shot(14, 0.1, 10);
                    this.shot(12, 0.2, 9);
                    this.shot(10, 0.4, 8);
                }
                else if (this.data.gold < 2800) {
                    this.arrows = 10;
                    this.shot(10, -0.4, 9);
                    this.shot(12, -0.3, 10);
                    this.shot(14, -0.2, 11);
                    this.shot(15, -0.1, 12);
                    this.shot(17, -0.05, 13);
                    this.shot(17, 0.05, 13);
                    this.shot(15, 0.1, 12);
                    this.shot(14, 0.2, 11);
                    this.shot(12, 0.3, 10);
                    this.shot(10, 0.4, 9);
                }
                else {
                    this.arrows = 11;
                    this.shot(10, -0.4, 10);
                    this.shot(12, -0.3, 11);
                    this.shot(14, -0.2, 12);
                    this.shot(15, -0.1, 14);
                    this.shot(17, -0.05, 15);
                    this.shot(18, 0, 20);
                    this.shot(17, 0.05, 15);
                    this.shot(15, 0.1, 14);
                    this.shot(14, 0.2, 12);
                    this.shot(12, 0.3, 11);
                    this.shot(10, 0.4, 10);
                }
                this.last_shot = 0;
            }
            ;
        }
        this.sprite.setVelocity(0);
        if (this.controls.left.isDown) {
            this.sprite.setVelocityX(-speed);
        }
        else if (this.controls.right.isDown) {
            this.sprite.setVelocityX(speed);
        }
        if (this.controls.up.isDown) {
            this.sprite.setVelocityY(-speed);
        }
        else if (this.controls.down.isDown) {
            this.sprite.setVelocityY(speed);
        }
        if (this.controls.left.isDown) {
            this.sprite.anims.play(this.name + '_left', true);
        }
        else if (this.controls.right.isDown) {
            this.sprite.anims.play(this.name + '_right', true);
        }
        else if (this.controls.up.isDown) {
            this.sprite.anims.play(this.name + '_up', true);
        }
        else if (this.controls.down.isDown) {
            this.sprite.anims.play(this.name + '_down', true);
        }
        else {
            this.sprite.anims.play(this.name + '_idle', true);
        }
    }
}
