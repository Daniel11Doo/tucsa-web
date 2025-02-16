from .models import ContactForm
from flask import Blueprint, redirect, render_template, url_for
app = Blueprint('ContactPages', __name__, url_prefix='/contacto')

@app.get('/')
def contacto():
    form = ContactForm()
    return render_template ("contacto.html", form=form)