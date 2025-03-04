class DisinfoQuiz {
    constructor(containerElement) {
      this.container = containerElement;
      this.currentQuestion = 0;
      this.score = 0;
      this.questions = [
        {
          question: "Which tactic involves flooding communication channels with irrelevant content?",
          options: [
            "Deception & Mimicry",
            "Denial of Information",
            "Subversion",
            "Credential Stacking"
          ],
          correctAnswer: 1,
          explanation: "Denial of Information (DoI) involves deliberately flooding communication channels with a high volume of messages to bury genuine information beneath falsehoods and irrelevant content."
        },
        {
          question: "What countermeasure helps combat Deception & Mimicry tactics?",
          options: [
            "Message Prioritization",
            "Source Verification",
            "Rigorous Authentication",
            "Cognitive Aids"
          ],
          correctAnswer: 2,
          explanation: "Rigorous Authentication using digital signatures, watermarking, and metadata verification helps confirm the authenticity of communications that might be mimicked."
        },
        {
          question: "Which disinformation tactic involves the insertion of subtle, persistent distortions?",
          options: [
            "Disruption & Destruction",
            "Denial of Information",
            "Deception & Mimicry",
            "Subversion"
          ],
          correctAnswer: 3,
          explanation: "Subversion involves the insertion of subtle, persistent distortions into the message stream to gradually shift the narrative and erode trust in reliable sources."
        },
        {
          question: "What is a key principle from information theory that explains why overwhelming noise makes genuine information effectively invisible?",
          options: [
            "Entropy maximization",
            "Signal-to-noise ratio",
            "Bandwidth limitation",
            "Modulation theory"
          ],
          correctAnswer: 1,
          explanation: "Shannon's principle states that when the signal-to-noise ratio drops below a critical threshold, even accurate information becomes effectively invisible."
        },
        {
          question: "Which countermeasure focuses on helping audiences process large volumes of information?",
          options: [
            "Digital Forensics",
            "Cross-Referencing Information",
            "Cognitive Aids",
            "Rapid-Response Fact-Checking"
          ],
          correctAnswer: 2,
          explanation: "Cognitive Aids like summarization and aggregation tools help distill essential information, reducing the cognitive load on audiences when facing information overload."
        }
      ];
      
      this.initialize();
    }
    
    initialize() {
      this.renderQuiz();
      this.renderQuestion();
    }
    
    renderQuiz() {
      this.container.innerHTML = `
        <div class="quiz-container">
          <div class="quiz-header">
            <h2>Test Your Knowledge</h2>
            <div class="quiz-progress">Question <span id="current-question">1</span> of <span id="total-questions">${this.questions.length}</span></div>
          </div>
          <div id="question-container"></div>
          <div id="result-container" class="hidden"></div>
          <div class="quiz-controls">
            <button id="submit-answer" class="btn">Submit Answer</button>
            <button id="next-question" class="btn hidden">Next Question</button>
            <button id="restart-quiz" class="btn hidden">Restart Quiz</button>
          </div>
        </div>
      `;
      
      // Add event listeners
      document.getElementById('submit-answer').addEventListener('click', () => this.checkAnswer());
      document.getElementById('next-question').addEventListener('click', () => this.nextQuestion());
      document.getElementById('restart-quiz').addEventListener('click', () => this.restartQuiz());
    }
    
    renderQuestion() {
      const questionData = this.questions[this.currentQuestion];
      const questionContainer = document.getElementById('question-container');
      
      document.getElementById('current-question').textContent = this.currentQuestion + 1;
      
      questionContainer.innerHTML = `
        <div class="question">
          <h3>${questionData.question}</h3>
          <div class="options">
            ${questionData.options.map((option, index) => `
              <div class="option">
                <input type="radio" name="quiz-option" id="option-${index}" value="${index}">
                <label for="option-${index}">${option}</label>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    checkAnswer() {
      const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
      
      if (!selectedOption) {
        alert('Please select an answer');
        return;
      }
      
      const selectedAnswer = parseInt(selectedOption.value);
      const correctAnswer = this.questions[this.currentQuestion].correctAnswer;
      const resultContainer = document.getElementById('result-container');
      
      resultContainer.classList.remove('hidden');
      
      if (selectedAnswer === correctAnswer) {
        this.score++;
        resultContainer.innerHTML = `
          <div class="result correct">
            <h3>Correct!</h3>
            <p>${this.questions[this.currentQuestion].explanation}</p>
          </div>
        `;
      } else {
        resultContainer.innerHTML = `
          <div class="result incorrect">
            <h3>Incorrect</h3>
            <p>The correct answer is: ${this.questions[this.currentQuestion].options[correctAnswer]}</p>
            <p>${this.questions[this.currentQuestion].explanation}</p>
          </div>
        `;
      }
      
      // Show next button and hide submit
      document.getElementById('submit-answer').classList.add('hidden');
      
      if (this.currentQuestion < this.questions.length - 1) {
        document.getElementById('next-question').classList.remove('hidden');
      } else {
        // Show final score and restart button
        resultContainer.innerHTML += `
          <div class="final-score">
            <h3>Quiz Completed!</h3>
            <p>Your score: ${this.score} out of ${this.questions.length}</p>
          </div>
        `;
        document.getElementById('restart-quiz').classList.remove('hidden');
      }
    }
    
    nextQuestion() {
      this.currentQuestion++;
      document.getElementById('result-container').classList.add('hidden');
      document.getElementById('next-question').classList.add('hidden');
      document.getElementById('submit-answer').classList.remove('hidden');
      this.renderQuestion();
    }
    
    restartQuiz() {
      this.currentQuestion = 0;
      this.score = 0;
      document.getElementById('result-container').classList.add('hidden');
      document.getElementById('restart-quiz').classList.add('hidden');
      document.getElementById('submit-answer').classList.remove('hidden');
      this.renderQuestion();
    }
  }
  
  // Initialize the quiz if the container exists
  document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('disinfo-quiz');
    if (quizContainer) {
      new DisinfoQuiz(quizContainer);
    }
  });