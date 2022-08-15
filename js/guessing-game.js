/* 

Write your guess-game code here! Don't forget to look at the test specs as a guide. You can run the specs
by running "testem".

In this file, you will also include the event listeners that are needed to interact with your HTML file when
a user clicks a button or adds a guess to the input field.

*/

function generateWinningNumber() {
  return Math.round(Math.random() * 99 + 1);
}

function shuffle(array) {
  let shufflesLeft = array.length;

  while (shufflesLeft) {
    let randomNum = Math.floor(Math.random() * shufflesLeft--);
    let currentNum = array[shufflesLeft];

    array[shufflesLeft] = array[randomNum];
    array[randomNum] = currentNum;
  }
  return array;
}

class Game {
  constructor() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
    this.guessesLeft = 5;
    this.hintStorage = "";
  }

  difference() {
    return Math.abs(this.playersGuess - this.winningNumber);
  }

  isLower() {
    return this.playersGuess < this.winningNumber;
  }

  checkGuess() {
    if (this.playersGuess === this.winningNumber) {
      return "You Win!";
    }

    if (this.pastGuesses.includes(this.playersGuess)) {
      return "You have already guessed that number.";
    } else {
      this.pastGuesses.push(this.playersGuess);
      this.guessesLeft--;
    }
    if (this.pastGuesses.length >= 5) {
      return `You Lose.`;
    }

    if (this.difference() < 10) {
      return "You're burning up!";
    }
    if (this.difference() < 25) {
      return "You're lukewarm.";
    }
    if (this.difference() < 50) {
      return "You're a bit chilly.";
    }
    if (this.difference() < 100) {
      return "You're ice cold!";
    }
  }

  playersGuessSubmission(number) {
    number = Number(number);
    if (number % 1 === 0 && number >= 1 && number <= 100) {
      this.playersGuess = number;
      return this.checkGuess();
    } else {
      return "Please try a number from 1 - 100";
    }
  }

  provideHint() {
    if (this.hintStorage) {
      return this.hintStorage;
    }
    let array = shuffle([
      this.winningNumber,
      generateWinningNumber(),
      generateWinningNumber(),
    ]);
    let string = array.join(",");
    string = string.replaceAll(`,`, `, `);
    this.hintStorage = string;
    return string;
  }
}

function newGame() {
  return new Game();
}

let game = newGame();
const guess = document.querySelector("#guessField");
const guessStatus = document.querySelector("#guessStatus");
const guessesLeft = document.querySelector("#guessesLeft");
const submitGuessButton = document.querySelector("#submitGuessButton");
const playAgainButton = document.querySelector("#playAgainButton");
const hintButton = document.querySelector("#hintButton");
const hint = document.querySelector("#hint");
const guessOne = document.querySelector("#guessOne");
const guessTwo = document.querySelector("#guessTwo");
const guessThree = document.querySelector("#guessThree");
const guessFour = document.querySelector("#guessFour");
const guessFive = document.querySelector("#guessFive");

const startGame = window.addEventListener("load", function () {
  console.log("Starting new game");
  game;
  guessesLeft.innerHTML = game.guessesLeft;
  guessStatus.innerHTML = "Take a guess!";
});

//When submitButton is pressed
submitGuessButton.addEventListener("click", function () {
  return console.log(`guess`, guess.value);
});
submitGuessButton.addEventListener("click", function () {
  let gameStatus = game.playersGuessSubmission(guess.value);
  console.log(`gameStatus:`, gameStatus);
  guessStatus.innerHTML = gameStatus;
  guessesLeft.innerHTML = game.guessesLeft;

  let guessArray = [guessOne, guessTwo, guessThree, guessFour, guessFive];
  console.log(`hello`, guessArray[0], `see ya`, game.pastGuesses[0]);
  for (let i = 0; i < game.pastGuesses.length; i++) {
    guessArray[i].innerHTML = game.pastGuesses[i];
  }

  if (gameStatus === `You Lose.` || gameStatus === "You Win!") {
    guess.disabled = true;
    submitGuessButton.disabled = true;
    hintButton.disabled = true;
  }
});

playAgainButton.addEventListener("click", function () {
  //   console.log("Starting new game");
  //   guess.disabled = false;
  //   submitGuessButton.disabled = false;
  //   hintButton.disabled = false;
  //   game = newGame();
  location.reload();
  return false;
  guessesLeft.innerHTML = game.guessesLeft;
  guessStatus.innerHTML = "take a guess!";
});

hintButton.addEventListener("click", function () {
  hint.innerHTML = `Hint... it's one of these three: ${game.provideHint()}`;
  return console.log(game.provideHint());
});
