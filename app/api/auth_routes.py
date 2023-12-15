from flask import Blueprint, jsonify, session, request
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
import re
from .aws_helpers import get_unique_filename, upload_file_to_s3

auth_routes = Blueprint('auth', __name__)



@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': ['Unauthorized']}


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        # Check if credential is email
        if re.match(r"^[\w\d]+@[\w\d\.]+\.[\w\d]+$", form.data['credential']):
            user = User.query.filter(User.email == form.data['credential']).first()
        else:
            user = User.query.filter(User.username == form.data['credential']).first()
        login_user(user)
        return user.to_dict()
    return {'errors': form.errors}, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        
        if form.data["profile_pic"]:
            profile_pic = form.data["profile_pic"]
            profile_pic.filename = get_unique_filename(profile_pic.filename)
            profileUpload = upload_file_to_s3(profile_pic)
            if "url" not in profileUpload:
                return profileUpload, 500
        
        user = User(
            username=form.data['username'],
            email=form.data['email'],
            password=form.data['password'],
            first_name=form.data['first_name'],
            last_name=form.data['last_name'],
            bio=form.data["bio"]
        )
        
        if form.data["profile_pic"]:
            user.profile_pic_url = f"{CLOUDFRONT_URL}/{profile_pic.filename}"
            
        
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict()
    return {'errors': form.errors}, 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': ['Unauthorized']}, 401