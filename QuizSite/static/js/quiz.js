function generateQuiz(questions, quizContainer, resultsContainer, submitButton){

    function showQuestions(questions, quizContainer){
        var output=[]
        var answers
        var question
        var correct
        var display

        for  (var i=0; i<questions.length; i++){
            answers=[]
            question=questions[i][0]
            choices=questions[i].slice(1,-1)
            correct=questions[i].slice(-1)[0]
            display= correct.length > 1 ? 'checkbox' : 'radio'
            for (var j=0; j<choices.length; j++){
                answers.push(
				    '<label>'
					    + '<p><input type="'
					    + display
					    + '" name="question'
					    + i
					    + '" value="'
					    + (j+1)
					    + '">'
					    + (j+1)
					    + ': '
					    + choices[j]
				    + '</p></label>'
			    )
            }
            output.push(
			'<div class="question">'
			+ question
			+ '</div>'
			+ '<div class="answers">'
			+ answers.join('')
			+ '</div>'
		    )
		    quizContainer.innerHTML = output.join('')


        }
    }

    function showResults(questions, quizContainer, resultsContainer){
        // gather answer containers from our quiz
	    var answerContainers = quizContainer.querySelectorAll('.answers');
	    var userAnswer = '';
	    var numCorrect = 0;
	    for(var i=0; i<questions.length; i++){
	        question=questions[i][0]
            choices=questions[i].slice(1,-1)
            correct=questions[i].slice(-1)[0]
		    // find selected answer
		    userAnswers1 = answerContainers[i].querySelectorAll('input[name=question'+i+']:checked')||[]
            userAnswers=[]
		    for (var j=0; j<userAnswers1.length; j++){
		        userAnswers[j]=Number(userAnswers1[j].value)
		    }
		    if (userAnswers.length==correct.length){

			    // add to the number of correct answers
			    for (var j=0; j<correct.length; j++){
			        if (!(userAnswers.indexOf(correct[j]) > -1 )){
			            answerContainers[i].style.color = 'red'
			            break
			        }
			        if (j==(correct.length-1)){
			            numCorrect++
			            answerContainers[i].style.color = 'lightgreen'
			        }
			    }
		    }
		    else{
			    answerContainers[i].style.color = 'red'
		    }
	    }
	    resultsContainer.innerHTML = numCorrect + ' out of ' + questions.length
    }

    showQuestions(questions, quizContainer);
    submitButton.onclick=function(){
        showResults(questions, quizContainer, resultsContainer);
    }
}