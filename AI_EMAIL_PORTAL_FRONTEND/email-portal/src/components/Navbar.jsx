import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useLogout } from "../API/api";
import { Toaster } from "react-hot-toast";
import { CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
export default function NavbarComponent() {
  const logout = useLogout();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
      <Navbar.Brand href="/">AI Email Pro</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          {user ? (
            <>
              <Nav.Link onClick={() => logout()}>Logout</Nav.Link>
              <NavDropdown title="Profile" id="basic-nav-dropdown">
                <NavDropdown.Item href="/joblist">All Jobs</NavDropdown.Item>
                <NavDropdown.Item href="/myjobs">Applied Jobs</NavDropdown.Item>
                {/* <NavDropdown.Item href="/jobform">Create Job</NavDropdown.Item> */}
                <NavDropdown.Item href="/mails">Mail History</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/settings">
              <button className="flex items-center gap-2  text-gray-700 hover:text-black">
                <CiSettings size={24} color="white" />
              </button>
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link href="/register">Register</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
      <Toaster position="top-right" reverseOrder={false} />
    </Navbar>
  );
}
