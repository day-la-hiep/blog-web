# Nguoi dung
## Danh sach api can co.
### Bai viet
-x GET /articles?search=  // tra cuu bai viet
-x GET /categories/{id}/articles // lay bai viet theo the loai
-x GET /articles/{id} // lay chi tiet bai viet
-x GET /users/me/articles?status=&page=&limit= // lay bai viet da viet cua nguoi dung
-x POST /articles // kem thong tin article.
-x POST /articles/{articleId}/thumbnail //upload thumbnail
-x POST /articles/{articleId}/images // upload cac anh trong bai viet
-x POST /articles/{articleId}/submit
-x POST /articles/{articleId}/publish

- POST /users/me/followed-articles?page=&limit= // danh sach bai viet tu danh sach nguoi dung da theo doi

- DEL /articles?id=
### xThe loai bai viet
-x GET /articles (lay tat ca the loai)

### xDanh sach luu ca nhan
-x GET /users/me/saved-lists // lay danh sach luu ca nhan
-x POST /saved-lists/{savedListId}/articles/ kem body la article id
-x PUT /saved-lists/{savedListid} kem body la thong tin thay doi cua saved list (ten)
-x GET /users/me/saved-lists

### xBai viet duoc luu (saved article)
-x UPDATE /saved-article/{id} kem request body la note

### Theo doi
-x POST /users/me/followings kem theo body username cua tac gia minh follow
-x DELETE /users/me/followings/{id} kem theo theo param username cua tac gia minh unfollow

-x GET /users/me/followers // lay danh sach nguoi dang theo doi
-x GET /users/me/followings 


### xBinh luan
-x GET /articles/{id}/comments?limit= // lay tat ca comment tu bai viet trong do comment se bao gom id va noi dung comment, ngay comment
-x POST /articles/{id}/comments // kem body la noi dung comment
-x DELETE /comments/?id= // xoa comment voi id
-x PUT /comments/{id} // update comment
- GET /users/me/comments
# Admin