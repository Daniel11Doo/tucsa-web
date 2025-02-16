import os
from flask import Flask, render_template, request, redirect, url_for
from features.nosotros.routes_frontend import app as nosotros_app
from features.contacto.routes_frontend import app as contacto_front
from features.contacto.routes_backend import app as contacto_back
from flask_wtf.csrf import CSRFProtect
from dotenv import load_dotenv
app = Flask(__name__)

basedir = os.path.abspath( os.path.dirname(__file__) )
load_dotenv( os.path.join(basedir, ".env") )
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

csrf = CSRFProtect(app)

app.register_blueprint(nosotros_app)
app.register_blueprint(contacto_front)
app.register_blueprint(contacto_back)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)