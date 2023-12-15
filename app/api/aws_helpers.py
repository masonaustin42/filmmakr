import boto3
from boto3.s3.transfer import TransferConfig
import botocore
import os
import uuid
import threading
import sys
import boto3
import os
from flask_socketio import emit

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.environ.get("S3_KEY"),
    aws_secret_access_key=os.environ.get("S3_SECRET")
)

config = TransferConfig(multipart_threshold=1024 * 25, 
                                max_concurrency=10,
                                multipart_chunksize=1024 * 25,
                                use_threads=True)

class ProgressPercentage(object):
        def __init__(self, filename, file_size):
            self._filename = filename
            self._size = file_size
            # self._size = float()
            self._seen_so_far = 0
            self._lock = threading.Lock()

        def __call__(self, bytes_amount):
            # To simplify we'll assume this is hooked up
            # to a single filename.
            with self._lock:
                self._seen_so_far += bytes_amount
                percentage = (self._seen_so_far / self._size) * 100
                sys.stdout.write(
                    "\r%s  %s / %s  (%.2f%%)" % (
                        self._filename, self._seen_so_far, self._size,
                        percentage))
                sys.stdout.flush()
                
def emit_progress(filename, file_size):
    with ProgressPercentage(filename, file_size) as progress:
        emit('progress', {'progress': progress})
                


ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "mp4", "avi", "mov", "mp3", "wav", "wmv", "aiff" }
ALLOWED_EXTENSIONS_NO_AUDIO = {"png", "jpg", "jpeg", "mp4", "avi", "mov"}
BUCKET_NAME = os.environ.get("S3_BUCKET")
S3_LOCATION = f"http://{BUCKET_NAME}.s3.amazonaws.com/"
CLOUDFRONT_URL = os.environ.get("CLOUDFRONT_URL")


def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"


# def upload_file_to_s3(file, acl="public-read"):
#     print(file.filename)
#     try:
#         s3.upload_fileobj(
#             file,
#             BUCKET_NAME,
#             file.filename,
#             ExtraArgs={
#                 # "ACL": acl,
#                 "ContentType": file.content_type
#             }
#         )
#     except Exception as e:
#         # in case the your s3 upload fails
#         return {"errors": str(e)}

#     return {"url": f"{S3_LOCATION}{file.filename}"}

def upload_file_to_s3(file):
    try:
        file_data = file.stream  # Assuming 'file' is a Flask FileStorage object
        file_size = os.fstat(file_data.fileno()).st_size  # Get file size
        
        s3.upload_fileobj(
            file,
            BUCKET_NAME,
            file.filename,
            Config=config,
            Callback=emit_progress(file.filename, file_size),
            ExtraArgs={
                "ContentType": file.content_type
            }
        )
    except Exception as e:
        return {"errors": str(e)}
    
    return {"url": f"{S3_LOCATION}{file.filename}"}


def remove_file_from_s3(image_url):
    # AWS needs the image file name, not the URL, 
    # so you split that out of the URL
    key = image_url.rsplit("/", 1)[1]
    try:
        s3.delete_object(
        Bucket=BUCKET_NAME,
        Key=key
        )
    except Exception as e:
        return { "errors": str(e) }
    return True