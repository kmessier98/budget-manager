import { type ReactNode } from "react";
import { createPortal } from "react-dom";
import "./Modal.scss";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  isSubmitting?: boolean;
};

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  isSubmitting,
}: ModalProps) => {
  const modalRoot = document.getElementById("modal-root");

  if (!isOpen || !modalRoot) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          {title && <h2>{title}</h2>}
          <button onClick={onClose} disabled={isSubmitting}>
            &times;
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    modalRoot,
  );
};

export default Modal;
