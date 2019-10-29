const createHtml = function ({ className, Parent, value, id, tag = 'div' }) {
  const element = document.createElement(tag);
  element.className = className;
  element.id = id;
  if (value) {
    element.innerHTML = value;
  }
  Parent.appendChild(element);
  return element;
}

const random = function (from, to) {
  return Math.floor(Math.random() * (to - from + 1)) + from;
}

class Game {
  constructor(Parent, size) {

    window.addEventListener('keyup', function (e) {
      this.hasMoved = false;
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
      let emptyBlocks = [];

      for (let i = 0; i < this.fields.length; i++) {
        for (let k = 0; k < this.fields[i].length; k++) {
          if (!this.fields[i][k].value) {
            emptyBlocks.push(this.fields[i][k]);
          }
        }
      }
      console.log(emptyBlocks.length)
      if (emptyBlocks.length <= 0 && this.hasMoved == false) {
        let x = alert('You lose!');
        if (x) { newGame() }
      }
      else if (this.hasMoved == true) {
        this.spamElement();
      }

    }.bind(this));

    this.score = 0;
    this.record = 0;
    this.fields = [];
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

    let newGameButton = createHtml({ tag: 'button', className: '', id: 'new_game_button', Parent: title2048 });
    // title2048.appendChild(newGameButton);
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
      this.fields[i] = [];                   // (Заполняем игровое поле ячейками)
      for (let k = 0; k < size; k++) {
        this.fields[i][k] = new Square(gameFieldBlock, this);
      }
    }

    this.sumBlocks = [];

