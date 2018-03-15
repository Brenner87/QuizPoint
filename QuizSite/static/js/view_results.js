function runQuiz(questions, quizContainer, questionPattern, choicePattern, submitButton, resultPattern, title, titleText, answers){

    /*function generateQuestions(questions, questionPattern, choicePattern){
        $('#submitForm').submit(function(event){event.preventDefault()})
        var output=[]
        for  (var i=0; i<questions.length; i++){
            var question=questions[i][0]
            var choices=questions[i].slice(1,-1)
            var display= questions[i].slice(-1)[0].length > 1 ? 'checkbox' : 'radio'
            var answers=renderChoices(choicePattern, display ,i , choices)
            var renderedQuestion=renderQuestion(questionPattern, question, i, answers )
            output.push(renderedQuestion)
        }
        return output
    }*/

    function displayResults(questions, quizContainer, title, titleText, answers){
        var output=generateQuestions(questions, questionPattern, choicePattern)
        quizContainer.html(output.join())
        for (var i=0; i<questions.length; i++){
            var correctAnswer=questions[i].slice(-1)[0]
            if (arraysEqual(correctAnswer, answers[i])){
                $('#'+i).find('h3').addClass("bg-success")
                for (var j=0; j<answers[i].length; j++){
                    var item=$('input[name=question'+i+'][value='+(answers[i][j])+']')
                    item.attr('checked', true)
                }
            }
            else {
                $('#'+i).find('h3').addClass("bg-danger")
                for (var j=0; j<answers[i].length; j++){
                    var item=$('input[name=question'+i+'][value='+(answers[i][j])+']')
                    item.attr('checked', true)
                    item.parent().parent().addClass('bg-danger')
                }
            }
            for (var j=0; j<correctAnswer.length; j++){
                var correct=$('input[name=question'+i+'][value='+(correctAnswer[j])+']')
                correct.parent().parent().removeClass('bg-danger')
                correct.parent().parent().addClass('bg-success')
            }
        }
        unchecked=$('input')
        unchecked.attr("disabled", "disabled")
        unchecked.addClass('disabled')
    }

    function arraysEqual(arr1, arr2) {
        if(arr1.length !== arr2.length)
            return false;
        for(var i = arr1.length; i--;) {
            if(arr1[i] !== arr2[i])
                return false;
        }

        return true;
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
    }*/


    submitButton.click(function(){displayResults(questions, quizContainer, title, titleText, answers)})

}