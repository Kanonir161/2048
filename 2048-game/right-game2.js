let createHtml = function ({ className, Parent, value, id, tag = 'div' }) {

    let element = document.createElement(tag);
    element.className = className;
    element.id = id;
    if (value) {
        element.innerHTML = value;
    }
    Parent.appendChild(element);
    return element;
}

let random = function (from, to) {
    return Math.floor(Math.random() * (to - from + 1)) + from;
}

class Game {
    constructor(Parent, size) {

        window.addEventListener('keyup', function (e) {
            switch (e.keyCode) {
                case 38:
                    this.moveUp();
                    break;
                case 40:
                    this.moveDown();
                    break;
                case 37:
                    this.moveLeft();
                    break;
                case 39:
                    this.moveRight();
                    break;
            }
        }.bind(this));




        this.score = 0;
        this.record = 0;
        this.field = [];
        this.size = size;
        let containerAll = createHtml({     // Общий контейнер
            className: "container",
            Parent
        })



        let bigHeader = createHtml({       // Шапка
            className: "header",
            Parent: containerAll
        })


        let title2048 = createHtml({       // Название игры 
            className: "title",
            Parent: bigHeader,
            value: "2048 =)"
        })

        let newGameButton = document.createElement('button');
        title2048.appendChild(newGameButton);
        newGameButton.className = 'newButton';
        newGameButton.innerText = 'NEW GAME';


        let ScoreOfGame = createHtml({      // Контейнер игровых очков
            className: "game-scores",
            Parent: bigHeader
        })



        let headerElementScore = createHtml({   // Текущий счет
            id: 'score',
            className: "score",
            Parent: ScoreOfGame

        })
        this.headerElementScore = headerElementScore;

        let gameFieldBlock = createHtml({       // Игровое поле
            className: "game",
            Parent: containerAll
        })



        for (let i = 0; i < size; i++) {
            this.field[i] = [];                   // (Заполняем игровое поле ячейками)
            for (let k = 0; k < size; k++) {
                this.field[i][k] = new Square(gameFieldBlock, this);

            }
        }
        console.log(this.field)



        newGameButton.onclick = function () {
            this.newGame();
        }.bind(this)



    }



    spamElement() {

        let emptyBlocks = [];

        for (let i = 0; i < this.field.length; i++) {
            for (let k = 0; k < this.field[i].length; k++) {
                if (!this.field[i][k].value) {
                    emptyBlocks.push(this.field[i][k]);
                }
            }
        }
        if (emptyBlocks.length) {
            emptyBlocks[random(0, emptyBlocks.length - 1)].spam();
        }
        else if (emptyBlocks.length = 0) {
            alert("Извини, ты проиграл");
        }
    }







    isLastKey(key) {
        return key == (this.size - 1);
    }

    isFirstKey(key) {
        return key == 0;
    }
    // Обходим все ячейки в противоположном направлении от нажатия клавиши
    // По направлению первую строку или столбец пропускаем
    // Для ячейки ищем следующую заяную ячейку (или последнюю)
    //	если ячейка занята и совпадает с нашей, то объединяем
    //	если ячейка занята и не совпадет, то проверяем предыдущую ячейку


    moveRight() {
        debugger
        let hasMoved = false;
        for (let i = 0; i < this.size; i++) {
            for (let k = this.size - 2; k >= 0; k--) {
                let currentCell = this.field[i][k];
                if (currentCell.isEmpty) {
                    continue;
                }

                let nextCellKey = k + 1;

                while (nextCellKey < this.size) {
                    let nextCell = this.field[i][nextCellKey];

                    if (!nextCell.isEmpty || this.isLastKey(nextCellKey)) {


                        if ((nextCell.isEmpty && this.isLastKey(nextCellKey)) // last cell with no value
                            || nextCell.isSameTo(currentCell)) {
                            this.field[i][nextCellKey].merge(currentCell);

                            hasMoved = true;
                        }

                        else if (!nextCell.isEmpty && nextCellKey - 1 != k) {
                            this.field[i][nextCellKey - 1].merge(currentCell);
                            hasMoved = true;
                        }

                        break;

                    }
                    nextCellKey++;
                    nextCell = this.field[i][nextCellKey];
                }
            }
        }

        if (hasMoved) {
            this.spamElement();
        }
    }

