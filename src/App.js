import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import TaskIndex from "./TaskIndex.js";
import SolverIndex from "./SolverIndex.js";

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/tasks"} className="nav-link">
                Tasks
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/solvers"} className="nav-link">
                Solvers
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route index element={<Navigate to={"/tasks"} />} />
          <Route path="/tasks">
            <Route index element={<TaskIndex/>} />           
          </Route>

          <Route index element={<Navigate to={"/solvers"} />} />
          <Route path="/solvers">
            <Route index element={<SolverIndex />} />            
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
