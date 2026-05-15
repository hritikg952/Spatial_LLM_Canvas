import "./ActionButton.css";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
}

const ActionButton = ({ icon, label }: ActionButtonProps) => (
  <button className="action-btn" aria-label={label}>
    {icon}
  </button>
);

export default ActionButton;
