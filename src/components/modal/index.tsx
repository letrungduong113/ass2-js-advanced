import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
const ModalComponent = ({
  show,
  handleClose,
  handleConfirm,
  description,
}: {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  description: string;
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận</Modal.Title>
      </Modal.Header>
      <Modal.Body>{description}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Xác nhận
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
