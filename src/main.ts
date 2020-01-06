import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { animationFrame } from 'rxjs/scheduler/animationFrame';

import { interval } from 'rxjs/observable/interval';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { generate } from 'rxjs/observable/generate';

import {
  map,
  filter,
  scan,
  startWith,
  distinctUntilChanged,
  share,
  withLatestFrom,
  tap,
  skip,
  takeWhile,
  take,
  switchMap,
  first,
  pluck,
  mergeMap,
  toArray,
  finalize
} from 'rxjs/operators';
import { Road, Car, Player, IGame } from './types';
import { randomCar, updateState } from './utils';
import { GAME_HEIGHT, GAME_WIDTH, LVL_DURATION } from './constants';
import { noop, render, renderGameOver } from './canvas';

const gameSpeed$ = new BehaviorSubject<number>(200);

const road$ = gameSpeed$.pipe(
  switchMap(i =>
    interval(i).pipe(
      scan((road: Road, _: number) => {
        road.cars = road.cars.filter((car: Car, idx: number) => car.x < GAME_HEIGHT - 1);
        road.cars[0].x === GAME_HEIGHT / 2 ? road.cars.push(randomCar()) : noop;
        road.cars.forEach(car => car.x++);

        return road;
      }, { cars: [randomCar()] })
    )
  )
);

const keys$ = fromEvent(document, 'keydown')
  .pipe(
    pluck('code'),
    filter(key => key === 'ArrowLeft' || key === 'ArrowRight'),
    startWith('ArrowLeft')
  );

const player$ = keys$.pipe(
  scan((player: Player, key: string) => {
    if (key === 'ArrowLeft' && player.y > 0) player.y--;
    if (key === 'ArrowRight' && player.y < GAME_WIDTH - 1) player.y++;

    return player;
  }, {y: 0})
);

const state$ = of({
  score: 1,
  lives: 3,
  level: 1,
  duration: LVL_DURATION,
  interval: 200
});

const isNotGameOver = (game: IGame) => game.state.lives > 0;

const game$ = combineLatest(state$, road$, player$, (state, road, player) => ({ state, road, player })).pipe(
  scan(updateState(gameSpeed$)),
  tap(render),
  takeWhile(isNotGameOver),
  finalize(renderGameOver)
);

game$.subscribe();