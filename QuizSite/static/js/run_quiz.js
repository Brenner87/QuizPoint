function runQuiz(questions, quizContainer, questionPattern, choicePattern, submitButton, resultPattern, title, titleText){
    var count=0
    var userAnswers=[]
    var alertMessages=[]

    function displayQuestion(questions, quizContainer, title, titleText){
        if (alertMessages.length){
            alert(alertMessages.pop())
            return false
        }
        /*Below string shouldn't be calculated each time when function called*/
        var state='('+(count+1)+'/'+questions.length+')'
        $(title).find('h1').text(titleText+' '+state)
        var output=generateQuestions(questions, questionPattern, choicePattern)
        quizContainer.find('form div:first').html(output[count])

        if (count>=questions.length){
            sendData(quizContainer, userAnswers)
            $('#submitForm').unbind('submit').submit()
            return false
        }

        count+=1
    }

    function getAnswer(count){
        var userAnswer=[]
        var choices=$('input:checked')
        choices.each(function(){
            userAnswer.push(Number($(this).attr('value')))
        })
        userAnswer.length && userAnswers.push(userAnswer)
        if (!(userAnswer.length)) {
            alertMessages.push('Оберіть хоча б один варіант')
            return false
        }
    }

    function sendData(quizContainer, items){
        if (items.length){
            $(quizContainer).find('input[name=answers]').val(JSON.stringify(items))
        }
    }


    displayQuestion(questions, quizContainer, title, titleText)
    submitButton.click(function(){getAnswer(count)})
    submitButton.click(function(){displayQuestion(questions, quizContainer, title, titleText)})

}