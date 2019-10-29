//Фунция создания блоков на документе
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



  spawnUnit() {
    let emptyCells = [];

    for (let i = 0; i < this.field.length; i++) {
      for (let k = 0; k < this.field[i].length; k++) {
        if (!this.field[i][k].value) {
          emptyCells.push(this.field[i][k]);
        }
      }
    }

    if (emptyCells.length) {
      emptyCells[random(0, emptyCells.length - 1)].spam();
    } else {
      alert('You lose');
    }
  }

  // Обходим все ячейки в противоположном направлении от нажатия клавиши
  // По направлению первую строку или столбец пропускаем
  // Для ячейки ищем следующую заяную ячейку (или последнюю)
  //	если ячейка занята и совпадает с нашей, то объединяем
  //	если ячейка занята и не совпадет, то проверяем предыдущую ячейку
  moveRight() {
    let hasMoved = false;
    for (let i = 0; i < this.size; i++) {
      for (let k = this.size - 2; k >= 0; k--) {
        hasMoved = this.move(i, k, false, true, this.isLastKey.bind(this)) || hasMoved;
      }
    }

    if (hasMoved) {
      this.spawnUnit();
    }
  }

  isLastKey(key) {
    return key == (this.size - 1);
  }

  isFirstKey(key) {
    return key == 0;
  }

  moveLeft() {
    let hasMoved = false;
    for (let i = 0; i < this.size; i++) {
      for (let k = 1; k < this.size; k++) {
        hasMoved = this.move(i, k, false, false, this.isFirstKey.bind(this)) || hasMoved;
      }
    }

    if (hasMoved) {
      this.spawnUnit();
    }
  }


  moveDown() {
    let hasMoved = false;
    for (let i = this.size - 2; i >= 0; i--) {
      for (let k = 0; k < this.size; k++) {
        hasMoved = this.move(i, k, true, true, this.isLastKey.bind(this)) || hasMoved;
      }
    }

    if (hasMoved) {
      this.spawnUnit();
    }
  }

  moveUp() {
    let hasMoved = false;
    for (let i = 1; i < this.size; i++) {
      for (let k = 0; k < this.size; k++) {
        hasMoved = this.move(i, k, true, false, this.isFirstKey.bind(this)) || hasMoved;
      }
    }

    if (hasMoved) {
      this.spawnUnit();
    }
  }


  move(i, k, isI, isIncrement, keyCheck) {
    let hasMoved = false;

    let inc = isIncrement ? 1 : -1;
    let currentCell = this.field[i][k];
    if (currentCell.isEmpty) {
      return hasMoved;
    }

    let nextCellKey = (isI ? i : k) + inc;
    while (nextCellKey < this.size && nextCellKey >= 0) {
      let nextCell = this.field[isI ? nextCellKey : i][isI ? k : nextCellKey];
      if (!nextCell.isEmpty || keyCheck(nextCellKey)) {
        if ((nextCell.isEmpty && keyCheck(nextCellKey))
          || nextCell.isSameTo(currentCell)) {
          this.field[isI ? nextCellKey : i][isI ? k : nextCellKey].merge(currentCell);
          hasMoved = true;
        } else if (!nextCell.isEmpty && ((isI && (nextCellKey + (inc * -1) != i)) || (!isI && (nextCellKey + (inc * -1) != k)))) {
          this.field[isI ? nextCellKey + (inc * -1) : i][isI ? k : nextCellKey + (inc * -1)].merge(currentCell);
          hasMoved = true;
        }

        break;
      }
      nextCellKey += inc;
      nextCell = this.field[isI ? nextCellKey : i][isI ? k : nextCellKey];
    }

    return hasMoved;
  }

  newGame() {
    const scoreDiv = document.getElementById('score');
    if (scoreDiv) {
      scoreDiv.innerHTML = `Rating: 0`;
    }
    for (let i = 0; i < this.field.length; i++) {
      for (let k = 0; k < this.field[i].length; k++)
        if (this.field[i][k].value) {
          this.field[i][k].value = '';
        }
    }
    for (let i = 0; i < 2; i++) {
      this.spawnUnit();
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





}

// let isLastKey = function (key) {
  // return key == (this.size + 1);
// }