    newGameButton.onclick = function () {
      this.newGame();
    }.bind(this)
  }



  spamElement() {
    // debugger
    let emptyBlocks = [];
    let newField = [];
    for (let i = 0; i < this.fields.length; i++) {
      for (let k = 0; k < this.fields[i].length; k++) {
        if (!this.fields[i][k].value) {
          emptyBlocks.push(this.fields[i][k]);
        }
      }
    }

    if (emptyBlocks.length > 0) {
      let randomPosition = random(0, emptyBlocks.length - 1);
      emptyBlocks[randomPosition].spam();
      for (let i = 0; i < this.fields.length; i++) {
        for (let k = 0; k < this.fields[i].length; k++) {
          if (!this.fields[i][k].value) {
            newField.push(this.fields[i][k]);

          }
        }
      }
      console.log(newField);

    }
    else {
      alert("you lose");
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
  // Для ячейки ищем следующую занятую ячейку (или последнюю)
  // Если находим ячейку совпадающую с нашей, то добавляем ее в массив объединенных
  //	если ячейка занята и совпадает с нашей и не является объединенной, то объединяем 
  //	если ячейка занята и не совпадет, то проверяем предыдущую ячейку

  moveRight() {
    //let hasMoved = false;
    for (let i = 0; i < this.size; i++) {
      for (let a = 0; a < this.size; a++) {
        this.sumBlocks[a] = []
        for (let b = 0; b < this.size; b++) {
          this.sumBlocks[a][b] = 0;
        }
      }
      for (let k = this.size - 1; k >= 0; k--) {
        let currentCell = this.fields[i][k];
        if (currentCell.isEmpty) {
          continue;
        }

        let nextCellKey = k + 1;

        while (nextCellKey < this.size) {
          let nextCell = this.fields[i][nextCellKey];

          if (!nextCell.isEmpty || this.isLastKey(nextCellKey)) {
            if (nextCell.isEmpty && this.isLastKey(nextCellKey)) // last cell with no value
            {
              this.fields[i][nextCellKey].merge(currentCell);
              this.hasMoved = true;
            }

            else if (nextCell.isSameTo(currentCell) && this.sumBlocks[i][nextCellKey] == 0) {
              this.fields[i][nextCellKey].merge(currentCell);
              this.hasMoved = true;
              this.sumBlocks[i][nextCellKey] = (this.fields[i][nextCellKey]);
            }

            else if (!nextCell.isEmpty && nextCellKey - 1 != k) {
              this.fields[i][nextCellKey - 1].merge(currentCell);
              this.hasMoved = true;
            }
            break;

          }
          nextCellKey++;
          nextCell = this.fields[i][nextCellKey];
        }
      }

    }

    // if (this.hasMoved) {
    //   this.spamElement();
    // }
  }

  moveLeft() {
    //let hasMoved = false;
    for (let i = 0; i < this.size; i++) {
      for (let a = 0; a < this.size; a++) {
        this.sumBlocks[a] = []
        for (let b = 0; b < this.size; b++) {
          this.sumBlocks[a][b] = 0;
        }
      }
      for (let k = 1; k < this.size; k++) {
        let currentCell = this.fields[i][k];
        if (currentCell.isEmpty) {
          continue;
        }

        let nextCellKey = k - 1;
        while (nextCellKey >= 0) {
          let nextCell = this.fields[i][nextCellKey];
          if (!nextCell.isEmpty || this.isFirstKey(nextCellKey)) {
            if (nextCell.isEmpty && this.isFirstKey(nextCellKey)) {
              this.fields[i][nextCellKey].merge(currentCell);
              this.hasMoved = true;
            }
            else if (nextCell.isSameTo(currentCell) && this.sumBlocks[i][nextCellKey] == 0) {
              this.fields[i][nextCellKey].merge(currentCell);
              this.hasMoved = true;
              this.sumBlocks[i][nextCellKey] = (this.fields[i][nextCellKey]);
            }
            else if (!nextCell.isEmpty && nextCellKey + 1 != k) {
              this.fields[i][nextCellKey + 1].merge(currentCell);
              this.hasMoved = true;
            }

            break;
          }
          nextCellKey--;
          nextCell = this.fields[i][nextCellKey];
        }
      }
    }

    // if (hasMoved) {
    //   this.spamElement();
    // }
  }

  moveDown() {
    // let hasMoved = false;
    for (let k = 0; k < this.size; k++) {
      for (let a = 0; a < this.size; a++) {
        this.sumBlocks[a] = []
        for (let b = 0; b < this.size; b++) {
          this.sumBlocks[a][b] = 0;
        }
      }
      for (let i = this.size - 2; i >= 0; i--) {
        let currentCell = this.fields[i][k];
        if (currentCell.isEmpty) {
          continue;
        }

        let nextCellKey = i + 1;
        while (nextCellKey < this.size) {

          let nextCell = this.fields[nextCellKey][k];
          if (!nextCell.isEmpty || this.isLastKey(nextCellKey)) {
            if ((nextCell.isEmpty && this.isLastKey(nextCellKey)) // last cell with no value
            ) {
              this.fields[nextCellKey][k].merge(currentCell);
              this.hasMoved = true;
            }
            else if (nextCell.isSameTo(currentCell) && this.sumBlocks[nextCellKey][k] == 0) {
              this.fields[nextCellKey][k].merge(currentCell);
              this.hasMoved = true;
              this.sumBlocks[nextCellKey][k] = (this.fields[nextCellKey][k]);
            }
            else if (!nextCell.isEmpty && nextCellKey - 1 != i) {
              this.fields[nextCellKey - 1][k].merge(currentCell);
              this.hasMoved = true;
            }

            break;
          }
          nextCellKey++;
          nextCell = this.fields[nextCellKey][k];
        }
      }
    }

    // if (hasMoved) {
    //   this.spamElement();
    // }
  }

  moveUp() {

    // let hasMoved = false;
    for (let k = 0; k < this.size; k++) {
      for (let a = 0; a < this.size; a++) {
        this.sumBlocks[a] = []
        for (let b = 0; b < this.size; b++) {
          this.sumBlocks[a][b] = 0;
        }
      }
      for (let i = 1; i < this.size; i++) {

        let currentCell = this.fields[i][k];
        if (currentCell.isEmpty) {
          continue;
        }

        let nextCellKey = i - 1;
        while (nextCellKey < this.size) {

          let nextCell = this.fields[nextCellKey][k];

          if (!nextCell.isEmpty || this.isFirstKey(nextCellKey)) {
            if ((nextCell.isEmpty && this.isFirstKey(nextCellKey)) // last cell with no value
            ) {
              this.fields[nextCellKey][k].merge(currentCell);
              this.hasMoved = true;
            }
            else if (nextCell.isSameTo(currentCell) && this.sumBlocks[nextCellKey][k] == 0) {
              this.fields[nextCellKey][k].merge(currentCell);
              this.hasMoved = true;
              this.sumBlocks[nextCellKey][k] = (this.fields[nextCellKey][k]);
            }
            else if (!nextCell.isEmpty && nextCellKey + 1 != i) {
              this.fields[nextCellKey + 1][k].merge(currentCell);
              this.hasMoved = true;
            }

            break;
          }
          nextCellKey--;
          nextCell = this.fields[nextCellKey][k];

        }
      }
    }

    // if (hasMoved) {
    //   this.spamElement();
    // }
  }

  newGame() {
    const scoreDiv = document.getElementById('score');
    if (scoreDiv) {
      scoreDiv.innerHTML = `Rating: 0`;
      this.score = 0;
    }
    for (let i = 0; i < this.fields.length; i++) {
      for (let k = 0; k < this.fields[i].length; k++)
        if (this.fields[i][k].value) {
          this.fields[i][k].value = '';
        }
    }

    this.spamElement();


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


  }

  get score() {
    return this._score;
  }

  isGameOver() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; k < 4; k++) {
        if (this.fields[i][k] == 0) {
          return false;
        }
        if (i !== 3 && this.fields[i][k] === this.fields[i + 1][k]) {
          return false;
        }
        if (k !== 3 && this.fields[i][k] === this.fields[i][k + 1]) {
          return false;
        }
      }
    }
    alert('You lose');
    return true;

  }
}

