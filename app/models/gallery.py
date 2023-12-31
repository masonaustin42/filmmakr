from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash

class Gallery(db.Model):
    __tablename__ = "galleries"
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date)
    hashed_password = db.Column(db.String(255))
    preview_url = db.Column(db.String(2000))
    
    owner = db.relationship("User", back_populates="galleries")
    items = db.relationship("Item", back_populates="gallery", cascade="all, delete-orphan")
    
    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        if password is None:
            self.hashed_password = None
        else :
            self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'date': self.date
        }
        
    def to_dict_full(self):
        return {
            'id': self.id,
            'title': self.title,
            'date': self.date,
            'items': [item.to_dict() for item in self.items],
            'preview': self.preview_url,
            'isPrivate': (self.hashed_password is not None),
            'ownerId': self.owner.id
        }
        
    def to_dict_search(self):
        return {
            'id': self.id,
            'title': self.title,
            'date': self.date,
            'preview': self.preview_url,
            'owner': self.owner.to_dict_search()
        }