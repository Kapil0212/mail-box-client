import { Button, Nav } from 'react-bootstrap';

const Sidebar = ({ onCompose, onInbox }) => {
  return (
    <div className="sidebar">

      <Button
        className="compose-button"
        onClick={onCompose}
      >
        ✎ Compose
      </Button>

      <Nav className="flex-column mt-4">

        <Nav.Link onClick={onInbox} style={{ cursor: 'pointer' }}>
          📥 Inbox
        </Nav.Link>

        <Nav.Link>
          📤 Sent
        </Nav.Link>

      </Nav>

    </div>
  );
};

export default Sidebar;