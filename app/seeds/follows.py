from app.models import db, Follow, environment, SCHEMA
from sqlalchemy.sql import text
import csv

def seed_follows():
    with open("app/seeds/follows.csv", "r") as file:
        csvreader = csv.reader(file)
        fields = next(csvreader)
        for row in csvreader:
            follow = Follow(
                user_id = int(row[0]),
                following_id = int(row[1])
            )
            db.session.add(follow)
        db.session.commit()
        
def undo_follows():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.follows RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM follows"))
        
    db.session.commit()