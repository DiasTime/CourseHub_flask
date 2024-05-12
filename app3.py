from flask import Flask, request, redirect, render_template
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

app = Flask(__name__)
cred = credentials.Certificate("firestore.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/delete_course/<int:course_id>', methods=['GET', 'POST'])
def delete_course(course_id):
    return render_template('delete_course.html', course_id=course_id)

@app.route('/confirm_delete/<int:course_id>', methods=['POST'])
def confirm_delete(course_id):
    # Удаляем курс из базы данных
    doc_ref = db.collection(u'courses').document(f'course_{course_id}')
    doc_ref.delete()

    # Обновляем имена оставшихся курсов и их courseId
    remaining_courses_after = db.collection(u'courses').stream()
    for i, course in enumerate(remaining_courses_after):
        old_course_id = int(course.id.split('_')[1])
        new_course_id = i + 1

        # Проверяем, не был ли этот документ удален
        if course_id != old_course_id:
            # Обновляем имя документа
            new_doc_name = f'course_{new_course_id}'
            doc_ref = db.collection(u'courses').document(course.id)
            doc_ref.update({u'name': new_doc_name})
            # Обновляем значение courseId внутри документа
            doc_ref.update({u'courseId': new_course_id})

    # Проверяем, если какие-то курсы пропущены, и обновляем их имена и courseId
    courses_after_deletion = [int(course.id.split('_')[1]) for course in db.collection(u'courses').stream()]
    missing_courses = set(range(1, course_id + 1)) - set(courses_after_deletion)
    for missing_course_id in missing_courses:
        doc_ref = db.collection(u'courses').document(f'course_{missing_course_id}')
        doc = doc_ref.get()
        if doc.exists:
            doc_ref.update({u'name': f'course_{missing_course_id}', u'courseId': missing_course_id})
        else:
            # Если документа не существует, создаем его снова
            return redirect('/deleted_successfully')

@app.route('/deleted_successfully', methods=['GET'])
def deleted_successfully():
    return 'Course deleted successfully'

if __name__ == '__main__':
    app.run(debug=True, port=5006)
