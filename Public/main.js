document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('questions-container');

    // Initialize form fields based on their current question type
    document.querySelectorAll('.question-item').forEach(questionItem => {
        const questionType = questionItem.querySelector('.question-type').value;
        updateQuestionFields(questionItem, questionType);
    });

    container.addEventListener('change', (event) => {
        if (event.target.classList.contains('question-type')) {
            const questionItem = event.target.closest('.question-item');
            const questionType = event.target.value;

            // Update fields based on question type
            updateQuestionFields(questionItem, questionType);
        }
    });

    container.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-choice')) {
            const questionIndex = event.target.dataset.questionIndex;
            const multipleChoiceContainer = event.target.closest('.multiple-choice-container');
            const choiceCount = multipleChoiceContainer.querySelectorAll('.choice-item').length;

            if (choiceCount < 10) {
                const newChoice = document.createElement('div');
                newChoice.classList.add('choice-item');                newChoice.innerHTML = `
                    <input type="radio" name="questions[${questionIndex}][correctChoice]" value="${choiceCount}">
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
            
            // Update the indices for all remaining questions
            const questionItems = container.querySelectorAll('.question-item');
            questionItems.forEach((item, index) => {
                updateQuestionIndex(item, index);
            });
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
                <!-- For free text -->
                <input type="text" name="questions[${questionIndex}][freeAnswer]" class="free-answer-input" required>                <!-- For true/false -->
                <select name="questions[${questionIndex}][tfAnswer]" class="tf-answer-select" style="display: none;">
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>

                <div class="multiple-choice-container" style="display: none;">
                    <div class="choice-item">
                        <input type="radio" name="questions[${questionIndex}][correctChoice]" value="0">
                        <input type="text" name="questions[${questionIndex}][choices][0]" placeholder="Choice 1">
                        <button type="button" class="remove-choice">Remove</button>
                    </div>
                    <div class="choice-item">
                        <input type="radio" name="questions[${questionIndex}][correctChoice]" value="1">
                        <input type="text" name="questions[${questionIndex}][choices][1]" placeholder="Choice 2">
                        <button type="button" class="remove-choice">Remove</button>
                    </div>
                    <button type="button" class="add-choice" data-question-index="${questionIndex}">Add Choice</button>
                </div>
            </div>
            <button type="button" class="remove-question">Remove Question</button>
        `;
        container.appendChild(newQuestion);
    });

    // Function to update question index when removing questions
    function updateQuestionIndex(questionItem, newIndex) {
        // Update text input
        const textInput = questionItem.querySelector('input[name^="questions"][name$="[text]"]');
        if (textInput) {
            textInput.name = `questions[${newIndex}][text]`;
        }
        
        // Update type select
        const typeSelect = questionItem.querySelector('select[name^="questions"][name$="[type]"]');
        if (typeSelect) {
            typeSelect.name = `questions[${newIndex}][type]`;
        }
        
        // Update free answer input
        const freeAnswerInput = questionItem.querySelector('.free-answer-input');
        if (freeAnswerInput) {
            freeAnswerInput.name = `questions[${newIndex}][freeAnswer]`;
        }
        
        // Update true/false select
        const tfAnswerSelect = questionItem.querySelector('.tf-answer-select');
        if (tfAnswerSelect) {
            tfAnswerSelect.name = `questions[${newIndex}][tfAnswer]`;
        }
        
        // Update multiple choice container
        const addChoiceBtn = questionItem.querySelector('.add-choice');
        if (addChoiceBtn) {
            addChoiceBtn.dataset.questionIndex = newIndex;
        }
        
        // Update all radio buttons and text inputs in multiple choice
        const choiceItems = questionItem.querySelectorAll('.choice-item');
        choiceItems.forEach((item, choiceIndex) => {
            const radio = item.querySelector('input[type="radio"]');
            const choiceInput = item.querySelector('input[type="text"]');
            
            if (radio) {
                radio.name = `questions[${newIndex}][correctChoice]`;
                radio.value = choiceIndex;
            }
            
            if (choiceInput) {
                choiceInput.name = `questions[${newIndex}][choices][${choiceIndex}]`;
            }
        });
    }    // When question type changes
    function updateQuestionFields(questionItem, questionType) {
        const freeAnswerInput = questionItem.querySelector('.free-answer-input');
        const tfAnswerSelect = questionItem.querySelector('.tf-answer-select');
        const multipleChoiceContainer = questionItem.querySelector('.multiple-choice-container');
        
        // First, hide all inputs and remove required attribute
        freeAnswerInput.style.display = 'none';
        freeAnswerInput.required = false;
        
        tfAnswerSelect.style.display = 'none';
        tfAnswerSelect.required = false;
        
        multipleChoiceContainer.style.display = 'none';
        multipleChoiceContainer.querySelectorAll('input[type="text"]').forEach(input => {
            input.required = false;
        });
        multipleChoiceContainer.querySelectorAll('input[type="radio"]').forEach(input => {
            input.required = false;
        });
        
        // Then show only the relevant input type and make it required
        if (questionType === 'free') {
            freeAnswerInput.style.display = 'block';
            freeAnswerInput.required = true;
        } else if (questionType === 'truefalse') {
            tfAnswerSelect.style.display = 'block';
            tfAnswerSelect.required = true;
        } else if (questionType === 'multiplechoice') {
            multipleChoiceContainer.style.display = 'block';
            
            // Only make visible fields required
            const radioButtons = multipleChoiceContainer.querySelectorAll('input[type="radio"]');
            if (radioButtons.length > 0) {
                radioButtons[0].required = true; // Only require one radio to be checked
            }
            
            multipleChoiceContainer.querySelectorAll('input[type="text"]').forEach(input => {
                input.required = true;
            });
        }
    }    // Find the quiz form
    const quizForm = document.getElementById('quiz-form');
    
    if (quizForm) {
        console.log("Quiz form found, adding submit handler");
        
        quizForm.addEventListener('submit', function(event) {
            // Prevent the form from submitting normally
            event.preventDefault();
            console.log("Form submission intercepted!");
            
            try {
                // Process each question to handle the different question types
                const questionItems = document.querySelectorAll('.question-item');
                questionItems.forEach((questionItem, questionIndex) => {
                    const questionType = questionItem.querySelector('.question-type').value;
                    
                    // Remove required attribute from hidden fields based on question type
                    // This fixes the "not focusable" validation error
                    if (questionType === 'free') {
                        // Free text - disable true/false and multiple choice
                        questionItem.querySelectorAll('.tf-answer-select, .multiple-choice-container input').forEach(input => {
                            input.required = false;
                            input.disabled = true;
                        });
                    } else if (questionType === 'truefalse') {
                        // True/false - disable free text and multiple choice
                        questionItem.querySelectorAll('.free-answer-input, .multiple-choice-container input').forEach(input => {
                            input.required = false;
                            input.disabled = true;
                        });
                    } else if (questionType === 'multiplechoice') {
                        // Multiple choice - disable free text and true/false
                        questionItem.querySelectorAll('.free-answer-input, .tf-answer-select').forEach(input => {
                            input.required = false;
                            input.disabled = true;
                        });
                    }
                });
                
                // Log form data for debugging
                const formData = new FormData(quizForm);
                console.log("Submitting form data:");
                for (let pair of formData.entries()) {
                    console.log(pair[0] + ': ' + pair[1]);
                }
                
                // Submit the form now that all validations should pass
                quizForm.submit();
                
            } catch (error) {
                console.error("Error processing form:", error);
                alert("There was an error processing your quiz. Please try again.");
            }
        });
    } else {
        console.error("Quiz form not found! Make sure the form has id='quiz-form'");
    }

    // Debug all form submissions
    document.querySelectorAll('form').forEach(form => {
        console.log("Found form with action:", form.action);
    });
});