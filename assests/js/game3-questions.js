// Game 3: Christmas Quiz
let quizGameActive = false;
let quizScore = 0;
let quizTimeLeft = 30;
let quizTimer;
let quizQuestions = [];
let currentQuestionIndex = 0;
let quizQuestionsAnswered = 0;
let quizLocked = false;

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
        text: "What colour is Rudolph's nose?",
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
        text: "Which animal pulls Santa's sleigh?",
        answers: { A: "Horses", B: "Dogs", C: "Reindeer", D: "Sheep" },
        correct: "C"
    },
    {
        text: "What do people traditionally eat on Christmas Day in the UK?",
        answers: { A: "Fish and Chips", B: "Roast turkey", C: "Pizza", D: "Burgers" },
        correct: "B"
    }
];

function initCodePuzzleGame() {
    // Setup game HTML
    game3Container.innerHTML = `
        <div class="game-content" style="background: linear-gradient(to bottom, #4a148c, #311b92); padding: 30px; border-radius: 20px; width: 100%; max-height: 100vh; overflow-y: auto; border: 5px solid #ffcc00; position: relative;">
            <button class="close-game-btn" id="closeQuizGame" style="position: absolute; top: 15px; right: 15px; background: #ff4d4d; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer;">&times;</button>
            
            <div class="game-header">
                <h2 style="color: #ffcc00; font-size: 2.5rem; text-align: center; margin-bottom: 20px;">🎄 Christmas Quiz Challenge</h2>
                <div style="background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 15px; margin-bottom: 20px; text-align: left;">
                    <h3 style="color: #9c27b0; margin-bottom: 10px;">How to Play:</h3>
                    <p style="margin-bottom: 10px">Answer 5 Christmas questions correctly to help Santa remember his route!</p>
                    <ul style="padding-left: 20px; margin-bottom: 15px;">
                        <li>You have 30 seconds to answer 5 questions</li>
                        <li>Each correct answer gives you 20 points</li>
                        <li>Need at least 4 correct answers (80 points) to win</li>
                        <li>Click A, B, C, or D to select your answer</li>
                    </ul>
                </div>
            </div>
            
            <div class="game-stats" style="display: flex; justify-content: space-between; background: rgba(0, 0, 0, 0.2); padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                <div class="stat-box" style="text-align: center;">
                    <h3 style="margin: 0; color: #ffcc00;">Score: <span id="quizScore">0</span></h3>
                    <p style="margin: 5px 0 0 0; font-size: 0.9rem;">Target: 80 points</p>
                </div>
                <div class="stat-box" style="text-align: center;">
                    <h3 style="margin: 0; color: #ffcc00;">Time: <span id="quizTimer">30</span>s</h3>
                    <p style="margin: 5px 0 0 0; font-size: 0.9rem;">Question: <span id="quizQuestionNo">1</span>/5</p>
                </div>
                <button id="startQuizGame" class="btn btn-start" style="background: linear-gradient(to right, #9c27b0, #7b1fa2); color: white; border: none; padding: 10px 20px; border-radius: 25px; font-size: 1.1rem; cursor: pointer; font-weight: bold;">
                    <i class="fas fa-play"></i> Start Quiz
                </button>
            </div>
            
            <div class="quiz-question-area" style="background: rgba(255, 255, 255, 0.1); padding: 25px; border-radius: 15px; margin-bottom: 20px; border: 2px solid #9c27b0;">
                <div id="quizQuestionText" style="font-size: 1.4rem; color: white; text-align: center; margin-bottom: 25px; min-height: 60px;">
                    Click "Start Quiz" to begin!
                </div>
                
                <div class="quiz-answers" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <button id="quizBtnA" class="quiz-answer-btn" data-answer="A" style="background: linear-gradient(to right, #2196F3, #0d47a1); color: white; border: none; padding: 15px; border-radius: 10px; font-size: 1.1rem; cursor: pointer; text-align: left;">
                        <span class="answer-letter">A:</span> <span class="answer-text"></span>
                    </button>
                    <button id="quizBtnB" class="quiz-answer-btn" data-answer="B" style="background: linear-gradient(to right, #4CAF50, #2E7D32); color: white; border: none; padding: 15px; border-radius: 10px; font-size: 1.1rem; cursor: pointer; text-align: left;">
                        <span class="answer-letter">B:</span> <span class="answer-text"></span>
                    </button>
                    <button id="quizBtnC" class="quiz-answer-btn" data-answer="C" style="background: linear-gradient(to right, #ff9800, #e65100); color: white; border: none; padding: 15px; border-radius: 10px; font-size: 1.1rem; cursor: pointer; text-align: left;">
                        <span class="answer-letter">C:</span> <span class="answer-text"></span>
                    </button>
                    <button id="quizBtnD" class="quiz-answer-btn" data-answer="D" style="background: linear-gradient(to right, #f44336, #c62828); color: white; border: none; padding: 15px; border-radius: 10px; font-size: 1.1rem; cursor: pointer; text-align: left;">
                        <span class="answer-letter">D:</span> <span class="answer-text"></span>
                    </button>
                </div>
                
                <div id="quizFeedback" style="text-align: center; margin-top: 20px; font-size: 1.2rem; color: #ffcc00; min-height: 30px;"></div>
            </div>
            
            <div class="quiz-result" id="quizResult" style="display: none; text-align: center; background: rgba(0, 0, 0, 0.3); padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                <h3 id="quizResultTitle" style="color: #ffcc00; margin-bottom: 10px;"></h3>
                <p id="quizResultText" style="margin-bottom: 15px;"></p>
            </div>
            
            <div class="game-controls" style="margin-top: 20px; text-align: center;">
                <button id="backFromQuiz" class="back-home-btn" style="background: linear-gradient(to right, #2196F3, #0d47a1); color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 1.3rem; font-weight: bold; cursor: pointer; display: none;">
                    <i class="fas fa-home"></i> Back to Village
                </button>
            </div>
        </div>
    `;
    
    // Add game-specific styles
    const style = document.createElement('style');
    style.id = 'quiz-styles';
    style.textContent = `
        .quiz-answer-btn {
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }
        
        .quiz-answer-btn:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .quiz-answer-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        .quiz-answer-btn.correct {
            background: linear-gradient(to right, #4CAF50, #2E7D32) !important;
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(76, 175, 80, 0.5);
        }
        
        .quiz-answer-btn.wrong {
            background: linear-gradient(to right, #f44336, #c62828) !important;
            opacity: 0.7;
        }
        
        .answer-letter {
            font-weight: bold;
            margin-right: 10px;
            background: rgba(255, 255, 255, 0.2);
            padding: 3px 8px;
            border-radius: 5px;
        }
        
        .answer-text {
            display: inline-block;
            width: calc(100% - 40px);
        }
        
        @keyframes correctAnswer {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes wrongAnswer {
            0% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
            100% { transform: translateX(0); }
        }
    `;
    
    // Remove existing styles if any
    const existingStyles = document.getElementById('quiz-styles');
    if (existingStyles) existingStyles.remove();
    
    document.head.appendChild(style);
    
    // Setup event listeners
    setupQuizEventListeners();
    
    // Reset game state
    resetQuizGame();
}

