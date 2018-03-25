from django import forms
from .models import Item
import json

class QuizForm(forms.ModelForm):
    error_css_class = 'error'
    required_css_class = 'required'
    quiz = forms.CharField(max_length=4000, widget=forms.HiddenInput())

    class Meta:
        model=Item
        fields=('title', 'category', 'description', 'quiz')

    def validate_json(self, quiz):
        max_question_number = 40
        try:
            jsonItem = json.loads(quiz)
        except Exception as err:
            raise forms.ValidationError('Валідацію тесту провалено')
        try:
            questions = jsonItem['question']
        except Exception as err:
            raise forms.ValidationError('Валідацію тесту провалено')

        if not isinstance(questions, list) or len(questions) < 1:
            raise forms.ValidationError('Кількість питаннь менше 1го')
        if not isinstance(questions, list) or len(questions) >= max_question_number:
            raise forms.ValidationError('Питаннь не може бути більше {}'.format(max_question_number))
        for question in questions:
            try:
                question_text = question[0]
                answers = question[-1]
            except Exception:
                raise forms.ValidationError('Не вистачає полів')
            for item in question:
                if len(item)>300:
                    raise forms.ValidationError('Перевищено ліміт символів')
            if not question_text:
                raise forms.ValidationError('Текст питання є обов\'язковим')
            if not isinstance(answers, list) or len(answers) < 1:
                raise forms.ValidationError('Не вказано варіанти відповіді')
            if sorted(answers) != answers:
                raise forms.ValidationError('Список відвовідей не впорядковано ')
            for i in answers:
                if not isinstance(i, int):
                    raise forms.ValidationError('Варіанти відповіді можуть бути лише цифри')
                if i > len(question[1:-1]):
                    raise forms.ValidationError('Варіанта відповіді з таким номером не існує')
                if i <= 0:
                    raise forms.ValidationError('Варіанти відповіді не можуть бути менше 0')



    def clean_quiz(self):
        quiz=self.cleaned_data.get('quiz')
        self.validate_json(quiz)
        return quiz


class LoginForm(forms.Form):
    error_css_class = 'error'
    required_css_class = 'required'
    username=forms.CharField(label='Логін')
    password=forms.CharField(widget=forms.PasswordInput, label='Пароль')


class GetAnswers(forms.Form):
    error_css_class = 'error'
    required_css_class = 'required'
    answers = forms.CharField(max_length=400, widget=forms.HiddenInput())

    def validate_json(self, answers):
        try:
            jsonItem = json.loads(answers)
        except Exception as err:
            raise forms.ValidationError('Не вдалося зчитати варіанти відповіді')


    def clean_answers(self):
        answers=self.cleaned_data.get('answers')
        self.validate_json(answers)
        return answers



