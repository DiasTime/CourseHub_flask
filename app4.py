from flask import Flask, render_template, jsonify, request, redirect,url_for
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import random

app = Flask(__name__)

correct_password = "12345678"

# Initialize Firestore with your credentials
cred = credentials.Certificate("firestore.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def get_course_documents():
    courses_ref = db.collection('courses').get()
    courses = [course_doc.to_dict() for course_doc in courses_ref]
    return courses

@app.route('/')
def index():
    return render_template('dashboard.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        password_attempt = request.form['password']
        if password_attempt == correct_password:
            return redirect(url_for('index'))  # Перенаправляем на основную страницу
    return render_template('login.html')

@app.route('/courses')
def courses():
    courses = get_course_documents()
    return jsonify(courses)

@app.route('/delete_course/<course_id>', methods=['DELETE'])
def delete_course(course_id):
    doc_ref = db.collection('courses').document(course_id)
    doc_ref.delete()
    return jsonify({'message': 'Course deleted successfully'})


if __name__ == '__main__':
    app.run(debug=True, port=5003)
