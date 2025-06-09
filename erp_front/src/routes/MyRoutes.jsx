import { Navigate, Route, Routes } from "react-router-dom";
import ProductList from "../components/admin/inventory/ProductList";
import CreateProduct from "../components/admin/inventory/CreateProduct";
import Products from "../components/admin/main/Products";
import Dashboard from "../components/admin/main/Dashboard";
import Providers from "../components/admin/main/Providers";
import ProviderList from "../components/admin/provider/ProviderList";
import CreateProvider from "../components/admin/provider/CreateProvider";
import Clients from "../components/admin/main/Clients";
import ClientList from "../components/admin/client/ClientList";
import CreateClient from "../components/admin/client/CreateClient";
import Entrances from "../components/admin/main/Entrances";
import EntranceList from "../components/admin/entrance/EntranceList";
import CreateEntrance from "../components/admin/entrance/CreateEntrance";
import SaleList from "../components/admin/sale/SaleList";
import Sales from "../components/admin/main/Sales";
import CreateSale from "../components/admin/sale/CreateSale";
import CompanyForm from "../components/admin/company/CompanyForm";
import Login from "../components/admin/user/Login";
import { ProtectedRoute } from "../components/admin/main/ProtectedRoute";
import UpdateProfileForm from "../components/admin/company/PasswordForm";
import Reports from "../components/admin/report/Reports";
import Users from "../components/admin/main/Users";
import CreateUser from "../components/admin/user/CreateUser";
import UserList from "../components/admin/user/UserList";
import NotFound from "../components/admin/main/NotFound";

const MyRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" exact={true} element={<Dashboard />}>
        <Route path="products" element={<Products />}>
          <Route index element={<ProductList />} />
          <Route path="create-product" element={<CreateProduct />} />
        </Route>
        <Route path="providers" element={<Providers />}>
          <Route index element={<ProviderList />} />
          <Route path="create-provider" element={<CreateProvider />} />
        </Route>
        <Route path="entrances" element={<Entrances />}>
          <Route index element={<EntranceList />} />
          <Route path="create-entrance" element={<CreateEntrance />} />
        </Route>
        <Route path="clients" element={<Clients />}>
          <Route index element={<ClientList />} />
          <Route path="create-client" element={<CreateClient />} />
        </Route>
        <Route path="sales" element={<Sales />}>
          <Route index element={<SaleList />} />
          <Route path="create-sale" element={<CreateSale />} />
        </Route>
        <Route path="users" element={<Users />}>
          <Route index element={<UserList />} />
          <Route path="create-user" element={<CreateUser />} />
        </Route>
        <Route element={<ProtectedRoute requiredRoles={["admin"]} />}>
          <Route path="infocompany" element={<CompanyForm />} />
        </Route>
        <Route path="changepassword" element={<UpdateProfileForm />} />
        <Route path="reports" element={<Reports />} />
        <Route path="unauthorized" element={<NotFound />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default MyRoutes;
