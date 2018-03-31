function addQuestion(quizContainer, formPattern, choicePattern){
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
            var [block, alertMessages]=parceForm(block[block.length-1], $('input[name=title]').val(), questionNumber)
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

function parceForm(form, name, questionNumber){
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
    var alertMessages=validateForm(name, questionText, question, answers, questionNumber)
    question.push(answers.split(',').filter(Boolean).map(Number).sort())
    question.unshift(questionText)
    return [question, alertMessages]
}

function validateForm(name, question, choices, answers, questionNumber){
    var alertMessages=[]
    var maxQuestions=40
    questionNumber>maxQuestions && alertMessages.push('Максимальна кількість питаннь досягнена (' + maxQuestions + ')')
    !(name) && alertMessages.push('Вкажіть назву тесту.')
    /*ajaxTitleValidation(name) && alertMessages.push('Тест з такою назвою вже існує')*/
    !(question) && alertMessages.push('Введіть текст питання.')
    choices.length<2 && alertMessages.push('Варіантів відповіді повинно бути мінімум 2.')
    !answers.trim() && alertMessages.push('Правильні варіанти повинні мати вигляд номерів, перерахованих черех кому.')
    $(answers.split(',')).each(function(){
        if (!(typeof Number(this)==='number' && (Number(this)%1)===0 && (Number(this)>=0))){
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

function sendData(quizContainer, validateUrl, itemId) {
    var alertMessages=[]
    var quiz=createJson(quizContainer)
    !$('input[name=title]').val() && alertMessages.push('Оберіть назву для вашого тесту')
    ajaxTitleValidation($('input[name=title]').val(), validateUrl, itemId) && alertMessages.push('Тест з такою назвою вже існує')
    !$('#id_category').val() && alertMessages.push('Необідно вибрати категорію')
    !$('input[name=description').val() && alertMessages.push('Поле "Короткий опис" не може бути пустим')
    !quiz.question.length && alertMessages.push('Необхідно додати хоча б 1 питання')
    alertMessages.length && alertNotification(alertMessages)
    !alertMessages.length && $('input[name=quiz]').val(JSON.stringify(quiz))
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

function ajaxTitleValidation(name, validateUrl, itemId){
    var is_exist=false
    if (itemId == 'None') {itemId=undefined}
    checkTitle=$.ajax({
                url: validateUrl,
                async: false,
                cache: false,
                data: {
                    'title':name,
                    'id'   :itemId
                },
                dataType: 'json',

            })
    checkTitle.done(function(data){
                    is_exist=data.is_taken})
    return is_exist
}

