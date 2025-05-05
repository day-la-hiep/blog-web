# Nguoi dung
## Danh sach api can co.
### Bai viet
- public:
[//]: # (    - GET /public/articles?search=&page=&limit=)
[//]: # (    - GET /public/categories/{slug}/articles)
[//]: # (    - GET /public/articles/{id})
    - GET /public/users/{userId}/articles?status=&page=&limit=
-private:
    - user:
[//]: # (        - GET /users/{{id}}/articles?status=&page=&limit= // lay bai viet da viet cua nguoi dung)
        - GET /users/me/followed-articles?page=&limit= // danh sach bai viet tu danh sach nguoi dung da theo doi
        
[//]: # (        - GET /aritcles/{id})
[//]: # (        - POST /articles/)
[//]: # (        - POST /articles/{id}/thumbnail)
[//]: # (        - POST /aritcles/images)
[//]: # (        - POST /articles/{id}/submit)
[//]: # (        - POST /articles/{id}/unsubmit)
[//]: # (        - DEL /aritcles/{id})
[//]: # (        - PUT /articles/{id})
    - admin, mod:
[//]: # (        - GET /articles?search=&page=&limit=&filter-param)
[//]: # (        - GET /users/{{userId}}/articles?status=&page=&limit= // lay bai viet da viet cua nguoi dung)
[//]: # (        - POST /articles/{id}/accept)
[//]: # (        - POST /articles/{id}/reject)
[//]: # (        - POST /articles/{id}/undo-accept)



### The loai bai viet
- User

[//]: # (  - GET /public/categories?page=&limit=&search=&active )

[//]: # (  - GET /public/categories/{slug}/children)
  - GET /public/categories/{slug}
- Admin

[//]: # (  - GET /categories?page=&limit= )

[//]: # (  - GET /categories/{id} )

[//]: # (  - GET /categories/{id}/children)

[//]: # (  - PUT /categories/{id})

[//]: # (  - POST /categories)

[//]: # (  - DELETE /categories/{id})
  
### Danh sach luu ca nhan
- User

[//]: # (  - GET /users/me/saved-lists // lay danh sach luu ca nhan)
[//]: # (  - POST /saved-lists/{savedListId}/articles/ )
[//]: # (  - PUT /saved-lists/{savedListid})
[//]: # (  - GET /users/me/saved-lists)

[//]: # (@Deprecated)

[//]: # (### Theo doi )

[//]: # ()
[//]: # (- User)

[//]: # (  - POST /users/me/followings kem theo body username cua tac gia minh follow)

[//]: # (  - DELETE /users/me/followings/{id} kem theo theo param username cua tac gia minh unfollow)

[//]: # ()
[//]: # (  - GET /users/me/followers )

[//]: # (  - GET /users/{userId}/followers)

[//]: # (  - GET /users/me/followings )

[//]: # (  - GET /users/{userId}/following)


### Binh luan
- User:
  - GET /comments/{id}

[//]: # (  - GET /articles/{id}/comments?limit=&page= )
[//]: # (  - PUT /comments/{id} )
[//]: # (  - POST /articles/{id}/comments )
[//]: # (  - DELETE /comments/{id})
[//]: # (  - GET /users/me/comments)

  - DEL /comments/{id}
### Bao cao
- User:
  - POST /reports
- Admin:
  - GET /reports
  - GET /reports/{id}
  - GET /reports?targetId={id}
  - PUT /reports/{id}
  - DEL /reports/{id}
  - DEL /reports?targetId={id}

### Nguoi dung
- User:
  - GET /users/me
  - PUT /users/me
[//]: # (  - POST /users)
  - DEL /users/me
  - POST /users/me/password
  - GET /public/users/{userId}
- Admin:
  - GET /users/{userId}
  - PUT /users/{userId}/roles
  - DELETE /users/username/roles
