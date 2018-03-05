function runQuiz(questions, quizContainer, questionPattern, choicePattern, submitButton){
    var count=0
    var userAnswers=[]
    var alertMessages=[]

    function generateQuestions(questions, questionPattern, choicePattern){
        var output=[]
        var correct=[]
        for  (var i=0; i<questions.length; i++){
            var question=questions[i][0]
            var choices=questions[i].slice(1,-1)
            correct.push(questions[i].slice(-1)[0])
            var display= questions[i].slice(-1)[0].length > 1 ? 'checkbox' : 'radio'
            var answers=renderChoices(choicePattern, display ,i , choices)
            var renderedQuestion=renderQuestion(questionPattern, question, i, answers )
            output.push(renderedQuestion)
        }
        return [output, correct]
    }

    function displayQuestion(questions, quizContainer){
        if (alertMessages.length){
            alert(alertMessages.pop())
            return false
        }
        var [output, correct]=generateQuestions(questions, questionPattern, choicePattern)
        quizContainer.html(output[count])

        if (count>=questions.length){
            displayResults(userAnswers, correct, quizContainer)
            return false
        }

        count+=1
    }

    function renderQuestion(questionPattern, questionText, questionNum, answers ){
        var output=[]
        var question=$($.parseHTML($(questionPattern).html()))
        question.first().attr('id', questionNum)
        question.first().html(questionText)
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
                $(choice).html(function(ind, origText){
                    return origText + (j+1+': '+choices[j])})
            answers.push(choice.get(0).outerHTML)
        }
        return answers
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

    function addAnswer(quizContainer){

    }

    function displayResults(answers, correct, quizContainer){
        if (answers.length != correct.length) {
            quizContainer.html("Щось пішло не так. Зверніться до адміністратора")
            return false
        }
        correctCount=0
        for (var i=0; i<answers.length; i++){
            if (answers[i].length==correct[i].length
            && answers[i].every((element, index)=>element===correct[i][index])){
                correctCount+=1
            }
        }

        quizContainer.html("Тест завершено. Ваш результат: "+correctCount+"/"+answers.length)
        submitButton.unbind()
    }
    displayQuestion(questions, quizContainer)
    submitButton.click(function(){getAnswer(count)})
    submitButton.click(function(){displayQuestion(questions, quizContainer)})

}