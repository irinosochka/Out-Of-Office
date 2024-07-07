import React from 'react';

interface ModalProps {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div>
            <div>
                <button onClick={onClose}>
                    &times;
                </button>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
