function runQuiz(questions, quizContainer, questionPattern, choicePattern, submitButton, resultPattern, title, titleText){
    var count=0
    var userAnswers=[]
    var alertMessages=[]
    console.log(title)


    /*function generateQuestions(questions, questionPattern, choicePattern){
        $('#submitForm').submit(function(event){event.preventDefault()})
        var output=[]
        *//*var correct=[]*//*
        for  (var i=0; i<questions.length; i++){
            var question=questions[i][0]
            var choices=questions[i].slice(1,-1)
            var display= questions[i].slice(-1)[0] > 1 ? 'checkbox' : 'radio'
            var answers=renderChoices(choicePattern, display ,i , choices)
            var renderedQuestion=renderQuestion(questionPattern, question, i, answers)
            output.push(renderedQuestion)
        }
        return output
    }
*/
    function displayQuestion(questions, quizContainer, title, titleText){
        if (alertMessages.length){
            alert(alertMessages.pop())
            return false
        }
        /*Below string shouldn't be calculated each time when function called*/
        var state='('+(count+1)+'/'+questions.length+')'
        console.log(state)
        console.log($(title))
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

    /*function renderQuestion(questionPattern, questionText, questionNum, answers ){
        var output=[]
        var question=$($.parseHTML($(questionPattern).html()))
        question.first().attr('id', questionNum)
        question.find('h3').html(questionText)
        question.last().html(answers.join(''))
        return question.get(0).outerHTML + question.get(1).outerHTML
    }

    function renderChoices(choicePattern, display ,questionNum , choices){
        var answers=[]
        for (var j=0; j<choices.length; j++){
            var choice=$($.parseHTML($(choicePattern).html()))
                choice.find('input').attr({
                    'type' : display,
                    'name' : 'question'+questionNum,
                    'value': j+1
                })
                $(choice).find('span').html(choices[j])
            answers.push(choice.get(0).outerHTML)
        }
        return answers
    }
*/
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

  /*  function displayResults(answers, correct, quizContainer, resultPattern){
        var result=$($.parseHTML($(resultPattern).html()))
        if (answers.length != correct.length) {
            quizContainer.html(result.find('h3').html("Щось пішло не так. Зверніться до адміністратора"))
            return false
        }
        correctCount=0
        for (var i=0; i<answers.length; i++){
            if (answers[i].length==correct[i].length
            && answers[i].every((element, index)=>element===correct[i][index])){
                correctCount+=1
            }
        }
        quizContainer.html($(result).find('h3').html("Тест завершено. Ваш результат: "+correctCount+"/"+answers.length))
        submitButton.unbind()
    }*/
    displayQuestion(questions, quizContainer, title, titleText)
    submitButton.click(function(){getAnswer(count)})
    submitButton.click(function(){displayQuestion(questions, quizContainer, title, titleText)})

}