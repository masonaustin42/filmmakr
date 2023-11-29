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
    portfolio_pic_url = db.Column(db.String(1500))
    
    galleries = db.relationship('Gallery', back_populates='owner') # maybe add cascade='all, delete-orphan'
    

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
            'profile_pic': self.profile_pic_url
        }
        
    def to_dict_full(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'name': f"{self.first_name} {self.last_name}",
            'bio': self.bio,
            'profile_pic': self.profile_pic_url,
            'portfolio_pic': self.portfolio_pic_url,
            'galleries': [gallery.to_dict() for gallery in self.galleries]
        }
