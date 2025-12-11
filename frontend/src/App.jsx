import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner"; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Ensure this wraps app
import Analytics from "./pages/Manage/Analytics";

// --- PAGES ---
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Menu from "./pages/Menu";            // Public Customer Menu
import OrderSuccess from "./pages/OrderSuccess";

// --- ADMIN PAGES ---
import Manage from "./pages/Manage";        // The Layout Shell
import DayMenu from "./pages/Manage/DayMenu"; // Dashboard Home
import ManageOrders from "./pages/Manage/Orders";
import ManageMenu from "./pages/Manage/Menu";
import ManageQr from "./pages/Manage/QrCode";
import Settings from "./pages/Manage/Settings";
import Team from "./pages/Manage/Team";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Public Customer View */}
            <Route path="/menu/:shopId" element={<Menu />} />
            <Route path="/order/success/:orderId" element={<OrderSuccess />} />

            {/* --- Protected Admin Routes --- */}
            <Route element={<ProtectedRoute />}>
              {/* 
                  The layout "Manage" renders here.
                  All nested routes will render inside Manage's <Outlet /> 
              */}
              <Route path="/manage" element={<Manage />}>
                <Route index element={<DayMenu />} />       {/* Default: /manage */}
                <Route path="orders" element={<ManageOrders />} /> {/* /manage/orders */}
                <Route path="team" element={<Team />} />           {/* /manage/team */}
                <Route path="stats" element={<Analytics />} />     {/* /manage/stats */}
                <Route path="menu" element={<ManageMenu />} />     {/* /manage/menu */}
                <Route path="qr" element={<ManageQr />} />         {/* /manage/qr */}
                <Route path="settings" element={<Settings />} />   {/* /manage/settings */}
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;