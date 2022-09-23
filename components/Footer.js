import React from 'react';
import { Nav } from 'react-bootstrap';

function Footer() {
  return (
    <>
      <Nav className="footer justify-content-center">
        <Nav.Item>
          <Nav.Link href="/">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <h8>MAD App Future Copyright</h8>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="https://www.linkedin.com/in/brett-hughes-08942893">Connect</Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
}

export default Footer;
