from .db import db, environment, SCHEMA, add_prefix_for_prod

class Item(db.Model):
    __tablename__ = "items"
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}
        
    id = db.Column(db.Integer, primary_key=True)
    gallery_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("galleries.id")), nullable=False)
    name = db.Column(db.String(255))
    media_type = db.Column(db.String(30))
    media_url = db.Column(db.String(2000), nullable=False)
    
    gallery = db.relationship("Gallery", back_populates="items")
    
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.media_type,
            'url': self.media_url
        }
        
    def to_dict_full(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.media_type,
            "url": self.media_url,
            "gallery": self.gallery
        }