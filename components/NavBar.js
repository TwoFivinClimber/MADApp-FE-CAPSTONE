/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  Button, Container, Nav, Navbar, Offcanvas,
} from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/context/authContext';
import { signIn, signOut } from '../utils/auth';
import { getUser } from '../api/user/userData';
import SearchBar from './SearchBar';

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
      <Navbar key={expand} bg="light" expand={expand} className={`${router.route === '/user/new' ? 'navNoShow' : ''} "mb-3"`}>
        <Container fluid>
          <div className="navItems">
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Brand className="navTitle" href="#">M.A.D. App</Navbar.Brand>
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
            collapseOnSelect
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                M.A.D. App
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
                  <SearchBar />
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
