import { IGame } from './types';
import { GAME_HEIGHT, GAME_WIDTH, CAR, PLAYER } from './constants';

const createElem = (column: number) =>
  (elem => (
    (elem.style.display = 'inline-block'),
    (elem.style.marginLeft = '3px'),
    (elem.style.height = '12px'),
    (elem.style.width = '6px'),
    (elem.style.borderRadius = '40%'),
    (elem.style['background-color'] =
      column === CAR ? 'green' : column === PLAYER ? 'blue' : 'white'),
    elem
  ))(document.createElement('div'));

export const render = (game: IGame) =>
  (renderFrame => {
    game.road.cars.forEach(c => (renderFrame[c.x][c.y] = CAR));

    let element: HTMLElement | null = (document.getElementById('game'));
    if (element) element.innerHTML = `Score: ${game.state.score} Lives: ${game.state.lives} Level: ${game.state.level}`;

    (renderFrame[GAME_HEIGHT - 1][game.player.y] = PLAYER);

    renderFrame.forEach(r => {
      const rowContainer = document.createElement('div');
      r.forEach(c => rowContainer.appendChild(createElem(c)));

      let element: HTMLElement | null = (document.getElementById('game'));
      if (element) element.appendChild(rowContainer);
    });
  })(
    Array(GAME_HEIGHT)
      .fill(0)
      .map(e => Array(GAME_WIDTH).fill(0))
  );

export const renderGameOver = () => {
    if (document && document.getElementById('game')) {
      let element: HTMLElement | null = (document.getElementById('game'));
      if (element)
        element.innerHTML += '<br/>GAME OVER!!!';
    }
};


// *******************************************************

export const renderGame = () => {};
export const renderGameOverLite = () => (document.body.innerHTML += '<br/>GAME OVER!');
export const noop = () => {};

// *******************************************************
