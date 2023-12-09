from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField, BooleanField
from app.api.aws_helpers import ALLOWED_EXTENSIONS

class ItemForm(FlaskForm):
    name = StringField('name')
    is_main = BooleanField("is_main")
    media = FileField("media", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))])