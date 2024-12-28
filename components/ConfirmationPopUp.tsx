import React from "react";

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

const ConfirmationPopUp: React.FC<ConfirmationPopupProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Seguro?",
  message = "Esta seguro de querer borrar el registro. La accion no se podra deshacerse.",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-black rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="text-white-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded-md text-white hover:bg-gray-400"  >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopUp;