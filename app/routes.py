from app import app
from flask import render_template

@app.route('/')
def index_page():

    return render_template('ipcheck.html')

@app.route('/abc')
def abc_page():
    return 'ultraaaa gay!'
