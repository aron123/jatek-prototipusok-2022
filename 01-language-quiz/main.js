const questions = [
    {
        title: 'macska',
        alternatives: ['dog', 'cat', 'mouse', 'bird'],
        correctIndex: 1
    },
    {
        title: 'doboz',
        alternatives: ['cat', 'table', 'box', 'blue'],
        correctIndex: 2
    },
    {
        title: 'zöld',
        alternatives: ['grey', 'pink', 'blue', 'green'],
        correctIndex: 3
    }
];

const app = {
    start: function () {
        this.currPosition = 0;
        this.score = 0;

        const altDivs = document.querySelectorAll('.alternative');
        altDivs.forEach((element, index) => {
            element.addEventListener('click', () => {
                this.checkAnswer(index);
            });
        });

        this.showQuestion();
        this.updateStats();
    },
    showQuestion: function () {
        const question = questions[this.currPosition];
        const titleDiv = document.querySelector('#title');
        titleDiv.textContent = question.title;

        const altDivs = document.querySelectorAll('.alternative');
        altDivs.forEach((element, index) => {
            element.textContent = question.alternatives[index];
        });
    },
    checkAnswer: function (index) {
        if (questions[this.currPosition].correctIndex === index) {
            this.score++;
            this.checkResult(true);
        } else {
            this.checkResult(false);
        }

        this.updateStats();

        this.stepQuestion();

        this.showQuestion();
    },
    stepQuestion: function() {
        this.currPosition++;
        if (this.currPosition === questions.length) {
            this.currPosition = 0;
        }
    },
    updateStats: function () {
        const scoreDiv = document.querySelector('#score');
        scoreDiv.textContent = 'Your score: ' + this.score;
    },
    checkResult: function (success) {
        const currQuestion = questions[this.currPosition];
        let result = '';

        if (success) {
            result = 'Correct!';
        } else {
            const correctAnsw = currQuestion.alternatives[currQuestion.correctIndex];
            result = 'Wrong! Correct answer is ' + correctAnsw;
        }

        const resultDiv = document.querySelector('#result');
        resultDiv.textContent = result;
    }
};

app.start();