1. Email không hợp lệ được hệ thống chấp nhận
* **Test Case phát hiện:** `FR01-TC05 (email thiếu định dạng @) và FR01-TC06 (email thiếu phần miền)`
* **Mức độ nghiêm trọng:** Severe — Email không hợp lệ được hệ thống chấp nhận
* **Các bước tái hiện:**
  1. Truy cập trang đăng ký
  2. Nhập thông tin đăng ký như sau: `Tên`: [bất kỳ]. Email : các dạng email không hợp lệ (ví dụ: thiếu định dạng, thiếu phần miền). Mật khẩu: Password123!
  3. Nhấn `Đăng ký`
* **Kết quả mong đợi:** Một thông báo nhắc nhở người dùng về việc nhập email không hợp lệ 
* **Kết quả thực tế:** Hệ thống báo lỗi `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT."` — ở đây nghĩa là email đã vượt qua validation, trong khi hệ thống báo lỗi ở Password do việc implement xác thực mật khẩu bị lỗi
* **Nguyên nhân kỹ thuật:**
  * File `frontend/register.jsx`:
    ```javascript
     <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
    ```
  * vì trường email được sử dụng là text và không hề có kĩ thuật validation cho email, nên email không hợp lệ được chấp nhận

<img width="1903" height="932" alt="Image" src="https://github.com/user-attachments/assets/685102f2-0723-4a4e-8bfa-6f26d1cc610a" />


2. FR01-TC01 đến TC12 (hoặc tất cả TC): Không có trường xác nhận mật khẩu (đọc phần lưu ý)
* **Test Case phát hiện:** `FR01-TC01 đén TC12`
* **Mức độ nghiêm trọng:** Severe — Trang web không có xác nhận mật khẩu so với đặc tả
* **Các bước tái hiện:**
  1. Truy cập trang đăng ký
* **Kết quả mong đợi:** Có trường `Xác nhận mật khẩu`
* **Kết quả thực tế:** Trường này hoàn toàn không xuất hiện
* **Nguyên nhân kỹ thuật:**
  * Trong `frontend/register.jsx`, code không implement trường xác nhận mật khẩu

<img width="1903" height="932" alt="Image" src="https://github.com/user-attachments/assets/e23bbdc2-7006-4c23-931f-b12f9945af9b" />

Lưu ý: Khi chạy tất cả các test case của FR01 trên Playwright, tất cả các test sẽ thất bại do Playwright không thể tìm được trường xác nhận mật khẩu (trong khi đặc tả yêu cầu trường này), không nên suy ra rằng là tất cả validation logic của từng test case đã thất bại

3. FR01-TC01: Các password hợp lệ bị từ chối bởi hệ thống
* **Test Case phát hiện:** `FR01-TC01 (Đăng ký thành công với thông tin hợp lệ)`
* **Mức độ nghiêm trọng:** Severe — Việc password hợp lệ bị từ chối có thể khiến người dùng hiểu nhầm về hệ thống
* **Các bước tái hiện:**
  1. Truy cập trang đăng ký
  2. Nhập thông tin đăng ký như sau: `Tên`: Nguyen Van A. `Email` : new_user@eshop.com (hoặc bất kì email hợp lệ nào). `Mật khẩu`: Password123! (hoặc bất kỳ mật khẩu hợp lệ nào)
  3. Nhấn `Đăng ký`
* **Kết quả mong đợi:** Người dùng được trả về trang đăng nhập do hệ thống chấp nhận thông tin đăng nhập trên
* **Kết quả thực tế:** Hệ thống báo lỗi `"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT."` — Implement password bị lỗi
* **Nguyên nhân kỹ thuật:**
  * File `frontend/register.jsx`:
    ```javascript
          const flawedStrongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\s)[A-Za-z\d\s]{8,}$/;
    ```
  * Regex này giới hạn người dùng chỉ được nhập password bao gồm 3 thành phần: ký tự, chữ số, khoảng trắng

<img width="1911" height="917" alt="Image" src="https://github.com/user-attachments/assets/28cb6beb-4c60-4316-966c-f89999d429df" />

