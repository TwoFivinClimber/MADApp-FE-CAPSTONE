/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  Button, Container, Image, Nav, Navbar, Offcanvas,
} from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/context/authContext';
import { signIn, signOut } from '../utils/auth';
import { getUser } from '../api/user/userData';

const NavBar = () => {
  const router = useRouter();
  const { user } = useAuth();
  const expand = false;

  const checkUserProfile = () => {
    if (user.uid) {
      getUser(user.uid).then((userObj) => {
        if (!Object.values(userObj).length) {
          router.push('/user/new');
        }
      });
    }
  };
  const signOutUser = () => {
    router.push('/');
    signOut();
  };

  useEffect(() => {
    checkUserProfile();
  }, [user]);

  return (
    <>
      <Navbar key={expand} bg="light" expand={expand} className={`nav-nav ${router.route === '/user/new' ? 'navNoShow' : ''} "mb-3"`}>
        <Container fluid>
          <div className="navItems">
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Link href="/" passHref>
              <Navbar.Brand className="navTitle">M.A.D. App</Navbar.Brand>
            </Link>
            {/* Visible Stuff go here */}
            {user ? (
              <Button type="button" className="sign-out btn btn-danger" onClick={signOutUser}>Sign Out</Button>
            ) : (
              <Button type="button" className="sign-in btn btn-success" onClick={signIn}>Sign In</Button>
            )}
          </div>
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                <Image className="nav-logo-expand" src="https://res.cloudinary.com/twofiveclimb/image/upload/v1663966058/mad-app/madLogoNav_hf3myl.png" alt="mad app logo" />
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="navLinks justify-content-center flex-grow-1 pe-3">
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`}>
                  <Link href="/" passHref expand={false}>
                    <span> Home</span>
                  </Link>
                </Navbar.Toggle>
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`}>
                  <Link href="/browseEvents" passHref>
                    <span>Browse Events</span>
                  </Link>
                </Navbar.Toggle>
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`}>
                  <Link href="/browseDays" passHref>
                    <span>Browse Days</span>
                  </Link>
                </Navbar.Toggle>
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`}>
                  <Link href="/search" passHref>
                    <span>Search</span>
                  </Link>
                </Navbar.Toggle>
                <>
                  {user
                    ? (
                      <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`}>
                        <Link href="/event/new" passHref><span>Create Event</span>
                        </Link>
                      </Navbar.Toggle>
                    ) : <></> }
                  {user
                    ? (
                      <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`}>
                        <Link href="/day/new" passHref><span>Create Day</span>
                        </Link>
                      </Navbar.Toggle>
                    ) : <></> }
                  {user
                    ? (
                      <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`}>
                        <Link href="/user/profile" passHref><span>Profile</span>
                        </Link>
                      </Navbar.Toggle>
                    )
                    : <></> }
                  {user ? (
                    <Button type="button" className="sign-out btn btn-danger" onClick={signOutUser}>Sign Out</Button>
                  ) : (
                    <Button type="button" className="sign-in btn btn-success" onClick={signIn}>Sign In</Button>
                  )}
                </>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
