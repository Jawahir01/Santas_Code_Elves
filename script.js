

// Questions 
const questions = [
  {
    text: "What date is Christmas Day?",
    answers: { A: "24 December", B: "25 December", C: "26 December", D: "31 December" },
    correct: "B"
  },
  {
    text: "Who delivers presents at Christmas?",
    answers: { A: "The Easter Bunny", B: "A Snowman", C: "Santa Claus", D: "A Reindeer" },
    correct: "C"
  },
  {
    text: "What colour is Rudolph’s nose?",
    answers: { A: "Red", B: "Blue", C: "Green", D: "Yellow" },
    correct: "A"
  },
  {
    text: "Which month is Christmas in?",
    answers: { A: "October", B: "December", C: "March", D: "June" },
    correct: "B"
  },
  {
    text: "What do people put on top of a Christmas tree?",
    answers: { A: "A Hat", B: "A Shoe", C: "A Pumpkin", D: "A Star or Angel" },
    correct: "D"
  },
  {
    text: "What day is Boxing Day celebrated on?",
    answers: { A: "24 December", B: "25 December", C: "26 December", D: "27 December" },
    correct: "C"
  },
   {
    text: "Which plant is often associated with Christmas in the UK?",
    answers: { A: "Rose", B: "Mistletoe", C: "Tulip", D: "Daisy" },
    correct: "B"
  },
  {
    text: "What dessert is traditionally served at Christmas in the UK?",
    answers: { A: "Chocolate cake", B: "Ice cream", C: "Christmas pudding", D: "Pancakes" },
    correct: "C"
  },
   {
    text: "What do people pull at Christmas dinner to get a paper hat and joke?",
    answers: { A: "Gift box", B: "Christmas cracker", C: "Card", D: "Balloon" },
    correct: "B"
  },
  {
    text: "What are traditional Christmas songs called?",
    answers: { A: "Anthems", B: "Pop songs", C: "Carols", D: "Hymns" },
    correct: "C"
  },
  {
    text: "Which animal pulls Santa’s sleigh?",
    answers: { A: "Horses", B: "Dogs", C: "Reindeer", D: "Sheep" },
    correct: "C"
  },
  {
    text: "What do people traditionally eat on Christmas Day in the UK?",
    answers: { A: "Fish and Chips", B: "Roast turkey", C: "Pizza", D: "Burgers" },
    correct: "B"
  }
];

// Get elements from index.html
const questionText = document.getElementById("questionText");
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const qNoEl = document.getElementById("qNo");
const feedbackEl = document.getElementById("feedback");
const resultEl = document.getElementById("result");

const btnA = document.getElementById("btnA");
const btnB = document.getElementById("btnB");
const btnC = document.getElementById("btnC");
const btnD = document.getElementById("btnD");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

// Popup elements 
const popup = document.getElementById("popup");
const closePopup = document.getElementById("closePopup");
const popupTitle = document.getElementById("popupTitle");
const popupText = document.getElementById("popupText");

// Game state
let gameQuestions = [];
let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timer = null;
let locked = false;

// enable/disable answer buttons
function enableButtons(state) {
  btnA.disabled = !state;
  btnB.disabled = !state;
  btnC.disabled = !state;
  btnD.disabled = !state;
}

// Show one question plus put answer text on the buttons
function showQuestion() {
  const q = gameQuestions[currentQuestion];

  questionText.textContent = q.text;
  qNoEl.textContent = String(currentQuestion + 1);

  btnA.textContent = "A: " + q.answers.A;
  btnB.textContent = "B: " + q.answers.B;
  btnC.textContent = "C: " + q.answers.C;
  btnD.textContent = "D: " + q.answers.D;

  feedbackEl.textContent = "";
  locked = false;
}

// Start the game
function startGame() {
  // Reset state
  score = 0;
  currentQuestion = 0;
  timeLeft = 30;
  locked = false;

  scoreEl.textContent = "0";
  qNoEl.textContent = "1";
  timeEl.textContent = String(timeLeft);
  feedbackEl.textContent = "";
  resultEl.textContent = "";

  // Hide popup if open
  if (popup) popup.classList.add("hidden");

  // Pick 5 random questions 
  gameQuestions = [...questions]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  // Enable answers
  enableButtons(true);

  // Start timer
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = String(timeLeft);

    if (timeLeft <= 0) {
      endGame(true); // time Ended
    }
  }, 1000);

  showQuestion();
}

// When user clicks A/B/C/D.
function answer(letter) {
  if (locked) return;
  locked = true;

  const correct = gameQuestions[currentQuestion].correct;

  if (letter === correct) {
    score++;
    scoreEl.textContent = String(score);
    feedbackEl.textContent = " Correct! Ho ho ho!";
  } else {
    feedbackEl.textContent = ` Wrong! Correct answer was ${correct}.`;
  }

  setTimeout(() => {
    currentQuestion++;

    if (currentQuestion >= gameQuestions.length) {
      endGame(false); // finished all the questions
    } else {
      showQuestion();
    }
  }, 800);
}

// End game: popup for pass and fail
function endGame(fromTimeOut) {
  clearInterval(timer);
  enableButtons(false);

  if (fromTimeOut) {
    feedbackEl.textContent = "Time's up! Santa ran off with the clock!";
  }

  if (score >= 4) {
    // PASS popup
    popupTitle.textContent = "Congratulations!";
    popupText.textContent = `You passed with ${score}/5 and unlocked Level 3! `;
    closePopup.textContent = "Continue";
    popup.classList.remove("hidden");
  } else {
    // FAIL popup 
    popupTitle.textContent = "Oops!";
    popupText.textContent = `The elves are laughing! One more try? (Score: ${score}/5)`;
    closePopup.textContent = "Try again";
    popup.classList.remove("hidden");
  }
}

// Button events
startBtn.onclick = startGame;
restartBtn.onclick = startGame;

btnA.onclick = () => answer("A");
btnB.onclick = () => answer("B");
btnC.onclick = () => answer("C");
btnD.onclick = () => answer("D");

//  Popup close - restart automatically if failed
if (closePopup) {
  closePopup.onclick = () => {
    popup.classList.add("hidden");
    if (score < 4) startGame();
  };
}

//  Starts with answers disabled
enableButtons(false);
