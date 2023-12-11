from app.models import db, User, environment, SCHEMA
from werkzeug.security import generate_password_hash
from sqlalchemy.sql import text
import csv


def seed_users():
    with open("app/seeds/users.csv", "r") as file:
        csvreader = csv.reader(file)
        fields = next(csvreader)
        for row in csvreader:
            user = User(
                username = row[0],
                email = row[1],
                hashed_password = generate_password_hash(row[2]),
                first_name = row[3],
                last_name = row[4],
                profile_pic_url = row[5],
                bio = row[6]
            )
            db.session.add(user)
        db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
        
    db.session.commit()
