
class Square {
  constructor(gameFieldBlock, game) {
    this.game = game;
    this.element = createHtml({
      className: "field-cell",
      Parent: gameFieldBlock
    })
    this.parent = gameFieldBlock;

  }

  get value() {
    return this._value || 0;
  }


  set value(value) {
    this._value = value;
    this.element.innerHTML = value == 0 ? '' : value;
    if (this.element.innerText == 2) {
      this.element.className = 'two';
    }
    else if (this.element.innerText == 0) {
      this.element.className = 'zero';
    }
    else if (this.element.innerText == 4) {
      this.element.className = 'four';
    }
    else if (this.element.innerText == 8) {
      this.element.className = 'eight';
    }
    else if (this.element.innerText == 16) {
      this.element.className = 'sixteen';
    }
    else if (this.element.innerText == 32) {
      this.element.className = 'threeTwo';
    }
    else if (this.element.innerText == 64) {
      this.element.className = 'sixFour';
    }
    else if (this.element.innerText == 128) {
      this.element.className = 'oneTwoEight';
    }
    else if (this.element.innerText == 256) {
      this.element.className = 'twoFiveSix';
    }

  }

  clear() {
    this.value = '';
  }

  merge(cell) {

    if (this.value) {
      this.game.addRating(this.value + cell.value);
    }
    this.value += cell.value;
    cell.clear();
  }

  isSameTo(cell) {
    return this.value == cell.value;
  }

  spam() {
    this.value = Math.random() > 0.9 ? 4 : 2;
  }

  get isEmpty() {
    return this.value == 0;
  }

}
