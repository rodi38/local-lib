import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "../App"
import Book from "../components/book";
import Loan from "../components/loan";
import Student from "../components/student";

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
                }
            ]
        }
    ]);
  return (
    <RouterProvider router={router}/>
  )
}

export default Router