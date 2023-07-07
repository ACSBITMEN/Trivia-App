document.addEventListener('DOMContentLoaded', function() {
  const selectCategories = document.getElementById('selectCategories');
  const selectDifficulty = document.getElementById('selectDifficulty');
  const selectType = document.getElementById('selectType');

  fetch('https://opentdb.com/api_category.php')
    .then(response => response.json())
    .then(data => {
      const categories = data.trivia_categories;
      const difficulties = ['easy', 'medium', 'hard'];
      const questionTypes = ['multiple', 'boolean'];

      // Mostrar las categorías al usuario
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        selectCategories.appendChild(option);
      });

      // Mostrar las dificultades al usuario
      difficulties.forEach(difficulty => {
        const option = document.createElement('option');
        option.value = difficulty;
        option.textContent = difficulty;
        selectDifficulty.appendChild(option);
      });

      // Mostrar los tipos de respuestas al usuario
      questionTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        selectType.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });

  // constantes del DOM para ocultar o mostrar secciones.
  const opcionesSection = document.getElementById('opciones');
  const mainSection = document.getElementById('mainSection');
  const volverBtn = document.getElementById('volverBtn');

  opcionesSection.style.display = 'none'; // Ocultar opcionesSection

  const comenzarBtn = document.getElementById('comenzar');
  comenzarBtn.addEventListener('click', function() {
    mainSection.style.display = 'none'; // Ocultar mainSection
    opcionesSection.style.display = 'block'; // Mostrar opcionesSection
  });

  volverBtn.addEventListener('click', function() {
    mainSection.style.display = 'block'; // Mostrar mainSection
    opcionesSection.style.display = 'none'; // Ocultar opcionesSection
  });

  //Constantes para comenzar el juego de trivias
  const letsGoBtn = document.getElementById('letsGo');
  const mainQuizDiv = document.getElementById('mainQuiz');
  const scoreDisplay = document.getElementById('scoreDisplay');
  let questions = []; // Array para almacenar las preguntas de la trivia actual
  let currentQuestionIndex = 0; // Índice de la pregunta actual
  let score = 0; // Puntaje inicial

  letsGoBtn.addEventListener('click', function() {
    const categoryId = selectCategories.value;
    const difficulty = selectDifficulty.value;
    const type = selectType.value;

    mainSection.style.display = 'none'; // Ocultar mainSection
    opcionesSection.style.display = 'none'; // Ocultar opcionesSection
    mainQuizDiv.style.display = 'block'; // Mostrar mainQuizDiv

    const apiUrl = `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${difficulty}&type=${type}&encode=url3986&lang=es`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        questions = data.results;
        currentQuestionIndex = 0;
        score = 0;

        showQuestion();
        updateScore();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });

  function shuffleArray(array) {
    // Algoritmo de Fisher-Yates para mezclar un array
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    const decodedQuestion = decodeURIComponent(currentQuestion.question);
    const decodedCorrectAnswer = decodeURIComponent(currentQuestion.correct_answer);
    const decodedIncorrectAnswers = currentQuestion.incorrect_answers.map(incorrectAnswer => decodeURIComponent(incorrectAnswer));

    const answers = [decodedCorrectAnswer, ...decodedIncorrectAnswers];
    shuffleArray(answers);

    let quizHtml = `
      <div class="question mt-5">
        <p class="fw-normal text-center fs-3">${currentQuestionIndex + 1}. ${decodedQuestion}</p>
        <ol class="answers mt-5">
    `;

    answers.forEach(answer => {
      quizHtml += `<li class="d-grid gap-1 mt-1"><button class="answer-btn btn btn-primary">${answer}</button></li>`;
    });

    quizHtml += `</ol></div>`;

    mainQuizDiv.innerHTML = quizHtml;

    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach(button => {
      button.addEventListener('click', function() {
        const selectedAnswer = this.textContent;
        const decodedSelectedAnswer = decodeURIComponent(selectedAnswer);
        const decodedCorrectAnswer = decodeURIComponent(currentQuestion.correct_answer);

        if (decodedSelectedAnswer === decodedCorrectAnswer) {
          // Respuesta correcta
          score += 100;
        }

        // Avanzar a la siguiente pregunta o finalizar el quiz
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
          showQuestion();
        } else {
          showScore();
        }
      });
    });
  }

  function updateScore() {
    scoreDisplay.textContent = `Puntaje: ${score}`;
  }

  function showScore() {
    mainQuizDiv.innerHTML = `
    <h2 class="text-center mt-5">Puntaje Final</h2>
    <p class="text-center mt-4 fs-3">Tu puntaje es: ${score}/1000</p>
    <div id="mainOpcions" class="d-flex justify-content-center mt-5">
        <button id="newTriviaBtn" class="btn btn-primary btn-lg">New Trivia</button>
    </div>
    `;

    const newTriviaBtn = document.getElementById('newTriviaBtn');
    newTriviaBtn.addEventListener('click', function() {
      mainQuizDiv.style.display = 'none'; // Ocultar mainQuizDiv
      opcionesSection.style.display = 'block'; // Mostrar opcionesSection
    });
  }
}); 