4. FR13-TC03,05,06: Tính toán sai tổng doanh thu
* **Test Case phát hiện:** `FR13-TC03 và FR13-TC05 và FR13-TC06`
* **Mức độ nghiêm trọng:** Medium— Doanh thu bị đẩy lên bất thường 
* **Các bước tái hiện:**
  1. Truy cập trang admin
  2. Thêm bất kì đơn hàng (tối thiểu 1) rồi cho những đơn hàng đó ở trạng thái `delivered` (giả sử, có một đơn hàng ở trạng thái `delivered` trị giá 30,000,000 đồng)
  3. Kiểm tra kết quả
* **Kết quả mong đợi:** Tổng doanh thu (theo giả thuyết): 30,000,000 đồng (tức là tổng tiền của các đơn hàng ở trạng thái `delivered`)
* **Kết quả thực tế:** Tổng doanh thu (theo giả thuyết): 60,000,000 đồng (tổng tiền đã bị nhân đôi)
* **Nguyên nhân kỹ thuật:**
  * File `frontend-admin/App.jsx`:
    ```javascript
    const totalRevenue = orders.reduce((sum, o) => {
    if (o.status === "delivered") return sum + o.total_amount * 2;
    return sum;}, 0);
    ```

  * Trong trường hợp này, o.total_amount bị nhân đôi

<img width="1920" height="949" alt="Image" src="https://github.com/user-attachments/assets/353296c3-adc3-41ef-958e-909e16b0997a" />

<img width="1920" height="955" alt="Image" src="https://github.com/user-attachments/assets/8c2911ce-f5b7-47fe-b5ef-8757c7f348ad" />

5. FR07-TC06,07: Thiếu nút '+'/'-'
* **Test Case phát hiện:** `FR07-TC06 và FR07-TC07`
* **Mức độ nghiêm trọng:** Medium — Việc chỉnh sửa số lượng sản phẩm không thuận tiện
* **Các bước tái hiện:**
  1. Truy cập trang sản phẩm
  2. Thêm một sản phẩm bất kỳ
  3. Vào giỏ hàng
* **Kết quả mong đợi:** Giỏ hàng xuất hiện nút '+'/'-'
* **Kết quả thực tế:** Giỏ hàng thiếu nút '+'/'-'
* **Nguyên nhân kỹ thuật:**
  * chức năng này hoàn toàn không xuất hiện trong implementation của `frontend/cart.jsx`

<img width="1920" height="884" alt="Image" src="https://github.com/user-attachments/assets/648dfd8d-f107-4ae2-b986-0c7f39c37363" />

6. FR07-TC08: "Tổng tạm tính" được thể hiện thay vì "Tổng cộng"
* **Test Case phát hiện:** `FR07-TC08`
* **Mức độ nghiêm trọng:** Low — Giao diện trái với mô tả
* **Các bước tái hiện:**
  1. Truy cập trang sản phẩm
  2. Thêm một sản phẩm bất kỳ
  3. Vào giỏ hàng
* **Kết quả mong đợi:** Tổng số tiền được ghi "Tổng cộng"
* **Kết quả thực tế:** Tổng số tiền được ghi "Tổng tạm tính"
* **Nguyên nhân kỹ thuật:**
 * File `frontend/cart.jsx`:
    ```javascript
     <div className="flex justify-between items-center">
        <div className="text-xl font-bold">
          Tổng tạm tính: <span className="text-red-600">{cartTotal.toLocaleString()} ₫</span>
        </div>
    ```
  * Tổng tạm tính được ghi thay vì tổng cộng

<img width="1920" height="884" alt="Image" src="https://github.com/user-attachments/assets/648dfd8d-f107-4ae2-b986-0c7f39c37363" />

7. FR07-TC09,10: Thiếu hộp thoại xác nhận khi xoá sản phẩm
* **Test Case phát hiện:** `FR07-TC09 và FR07-10`
* **Mức độ nghiêm trọng:** High — Việc xoá sản phẩm khi không có xác nhận có thể gây khó khăn với người dùng
* **Các bước tái hiện:**
  1. Truy cập trang
  2. Thêm một sản phẩm vào giỏ hàng
  3. Vào giỏ hàng
  4. Nhấn xoá
* **Kết quả mong đợi:** Một hộp thoại nhắc nhở người dùng xác nhận xoá sản phẩm xuất hiện
* **Kết quả thực tế:** Hộp thoại không xuất hiện
* **Nguyên nhân kỹ thuật:**
  * Chức năng này không được implement trong file `cart.jsx`

