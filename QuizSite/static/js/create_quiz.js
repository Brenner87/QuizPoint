function createQuiz(quizContainer, appendButton, submitButton, formPattern, choicePattern, validateUrl, itemId='None'){
    appendButton.click(function(){addQuestion(quizContainer, formPattern, choicePattern)})
    rmButton.click(function(){rmQuestion(quizContainer)})
    submitButton.click(function(){sendData(quizContainer, validateUrl, itemId)})

}