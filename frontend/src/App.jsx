import HomePage from "./pages/HomePage/HomePage.jsx"
import Login from "./pages/Login/Login.jsx"
import PreviousReports from "./pages/PreviousReports/PreviousReports.jsx"
import Results from "./pages/Results/Results.jsx"
import SignUp from "./pages/SignUp/SignUp.jsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "home",
    element: <HomePage />,
  },
  {
    path: "results",
    element: <Results />,
  },
  {
    path: "previous-reports",
    element: <PreviousReports />
  },
])

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
