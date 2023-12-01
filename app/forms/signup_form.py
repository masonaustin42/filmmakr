from flask_wtf import FlaskForm
from flask_wtf.file import FileAllowed, FileField
from wtforms import StringField, TextAreaField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User
import re


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')
    
def is_email(form, field):
    # Checking if email is valid
    email = field.data
    if not re.match(r"^[\w\d]+@[\w\d\.]+\.[\w\d]+$", email):
        raise ValidationError('Email is invalid')
    


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


class SignUpForm(FlaskForm):
    username = StringField(
        'username', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[DataRequired(), user_exists, is_email])
    password = StringField('password', validators=[DataRequired()])
    first_name = StringField('first name', validators=[DataRequired()])
    last_name = StringField('last name', validators=[DataRequired()])
    bio = TextAreaField('bio')
    profile_pic = FileField('profile pic', validators=[FileAllowed(["png", "jpg", "jpeg"])])
    portfolio_pic = FileField('portfolio pic', validators=[FileAllowed(["png", "jpg", "jpeg"])])
