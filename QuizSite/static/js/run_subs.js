function generateQuestions(questions, questionPattern, choicePattern){
        $('#submitForm').submit(function(event){event.preventDefault()})
        var output=[]
        /*var correct=[]*/
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


function renderQuestion(questionPattern, questionText, questionNum, answers ){
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