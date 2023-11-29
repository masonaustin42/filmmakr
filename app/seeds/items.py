from app.models import db, Item, environment, SCHEMA
from sqlalchemy.sql import text
import csv
from datetime import date


def seed_items():
    with open("app/seeds/items.csv", "r") as file:
        csvreader = csv.reader(file)
        fields = next(csvreader)
        for row in csvreader:
            item = Item(
                name = row[0],
                gallery_id = int(row[1]),
                media_type = row[2],
                media_url = row[3]
            )
            db.session.add(item)
            db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_items():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.items RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM items"))
        
    db.session.commit()
