import CheckIcon from "@mui/icons-material/Check";

export type BookingStep = 1 | 2 | 3;

interface BookingProgressProps {
  activeStep: BookingStep;
}

const steps = [
  { number: 1, label: "Thông tin đặt phòng" },
  { number: 2, label: "Thanh toán" },
  { number: 3, label: "Xác nhận vé" },
] as const;

const BookingProgress = ({ activeStep }: BookingProgressProps) => (
  <nav aria-label="Tiến trình đặt phòng" className="mb-5 flex flex-wrap items-center gap-2 text-xs">
    {steps.map((step, index) => {
      const isActive = step.number === activeStep;
      const isCompleted = step.number < activeStep;

      return (
        <div key={step.number} className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 rounded-full px-3 py-1 font-semibold ${
              isActive
                ? "bg-[#1677ff] text-white"
                : isCompleted
                  ? "text-[#16a34a]"
                  : "text-[#737d95]"
            }`}
          >
            {isCompleted && <CheckIcon sx={{ fontSize: 14 }} />}
            {step.number}. {step.label}
          </span>
          {index < steps.length - 1 && <span className="text-[#d1d7e3]">›</span>}
        </div>
      );
    })}
  </nav>
);

export default BookingProgress;
