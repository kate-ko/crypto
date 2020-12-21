import {
    NavLink
} from "react-router-dom";

function Navbar() {
    return <nav className="navbar navbar-dark bg-dark">
        <ul className="nav">
            <li className="nav-item">
                <NavLink className="nav-link" to="/rates">Rates</NavLink>
            </li>

            <li className="nav-item">
                <NavLink className="nav-link" to="/history">History</NavLink>
            </li>
        </ul>
    </nav >
}

export default Navbar;