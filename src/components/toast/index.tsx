import Toast from "react-bootstrap/Toast";

export default function ToastComponent({
  description,
  isToggle,
  handleToggle
}: {
  description: string;
  isToggle: boolean;
  handleToggle: () => void;
}) {
  return (
    <div>
      <Toast show={isToggle} onClose={handleToggle}>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Thông báo</strong>
        </Toast.Header>
        <Toast.Body>{description}</Toast.Body>
      </Toast>
    </div>
  );
}
