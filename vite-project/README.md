## Người dùng đăng nhập, đăng ký.
@startuml
actor User
participant "Frontend" as FE
participant "Backend" as BE
participant "Database" as DB

'=== Quy trình Đăng ký ===
User -> FE: Nhập thông tin đăng ký (username, email, password)
FE -> FE: Validate dữ liệu (format email, độ mạnh password)
alt Dữ liệu hợp lệ
    FE -> BE: Gửi POST /api/register {username, email, password}
    BE -> BE: Validate dữ liệu (kiểm tra logic nghiệp vụ)
    BE -> DB: Truy vấn kiểm tra email/username tồn tại
    DB --> BE: Trả về kết quả
    alt Thông tin chưa tồn tại
        BE -> BE: Hash password (bcrypt)
        BE -> DB: INSERT INTO Users (username, email, password)
        DB --> BE: Xác nhận lưu thành công
        BE --> FE: Trả về 200 OK + thông báo thành công
        FE --> User: Hiển thị "Đăng ký thành công" và chuyển hướng
    else Thông tin đã tồn tại
        BE --> FE: Trả về 400 Bad Request + "Email đã tồn tại"
        FE --> User: Hiển thị lỗi và yêu cầu nhập lại
    end
else Dữ liệu không hợp lệ
    FE --> User: Hiển thị lỗi validate (VD: email sai định dạng)
end

'=== Quy trình Đăng nhập ===
User -> FE: Nhập thông tin đăng nhập (email/username, password)
FE -> BE: Gửi POST /api/login {identifier, password}
BE -> DB: SELECT * FROM Users WHERE email = ? OR username = ?
DB --> BE: Trả về thông tin user (nếu tồn tại)
alt User tồn tại
    BE -> BE: So sánh password (bcrypt.compare)
    alt Password đúng
        BE -> BE: Tạo JWT token
        BE --> FE: Trả về 200 OK + {token, user_data}
        FE -> FE: Lưu token vào localStorage/cookie
        FE --> User: Chuyển hướng đến trang chủ
    else Password sai
        BE --> FE: Trả về 401 Unauthorized + "Sai mật khẩu"
        FE --> User: Hiển thị lỗi
    end
else User không tồn tại
    BE --> FE: Trả về 404 Not Found + "Tài khoản không tồn tại"
    FE --> User: Hiển thị lỗi
end
@enduml

## Thao tác của người dùng tại trang chính
@startuml
actor User
participant "Frontend" as FE
participant "Backend" as BE
participant "Database" as DB

'=== Luồng xem danh sách bài viết ===
User -> FE: Truy cập trang chủ / danh sách bài viết
FE -> BE: Gửi GET /api/articles (kèm category_id nếu có)
alt Xem theo thể loại
    FE -> User: Hiển thị dropdown chọn thể loại
    User -> FE: Chọn thể loại (category_id)
    FE -> BE: Gửi GET /api/articles?category_id={category_id}
end
BE -> DB: Truy vấn bài viết (SELECT * FROM Articles JOIN Article_Categories...)
alt Có category_id
    DB -> BE: Trả về bài viết thuộc thể loại đã chọn
else Không có category_id
    DB -> BE: Trả về tất cả bài viết (mặc định)
end
BE --> FE: Trả về 200 OK + danh sách bài viết
FE --> User: Hiển thị danh sách bài viết (tiêu đề, ảnh, tóm tắt)

'=== Luồng xem chi tiết bài viết ===
User -> FE: Chọn một bài viết từ danh sách
FE -> BE: Gửi GET /api/articles/{article_id}
BE -> DB: Truy vấn chi tiết bài viết (SELECT * FROM Articles WHERE article_id = ?)
DB --> BE: Trả về thông tin bài viết
BE -> DB: Truy vấn thể loại bài viết (SELECT Categories.name FROM Article_Categories...)
DB --> BE: Trả về danh sách thể loại
BE --> FE: Trả về 200 OK + {nội dung, thể loại, tác giả...}
FE --> User: Hiển thị chi tiết bài viết
@enduml

