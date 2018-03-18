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

        addChoice(choiceBlock, choicePattern)
        addChoice(choiceBlock, choicePattern)
        plusChoiceButton.click(function(){addChoice(choiceBlock, choicePattern)})
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

    function addChoice(block, choicePattern){
        var item=block.find('input:last')
        var number=$(item).attr('name')
        if (!number){number=0}
        number=Number(number)+1
        var choice=$($.parseHTML($(choicePattern).html()))
        choice.first().attr('for', 'choice'+number)
        choice.first().text(number+':')
        choice.find('input').attr('name', number)
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
        question.push(answers.split(',').map(Number).sort())
        question.unshift(questionText)
        return [question, alertMessages]
    }

    function validateForm(name, question, choices, answers){
        var alertMessages=[]
        !(name) && alertMessages.push('Вкажіть назву тесту.')
        ajaxTitleValidation(name) && alertMessages.push('Тест з такою назвою вже існує')
        !(question) && alertMessages.push('Введіть текст питання.')
        choices.length<2 && alertMessages.push('Варіантів відповіді повинно бути мінімум 2.')
        !answers.trim() && alertMessages.push('Правильні варіанти повинні мати вигляд номерів, перерахованих черех кому.')
        $(answers.split(',')).each(function(){
            if (!(typeof Number(this)==='number' && (Number(this)%1)===0)){
                alertMessages.push('Варіанти відповіді повинні мати вигляд номерів, перерахованих черех кому.')
                return false
            }
            if (Number(this)>choices.length){
                alertMessages.push('У правильних варіантах вказано неіснуючий варіант')
                
            }
        })
        if (alertMessages.length){ return alertMessages }
        else { return undefined }
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
        if (quiz.question.length){
            $('input[name=quiz]').val(JSON.stringify(quiz))
        }
        else {
            $('#submitForm').submit(function(event){event.preventDefault()})
            alert('Необідно додати хоча б 1 питання')
        }
    }

    function addQuestionBlock(questionNumber, formPattern){
        var question=$($.parseHTML($(formPattern).html()))
        question.first().attr('id', 'question_'+questionNumber)
        question.find('#errorMessage').attr('id', 'errorMessage'+questionNumber)
        question.find('label').first().text('Питання ' + questionNumber)
        question.find('#addChoice').attr('id', 'addChoice'+questionNumber)
        question.find('#rmChoice').attr('id', 'rmChoice'+questionNumber)
        return question
    }

    function ajaxTitleValidation(name){
        var is_exist=false
        $.ajax({
            url: '/ajax/validate_quiz_title/',
            data: {
                'title':name
            },
            dataType: 'json',
            success: function(data){
                if (data.is_taken) {
                    is_exist=true
                    alert("alert")
                }
            }
        })
        console.log(name)
        console.log(is_exist)
        return is_exist
    }