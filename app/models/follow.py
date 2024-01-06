from .db import db, environment, SCHEMA

class Follow(db.Model):
    __tablename__ = 'follows'
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    following_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    user = db.relationship('User', back_populates='follows', foreign_keys=[user_id], uselist=False)
    following = db.relationship('User', back_populates='following', foreign_keys=[following_id], uselist=False)
    
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'following_id': self.following_id
        }