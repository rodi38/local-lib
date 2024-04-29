import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "../App"
import Book from "../components/book";
import Loan from "../components/loan";
import Student from "../components/student";
import CreateStudent from "../components/student/CreateStudent";
import CreateBook from "../components/book/CreateBook";
import CreateLoan from "../components/loan/CreateLoan";

function Router() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <App/>,
            errorElement: <p>Pagina não existe.</p>,
            children: [
                {
                    path: "/book",
                    element: <Book/>,
                },
                {
                    path: "/loan",
                    element: <Loan/>,
                },
                {
                    path: "/student",
                    element: <Student/>,
                },
                {
                    path: "/create-book",
                    element: <CreateBook/>
                },
                {
                    path: "/create-loan",
                    element: <CreateLoan/>
                },
                {
                    path: "/create-student",
                    element: <CreateStudent/>
                }
            ]
        }
    ]);
  return (
    <RouterProvider router={router}/>
  )
}

export default Router