function createQuiz(quizContainer, appendButton, submitButton, formPattern, choicePattern){




    appendButton.click(function(){addQuestion(quizContainer)})
    rmButton.click(function(){rmQuestion(quizContainer)})
    submitButton.click(function(){sendData(quizContainer)})

}