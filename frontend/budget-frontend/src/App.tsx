import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NewTransactionPage from "./pages/NewTransactionPage";
import TransactionsPage from "./pages/TransactionsPage";

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/transactions" replace/>} />
      <Route path="/transactions" element={<TransactionsPage/>} />
      <Route path="/transactions/new" element={<NewTransactionPage/>} />
    </Routes>
    </BrowserRouter>
  )
}