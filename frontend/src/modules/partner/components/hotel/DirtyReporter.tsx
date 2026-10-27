import { useEffect } from "react";
import { useFormikContext } from "formik";

/** Báo trạng thái "có thay đổi chưa lưu" của form Formik lên trang cha (để hỏi trước khi rời tab). */
export const DirtyReporter = ({ onChange }: { onChange: (dirty: boolean) => void }) => {
  const { dirty } = useFormikContext();
  useEffect(() => {
    onChange(dirty);
  }, [dirty, onChange]);
  return null;
};

export default DirtyReporter;
