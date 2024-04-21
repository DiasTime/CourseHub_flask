from flask import Flask, render_template, request, redirect, url_for
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import jinja2

app = Flask(__name__)

# Инициализация Firestore с вашими учетными данными
cred = credentials.Certificate("firestore.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def convert_to_embed_url(video_url):
    return video_url.replace("watch?v=", "embed/")

def get_course(course_id):
    doc_ref = db.collection('courses').document(f'course_{course_id}')
    course = doc_ref.get().to_dict()
    return course

@app.route('/edit_course/<int:course_id>')
def edit_course(course_id):
    course = get_course(course_id)
    return render_template('edit_course.html', course=course)

@app.route('/update_course/<int:course_id>', methods=['POST'])
def update_course(course_id):
    title = request.form['title']
    author = request.form['author']
    date = request.form['date']
    video_src = request.form['video_src']
    video_embed_src = convert_to_embed_url(video_src)
    course_name = request.form['course_name']
    course_slogan = request.form['course_slogan']

    # Получаем текущий курс из Firestore
    course = get_course(course_id)

    # Обновляем описание курса
    course_descriptions = [value for key, value in request.form.items() if key.startswith('course_description_')]
    if not course_descriptions:
        course_descriptions = course.get('course_descriptions', [])

    # Обновляем данные глав
    chapters = []
    for key, value in request.form.items():
        if key.startswith('chapter_title_'):
            chapter_num = key.split('_')[-1]
            chapter_content = {
                'title': request.form.get(f'chapter_title_{chapter_num}'),
                'content': request.form.get(f'chapter_content_{chapter_num}'),
                'video': request.form.getlist(f'chapter_video_{chapter_num}'),
                'code': request.form.getlist(f'chapter_code_{chapter_num}'),
                'image': request.form.getlist(f'chapter_image_{chapter_num}'),
                'text': request.form.getlist(f'chapter_text_{chapter_num}')
            }

            # Если данные пусты, используем текущие данные из Firestore
            for key in ('video', 'code', 'image', 'text'):
                if not chapter_content[key]:
                    chapter_content[key] = course['chapters'][int(chapter_num) - 1][key]

            chapters.append(chapter_content)

    # Обновление информации о курсе в Firestore
    doc_ref = db.collection('courses').document(f'course_{course_id}')
    doc_ref.update({
        "title": title,
        "author": author,
        "date": date,
        "video_src": video_src,
        "video_embed_src": video_embed_src,
        "course_name": course_name,
        "course_slogan": course_slogan,
        "course_descriptions": course_descriptions,
        "chapters": chapters
    })

    return 'Курс успешно обновлен и сохранен в Firestore.'





if __name__ == '__main__':
    app.run(debug=True,port=5002)
