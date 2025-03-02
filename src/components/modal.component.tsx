"use client";

import { X } from "lucide-react";

export interface CustomModalProps {
  open: boolean;
  close: () => void;
}

interface IModal {
  children: React.ReactNode;
  title?: string;
  description?: string;
  open: boolean;
  close: () => void;
  hideCloseButton?: boolean;
}

const Modal = ({
  children,
  title,
  open,
  close,
  hideCloseButton,
  description,
}: IModal) => {
  if (!open) return;
  return (
    <div className=" fixed w-screen h-screen bg-black/50 top-0 left-0 inset-0 backdrop-blur-[1px] transition-all duration-500 z-40">
      <div
        className={`absolute top-1/3 left-1/2 bg-white max-w-[40vw] max-h-[80vh] w-full min-h-[10rem] min-w-[24rem] -translate-x-1/2 -translate-y-1/3 rounded-md transition-all duration-150`}
      >
        <div className="relative py-2 transition-all duration-500">
          {!hideCloseButton && (
            <button
              className="absolute right-4"
              onClick={() => {
                close();
              }}
            >
              <X size={18} className="text-gray-700" />
            </button>
          )}
          {title && (
            <div className=" px-6 py-2 flex flex-col border-b border-gray-300 gap-[2px]">
              {title && <h3 className="font-semibold">{title}</h3>}
              {description && (
                <p className="text-gray-600 text-sm">{description}</p>
              )}
            </div>
          )}
          <div className="px-6 py-2">{children}</div>
        </div>
      </div>
    </div>
  );
};
export default Modal;
