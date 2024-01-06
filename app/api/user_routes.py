from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import User

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
def get_users(): 
    """
    Query for all users and returns a list of dictionaries
    """
    users = User.query.all()
    return {"users": [user.to_dict_search() for user in users]}

@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()
