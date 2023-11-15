import { useEffect, useReducer, useRef } from 'react';
import * as THREE from 'three';
import { Raycaster } from 'three';
import spriteTexture from '../three/sprite/duckhunt_various_sheet 01.png';
import spriteTextureMirr from '../three/sprite/duckhunt_various_sheet.png';
import grassFile from '../three/sprite/grass01.png';
import GameInfo from './GameScore';
import { Dog } from './obj/doggy';
import Duck from './obj/Duck';

const reducer = (state, action) => {
    switch (action.type) {
        case 'killed_blue':
            return {
                ...state, score: state.score + 25, killed: state.killed + 1
            };
        case 'killed_green':
            return {
                ...state, score: state.score + 50, killed: state.killed + 1
            };
        case 'killed_red':
            return {
                ...state, score: state.score + 100, killed: state.killed + 1
            };
        case 'next_level':
            return {
                ...state, level: action.level, showLevel: true
            }
        case 'set_level':
            return {
                ...state, nextLevel: action.nextLevel
            }
        case 'hide_level':
            return { ...state, showLevel: false }
        default:
            break;
    }
}

const Canvas = () => {

    const can = useRef();

    const [state, dispatch] = useReducer(reducer, {
        score: 0,
        level: 0,
        killed: 0,
        ducks: { red: 0, blue: 0, geen: 0 },
        nextLevel: null,
        showLevel: false
    })

    const firstRun = useRef(true);
    const lvl = useRef(state.level);
    const showLevel = useRef(false);
    const currScore = useRef(state.score);
    const nextScore = useRef(0)

    const addClass = state.showLevel ? 'arise' : '';
    useEffect(() => {

        const canvasStyle = window.getComputedStyle(can.current);
        const sizes = {
            width: 800,
            height: 600,
            // width: +canvasStyle.width.split('p')[0],
            // height: +canvasStyle.height.split('p')[0],
        };

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
        camera.position.set(0, 0, 10);
        scene.add(camera);

        const hemiLight = new THREE.HemisphereLight('#ffffff', '#ffffff', 0.6);
        hemiLight.position.set(0, 50, 0);
        scene.add(hemiLight);

        const pointLight = new THREE.PointLight('white', 100, 100);
        pointLight.castShadow = true;
        scene.add(pointLight);

        const grassMap = new THREE.TextureLoader().load(grassFile);
        grassMap.magFilter = THREE.NearestFilter
        const material = new THREE.SpriteMaterial({ map: grassMap });
        const grass = new THREE.Sprite(material);
        grass.scale.set(40, 12, -2)
        grass.position.set(-7, -2.45, -1);
        scene.add(grass)
        const dog = new Dog(spriteTexture, scene);
        scene.add(dog.sprite.sprite);

        const killDuck = (points) => {
            currScore.current += points;
        }

        const ducks = new THREE.Group();
        ducks.name = 'group of ducks'
        const sendDuck = (type) => {
            const types = {
                0: 'blue',
                1: 'green',
                2: 'red'
            }
            const duck = new Duck(spriteTextureMirr, scene, types[type], ducks, dispatch, killDuck);
            duck.sprite.sprite.par = duck;
            ducks.add(duck.sprite.sprite)
            duck.moveTo('up');
        }

        const createLevel = () => {
            showLevel.current = true;

            const amountOfDucks = (lvl.current + 1) * 2;
            const blue = Math.floor((amountOfDucks / 2) - lvl.current / 2);
            const green = Math.floor((amountOfDucks - blue) / 2 + lvl.current / 4);
            const red = lvl.current / 5;
            nextScore.current = blue * 25 + green * 50 + red * 100;
            const createDuck = (cb, type, num) => {
                for (let i = 1; i <= num; i++) {
                    cb(type);
                }
            }
            createDuck(sendDuck, 0, blue);
            createDuck(sendDuck, 1, green);
            createDuck(sendDuck, 2, red);
        }

        createLevel();

        scene.add(ducks);

        const raycaster = new Raycaster();

        const clickHandler = (e) => {
            e.preventDefault();
            const pointer = new THREE.Vector2();
            pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(ducks.children);
            for (let i = 0; i < intersects.length; i++) {
                intersects[i].object.par.getKilled()
            }
        }

        window.addEventListener('click', clickHandler);

        const renderer = new THREE.WebGLRenderer({ canvas: can.current });
        renderer.setClearColor(0xffffff, 0);

        let triggered = false;
        const checkState = () => {

            if (ducks.children.length <= 0 && firstRun) {
                if (!triggered) {
                    triggered = true
                    dog.moveTo('enter_walk');
                    firstRun.current = false;
                }
            }
            if (ducks.children.length <= 0) {
                if (currScore.current >= nextScore.current) {
                    lvl.current += 1;
                    dispatch({ type: 'next_level', level: lvl.current })
                    setTimeout(() => {
                        dispatch({ type: 'hide_level' })
                    }, 1000)
                    createLevel();
                }
            }
        }

        let myReq;
        const clock = new THREE.Clock();
        const tick = () => {
            checkState();
            myReq = window.requestAnimationFrame(tick);
            const delta = clock.getDelta();
            dog.update(delta);
            ducks.children.forEach(el => el.par.update(delta));
            renderer.render(scene, camera);
        };
        tick();
        const resize = () => {

            // Обновляем размеры
            // sizes.width = window.innerWidth;
            // sizes.height = window.innerHeight;

            // Обновляем соотношение сторон камеры
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();

            // Обновляем renderer
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.render(scene, camera);
        }
        resize();
        window.addEventListener('resize', (e) => {
            resize();
        });

        return () => window.cancelAnimationFrame(myReq);
    }, []);

    return (
        <div className='threeWrapper'>
            <canvas className='canvasThree' ref={can} />
            <GameInfo level={state.level} killed={state.killed} score={state.score}
                addClass={addClass} />
        </div>
    )
}

export default Canvas;