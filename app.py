from flask import Flask, render_template, request
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

app = Flask(__name__)

cred = credentials.Certificate("firestore.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def convert_to_embed_url(video_url):
    return video_url.replace("watch?v=", "embed/")

def get_next_course_number():
    courses_ref = db.collection('courses')
    return len(courses_ref.get()) + 1

@app.route('/')
def index():
    return render_template('add_course.html')

@app.route('/add_course', methods=['POST'])
def add_course():
    title = request.form['title'] 
    author = request.form['author']
    date = request.form['date']
    video_src = request.form['video_src']
    video_embed_src = convert_to_embed_url(video_src)
    course_name = request.form['course_name']
    course_slogan = request.form['course_slogan']

    chapters = []
    for key, value in request.form.items():
        if key.startswith('chapter_title_'):
            chapter_num = key.split('_')[-1]
            chapter_content = {
                'title': request.form.get(f'chapter_title_{chapter_num}'),
                'content': request.form.get(f'chapter_content_{chapter_num}'),
                'code': [],
                'image': [],
                'text': [],
                'video': []
            }

            for block_key, block_value in request.form.items():
                if block_key.startswith(f'chapter_code_{chapter_num}_'):
                    chapter_content['code'].append(request.form.get(block_key))
                elif block_key.startswith(f'chapter_image_{chapter_num}_'):
                    chapter_content['image'].append(request.form.get(block_key))
                elif block_key.startswith(f'chapter_text_{chapter_num}_'):
                    chapter_content['text'].append(request.form.get(block_key))
                elif block_key.startswith(f'chapter_video_{chapter_num}_'):
                    chapter_content['video'].append(request.form.get(block_key))                                

            chapters.append(chapter_content)

    course_descriptions = []
    for key, value in request.form.items():
        if key.startswith('course_description_'):
            course_description_num = key.split('_')[-1]
            course_description = request.form.get(f'course_description_{course_description_num}', '')
            course_descriptions.append(course_description)
            
    course_id = get_next_course_number()

    data = {
        "title": title,
        "author": author,
        "date": date,
        "video_src": video_src,
        "video_embed_src": video_embed_src,
        "course_name": course_name,      
        "course_slogan": course_slogan,
        "chapters": chapters,
        "course_descriptions": course_descriptions,
        "courseId": course_id
    }

    doc_ref = db.collection('courses').document(f'course_{course_id}')
    doc_ref.set(data)

    return 'Курс успешно добавлен и сохранен в Firestore.'


if __name__ == '__main__':
    app.run(debug=True)
