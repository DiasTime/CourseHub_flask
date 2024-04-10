from flask import Flask, render_template, jsonify
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import random

app = Flask(__name__)

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

@app.route('/courses')
def courses():
    courses = get_course_documents()
    return jsonify(courses)

if __name__ == '__main__':
    app.run(debug=True, port=5003)
