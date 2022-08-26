import React from 'react';
import Link from 'next/link';
import {
  Button, Container, Nav, Navbar, Offcanvas,
} from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';
import { signIn, signOut } from '../utils/auth';

const NavBar = () => {
  const user = useAuth();
  const expand = false;
  return (
    <>
      <Navbar key={expand} bg="light" expand={expand} className="mb-3">
        <Container fluid>
          <div className="navItems">
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Brand className="navTitle" href="#">M.A.D. App</Navbar.Brand>
            {/* Visible Links go here */}
            {user ? (
              <Link href="/" passHref>
                <Button type="button" className="btn btn-danger" onClick={signOut}>Sign Out</Button>
              </Link>
            ) : (
              <Button type="button" className="btn btn-danger" onClick={signIn}>Sign In</Button>
            )}
          </div>
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                M.A.D. App
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-center flex-grow-1 pe-3">
                <Link href="/" passHref>
                  <span> Home</span>
                </Link>
                {user ? <Link href="/cloudinaryTest" passHref><span>Cloudinary Test</span></Link> : <></> }
                {user ? (
                  <Link href="/" passHref>
                    <Button type="button" className="btn btn-danger" onClick={signOut}>Sign Out</Button>
                  </Link>
                ) : (
                  <Button type="button" className="btn btn-danger" onClick={signIn}>Sign In</Button>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
