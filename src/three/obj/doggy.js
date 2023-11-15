import * as THREE from 'three';
import { SpriteFlipbook } from '../sprite/SpriteFlip';

export class Dog {
    isMoving = false;
    jumpUp = false;
    moving = null;
    action = null;

    constructor(srcTexture, scene, camera) {
        this.camera = camera;
        this.srcTexture = srcTexture;
        this.sprite = new SpriteFlipbook(srcTexture, 6.2, 5, scene);
        this.sprite.setPosition(-10, -10, 0);
        this.scale();
    };

    scale() {
        this.sprite.scale(4, 3, 1);

    }

    log() {
        console.log(this.sprite);
    }

    animation(type) {
        if (type === 'move') this.sprite.loop([0, 1, 2, 3, 4], 0.8);
        if (type === 'stay') this.sprite.loop([4, 6.2], 2);
        if (type === 'jump') this.sprite.loop([7.3, 8.3], 2);
        if (type === 'giggle') this.sprite.loop([9, 10], 0.5);
        if (type === 'find_one') this.sprite.loop([5.2], 1);
        if (type === 'find_two') this.sprite.loop([11.4], 1);
    };

    move(delta) {
        if (!this.isMoving) {
            return;
        }

        if (this.action === 'find_one') {
            
        }

        if (this.action === 'find_two') {

        }

        if (this.action === 'giggle') {

        }

        if (this.moving === 'enter_walk') {
            this.sprite.addPosition(2 * delta, 0, 0);
            if (this.sprite.sprite.position.x >= 0 && this.isMoving) {
                this.isMoving = false;
                this.moving = null;
                this.moveTo('stay');
                if (this.sprite.sprite.position.x >= 0 && !this.isMoving) {
                    setTimeout(() => {
                        this.moveTo('jump');
                    }, 1000);
                }
            }
        }

        if (this.jumpUp) {
            this.sprite.addPosition(0, 5 * delta, -5 * delta);
            if (this.sprite.sprite.position.y >= -4) {
                this.jumpUp = false;
                this.jumpDown = true;
                // this.sprite.sprite.visible = false;
            }
        }

        if (this.jumpDown) {
            this.sprite.addPosition(0, -1 * delta, 0);
            if (this.sprite.sprite.position.y <= -6) {
                this.isMoving = false;
                this.jumpDown = false;
                this.sprite.sprite.visible = false;
            }
        }


    }

    moveTo(type) {
        switch (type) {
            case 'enter_walk':
                this.sprite.sprite.visible = true;
                this.sprite.setPosition(-10, -6.5, 0);
                this.isMoving = true;
                this.moving = 'enter_walk';
                this.animation('move');
                break;
            case 'stay':
                this.sprite.setPosition(0, -6, 0);
                this.animation('stay');
                this.isMoving = false;
                break;
            case 'jump':
                this.isMoving = true;
                this.jumpUp = true;
                this.animation('jump');
                break;
            case 'find_one':
                this.isMoving = true;
                this.action = type;
                this.animation('find_one');
                break;
            case 'find_two':
                this.isMoving = true;
                this.action = type;
                this.animation('find_two');
                break;
            case 'giggle':
                this.isMoving = true;
                this.action = type;
                this.animation('giggle');
                break;
            default:
                this.sprite.sprite.visible = false;
                this.isMoving = false;
                this.moving = false;
                break;
        }
    }

    update(delta) {
        this.sprite.update(delta)
        this.move(delta);
        // this.flipBook.update(delta);
        // this.flipBook.loop(4, 1);
        // console.log(this.position.x += 1)
    }
}
