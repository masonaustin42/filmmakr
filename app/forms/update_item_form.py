from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, BooleanField
from app.api.aws_helpers import ALLOWED_EXTENSIONS

class UpdateItemForm(FlaskForm):
    name = StringField('name')
    is_main = BooleanField("is_main")
    media = FileField("media", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])