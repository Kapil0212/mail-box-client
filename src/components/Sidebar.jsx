import { Button, Nav } from 'react-bootstrap';

const Sidebar = ({
  onCompose,
  onInbox,
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

      <Nav className="flex-column mt-4">

        <Nav.Link
          onClick={onInbox}
          style={{ cursor: 'pointer' }}
        >
          📥 Inbox

          {unreadCount > 0 && (
            <span
              className="ms-2 text-muted fw-bold"
            >
              {unreadCount}
            </span>
          )}
        </Nav.Link>

        <Nav.Link>
          📤 Sent
        </Nav.Link>

      </Nav>

    </div>
  );
};

export default Sidebar;