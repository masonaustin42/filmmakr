# Filmmakr

## Live Link

[https://filmmakr.onrender.com/](https://filmmakr.onrender.com/)

![image](filmmakr.gif)

### Technologies used

#### Frameworks/Languages

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

#### Database

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

#### Other Tools

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

#### Hosting

![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

## Index

## Example Gallery

![image](filmmakr_gallery.gif)

## Creating a New Gallery

![image](filmmakr_new_gallery.gif)

## Uploading an Item

![image](filmmakr_new_item.gif)

## Endpoints

## Auth

| Route                                                   | Purpose                                                | Output                                                                                                                                                                               |
| ------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GET /api/auth/`                                        | Authenticates a user                                   | `json {"address": <STRING/>, "birthday": <STRING/>, "email": <STRING/>, "username":<STRING/> ,"id": <INT/>, "first_name": <STRING/>, "last_name": <STRING/>, "orders": [<orders/>]}` |
| `POST /api/auth/login`                                  | Logs a user in                                         | `json {"address": <STRING/>, "birthday": <STRING/>, "email": <STRING/>, "username":<STRING/> ,"id": <INT/>, "first_name": <STRING/>, "last_name": <STRING/>, "orders": [<orders/>]}` |
| `GET /api/auth/logout`                                  | Logs a user out                                        | `json {"message": "User logged out"}`                                                                                                                                                |
| `POST /api/auth/signup`                                 | Creates a new user and logs them in                    | `json {"address": <STRING/>, "birthday": <STRING/>, "email": <STRING/>, "username":<STRING/> ,"id": <INT/>, "first_name": <STRING/>, "last_name": <STRING/>, "orders": [<orders/>]}` |
| `GET /api/auth/unauthorized`                            | Returns unauthorized JSON when authentication fails    | `json {"errors": ["Unauthorized"]}`                                                                                                                                                  |
| `GET /api/profiles/<username>`                          | Fetches user's profile                                 | `json {"bio": <STRING/>, "galleries": [<galleries/>], "id": <INT/>, "name": <STRING/>, "profile_pic": <URL/>, "username": <STRING/>, "follows": [<users/>], "following": <users/>}`  |
| `GET /api/profiles/<username>/full`                     | Fetches user's full profile (requires auth)            | Same as above, but includes `json {"email: <STRING/>"}`                                                                                                                              |
| `GET /api/galleries/<int:galleryId>?p=<string:password` | Fetches gallery by ID                                  | `json {"gallery": {"id": <INT/>, "date": <STRING/>, "isPrivate": <BOOLEAN/>, "ownerId": <INT/>, "preview": <URL/>, "title": <STRING/>, "items": [<items/>]}}`                        |
| `POST /api/galleries/new`                               | Posts a new gallery                                    | `json {"gallery": {"id": <INT/>, "date": <STRING/>, "isPrivate": <BOOLEAN/>, "ownerId": <INT/>, "preview": <URL/>, "title": <STRING/>, "items": [<items/>]}}`                        |
| `PUT /api/galleries/<int:galleryId>`                    | Updates a gallery by ID                                | `json {"gallery": {"id": <INT/>, "date": <STRING/>, "isPrivate": <BOOLEAN/>, "ownerId": <INT/>, "preview": <URL/>, "title": <STRING/>, "items": [<items/>]}}`                        |
| `DELETE /api/galleries/<int:galleryId>`                 | Deletes a gallery                                      | `json {"status": "success"}`                                                                                                                                                         |
| `POST /api/galleries/<int:galleryId>/items`             | Creates a new item for a gallery                       | `json {"id": <INT/>, "name": <STRING/>, "type": <FILETYPE/>, "url": <URL/>, "isMain": <BOOLEAN/>}`                                                                                   |
| `PUT /api/items/<int:itemId>`                           | Updates an item by ID                                  | `json {"id": <INT/>, "name": <STRING/>, "type": <FILETYPE/>, "url": <URL/>, "isMain": <BOOLEAN/>}`                                                                                   |
| `DELETE /api/items/<int:itemId>`                        | Deletes an item by ID                                  | `json {"status": "success"}`                                                                                                                                                         |
| `POST /api/follows/<int:userId>`                        | As a logged in user, follow another user by username   | `json {"address": <STRING/>, "birthday": <STRING/>, "email": <STRING/>, "username":<STRING/> ,"id": <INT/>, "first_name": <STRING/>, "last_name": <STRING/>, "orders": [<orders/>]}` |
| `DELETE /api/follows/<int:userId>`                      | As a logged in user, unfollow another user by username | `json {"address": <STRING/>, "birthday": <STRING/>, "email": <STRING/>, "username":<STRING/> ,"id": <INT/>, "first_name": <STRING/>, "last_name": <STRING/>, "orders": [<orders/>]}` |
