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

@app.route('/add_test/<int:courseId>', methods=['GET', 'POST'])
def add_test(courseId):
    course_doc_id = f"course_{courseId}"
    upload_status = "upload"  # Состояние кнопки по умолчанию
    
    if request.method == 'GET':
        course_ref = db.collection('courses').document(course_doc_id)
        course_data = course_ref.get().to_dict()
        if course_data:
            course_name = course_data.get('course_name', 'Unknown Course')
            return render_template('add_test.html', courseId=courseId, course_name=course_name, upload_status=upload_status)
        else:
            return "Курс не найден"
    elif request.method == 'POST':
        if 'file' not in request.files:
            return redirect(request.url)
        
        file = request.files['file']
        if file.filename == '':
            return redirect(request.url)

        if file:
            # Получаем идентификатор курса из URL
            courseId = courseId
            
            if not courseId:
                return "Не указан идентификатор курса"
            
            # Получаем время выполнения теста из формы
            quiz_time = request.form.get('quiz_time')
            
            if not quiz_time:
                return "Не указано время теста"
            
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
            
            # Обновление документа курса с новыми вопросами и временем теста
            course_ref = db.collection('courses').document(course_doc_id)
            course_data = course_ref.get().to_dict()
            if course_data is None:
                course_data = {}
            if 'questions' in course_data:
                course_data['questions'].extend(questions)
            else:
                course_data['questions'] = questions
            course_data['quiz_time'] = int(quiz_time)  # Конвертируем время в целое число
            course_ref.set(course_data)
            
            upload_status = "success"  # Установка состояния кнопки на "success"
            
            return render_template('add_test.html', courseId=courseId, upload_status=upload_status)
        
if __name__ == '__main__':
    app.run(debug=True, port=5004)
