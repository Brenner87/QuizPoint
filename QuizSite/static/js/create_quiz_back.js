function createQuiz(quizContainer, appendButton, submitButton, formPattern, choicePattern){


    function addQuestion(quizContainer){
        var questionBlock=quizContainer.find('[id^=question_]')
        if ($(questionBlock).attr('id')){
            var questionId=$(questionBlock).last().attr('id').split('_')
            var questionNumber=questionId[questionId.length-1]
        }
        else {questionNumber=0}
        questionNumber=Number(questionNumber)+1
        var question=addQuestionBlock(questionNumber, formPattern)
        if (questionNumber>1) {
            var block=quizContainer.find('form')
            var [block, alertMessages]=parceForm(block[block.length-1], $('input[name=title]').val())
            if (alertMessages){
                alertNotification(alertMessages)
                return false
            }
        }
        quizContainer.append(question)

        var choiceBlock=$('#question_'+questionNumber).find('#choices')
        var plusChoiceButton=$('#addChoice'+ questionNumber)
        var minusChoiceButton=$('#rmChoice'+ questionNumber)

        addChoice(choiceBlock)
        addChoice(choiceBlock)
        plusChoiceButton.click(function(){addChoice(choiceBlock)})
        minusChoiceButton.click(function(){rmChoice(choiceBlock)})
        questionNumber++

        if (questionNumber>40){
            alert('Максимальна кількість питаннь досягнена')
            return false
        }
    }

    function rmQuestion(quizContainer){
        var questionBlock=quizContainer.find('[id^=question_]')
        if ($(questionBlock).attr('id')){
            $(questionBlock).last().remove()
        }
    }

    function addChoice(block){
        var item=block.find('input:last')
        var number=$(item).attr('name')
        if (!number){number=0}
        number=Number(number)+1
        var choice='<label for="choice'+ number +
            '" class="control-label col-md-2">'+number+': </label>'+
            '<div class="col-md-10">'+
            '<input type="text" name="' + number + '" class="form-control ">'+
            '</div>'
        block.append(choice)

    }

    function rmChoice(block){
        var item=block.find('input:last')
        var number=$(item).attr('name')
        if (Number(number)<3){return false}
        block.find('div').last().remove()
        block.find('label').last().remove()
    }

    function createJson(quizContainer){
        $('#submitForm').unbind('submit').submit()
        var quiz={}
        quiz.question=[]
        quiz.name=$('input[name=title]').val()
        var questions=quizContainer.find('form')
        for (var i=0; i<questions.length; i++){
            var [question, alertMessages]=parceForm(questions[i], quiz.name)
            quiz.question.push(question)
            if (alertMessages){
                alertNotification(alertMessages)
            }
        }
        return quiz
    }

    function parceForm(form, name){
        var question=[]
        items=$(form).find('input')
        var questionText=$(items[0]).val().trim()
        var answers=$(items[items.length-1]).val().trim()
        for (var j=0; j<items.length; j++){
            if (items[j].name=="correctAnswers" || items[j].name=="question"){
                continue
            }
            if (items[j].value.trim()){
                question.push(items[j].value.trim())
            }
        }
        var alertMessages=validateForm(name, questionText, question, answers)
        question.push(answers.split(',').map(Number))
        question.unshift(questionText)
        return [question, alertMessages]
    }

    function validateForm(name, question, choices, answers){
        var alertMessages=[]
        !(name) && alertMessages.push('Вкажіть назву тесту.')
        !(question) && alertMessages.push('Введіть текст питання.')
        choices.length<2 && alertMessages.push('Варіантів відповіді повинно бути мінімум 2.')
        !answers.trim() && alertMessages.push('Правильні варіанти повинні мати вигляд номерів, перерахованих черех кому.')
        $(answers.split(',')).each(function(){
            if (!(typeof Number(this)==='number' && (Number(this)%1)===0)){
                alertMessages.push('Варіанти відповіді повинні мати вигляд номерів, перерахованих черех кому.')
                return false
            }
        })
        if (alertMessages.length){ return alertMessages }
        else {return undefined}
    }

    function alertNotification(alertMessages){
        $('#submitForm').submit(function(event){event.preventDefault()})
        alert(alertMessages[0])
        /*var errorElement=document.createElement("div")
        errorElement.classList.add("invalid-feedback")
        errorElement.innerHTML='<ul class="errorlist"><li>Вкажіть правильні варианти відповіді</li></ul>'
        document.getElementById("errorMessage"+String(i+1)).appendChild(errorElement)*/
    }

    function sendData(quizContainer) {
        quiz=createJson(quizContainer)
        $('input[name=quiz]').val(JSON.stringify(quiz))
    }

    function addQuestionBlock(questionNumber, formPattern){

        var question1=$($.parseHTML($(formPattern).html()))
        question1.first().attr('id', 'question_'+questionNumber)
        var item=question1.find('#errorMessage')
        question1.find('#errorMessage').attr('id', 'errorMessage'+questionNumber)
        question1.find('label').first().text('Питання ' + questionNumber)
        question1.find('#addChoice').attr('id', 'addChoice'+questionNumber)
        question1.find('#rmChoice').attr('id', 'rmChoice'+questionNumber)
        console.log(question1)
        /*var question='<div class="form container" id="question_' + questionNumber + '">'+
            '<form class="question form-horizontal" role="form">'+
            '<div id="errorMessage' + questionNumber + '"></div>'+
            '<div class="form-group">'+
            '<label class="control-label col-md-2">Питання ' + questionNumber + ':</label>'+
            '<div class="col-md-10">'+
            '<input type="text" name="question" class="form-control">'+
            '</div>'+
            '<div><p class="text-muted">Варіанти відповіді:</p></div>'+
            '<div id="choices">'+
            '</div>'+
            '<div class="btn-group col-md-12" pull-right>'+
            '<button type= "button" id="addChoice' + questionNumber + '" class="btn btn-default btn-group"><span class="glyphicon glyphicon-plus"></span></button>'+
            '<button type= "button" id="rmChoice' + questionNumber + '" class="btn btn-default btn-group"><span class="glyphicon glyphicon-minus"></span></button></div>'+
            '<label for="correctAnswers" class="control-label col-md-6">Правильні варіанти(через кому):</label>'+
            '<div class="col-md-6">'+
            '<input type="text" name="correctAnswers" class="form-control">'+
            '</div>'+
            '</div>'+
            '</form></div>'*/
        return question1
    }


    appendButton.click(function(){addQuestion(quizContainer)})
    rmButton.click(function(){rmQuestion(quizContainer)})
    submitButton.click(function(){sendData(quizContainer)})

}