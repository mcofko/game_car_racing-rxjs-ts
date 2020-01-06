import { IGame, Car } from './types';
import { GAME_HEIGHT, LVL_DURATION, GAME_WIDTH } from './constants';
import { noop } from './canvas';
import { BehaviorSubject } from 'rxjs';

export const createCar = (x: number, y: number): Car => ({ x, y, scored: false });
export const randomCar = (): Car => createCar(0, Math.floor(Math.random() * Math.floor(GAME_WIDTH)));

const handleScoreIncrease = (game: IGame) => {
    const { state, road, player } = {...game};

    !road.cars[0].scored && road.cars[0].y !== player.y && road.cars[0].x === GAME_HEIGHT - 1
    ? ((road.cars[0].scored = true), (state.score += 1)) : noop;
};

const handleCollision = (game: IGame) => {
    const { state, road, player } = {...game};

    road.cars[0].x === GAME_HEIGHT - 1 && road.cars[0].y === player.y
    ? (state.lives -= 1) : noop;
};

const updateSpeed = (game: IGame, gameSpeed: BehaviorSubject<number>) => {
    const { state } = {...game};

    state.duration -= 10;
    if (state.duration < 0) {
        state.duration = LVL_DURATION * state.level;
        state.level++;
        state.interval -= state.interval > 60 ? 20 : 0;

        gameSpeed.next(state.interval);
    }
};

export const updateState = (gameSpeed: BehaviorSubject<number>) => {
    return (_, game: IGame) => {
        handleScoreIncrease(game);
        handleCollision(game);
        updateSpeed(game, gameSpeed);

        return game;
    };
};