<img width="1280" height="720" alt="Image" src="https://github.com/user-attachments/assets/91cb0621-a244-4686-9d71-1693f14ea021" />

8. FR07-TC03 - Sản phẩm thêm trùng không được cộng quantity
* **Test Case phát hiện:** `FR07-TC03`
* **Mức độ nghiêm trọng:** Medium — Giao diện trái với mô tả và gây hiểu nhầm về logic thêm sản phẩm
* **Các bước tái hiện:**
  1. Truy cập trang sản phẩm
  2. Thêm một sản phẩm bất kỳ 2 lần hoặc nhiều hơn
  3. Vào giỏ hàng
* **Kết quả mong đợi:** Sản phẩm được thêm phải có quantity là 2 (hoặc số lần mình thêm)
* **Kết quả thực tế:** Có 2 (hoặc số lần mình thêm) tab riêng cho 2 lần (hoặc số lần mình thêm) thêm sản phẩm
* **Nguyên nhân kỹ thuật:**
 * File `frontend/home.jsx`:
    ```javascript
     <button
                  onClick={() => addToCart({ ...p, quantity: 1 }, 1)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
    ```
  * Code không có logic để validate việc thêm trùng một sản phẩm. Sản phẩm khi thêm là cứ thêm vào một tab riêng

<img width="1920" height="964" alt="Image" src="https://github.com/user-attachments/assets/7bb4d156-e544-4b7a-830f-164da77ca01f" />

9. FR07-TC05: Thêm sản phẩm bằng "xem chi tiết" phải nhấn 2 lần mới thêm được
* **Test Case phát hiện:** `FR07-TC05`
* **Mức độ nghiêm trọng:** Medium — Việc nhấn hai lần khiến cho thao tác thêm không thuận tiện
* **Các bước tái hiện:**
  1. Truy cập trang sản phẩm
  2. Vào "Xem chi tiết"
  3. Nhấn `Thêm vào giỏ`
* **Kết quả mong đợi:** Phải có thông báo `Đã thêm`, và giỏ hàng có sản phẩ
* **Kết quả thực tế:** Nhấn lần một không thêm và giỏ hàng trống, phải nhấn lần hai thì mới thêm được
* **Nguyên nhân kỹ thuật:**
 * File `frontend/ProductDetail.jsx`:
    ```javascript
      const handleAddToCart = () => {
    if (clickCount === 0) {
      setClickCount(1);
      return; // Không làm gì cả ở lần đầu tiên
    }
    addToCart(product, parseInt(quantity));

    setAdded(true);

    setClickCount(0); // Reset lại

    setTimeout(() => setAdded(false), 2000);};
    ```
  * vì khi kiểm tra clickCount, khi ta click lần đầu tiên, hàm sẽ return luôn, không thực hiện các dòng code sau đó, nên việc click 1 lần khiến cho sản phẩm không được thêm vào (Lỗi này sẽ khiến cho TC05 thất bại khi playwright chỉ click một lần trong khi thực tế yêu cầu phải click 2 lần)

<img width="1280" height="720" alt="Image" src="https://github.com/user-attachments/assets/1d16e225-1162-443b-8157-d52745d1bcf9" />

10. FR07-TC11: "Giá" được hiển thị thay vì "Đơn giá"
* **Test Case phát hiện:** `FR07-TC11`
* **Mức độ nghiêm trọng:** Low — Giao diện trái với mô tả
* **Các bước tái hiện:**
  1. Truy cập trang sản phẩm
  2. Thêm một sản phẩm bất kỳ
  3. Vào giỏ hàng
* **Kết quả mong đợi:** Giá sản phẩm được hiển thị là "Đơn Giá"
* **Kết quả thực tế:** Giá sản phẩm được hiển thị là "Giá"
* **Nguyên nhân kỹ thuật:**
 * File `frontend/cart.jsx`:
    ```javascript
     <tr className="border-b">
            <th className="py-2">Sản phẩm</th>
            <th className="py-2">Giá</th>
            <th className="py-2">Số lượng</th>
            <th className="py-2">Thành tiền</th>
            <th className="py-2">Thao tác</th>
          </tr>
    ```
  * "Giá" được sử dụng thay vì "Đơn giá"

<img width="1920" height="884" alt="Image" src="https://github.com/user-attachments/assets/648dfd8d-f107-4ae2-b986-0c7f39c37363" />











