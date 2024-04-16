from flask import Flask, render_template, request, redirect, url_for
from docx import Document
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)

# Инициализация Firestore
cred = credentials.Certificate("firestore.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return redirect(request.url)
    
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)

    if file:
        # Чтение файла docx
        doc = Document(file)
        questions = []
        current_question = {}
        for paragraph in doc.paragraphs:
            # Разбиваем строку по знаку переноса строки на составляющие
            parts = paragraph.text.split('\n')
            # Извлекаем данные вопроса из каждой строки
            for part in parts:
                # Если строка не пустая
                if part.strip() != '':
                    # Ищем метку вопроса
                    if part.startswith('<q'):
                        if current_question:
                            questions.append(current_question)
                        current_question = {'title': ''}
                        # Извлекаем номер вопроса из метки
                        current_question['title'] = part.split('>')[1]
                    # Ищем варианты ответов
                    elif part.startswith('<v'):
                        if 'variants' not in current_question:
                            current_question['variants'] = []
                        # Извлекаем варианты ответов из метки
                        current_question['variants'].append(part.split('>')[1])
                    # Ищем правильный ответ
                    elif part.startswith('<a>'):
                        # Извлекаем правильный ответ из метки
                        current_question['correct'] = int(part.split('>')[1])

        if current_question:
            questions.append(current_question)
        
        # Сохранение вопросов в Firestore
        db.collection('tests').add({'questions': questions})
        return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True,port=5004)
