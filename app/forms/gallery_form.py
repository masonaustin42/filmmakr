from flask_wtf import FlaskForm
from wtforms import StringField, DateField, BooleanField
from wtforms.validators import DataRequired, Email, ValidationError

class GalleryForm(FlaskForm):
    title = StringField('title', validators=[DataRequired()])
    date = DateField('date')
    password = StringField('password')
    is_public = BooleanField('is public')