function setupQuizEventListeners() {
    // Close button
    document.getElementById('closeQuizGame').addEventListener('click', () => {
        stopQuizGame();
        closeMiniGame();
    });
    
    // Start game button
    document.getElementById('startQuizGame').addEventListener('click', startQuizGame);
    
    // Back to village button
    document.getElementById('backFromQuiz').addEventListener('click', () => {
        stopQuizGame();
        returnToMainGame(true);
    });
    
    // Answer buttons
    document.getElementById('quizBtnA').addEventListener('click', () => answerQuestion('A'));
    document.getElementById('quizBtnB').addEventListener('click', () => answerQuestion('B'));
    document.getElementById('quizBtnC').addEventListener('click', () => answerQuestion('C'));
    document.getElementById('quizBtnD').addEventListener('click', () => answerQuestion('D'));
}

function resetQuizGame() {
    quizScore = 0;
    quizTimeLeft = 30;
    quizQuestionsAnswered = 0;
    currentQuestionIndex = 0;
    quizLocked = false;
    quizGameActive = false;
    
    // Reset UI
    document.getElementById('quizScore').textContent = '0';
    document.getElementById('quizTimer').textContent = '30';
    document.getElementById('quizQuestionNo').textContent = '1';
    document.getElementById('quizQuestionText').textContent = 'Click "Start Quiz" to begin!';
    document.getElementById('quizFeedback').textContent = '';
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('backFromQuiz').style.display = 'none';
    document.getElementById('startQuizGame').style.display = 'inline-block';
    
    // Clear answer buttons
    const answerBtns = document.querySelectorAll('.quiz-answer-btn');
    answerBtns.forEach(btn => {
        btn.querySelector('.answer-text').textContent = '';
        btn.disabled = true;
        btn.classList.remove('correct', 'wrong');
    });
}

