class Arrow {
    constructor(scene, index) {
        this.name = "arrow";
        this.muted = false;
        this.dmg = 0;
        this.life_span = 500;
        this.index = index;
        this.scene = scene;
        this.ignore = [];
        this.createSpriteBody();
        this.reusable = true;
        this.sound = this.scene.sound.add('arrow', {
            volume: 0.1
        });
        this.trail = this.scene.add.particles('sora').createEmitter({
            x: 400,
            y: 300,
            speed: { min: 70, max: 90 },
            scale: { start: 0.2, end: 0.2 },
            alpha: { start: 1, end: 0, ease: 'Expo.easeIn' },
            blendMode: 'SCREEN',
            lifespan: 100
        });
        this.trail.reserve(10);
        this.trail.stop();
        this.explosion = this.scene.add.particles('sora').createEmitter({
            x: 400,
            y: 300,
            speed: { min: 5, max: 50 },
            scale: { start: 0.5, end: 0.5 },
            alpha: { start: 1, end: 0, ease: 'Expo.easeIn' },
            blendMode: 'SCREEN',
            lifespan: 1500
        });
        this.explosion.reserve(15);
        this.explosion.stop();
    }
    preload(self) {
        self.load.spritesheet("arrow", "./assets/images/arrow.png", {
            frameWidth: 32,
            frameHeight: 8
        });
        self.load.audio('arrow', ['./assets/audio/click.ogg', './assets/audio/click.mp3']);
        self.load.image('sora', './assets/images/sora.png');
    }
    fire(angle, speed, owner, dmg, ignore, lifespan) {
        this.ignore = ignore;
        this.reusable = false;
        this.life_span = lifespan;
        this.dmg = dmg;
        this.owner = owner;
        this.angle = angle;
        this.speed = speed;
        this.life_span = 1000;
        this.sprite.setActive(true);
        this.sprite.setVisible(true);
        this.sprite.setPosition(this.owner.sprite.x, this.owner.sprite.y);
        this.sprite.rotation = this.angle;
        this.sprite.setVelocityX(Math.cos(this.angle + Math.PI) * this.speed);
        this.sprite.setVelocityY(Math.sin(this.angle + Math.PI) * this.speed);
        this.trail.setPosition(this.sprite.x, this.sprite.y);
        this.trail.setAngle({
            min: this.angle * 180 / Math.PI - 45,
            max: this.angle * 180 / Math.PI + 45
        });
        this.trail.start();
    }
    collision(entity) {
        for (let index = 0; index < this.ignore.length; index++) {
            if (entity.name === this.ignore[index]) {
                return;
            }
        }
        if (!this.muted) {
            this.sound.play();
        }
        this.scene.cameras.main.shake(50, 0.002 / this.scene.cameras.main.zoom);
        this.explosion.setPosition(this.sprite.x, this.sprite.y);
        this.explosion.setAngle({
            min: this.angle * 180 / Math.PI - 45,
            max: this.angle * 180 / Math.PI + 45
        });
        this.explosion.start();
        this.explosion.emitParticle(15);
        this.explosion.stop();
        this.disable();
    }
    disable() {
        this.trail.stop();
        this.sprite.setActive(false);
        this.sprite.setVisible(false);
        this.sprite.setVelocityX(0);
        this.sprite.setVelocityY(0);
        this.sprite.setPosition(30, -50 - this.index * 30);
        this.reusable = true;
    }
    pause() {
        this.sprite.setStatic(true);
    }
    unpause() {
        this.sprite.setStatic(false);
        this.sprite.setVelocityX(Math.cos(this.angle + Math.PI) * this.speed);
        this.sprite.setVelocityY(Math.sin(this.angle + Math.PI) * this.speed);
    }
    createSpriteBody() {
        var M = Phaser.Physics.Matter.Matter;
        var playerBody = M.Bodies.rectangle(0, 0, 32, 8, { isSensor: true });
        this.compoundBody = M.Body.create({
            parts: [
                playerBody
            ],
            frictionAir: 0,
            label: this.name,
            friction: 0,
            restitution: 0
        });
        this.sprite = this.scene.matter.add.sprite(0, 0, "arrow").setExistingBody(this.compoundBody);
        this.sprite.setPosition(0, -50 - this.index * 30);
    }
    update(time, delta) {
        this.trail.setPosition(this.sprite.x, this.sprite.y);
        this.sprite.depth = this.sprite.y;
        this.life_span -= delta;
        if (this.life_span <= 0) {
            this.disable();
        }
    }
}
