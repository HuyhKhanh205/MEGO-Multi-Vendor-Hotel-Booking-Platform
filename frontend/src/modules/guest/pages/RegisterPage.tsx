import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../../stores/store";
import { loginSuccess } from "../../../stores/authSlice";

const validationSchema = Yup.object({
  fullName: Yup.string().required("Vui lòng nhập họ và tên"),
  email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
  password: Yup.string().min(6, "Mật khẩu tối thiểu 6 ký tự").required("Vui lòng nhập mật khẩu"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu"),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // Demo register simulation
      dispatch(
        loginSuccess({
          user: {
            id: `usr-${Date.now()}`,
            name: values.fullName,
            email: values.email,
            role: "CUSTOMER",
          },
          token: "mock-jwt-token-registered",
        })
      );
      navigate("/");
    },
  });

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 mb-2">
            <span className="text-2xl font-extrabold text-[#1677FF]">Me</span>
            <span className="text-2xl font-black text-gray-900">Go</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Đăng ký tài khoản mới</h1>
          <p className="text-xs text-gray-500 mt-1">
            Nhận ngay các ưu đãi đặc quyền cho thành viên MeGo
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Nguyễn Văn A"
              className={`w-full px-3.5 py-2 text-sm bg-gray-50 rounded-xl border outline-none transition-colors ${
                formik.touched.fullName && formik.errors.fullName
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-[#1677FF] focus:bg-white"
              }`}
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="example@mego.vn"
              className={`w-full px-3.5 py-2 text-sm bg-gray-50 rounded-xl border outline-none transition-colors ${
                formik.touched.email && formik.errors.email
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-[#1677FF] focus:bg-white"
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••"
              className={`w-full px-3.5 py-2 text-sm bg-gray-50 rounded-xl border outline-none transition-colors ${
                formik.touched.password && formik.errors.password
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-[#1677FF] focus:bg-white"
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••"
              className={`w-full px-3.5 py-2 text-sm bg-gray-50 rounded-xl border outline-none transition-colors ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-[#1677FF] focus:bg-white"
              }`}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 text-sm font-semibold text-white bg-[#1677FF] hover:bg-blue-700 rounded-xl transition-all shadow-xs"
          >
            Đăng ký tài khoản
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-[#1677FF] font-semibold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
