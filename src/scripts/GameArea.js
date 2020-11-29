export default class GameArea {
    constructor(width, height, size = 4) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.size = size;
        this.canvas.width = width;
        this.canvas.height = height;
        this.cellSize = this.canvas.width / this.size;
        this.clicks = 0;
        this.numbers = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 0, 12], [13, 14, 11, 15]];
    }

    #position = 0;
    #direction = '';
    #flag = false;
    

    getFlag() {
        return this.#flag;
    }

    checkFlag() {
        if (this.numbers.flat().sort((a, b) => a - b).toString() === [0].concat(this.numbers.flat().slice(0, -1)).toString()) {
            this.#flag = true;
            this.finalMove()
        }
    }

    static createNumbers(size) {
        let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
        let zeroIndex = numbers.findIndex(el => !el);
        let countOfInversions = 0;
        const countOfNumbers = Math.pow(size, 2);
        const countOfNumbersInRow = size;
        do {
            for (let i = numbers.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
            }
            for (let i = 0; i < countOfNumbers; i++) {
                if (numbers[i]) {
                    for (let j = 0; j < i; j++) {
                        if (numbers[j] > numbers[i]) {
                            countOfInversions++;
                        }
                    }
                }
            }
        } while ((countOfInversions + zeroIndex + 1) % 2 !== 0)
        return numbers.reduce((prev, curr, i, arr) => i % countOfNumbersInRow === 0 ? prev.concat([arr.slice(i, i + countOfNumbersInRow)]) : prev, []);
    }

    createCell(x, y, number) {
        const textHeight = this.canvas.width / 10;
        this.context.fillStyle = 'orange';
        this.context.fillRect(this.cellSize * x + 5, this.cellSize * y + 5, this.cellSize - 10, this.cellSize - 10);
        this.context.fillStyle = 'black';
        this.context.font = `${textHeight}px sans-serif`;
        this.context.fillText(number, this.cellSize * (x + 0.5) - this.context.measureText(number).width / 2, this.cellSize * (y + 0.5) + textHeight / 2);
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.numbers[y][x] > 0) {
                    this.createCell(x, y, this.numbers[y][x]);
                }
            }
        }
    }

    finalMove() {
        let finalPosition = 0;
        let textHeight = this.canvas.width / 12;
        let date = new Date() - this.startDate;
        let secs = Math.trunc((date / 1000) % 60);
        let mins = Math.trunc(date / (1000 * 60) % 60);
        step.call(this);
        let resultTime = `Time ${mins < 10 ? '0'.concat(mins) : mins} : ${secs < 10 ? '0'.concat(secs) : secs}`;
        let resultCLicks = `Clicks ${this.clicks}`;

        function step() {
            finalPosition += 8;
            this.context.clearRect(0, 0, this.canvas.width, finalPosition)
            this.context.fillStyle = 'black';
            if (finalPosition < this.canvas.height) {
                requestAnimationFrame(step.bind(this))
            } else {
                this.context.fillStyle = 'white';
                this.context.font = `${textHeight}px sans-serif`;
                this.context.fillText(resultTime, this.canvas.width / 2 - this.context.measureText(resultTime).width / 2, this.canvas.height / 2 - textHeight);
                this.context.fillText(resultCLicks, this.canvas.width / 2 - this.context.measureText(resultCLicks).width / 2, this.canvas.height / 2 + textHeight);
            }
        }
    }

    checkMove(direction, clickX, clickY, emptyX, emptyY) {
        const textHeight = this.canvas.width / 10;
        if (direction === 'right') {
            this.position += 10;
            this.context.clearRect(this.cellSize * clickX + 5, this.cellSize * clickY, this.cellSize, this.cellSize)
            this.context.fillStyle = 'orange';
            this.context.fillRect(this.position + 5, this.cellSize * clickY + 5, this.cellSize - 10, this.cellSize - 10);
            this.context.fillStyle = 'black';
            this.context.font = `${textHeight}px sans-serif`;
            this.context.fillText(this.numbers[clickY][clickX], this.position + this.cellSize * 0.5 - this.context.measureText(this.numbers[clickY][clickX]).width / 2, this.cellSize * (clickY + 0.5) + textHeight / 2);
        } else if (direction === 'left') {
            this.position -= 10;
            this.context.clearRect((clickX ? this.cellSize * clickX - 5 : this.cellSize * clickX), this.cellSize * clickY, this.cellSize, this.cellSize)
            this.context.fillStyle = 'orange';
            this.context.fillRect((clickX ? this.position + 5 : this.position), this.cellSize * clickY + 5, this.cellSize - 10, this.cellSize - 10);
            this.context.fillStyle = 'black';
            this.context.font = `${textHeight}px sans-serif`;
            this.context.fillText(this.numbers[clickY][clickX], this.position + this.cellSize * 0.5 - this.context.measureText(this.numbers[clickY][clickX]).width / 2, this.cellSize * (clickY + 0.5) + textHeight / 2);
        } else if (direction === 'down') {
            this.position += 10;
            this.context.clearRect(this.cellSize * clickX, this.cellSize * clickY + 5, this.cellSize, this.cellSize)
            this.context.fillStyle = 'orange';
            this.context.fillRect(this.cellSize * clickX + 5, this.position + 5, this.cellSize - 10, this.cellSize - 10);
            this.context.fillStyle = 'black';
            this.context.font = `${textHeight}px sans-serif`;
            this.context.fillText(this.numbers[clickY][clickX], this.cellSize * (clickX + 0.5) - this.context.measureText(this.numbers[clickY][clickX]).width / 2, this.position + this.cellSize * 0.5 + textHeight / 2);
        } else {
            this.position -= 10;
            this.context.clearRect(this.cellSize * clickX, this.cellSize * clickY - 5, this.cellSize, this.cellSize)
            this.context.fillStyle = 'orange';
            this.context.fillRect(this.cellSize * clickX + 5, this.position + 5, this.cellSize - 10, this.cellSize - 10);
            this.context.fillStyle = 'black';
            this.context.font = `${textHeight}px sans-serif`;
            this.context.fillText(this.numbers[clickY][clickX], this.cellSize * (clickX + 0.5) - this.context.measureText(this.numbers[clickY][clickX]).width / 2, this.position + this.cellSize * 0.5 + textHeight / 2);
        };

        if (
            (this.position > this.cellSize * clickY - this.cellSize && this.direction === 'up') ||
            (this.position < this.cellSize * clickY + this.cellSize && this.direction === 'down') ||
            (this.position > this.cellSize * clickX - this.cellSize && this.direction === 'left') ||
            (this.position < this.cellSize * clickX + this.cellSize && this.direction === 'right')
        ) {
            requestAnimationFrame(this.checkMove.bind(this, direction, clickX, clickY, emptyX, emptyY))
        } else {
            [this.numbers[clickY][clickX], this.numbers[emptyY][emptyX]] = [this.numbers[emptyY][emptyX], this.numbers[clickY][clickX]];
            localStorage.setItem('puzzle_saves', JSON.stringify({
                game: this.numbers,
                startDate: this.startDate,
                clicks: this.clicks
            }));
            this.checkFlag();
        }
    }

    move(e) {
        let emptyY = this.numbers.findIndex(row => row.indexOf(0) >= 0);
        let emptyX = this.numbers[emptyY].indexOf(0);
        let clickX = Math.floor(e.offsetX / this.cellSize);
        let clickY = Math.floor(e.offsetY / this.cellSize);
        if ((!!(clickX === emptyX ^ clickY === emptyY)) && ((clickX - 1 === emptyX || clickX + 1 === emptyX) || (clickY - 1 === emptyY || clickY + 1 === emptyY))) {

            if (clickX !== emptyX) {
                this.position = this.cellSize * clickX;
                if (clickX < emptyX) {
                    this.direction = 'right';
                } else {
                    this.direction = 'left';
                }
            } else {
                this.position = this.cellSize * clickY;
                if (clickY < emptyY) {
                    this.direction = 'down';
                } else {
                    this.direction = 'up';
                }
            }
            this.clicks++;
            this.checkMove(this.direction, clickX, clickY, emptyX, emptyY);
        }
    }
}