from flask import Blueprint, jsonify, session, request
from app.models import Gallery, Item, db
from . import validation_errors_to_error_messages
from flask_login import current_user, login_required
from app.forms import GalleryForm, ItemForm
from .aws_helpers import *

gallery_routes = Blueprint('galleries', __name__)


@gallery_routes.route("/<int:galleryId>", methods=["GET"])
def get_gallery(galleryId):
    gallery = Gallery.query.get(galleryId)
    
    password = request.args.get("p") if request.args.get("p") else ""
    print("PASSWORD: ", password)
    
    if not gallery:
        return { "errors": "Gallery not found"}, 404
    
    if gallery.hashed_password is not None:
        print("CHECKING_PASSWORD", gallery.hashed_password, gallery.check_password(password))
        if gallery.check_password(password):
            return { "gallery": gallery.to_dict()}
        else:
            return { "errors": "Incorrect password"}, 403
    else:
        return {"gallery": gallery.to_dict_full()}
    
@gallery_routes.route("/", methods=["POST"])
@login_required
def post_gallery():
    form = GalleryForm()
    
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        gallery = Gallery(
            title = form.data["title"],
            date = form.data["date"],
            password = form.data["password"],
            is_public = form.data["is_public"],
            owner_id = current_user.id
        )
        
        db.session.add(gallery)
        db.session.commit()
        
        return gallery.to_dict()
        
    if form.errors:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 400
    

@gallery_routes.route("/<int:galleryId>", methods=["POST"])
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
        gallery.is_public = form.data["is_public"]
        
        db.session.commit()
        return gallery.to_dict()
        
    if form.errors:
        return {'errors': validation_errors_to_error_messages(form.errors)}, 400
    
@gallery_routes.route("/<int:galleryId>", methods=["DELETE"])
@login_required
def delete_gallery(galleryId):
    
    gallery = Gallery.query.get(galleryId)
    
    if not gallery or gallery.owner_id != current_user.id:
        return { "errors": "Gallery not found"}, 404
    
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
    
    