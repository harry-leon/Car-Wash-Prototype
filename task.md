Admin Console — Update Tasks v2
SCOPE CONSTRAINT

Ưu tiên sửa file trong src/modules/admin-console/
Được phép sửa các file liên quan bên ngoài folder NẾU thực sự cần thiết (ví dụ: shared Zustand store, shared types, customer-facing pages để sync wash packages)
Trước khi sửa file ngoài folder, hãy giải thích lý do


TASK 1 — Dashboard: Đổi "Recent Bookings" thành "Check-in Center"

Đổi tên section Recent Bookings → Check-in Center trên trang Dashboard
Bảng Check-in Center hiển thị các cột:
Code | Customer | Vehicle | Service | Check-in Time | Staff | Status
Logic phân quyền xếp nhân viên:

Admin chỉ được xếp nhân viên sau khi customer đã check-in (status = CHECKED_IN hoặc IN_PROGRESS)
Booking chưa check-in → Staff column hiển thị Not assigned, không cho chỉnh sửa
Admin chỉ được đổi nhân viên khi booking đang ở trạng thái IN_PROGRESS


Khi Admin click vào một row → mở Detail View Drawer bên phải hiển thị chi tiết check-in đó


TASK 2 — Bookings Page: Thêm Staff column + Detail Drawer

Bảng booking list thêm cột Staff:

Nếu booking đã check-in → hiển thị tên nhân viên phụ trách
Nếu booking chưa check-in → hiển thị Not assigned hoặc để trống


Khi Admin click vào một booking row → mở Detail View Drawer bên phải hiển thị chi tiết booking đó


TASK 3 — Wash Packages: Đồng bộ với Customer Side

Thêm trường status: "ACTIVE" | "INACTIVE" vào wash package type
Khi Admin thêm gói mới:

Gói mới phải xuất hiện ngay trên trang chọn gói rửa của customer (sync qua Zustand store)


Khi Admin disable gói (đổi status → INACTIVE):

Gói đó không còn hiển thị cho customer khi booking


Cập nhật customer-facing page để chỉ hiển thị các gói có status = "ACTIVE"