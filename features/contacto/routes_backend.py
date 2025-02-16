from flask import Blueprint, Response, jsonify, request
from .models import ContactForm

app = Blueprint('ContactAPIs', __name__, url_prefix='/contacto/api/')

@app.post('/add')
def contact():
    form = ContactForm()
    if form.validate_on_submit():
        # Procesar el formulario y enviar el correo
        # ...
        print("Formulario válido")
        return jsonify({'status': 'success', 'message': 'Mensaje enviado correctamente.'}), 200
    else:
        return jsonify({'status': 'error', 'errors': form.errors}), 400