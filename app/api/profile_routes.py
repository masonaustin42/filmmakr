from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import User

profile_routes = Blueprint('profiles', __name__)


@profile_routes.route("/<username>/full")
@login_required
def get_profile_full(username):
    user = User.query.filter_by(username = username).one_or_none()
    
    if not user:
        return {"errors": "User not found"}, 404
    
    if user.id != current_user.id:
        return {"errors": "Unauthorized"}, 403
    
    return user.to_dict_profile_full()

@profile_routes.route("/<username>")
def get_profile(username):
    user = User.query.filter_by(username = username).one_or_none()
    
    if not user:
        return {"errors": "User not found"}, 404
    
    return user.to_dict_profile()