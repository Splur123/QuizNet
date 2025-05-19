document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('questions-container');

    container.addEventListener('change', (event) => {
        if (event.target.classList.contains('question-type')) {
            const questionItem = event.target.closest('.question-item');
            const answerInput = questionItem.querySelector('.answer-input');
            const answerSelect = questionItem.querySelector('.answer-select');
            const multipleChoiceContainer = questionItem.querySelector('.multiple-choice-container');

            if (event.target.value === 'truefalse') {
                answerInput.style.display = 'none';
                answerInput.removeAttribute('required');
                answerSelect.style.display = 'block';
                answerSelect.setAttribute('required', 'required');
                multipleChoiceContainer.style.display = 'none';
            } else if (event.target.value === 'multiplechoice') {
                answerInput.style.display = 'none';
                answerInput.removeAttribute('required');
                answerSelect.style.display = 'none';
                answerSelect.removeAttribute('required');
                multipleChoiceContainer.style.display = 'block';
            } else {
                answerSelect.style.display = 'none';
                answerSelect.removeAttribute('required');
                multipleChoiceContainer.style.display = 'none';
                answerInput.style.display = 'block';
                answerInput.setAttribute('required', 'required');
            }
        }
    });

    container.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-choice')) {
            const questionIndex = event.target.dataset.questionIndex;
            const multipleChoiceContainer = event.target.closest('.multiple-choice-container');
            const choiceCount = multipleChoiceContainer.querySelectorAll('.choice-item').length;

            if (choiceCount < 10) {
                const newChoice = document.createElement('div');
                newChoice.classList.add('choice-item');
                newChoice.innerHTML = `
                    <input type="radio" name="questions[${questionIndex}][correctChoice]" value="${choiceCount}" required>
                    <input type="text" name="questions[${questionIndex}][choices][${choiceCount}]" placeholder="Choice ${choiceCount + 1}" required>
                    <button type="button" class="remove-choice">Remove</button>
                `;
                multipleChoiceContainer.insertBefore(newChoice, event.target);
            } else {
                alert('You can only add up to 10 choices.');
            }
        }

        if (event.target.classList.contains('remove-choice')) {
            const multipleChoiceContainer = event.target.closest('.multiple-choice-container');
            const choiceItem = event.target.closest('.choice-item');
            const choiceCount = multipleChoiceContainer.querySelectorAll('.choice-item').length;

            if (choiceCount > 2) {
                choiceItem.remove();
            } else {
                alert('A multiple-choice question must have at least 2 choices.');
            }
        }

        if (event.target.classList.contains('remove-question')) {
            const questionItem = event.target.closest('.question-item');
            questionItem.remove();
        }
    });

    document.getElementById('add-question').addEventListener('click', () => {
        const questionIndex = container.querySelectorAll('.question-item').length;
        const newQuestion = document.createElement('div');
        newQuestion.classList.add('question-item');
        newQuestion.innerHTML = `
            <label for="question"><h3>Question:</h3></label>
            <input type="text" name="questions[${questionIndex}][text]" required>

            <label for="type"><h3>Question Type:</h3></label>
            <select name="questions[${questionIndex}][type]" class="question-type" required>
                <option value="free">Free Text</option>
                <option value="truefalse">True/False</option>
                <option value="multiplechoice">Multiple Choice</option>
            </select>

            <div class="answer-container">
                <label for="answer"><h3>Answer:</h3></label>
                <input type="text" name="questions[${questionIndex}][answer]" class="answer-input" required>
                <select name="questions[${questionIndex}][answer]" class="answer-select" style="display: none;" required>
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>

                <div class="multiple-choice-container" style="display: none;">
                    <div class="choice-item">
                        <input type="radio" name="questions[${questionIndex}][correctChoice]" value="0" required>
                        <input type="text" name="questions[${questionIndex}][choices][0]" placeholder="Choice 1" required>
                        <button type="button" class="remove-choice">Remove</button>
                    </div>
                    <div class="choice-item">
                        <input type="radio" name="questions[${questionIndex}][correctChoice]" value="1" required>
                        <input type="text" name="questions[${questionIndex}][choices][1]" placeholder="Choice 2" required>
                        <button type="button" class="remove-choice">Remove</button>
                    </div>
                    <button type="button" class="add-choice" data-question-index="${questionIndex}">Add Choice</button>
                </div>
            </div>
            <button type="button" class="remove-question">Remove Question</button>
        `;
        container.appendChild(newQuestion);
    });

    // Find the quiz form
    const quizForm = document.querySelector('form[action="/quizzes"]');
    
    if (quizForm) {
        console.log("Quiz form found, adding submit handler");
        
        quizForm.addEventListener('submit', function(event) {
            console.log("Form submission attempted!");
            
            // Log form data for debugging
            const formData = new FormData(this);
            console.log("Form data:");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            
            // Process each question
            document.querySelectorAll('.question-item').forEach(function(questionItem, index) {
                const questionType = questionItem.querySelector('.question-type').value;
                
                // Disable unused input fields based on question type
                if (questionType === 'free') {
                    questionItem.querySelector('.answer-select').disabled = true;
                    // Disable multiple choice inputs
                    questionItem.querySelectorAll('.multiple-choice-container input').forEach(input => {
                        input.disabled = true;
                    });
                } else if (questionType === 'truefalse') {
                    questionItem.querySelector('.answer-input').disabled = true;
                    // Disable multiple choice inputs
                    questionItem.querySelectorAll('.multiple-choice-container input').forEach(input => {
                        input.disabled = true;
                    });
                } else if (questionType === 'multiplechoice') {
                    questionItem.querySelector('.answer-input').disabled = true;
                    questionItem.querySelector('.answer-select').disabled = true;
                }
            });
        });
    } else {
        console.log("Quiz form not found!");
    }

    // Debug form submission
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            console.log("Form being submitted:", this.action);
            
            // Log all form inputs
            console.log("Form data:");
            const formData = new FormData(this);
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
        });
    });
});