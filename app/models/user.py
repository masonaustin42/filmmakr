from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    bio = db.Column(db.String(1500))
    profile_pic_url = db.Column(db.String(1500))
    
    galleries = db.relationship('Gallery', back_populates='owner', cascade='all, delete-orphan')
    following = db.relationship('Follow', back_populates='user', cascade='all, delete-orphan', foreign_keys='Follow.user_id')
    follows = db.relationship('Follow', back_populates='following', cascade='all, delete-orphan', foreign_keys='Follow.following_id')
    

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'name': f"{self.first_name} {self.last_name}",
            'profile_pic': self.profile_pic_url,
            'follows': [follow.user.to_dict_simple() for follow in self.follows],
            'following': [follow.following.to_dict_simple() for follow in self.following],
        }
        
    def to_dict_profile(self):
        return {
            'id': self.id,
            'username': self.username,
            'name': f"{self.first_name} {self.last_name}",
            'bio': self.bio,
            'profile_pic': self.profile_pic_url,
            'galleries': [gallery.to_dict() for gallery in self.galleries if gallery.password is None],
            'follows': [follow.user.to_dict_simple() for follow in self.follows],
            'following': [follow.following.to_dict_simple() for follow in self.following],
        }
        
    def to_dict_profile_full(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'name': f"{self.first_name} {self.last_name}",
            'bio': self.bio,
            'profile_pic': self.profile_pic_url,
            'galleries': [gallery.to_dict() for gallery in self.galleries],
            'follows': [follow.user.to_dict_simple() for follow in self.follows],
            'following': [follow.following.to_dict_simple() for follow in self.following],
        }

    def to_dict_simple(self):
        return {
            'id': self.id,
            'username': self.username,
            'name': f"{self.first_name} {self.last_name}",
            'profile_pic': self.profile_pic_url
        }