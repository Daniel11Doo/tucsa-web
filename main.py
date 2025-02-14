from flask import Flask, render_template, request, redirect, url_for
from features.nosotros.routes_frontend import app as nosotros_app
app = Flask(__name__)


app.register_blueprint(nosotros_app)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)