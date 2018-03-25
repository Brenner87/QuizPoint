function viewResults(questions, quizContainer, questionPattern, choicePattern, submitButton, resultPattern, title, titleText, answers){

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
        console.log(this)

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

    submitButton.click(function(){displayResults(questions, quizContainer, title, titleText, answers); $(this).remove()})

}