    moveLeft() {
        let hasMoved = false;
        for (let i = 0; i < this.size; i++) {
            for (let k = 1; k < this.size; k++) {
                let currentCell = this.field[i][k];
                if (currentCell.isEmpty) {
                    continue;
                }

                let nextCellKey = k - 1;
                while (nextCellKey >= 0) {
                    let nextCell = this.field[i][nextCellKey];
                    if (!nextCell.isEmpty || this.isFirstKey(nextCellKey)) {
                        if ((nextCell.isEmpty && this.isFirstKey(nextCellKey)) // last cell with no value
                            || nextCell.isSameTo(currentCell)) {
                            this.field[i][nextCellKey].merge(currentCell);
                            hasMoved = true;
                        } else if (!nextCell.isEmpty && nextCellKey + 1 != k) {
                            this.field[i][nextCellKey + 1].merge(currentCell);
                            hasMoved = true;
                        }

                        break;
                    }
                    nextCellKey--;
                    nextCell = this.field[i][nextCellKey];
                }
            }
        }

        if (hasMoved) {
            this.spamElement();
        }
    }


    moveDown() {
        let hasMoved = false;
        for (let k = 0; k < this.size; k++) {
            for (let i = this.size - 2; i >= 0; i--) {
                let currentCell = this.field[i][k];
                if (currentCell.isEmpty) {
                    continue;
                }

                let nextCellKey = i + 1;
                while (nextCellKey < this.size) {

                    let nextCell = this.field[nextCellKey][k];
                    if (!nextCell.isEmpty || this.isLastKey(nextCellKey)) {
                        if ((nextCell.isEmpty && this.isLastKey(nextCellKey)) // last cell with no value
                            || nextCell.isSameTo(currentCell)) {
                            this.field[nextCellKey][k].merge(currentCell);
                            hasMoved = true;
                        } else if (!nextCell.isEmpty && nextCellKey - 1 != i) {
                            this.field[nextCellKey - 1][k].merge(currentCell);
                            hasMoved = true;
                        }

                        break;
                    }
                    nextCellKey++;
                    nextCell = this.field[nextCellKey][k];
                }
            }
        }

        if (hasMoved) {
            this.spamElement();
        }
    }

    moveUp() {

        let hasMoved = false;
        for (let k = 0; k < this.size; k++) {
            for (let i = 1; i < this.size; i++) {

                let currentCell = this.field[i][k];
                if (currentCell.isEmpty) {
                    continue;
                }

                let nextCellKey = i - 1;
                while (nextCellKey < this.size) {

                    let nextCell = this.field[nextCellKey][k];
                    if (!nextCell.isEmpty || this.isFirstKey(nextCellKey)) {
                        if ((nextCell.isEmpty && this.isFirstKey(nextCellKey)) // last cell with no value
                            || nextCell.isSameTo(currentCell)) {
                            this.field[nextCellKey][k].merge(currentCell);
                            hasMoved = true;
                        } else if (!nextCell.isEmpty && nextCellKey + 1 != i) {
                            this.field[nextCellKey + 1][k].merge(currentCell);
                            hasMoved = true;
                        }

                        break;
                    }
                    nextCellKey--;
                    nextCell = this.field[nextCellKey][k];
                }
            }
        }

        if (hasMoved) {
            this.spamElement();
        }
    }

    newGame() {
        const scoreDiv = document.getElementById('score');
        if (scoreDiv) {
            scoreDiv.innerHTML = `Rating: 0`;
            this.score = 0;
        }
        for (let i = 0; i < this.field.length; i++) {
            for (let k = 0; k < this.field[i].length; k++)
                if (this.field[i][k].value) {
                    this.field[i][k].value = '';
                }
        }
        for (let i = 0; i < 2; i++) {
            this.spamElement();
        }

    }
    addRating(value) {
        this.score += value;
    }

    set score(value) {
        this._score = value;
        const scoreDiv = document.getElementById('score');
        if (scoreDiv) {
            scoreDiv.innerHTML = `Rating: ${value}`;
        }

        // document.getElementsByClassName('score')
        // this.headerElementScore
    }

    get score() {
        return this._score;
    }


    isGameOver() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; k < 4; k++) {
                if (this.field[i][k] == 0) {
                    return false;
                }
                if (i !== 3 && this.field[i][k] === this.field[i + 1][k]) {
                    return false;
                }
                if (k !== 3 && this.field[i][k] === this.field[i][k + 1]) {
                    return false;
                }
            }
        }
        alert('You lose');
        return true;


    }
}

    // let isLastKey = function (key) {
      // return key == (this.size + 1);
    // }

