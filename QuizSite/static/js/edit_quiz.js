function editQuiz(quizContainer, appendButton, submitButton, formPattern, choicePattern, quiz, validateUrl, itemId){
    submitButton.prop('disabled', true)

    function buildQuiz(quiz, quizContainer){
        var output=[]
        var questions=JSON.parse(quiz).question
        for  (var i=0; i<questions.length; i++){
            var question=questions[i][0]
            var choices=questions[i].slice(1,-1)
            var answers=questions[i][questions[i].length-1]
            addQuestion(quizContainer, formPattern, choicePattern)
            var questionBlock=$('#question_'+(i+1))
            var choiceBlock=$('#question_'+(i+1)).find('#choices')
            questionBlock.find('input[name=question]').val(question)
            questionBlock.find('input[name=correctAnswers]').val(answers.join(','))
            for (var j=0; j<choices.length; j++){
                choiceField=$(questionBlock.find('input[name='+(j+1)+']'))
                if (choiceField.length){
                    choiceField.val(choices[j])
                }
                else {
                    addChoice(choiceBlock, choicePattern)
                    choiceField=$(questionBlock.find('input[name='+(j+1)+']'))
                    choiceField.val(choices[j])
                }
            }
            questionBlock.find('input[name=question]').val(question)


        }
        /*return [output, correct]*/
        return output
    }
    console.log(submitButton)
    buildQuiz(quiz, quizContainer)
    appendButton.click(function(){addQuestion(quizContainer, formPattern, choicePattern)})
    rmButton.click(function(){rmQuestion(quizContainer)})
    submitButton.click(function(){sendData(quizContainer, validateUrl, itemId)})
    $(document).on('change', ':input',
    function() {
        submitButton.prop('disabled', false)
    })
}