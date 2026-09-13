import { Button } from 'react-bootstrap';

const Sidebar = ({
  onCompose,
  onInbox,
  onSent,
  unreadCount = 0,
}) => {
  return (
    <div className="sidebar">

      <Button
        className="compose-button"
        onClick={onCompose}
      >
        ✎ Compose
      </Button>

      <div className="mt-4">

        <button
          type="button"
          onClick={onInbox}
          className="btn btn-link text-start text-decoration-none w-100"
        >
          📥 Inbox

          {unreadCount > 0 && (
            <span className="ms-2 text-muted fw-bold">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onSent}
          className="btn btn-link text-start text-decoration-none w-100"
        >
          📤 Sent
        </button>

      </div>

    </div>
  );
};

export default Sidebar;