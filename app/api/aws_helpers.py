import boto3
from boto3.s3.transfer import TransferConfig
import os
import uuid
import threading
import boto3
import os

def upload_file_to_s3(file):
    try:
        from app import socketio  # Local import to avoid circular import error
        
        file_data = file.stream
        file_size = os.fstat(file_data.fileno()).st_size
        
        s3.upload_fileobj(
            file,
            BUCKET_NAME,
            file.filename,
            Config=config,
            Callback=ProgressPercentage(file.filename, file_size, socketio),
            ExtraArgs={
                "ContentType": file.content_type
            }
        )

        
    except Exception as e:
        print(e)
        return {"errors": str(e)}
    
    return {"url": f"{S3_LOCATION}{file.filename}"}


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
            def __init__(self, filename, file_size, socket):
                self._filename = filename
                self._size = file_size
                self._seen_so_far = 0
                self._lock = threading.Lock()
                self._socket = socket

            def __call__(self, bytes_amount):
                with self._lock:
                    self._seen_so_far += bytes_amount
                    percentage = (self._seen_so_far / self._size) * 100
                    self._socket.emit('progress', {'percentage': percentage})
                

                


ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "mp4", "avi", "mov", "mp3", "wav", "wmv", "aiff" }
ALLOWED_EXTENSIONS_NO_AUDIO = {"png", "jpg", "jpeg", "mp4", "avi", "mov"}
BUCKET_NAME = os.environ.get("S3_BUCKET")
S3_LOCATION = f"http://{BUCKET_NAME}.s3.amazonaws.com/"
CLOUDFRONT_URL = os.environ.get("CLOUDFRONT_URL")


def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"




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