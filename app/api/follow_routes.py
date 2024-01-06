from flask import Blueprint
from flask_login import login_required, current_user
from app.models import User, Follow, db

follow_routes = Blueprint('follows', __name__)

@follow_routes.route('/', methods=['GET'])
@login_required
def get_follows():
    follows = Follow.query.filter_by(user_id = current_user.id).all()
    
    return {"follows": [follow.to_dict() for follow in follows]}


@follow_routes.route('/<int:user_id>', methods=['POST'])
@login_required
def follow_user(user_id):
    user = User.query.get(user_id)
    
    if not user:
        return {"errors": "User not found"}, 404
    
    if user.id == current_user.id:
        return {"errors": "You can't follow yourself"}, 403
    
    follow = Follow.query.filter_by(user_id = current_user.id, following_id = user_id).one_or_none()
    
    if follow:
        return {"errors": "You are already following this user"}, 403
    
    new_follow = Follow(user_id = current_user.id, following_id = user_id)
    db.session.add(new_follow)
    db.session.commit()
    
    return user.to_dict()

@follow_routes.route('/<int:user_id>', methods=['DELETE'])
@login_required
def unfollow_user(user_id):
    user = User.query.get(user_id)
    
    if not user:
        return {"errors": "User not found"}, 404
    
    if user.id == current_user.id:
        return {"errors": "You can't unfollow yourself"}, 403
    
    follow = Follow.query.filter_by(user_id = current_user.id, following_id = user_id).one_or_none()
    
    if not follow:
        return {"errors": "You are not following this user"}, 403
    
    db.session.delete(follow)
    db.session.commit()
    
    return user.to_dict()