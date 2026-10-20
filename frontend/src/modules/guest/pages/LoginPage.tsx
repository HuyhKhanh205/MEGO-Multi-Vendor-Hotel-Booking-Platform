import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../../../stores/store";
import { loginSuccess } from "../../../stores/authSlice";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: Yup.string()
    .min(6, "Mật khẩu tối thiểu 6 ký tự")
    .required("Vui lòng nhập mật khẩu"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [errorMessage] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: "demo@mego.vn",
      password: "password123",
    },
    validationSchema,
    onSubmit: (values) => {
      // Demo authentication simulation (Ghi chú: tính năng backend thật sẽ kết nối API Spring Boot)
      dispatch(
        loginSuccess({
          user: {
            id: "usr-01",
            name: "Nguyễn Văn A",
            email: values.email,
            role: "CUSTOMER",
          },
          token: "mock-jwt-token-123456",
        })
      );
      navigate("/");
    },
  });

  const handleQuickDemoLogin = () => {
    dispatch(
      loginSuccess({
        user: {
          id: "usr-02",
          name: "Trần Mai Anh",
          email: "maianh.tran@mego.vn",
          role: "CUSTOMER",
        },
        token: "mock-jwt-token-demo",
      })
    );
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 mb-2">
            <span className="text-2xl font-extrabold text-[#1677FF]">Me</span>
            <span className="text-2xl font-black text-gray-900">Go</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Đăng nhập tài khoản</h1>
          <p className="text-xs text-gray-500 mt-1">
            Chào mừng bạn quay trở lại với MeGo
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 mb-4 text-xs text-red-700 bg-red-50 rounded-xl">
            {errorMessage}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
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
              className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 rounded-xl border outline-none transition-colors ${
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
              className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 rounded-xl border outline-none transition-colors ${
                formik.touched.password && formik.errors.password
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-[#1677FF] focus:bg-white"
              }`}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-xs text-red-500 mt-1">{formik.errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#1677FF] hover:bg-blue-700 rounded-xl transition-all shadow-xs"
          >
            Đăng nhập
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-400">hoặc thử nghiệm</span>
          </div>
        </div>

        {/* Nút đăng nhập test cho kiểm thử Header trạng thái đã login */}
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          className="w-full py-2 px-4 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200"
        >
          ⚡ Đăng nhập thử nghiệm (Test Auth State trên Header)
        </button>

        <p className="text-center text-xs text-gray-500 mt-6">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-[#1677FF] font-semibold hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
