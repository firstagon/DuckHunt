import { SpriteFlipbook } from '../sprite/SpriteFlip';

class Duck {
    isMoving = false;
    moving = null;
    movingSide = null;
    baseSpeed = 1;
    fallSpeed = 10;
    init = true;
    alive = true;

    constructor(srcTexture, scene, type, group, dispatch, kill) {
        this.srcTexture = srcTexture;
        this.sprite = new SpriteFlipbook(srcTexture, 10, 11, scene);
        // this.sprite.setPosition(0, 0, 0);
        this.sprite.setPosition(this.random(-6, 6), -3, 0);
        this.scale();
        this.color = type;
        this.type(type);
        this.group = group;
        this.dispatch = dispatch;
        this.kill = kill;
    };

    scale() {
        this.sprite.scale(2, 2, 1);
    }

    type(type) {
        if (type === 'blue') this.baseSpeed = 2;
        if (type === 'green') this.baseSpeed = 4;
        if (type === 'red') this.baseSpeed = 8;
    }

    log() {
        console.log(this.sprite);
    }

    animation(type) {
        if (this.color === 'blue') {
            if (type === 'up') this.sprite.loop([50, 51, 52], 1);
            if (type === 'topLeft') this.sprite.loop([80, 81, 82], 1);
            if (type === 'topRight') this.sprite.loop([40, 41, 42], 1);
            if (type === 'right' || type === 'downRight') this.sprite.loop([30.1, 31.1, 32.1], 1);
            if (type === 'left' || type === 'downLeft') this.sprite.loop([70.1, 71.1, 72.1], 1);
            if (type === 'shooted' && this.isMoving) this.sprite.loop([60], 1);
            if (type === 'killed') this.sprite.loop([61], 1);
        } else if (this.color === 'green') {
            if (type === 'up') this.sprite.loop([53.5, 54.5, 55.5], 1);
            if (type === 'topLeft') this.sprite.loop([83.5, 84.5, 85.5], 1);
            if (type === 'topRight') this.sprite.loop([43.5, 44.5, 45.5], 1);
            if (type === 'right' || type === 'downRight') this.sprite.loop([33.5, 34.5, 35.5], 1);
            if (type === 'left' || type === 'downLeft') this.sprite.loop([73.5, 74.5, 75.5], 1);
            if (type === 'shooted' && this.isMoving) this.sprite.loop([63.5], 1);
            if (type === 'killed') this.sprite.loop([64.5], 1);
        } else if (this.color === 'red') {
            if (type === 'up') this.sprite.loop([57, 58, 59], 1);
            if (type === 'topLeft') this.sprite.loop([87, 88, 89], 1);
            if (type === 'topRight') this.sprite.loop([47, 48, 49], 1);
            if (type === 'right' || type === 'downRight') this.sprite.loop([37, 38, 39], 1);
            if (type === 'left' || type === 'downLeft') this.sprite.loop([76.9, 77.9, 79], 1);
            if (type === 'shooted' && this.isMoving) this.sprite.loop([67], 1);
            if (type === 'killed') this.sprite.loop([68], 1);
        }

    };

    move(delta) {
        const position = this.sprite.sprite.position;
        const speed = this.baseSpeed * delta;

        if (!this.isMoving && this.moving !== 'killed') {
            return;
        }

        if (!this.isMoving && this.moving === 'killed') {
            this.sprite.addPosition(0, -speed, 0);
            if (position.y <= -3) {
                this.sprite.addPosition(0, -this.fallSpeed * delta, -this.fallSpeed * delta);
                if (position.y <= -6) {
                    // this.sprite.sprite.visible = false;
                    this.group.remove(this.sprite.sprite)
                }
            }

        }

        if (this.isMoving && position.x >= 6) {
            this.moveTo('left');
            if (position.y >= 6) {
                this.moveTo('downLeft')
            }
        }
        if (this.isMoving && position.x <= -6) {
            this.moveTo('right');
            if (position.y >= 6) {
                this.moveTo('downRight')
            }
        }
        if (this.isMoving && position.y <= -2) {
            this.moveTo('up');
        }
        if (this.isMoving && position.y >= 6) {
            if (position.x >= 4) {
                this.moveTo('downLeft');
            } else if (position.x <= -4) {
                this.moveTo('downRight');
            } else {
                this.getDir();
            }
        }

        if (this.isMoving && this.moving === 'up') {
            this.sprite.addPosition(0, speed, 0);
            if (position.y >= 2 && this.init) {
                this.getDir();
                this.init = false;
            }
            else if (this.isMoving && position.y >= 3 && !this.init)
                this.moveTo('downRight');
        }

        if (this.moving === 'left') {
            this.sprite.addPosition(-speed, 0, 0);
        }
        if (this.moving === 'right') {
            this.sprite.addPosition(speed, 0, 0);
        }

        if (this.moving === 'downRight') {
            this.sprite.addPosition(speed, -speed, 0);

        }
        if (this.moving === 'topRight') {
            this.sprite.addPosition(speed, speed, 0);
        }

        if (this.moving === 'topLeft') {
            this.sprite.addPosition(-speed, speed, 0);
        }
        if (this.moving === 'downLeft') {
            this.sprite.addPosition(-speed, -speed, 0);
        }

        if (this.isMoving && this.moving === 'shooted') {
            this.sprite.addPosition(0, 0, 0);
            this.isMoving = false;
        }


    }

    setDirection() {
        const directions = ['up', 'left', 'right', 'downRight', 'downLeft', 'topRight', 'topLeft'];
        const direction = this.random(0, directions.length - 1);
        this.moveTo(directions[direction]);
    }

    getDir() {
        clearInterval(this.interval);
        if (this.init) (
            this.setDirection()
        )
        this.interval = setInterval(() => {
            this.setDirection();
        }, this.random(1000, 3000));
    }

    getKilled() {
        clearInterval(this.interval);
        if (this.alive === true) {
            this.dispatch({ type: 'killed_' + this.color });
            const points = this.color === 'blue' ? 25 : this.color === 'green' ? 50 : 100
            this.kill(points)
            this.alive = false;
        }
        this.isMoving = false;
        this.moveTo('shooted');
        setTimeout(() => {
            this.moveTo('killed');
        }, 1000);
    }

    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    moveTo(type) {

        if (type === 'killed') {
            this.moving = type;
            this.animation(type);
            return;
        }

        this.isMoving = true;
        this.moving = type;
        this.animation(type);
    }

    update(delta) {
        this.sprite.update(delta)
        this.move(delta);
    }
}

export default Duck;