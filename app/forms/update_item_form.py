from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField
from app.api.aws_helpers import ALLOWED_EXTENSIONS

class UpdateItemForm(FlaskForm):
    name = StringField('name')
    media = FileField("media", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])