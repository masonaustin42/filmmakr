from flask import Blueprint, jsonify, session, request
from app.models import Gallery, Item, db
from . import validation_errors_to_error_messages
from flask_login import current_user, login_required
from app.forms import GalleryForm, ItemForm
from .aws_helpers import *
from datetime import date

gallery_routes = Blueprint('galleries', __name__)


@gallery_routes.route("/<int:galleryId>", methods=["GET"])
def get_gallery(galleryId):
    gallery = Gallery.query.get(galleryId)
    
    password = request.args.get("p") if request.args.get("p") else ""
    
    if not gallery:
        return { "errors": "Gallery not found"}, 404
    
    if current_user.id == gallery.owner_id:
        return {"gallery": gallery.to_dict_full()}
    
    if gallery.hashed_password is not None:
        if gallery.check_password(password):
            return { "gallery": gallery.to_dict_full()}
        else:
            return { "errors": "Incorrect password"}, 403
    else:
        return {"gallery": gallery.to_dict_full()}
    
@gallery_routes.route("/new", methods=["POST"])
@login_required
def post_gallery():
    form = GalleryForm()
    
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        gallery = Gallery(
            title = form.data["title"],
            owner_id = current_user.id
        )
        
        if form.data["password"]:
            gallery.password = form.data["password"]
        
        if form.data["date"]:
            gallery.date = date.fromisoformat(str(form.data["date"]))
        
        if form.data["preview"]:
            preview = form.data["preview"]
            preview.filename = get_unique_filename(preview.filename)
            upload = upload_file_to_s3(preview)
            
            if "url" not in upload:
                return upload, 500
            
            gallery.preview_url = f"{CLOUDFRONT_URL}/{preview.filename}"
        
        db.session.add(gallery)
        db.session.commit()
        
        return gallery.to_dict()
        
    if form.errors:
        return {'errors': form.errors}, 400
    

@gallery_routes.route("/<int:galleryId>", methods=["PUT"])
@login_required
def update_gallery(galleryId):
    form = GalleryForm()
    
    form['csrf_token'].data = request.cookies['csrf_token']
    
    gallery = Gallery.query.get(galleryId)
    
    if not gallery or gallery.owner_id != current_user.id:
        return { "errors": "Gallery not found"}, 404
    
    if form.validate_on_submit():
        gallery.title = form.data["title"]
        gallery.date = form.data["date"]
        gallery.password = form.data["password"]
        if form.data["preview"]:
            preview = form.data["preview"]
            preview.filename = get_unique_filename(preview.filename)
            upload = upload_file_to_s3(preview)
            
            if "url" not in upload:
                return upload, 500
            
            gallery.preview_url = f"{CLOUDFRONT_URL}/{preview.filename}"
            
        
        db.session.commit()
        return gallery.to_dict_full()
        
    if form.errors:
        return {'errors': form.errors}, 400
    
@gallery_routes.route("/<int:galleryId>", methods=["DELETE"])
@login_required
def delete_gallery(galleryId):
    
    gallery = Gallery.query.get(galleryId)
    
    if not gallery or gallery.owner_id != current_user.id:
        return { "errors": "Gallery not found"}, 404
    
    delete_preview = remove_file_from_s3(gallery.preview_url)
    if delete_preview is not True:
        return delete_preview
    
    for item in gallery.items:
        delete_item = remove_file_from_s3(item.media_url)
        if delete_item is not True:
            return delete_item
    
    db.session.delete(gallery)
    db.session.commit()
    return {"status": "success"}, 202
    
    
@gallery_routes.route("/<int:galleryId>/items", methods=["POST"])
@login_required
def post_item(galleryId):
    
    gallery = Gallery.query.get(galleryId)
    
    if not gallery or gallery.owner_id != current_user.id:
        return {"errors": "Gallery not found"}, 404
    
    form = ItemForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    
    if form.validate_on_submit():
        media = form.data["media"]
        media.filename = get_unique_filename(media.filename)
        upload = upload_file_to_s3(media)
        
        if "url" not in upload:
            return upload, 500
        
        item = Item(
            name = form.data["name"],
            media_url = f"{CLOUDFRONT_URL}/{media.filename}",
            media_type = media.filename.rsplit(".", 1)[1].lower(),
            gallery_id = galleryId
        )
        
        db.session.add(item)
        db.session.commit()
        
        return item.to_dict(), 200
    
    if form.errors:
        return form.errors
    
    