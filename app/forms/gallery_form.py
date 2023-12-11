from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, DateField, BooleanField
from wtforms.validators import DataRequired
from app.api.aws_helpers import ALLOWED_EXTENSIONS_NO_AUDIO

class GalleryForm(FlaskForm):
    title = StringField('title', validators=[DataRequired()])
    date = DateField('date')
    remove_date = BooleanField("remove date")
    password = StringField('password')
    remove_password = BooleanField("remove password")
    is_public = BooleanField('is public')
    preview = FileField('preview', validators=[FileAllowed(list(ALLOWED_EXTENSIONS_NO_AUDIO))])