function startQuizGame() {
    if (quizGameActive) return;
    
    resetQuizGame();
    quizGameActive = true;
    
    // Pick 5 random questions
    quizQuestions = [...questions]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
    
    // Update UI
    document.getElementById('startQuizGame').style.display = 'none';
    document.getElementById('quizResult').style.display = 'none';
    
    // Start timer
    quizTimer = setInterval(() => {
        quizTimeLeft--;
        document.getElementById('quizTimer').textContent = quizTimeLeft;
        
        if (quizTimeLeft <= 0) {
            endQuizGame(false, 'Time\'s up! Santa ran off with the clock!');
        }
    }, 1000);
    
    // Show first question
    showQuizQuestion();
}

function showQuizQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        endQuizGame(false, 'All questions answered!');
        return;
    }
    
    const question = quizQuestions[currentQuestionIndex];
    quizLocked = false;
    
    // Update question text
    document.getElementById('quizQuestionText').textContent = question.text;
    document.getElementById('quizQuestionNo').textContent = `${currentQuestionIndex + 1}/5`;
    
    // Update answer buttons
    document.getElementById('quizBtnA').querySelector('.answer-text').textContent = question.answers.A;
    document.getElementById('quizBtnB').querySelector('.answer-text').textContent = question.answers.B;
    document.getElementById('quizBtnC').querySelector('.answer-text').textContent = question.answers.C;
    document.getElementById('quizBtnD').querySelector('.answer-text').textContent = question.answers.D;
    
    // Enable buttons
    const answerBtns = document.querySelectorAll('.quiz-answer-btn');
    answerBtns.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong');
    });
    
    // Clear feedback
    document.getElementById('quizFeedback').textContent = '';
}

function answerQuestion(selectedAnswer) {
    if (quizLocked || !quizGameActive) return;
    
    quizLocked = true;
    quizQuestionsAnswered++;
    
    const question = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === question.correct;
    
    // Disable all buttons
    const answerBtns = document.querySelectorAll('.quiz-answer-btn');
    answerBtns.forEach(btn => {
        btn.disabled = true;
        
        // Highlight correct answer
        if (btn.dataset.answer === question.correct) {
            btn.classList.add('correct');
        }
        
        // Highlight wrong answer if selected
        if (btn.dataset.answer === selectedAnswer && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
    
    // Update score and feedback
    if (isCorrect) {
        quizScore += 20;
        document.getElementById('quizScore').textContent = quizScore;
        document.getElementById('quizFeedback').textContent = '✓ Correct! Ho ho ho!';
        document.getElementById('quizFeedback').style.color = '#4CAF50';
    } else {
        document.getElementById('quizFeedback').textContent = `✗ Wrong! Correct answer was ${question.correct}.`;
        document.getElementById('quizFeedback').style.color = '#f44336';
    }
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < quizQuestions.length) {
            showQuizQuestion();
        } else {
            endQuizGame(false, 'All questions answered!');
        }
    }, 1500);
}

function endQuizGame(fromTimeout, message) {
    clearInterval(quizTimer);
    quizGameActive = false;
    quizLocked = true;
    
    // Disable all buttons
    const answerBtns = document.querySelectorAll('.quiz-answer-btn');
    answerBtns.forEach(btn => {
        btn.disabled = true;
    });
    
    // Show result
    const resultEl = document.getElementById('quizResult');
    const resultTitle = document.getElementById('quizResultTitle');
    const resultText = document.getElementById('quizResultText');
    
    resultEl.style.display = 'block';
    
    if (quizScore >= 80) {
        // Win
        resultTitle.textContent = '🎉 Congratulations!';
        resultText.textContent = `You passed with ${quizScore}/100 points and unlocked the next house!`;
        document.getElementById('backFromQuiz').style.display = 'inline-block';
        document.getElementById('startQuizGame').style.display = 'none';
    } else {
        // Lose
        resultTitle.textContent = '😞 Try Again!';
        resultText.textContent = `You scored ${quizScore}/100 points. Need 80 points to win. The elves are laughing!`;
        document.getElementById('startQuizGame').style.display = 'inline-block';
        document.getElementById('backFromQuiz').style.display = 'none';
        
        if (fromTimeout && message) {
            document.getElementById('quizFeedback').textContent = message;
        }
    }
}

function stopQuizGame() {
    quizGameActive = false;
    clearInterval(quizTimer);
}
