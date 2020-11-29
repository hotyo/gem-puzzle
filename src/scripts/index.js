import '../styles/style.scss';
import GameArea from './GameArea';

const header = document.createElement('header');
const time = document.createElement('div');
time.append(document.createElement('span'), document.createElement('span'));
time.firstChild.classList.add('description');
time.lastChild.classList.add('count');
const start = document.createElement('button');

const moves = time.cloneNode(true);

time.querySelector('.description').textContent = 'Time ';
time.querySelector('.count').textContent = '##:##';
moves.querySelector('.description').textContent = 'Moves ';
moves.querySelector('.count').textContent = '0';
start.textContent = 'Start new game';

header.classList.add('header');
time.classList.add('time');
moves.classList.add('moves');
start.classList.add('start');

header.append(time);
header.append(moves);
header.append(start);

document.body.prepend(header);

const width = document.body.offsetWidth <= 768 ? 320 : 640;
const height = width;

const gameArea = new GameArea(width, height);

if (!localStorage.getItem('puzzle_saves')) {
    localStorage.setItem('puzzle_saves', JSON.stringify({
        game: GameArea.createNumbers(gameArea.size),
        startDate: new Date(),
        clicks: 0
    }));
    gameArea.numbers = JSON.parse(localStorage.getItem('puzzle_saves')).game
} else {
    gameArea.numbers = JSON.parse(localStorage.getItem('puzzle_saves')).game;
    gameArea.clicks = JSON.parse(localStorage.getItem('puzzle_saves')).clicks
    moves.querySelector('.count').textContent = gameArea.clicks;
}

const updateTime = () => {
    const startDate = new Date(JSON.parse(localStorage.getItem('puzzle_saves')).startDate);
    let timeCounter = time.querySelector('.count');
    if (!gameArea.getFlag()) {
        let date = new Date();
        let secs = Math.trunc(((date - startDate) / 1000) % 60);
        let mins = Math.trunc((date - startDate) / (1000 * 60) % 60);
        timeCounter.textContent = `${mins < 10 ? '0'.concat(mins) : mins} : ${secs < 10 ? '0'.concat(secs) : secs}`;
        gameArea.startDate = startDate;
        setTimeout(() => updateTime(), 1000);
    }
}

gameArea.canvas.classList.add('canvas');

gameArea.canvas.height = gameArea.canvas.width;

gameArea.draw();

gameArea.canvas.addEventListener('click', () => {
    if (!gameArea.getFlag()) {
        gameArea.move.call(gameArea, event);
        moves.querySelector('.count').textContent = gameArea.clicks;
    }
    else {
        gameArea.canvas.removeEventListener('click', gameArea.move.bind(gameArea));
        moves.querySelector('.count').textContent = gameArea.clicks
    }
});

document.addEventListener('DOMContentLoaded', () => {
    gameArea.checkFlag();
})

start.addEventListener('click', () => {
    localStorage.setItem('puzzle_saves', JSON.stringify({
        game: GameArea.createNumbers(gameArea.size),
        startDate: new Date(),
        clicks: 0
    }));
    gameArea.numbers = JSON.parse(localStorage.getItem('puzzle_saves')).game
    gameArea.clicks = JSON.parse(localStorage.getItem('puzzle_saves')).clicks
    gameArea.draw()
    moves.querySelector('.count').textContent = 0
})

updateTime()

header.after(gameArea.canvas);