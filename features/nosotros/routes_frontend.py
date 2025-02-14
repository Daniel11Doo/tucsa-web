from flask import Blueprint, redirect, render_template, url_for
# Rutas o EndPoints compuestas con el prefijo referente a la feature actual (user)
app = Blueprint('AboutUsPages', __name__, url_prefix='/nosotros')

@app.get('/')
def home():
    return render_template ("nosotros.html")

