from flask import Blueprint, jsonify, session, request
from app.models import Gallery, Item, db
from flask_login import current_user, login_required
from app.forms import UpdateItemForm
from .aws_helpers import get_unique_filename, upload_file_to_s3, remove_file_from_s3

item_routes = Blueprint('items', __name__)

@item_routes.route("/<int:itemId>", methods=["DELETE"])
@login_required
def delete_item(itemId):
    item = Item.query.get(itemId)
    
    if not item:
        return { "errors": "Item not found"}, 404
    
    if item.gallery.owner_id != current_user.id:
        return { "errors": "Unauthorized" }, 403
    
    delete_media = remove_file_from_s3(item.media_url)
    
    if delete_media is not True:
        return delete_media
    
    db.session.delete(item)
    db.session.commit()
    
    return { "status": "success" }, 202


@item_routes.route("/<int:itemId>", methods=["PUT"])
@login_required
def update_item(itemId):
    item = Item.query.get(itemId)
    
    if not item:
        return { "errors": "Item not found"}, 404
    
    if item.gallery.owner_id != current_user.id:
        return { "errors": "Unauthorized" }, 403
    
    form = UpdateItemForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        item.name = form.data["name"]
        
        if form.data["media"] is not None:
            delete_media = remove_file_from_s3(item.media_url)
            if delete_media != True:
                return delete_media
            media = form.data["media"]
            media.filename = get_unique_filename(media.filename)
            upload = upload_file_to_s3(media)
            if "url" not in upload:
                return upload, 500
            item.media_url = f"{CLOUDFRONT_URL}/{media.filename}"
            item.media_type = media.filename.rsplit(".", 1)[1].lower()
            
        if form.data["is_main"]:
            gallery = Gallery.query.get(item.gallery_id)
            for galleryItem in gallery.items:
                galleryItem.is_main = False
            item.is_main = True
        else:
            item.is_main = False
                
        db.session.commit()
                
        return item.to_dict(), 200
        
    if form.errors:
        return form.errors