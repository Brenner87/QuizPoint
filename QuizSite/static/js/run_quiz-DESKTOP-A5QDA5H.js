function runQuiz(questions, quizContainer, questionPattern, choicePattern, submitButton){
    var count=0

    function generateQuestions(questions, questionPattern, choicePattern){
        var output=[]
        var correct=[]
        for  (var i=0; i<questions.length; i++){
            var question=questions[i][0]
            var choices=questions[i].slice(1,-1)
            correct.push(questions[i].slice(-1)[0])
            var display= correct.length > 1 ? 'checkbox' : 'radio'
            var answers=renderChoices(choicePattern, display ,i , choices)
            var renderedQuestion=renderQuestion(questionPattern, question, i, answers )
            output.push(renderedQuestion)
        }
        return [output, correct]
    }

    function displayQuestion(questions, quizContainer){
        var [output, correct]=generateQuestions(questions, questionPattern, choicePattern)
        var answers=[]
        quizContainer.html(output[count])

        if (count>=questions.length){
            displayResults(answers, correct, quizContainer)
            return true
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

    function getAnswer(quizContainer){
        
    }

    function displayResults(answers, correct, quizContainer){
        quizContainer.html("Вітаю, ви успішно пройшли тест)
    }

    submitButton.click(function(){displayQuestion(questions, quizContainer)})

}