from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField 
from wtforms.fields import EmailField
from wtforms.validators import DataRequired, Email, Length, Regexp

class ContactForm(FlaskForm):
    name = StringField(
        'Nombre',
        validators=[DataRequired(message="El nombre es requerido."),
                    Length(min=2, max=50, message="El nombre debe tener entre 2 y 50 caracteres.")]
    )
    email = EmailField(
        'Correo Electrónico',
        validators=[DataRequired(message="El correo electrónico es requerido."),
                    Email(message="Ingrese un correo válido.")]
    )
    phone = StringField(
        'Teléfono',
        validators=[DataRequired(message="El teléfono es requerido."),
                    Length(min=10, max=10, message="El teléfono debe tener 10 dígitos."), 
                    Regexp(r'^[0-9]{10}$', message="Solo se permiten 10 dígitos numéricos.")]
    )
    message = TextAreaField(
        'Mensaje',
        validators=[DataRequired(message="El mensaje no puede estar vacío."),
                    Length(min=10, max=500, message="El mensaje debe tener entre 10 y 500 caracteres.")]
    )