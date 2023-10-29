import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  children: JSX.Element
}

interface ModalState {
  modalStatus: boolean;
}

const Modal = ({ isOpen, setIsOpen, children }: ModalProps) => {
  const [modalState, setModalState] = useState<ModalState>({ modalStatus: isOpen });

  useEffect(() => {
    console.log({ isOpen, setIsOpen, children })
    setModalState( () => ({ modalStatus: isOpen }))
  }, [isOpen]);

  return (
    <ReactModal
      shouldCloseOnOverlayClick={!false}
      onRequestClose={setIsOpen}
      isOpen={modalState.modalStatus}
      ariaHideApp={false}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          background: '#F0F0F5',
          color: '#000000',
          borderRadius: '8px',
          width: '736px',
          border: 'none',
        },
        overlay: {
          backgroundColor: '#121214e6',
        },
      }}
    >
      {children}
    </ReactModal>
  );
}

export default Modal;
