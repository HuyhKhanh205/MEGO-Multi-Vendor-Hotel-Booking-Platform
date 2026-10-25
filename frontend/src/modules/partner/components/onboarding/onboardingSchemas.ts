import * as Yup from "yup";

const phoneRegex = /^(0|\+84)(3|5|7|8|9)\d{8}$/;

/** Mỗi bước wizard chỉ validate các trường của bước đó. Bước 3 (tài liệu) được kiểm tra riêng vì file nằm ngoài Formik. */
export const STEP_SCHEMAS = [
  Yup.object({
    representativeName: Yup.string().trim().required("Vui lòng nhập họ tên người đại diện pháp luật").min(4, "Họ tên quá ngắn"),
    phone: Yup.string()
      .required("Vui lòng nhập số điện thoại liên hệ")
      .test("vn-phone", "Số điện thoại Việt Nam gồm 10 số, bắt đầu bằng 03/05/07/08/09", (value) => !!value && phoneRegex.test(value.replace(/\s+/g, ""))),
    email: Yup.string().trim().required("Vui lòng nhập email công việc").email("Email không hợp lệ"),
    password: Yup.string()
      .required("Vui lòng tạo mật khẩu tài khoản Extranet")
      .min(10, "Mật khẩu tối thiểu 10 ký tự")
      .matches(/[A-Z]/, "Mật khẩu cần ít nhất một chữ hoa")
      .matches(/\d/, "Mật khẩu cần ít nhất một chữ số")
      .matches(/[^A-Za-z0-9]/, "Mật khẩu cần ít nhất một ký tự đặc biệt"),
  }),
  Yup.object({
    propertyName: Yup.string().trim().required("Vui lòng nhập tên thương mại của cơ sở lưu trú"),
    starRating: Yup.string().required("Vui lòng chọn hạng sao"),
    hotelCategory: Yup.string().required("Vui lòng chọn loại hình cơ sở lưu trú"),
    address: Yup.string().trim().required("Vui lòng nhập địa chỉ chi tiết").min(10, "Địa chỉ cần ghi rõ số nhà, phường/xã, tỉnh/thành"),
    totalRooms: Yup.string()
      .required("Vui lòng nhập tổng số phòng")
      .test("positive-int", "Số phòng phải là số nguyên từ 1 đến 5.000", (value) => !!value && /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 5000),
  }),
  Yup.object({}),
  Yup.object({
    bankCode: Yup.string().required("Vui lòng chọn ngân hàng thụ hưởng"),
    accountNumber: Yup.string().required("Vui lòng nhập số tài khoản").matches(/^\d{6,19}$/, "Số tài khoản gồm 6–19 chữ số"),
    accountHolder: Yup.string().trim().required("Vui lòng nhập tên chủ tài khoản"),
    bankBranch: Yup.string().trim().required("Vui lòng nhập chi nhánh / phòng giao dịch"),
    payoutCycle: Yup.string().oneOf(["WEEKLY", "MONTHLY"]).required(),
    acceptedTerms: Yup.boolean().oneOf([true], "Bạn cần xác nhận thông tin và đồng ý điều khoản hợp tác"),
  }),
];

/** Tên trường theo từng bước để đánh dấu touched khi bấm "Tiếp tục". */
export const STEP_FIELDS: string[][] = STEP_SCHEMAS.map((schema) => Object.keys(schema.fields));
