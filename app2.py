from flask import Flask, render_template, request
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

app = Flask(__name__)

cred = credentials.Certificate("firestore.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/')
def index():
    doc_ref = db.collection('courses').document('course_1')
    course = doc_ref.get().to_dict()

    if not course:
        return 'Курс не найден'

    return render_template('edit_course.html', course=course)

@app.route('/edit_course/<course_id>', methods=['GET', 'POST'])
def edit_course(course_id):
    doc_ref = db.collection('courses').document(f'course_{course_id}')
    course = doc_ref.get().to_dict()

    if not course:
        return 'Курс не найден'

    if request.method == 'POST':
        title = request.form['title']
        author = request.form['author']
        date = request.form['date']
        video_src = request.form['video_src']
        course_name = request.form['course_name']
        course_slogan = request.form['course_slogan']

        chapters = []
        for i in range(1, int(request.form.get('num_chapters')) + 1):
            chapter_title = request.form.get(f'chapter_title_{i}')
            chapter_content = request.form.get(f'chapter_content_{i}')
            chapter = {
                'title': chapter_title,
                'content': chapter_content,
                'text_blocks': [],
                'video_links': []
            }
            for j in range(1, int(request.form.get(f'num_text_blocks_{i}')) + 1):
                text_block = request.form.get(f'chapter_text_block_{i}_{j}')
                chapter['text_blocks'].append(text_block)

            for j in range(1, int(request.form.get(f'num_video_links_{i}')) + 1):
                video_link = request.form.get(f'chapter_video_link_{i}_{j}')
                chapter['video_links'].append(video_link)

            chapters.append(chapter)

        course_descriptions = []
        for i in range(1, int(request.form.get('num_descriptions')) + 1):
            description = request.form.get(f'course_description_{i}')
            course_descriptions.append(description)

        doc_ref.update({
            "title": title,
            "author": author,
            "date": date,
            "video_src": video_src,
            "course_name": course_name,
            "course_slogan": course_slogan,
            "chapters": chapters,
            "course_descriptions": course_descriptions
        })

        return 'Курс успешно обновлен и сохранен в Firestore.'

    return render_template('edit_course.html', course=course)

if __name__ == '__main__':
    app.run(debug=True)
