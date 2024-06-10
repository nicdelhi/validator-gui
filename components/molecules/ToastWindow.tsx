import useToastStore from "../../hooks/useToastStore";
import { ToastBox } from "../atoms/ToastBox";

type ToastWindowProps = {
  viewLogsOnClick: () => void;
};

export const ToastWindow = ({ viewLogsOnClick }: ToastWindowProps) => {
  const { currentToast, cancelToastUpgrade } = useToastStore((state: any) => ({
    currentToast: state.currentToast,
    cancelToastUpgrade: state.cancelToastUpgrade,
  }));

  return (
    <div className="absolute top-19 max-md:w-full md:top-8 right-0 z-35">
      {currentToast && (
        <ToastBox
          toast={currentToast}
          onClose={() => {
            cancelToastUpgrade();
          }}
          viewLogsOnClick={viewLogsOnClick}
        />
      )}
    </div>
  );
};
