import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./Layout";
import Accounts from "./pages/accounts/Accounts";
import CreateAccount from "./pages/createAccount/CreateAccount";
import SingleAccount from "./pages/singleAccount/SingleAccount";
import Transfers from "./pages/transfers/Transfers";
import CreateTransfer from "./pages/createTransfer/CreateTransfer";

function App() {
  const route = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Accounts />,
        },
        {
          path: "createAccount",
          element: <CreateAccount />,
        },
        {
          path: "account/:id",
          element: <SingleAccount />,
        },
        {
          path: "transfers",
          element: <Transfers />,
        },
        {
          path: "createTransfer/:senderId",
          element: <CreateTransfer />,
        },
      ],
    },
  ]);
  const queryClient = new QueryClient();
  return (
    <>
      <ToastContainer />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={route}></RouterProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
