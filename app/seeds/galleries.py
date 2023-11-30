from app.models import db, Gallery, environment, SCHEMA
from werkzeug.security import generate_password_hash
from sqlalchemy.sql import text
import csv
from datetime import date


def seed_galleries():
    with open("app/seeds/galleries.csv", "r") as file:
        csvreader = csv.reader(file)
        fields = next(csvreader)
        for row in csvreader:
            gallery = Gallery(
                title = row[0],
                date = None if row[1] == "" else date.fromisoformat(row[1]),
                hashed_password = None if row[2] == "" else generate_password_hash(row[2]),
                owner_id = int(row[3])
            )
            db.session.add(gallery)
        db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_galleries():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.galleries RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM galleries"))
        
    db.session.commit()
