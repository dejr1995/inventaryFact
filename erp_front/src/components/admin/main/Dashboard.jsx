import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AiFillProduct } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { ImUserTie } from "react-icons/im";
import { TbReport } from "react-icons/tb";
import { GrConfigure } from "react-icons/gr";
import { MdOutlineInventory } from "react-icons/md";
import { useEffect, useState } from "react";
import Logout from "../user/Logout";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [showProductsSubmain, setShowProductsSubmain] = useState(false);
  const [showControlInventorySubmain, setShowControlInventorySubmain] =
    useState(false);
  const [showUsersSubmain, setShowUsersSubmain] = useState(false);
  const [showInfoSubmain, setShowInfoSubmain] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return (
    <StyledDashboard>
      <SideNav>
        <div
          style={{
            background: "#f2f2f2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "30px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ marginTop: "20px" }}>panel de control</h3>
        </div>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/clients"
        >
          <ImUserTie />
          Clientes
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="#"
          onClick={() => setShowProductsSubmain(!showProductsSubmain)}
        >
          <AiFillProduct />
          Gestion de Productos
        </NavLink>
        {showProductsSubmain && (
          <SubMenu>
            <NavLink
              className={({ isActive }) =>
                isActive ? "link-active" : "link-inactive"
              }
              to="/admin/products"
            >
              Productos
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "link-active" : "link-inactive"
              }
              to="/admin/providers"
            >
              Proveedores
            </NavLink>
          </SubMenu>
        )}
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="#"
          onClick={() =>
            setShowControlInventorySubmain(!showControlInventorySubmain)
          }
        >
          <MdOutlineInventory />
          Control de Inventario
        </NavLink>
        {showControlInventorySubmain && (
          <SubMenu>
            <NavLink
              className={({ isActive }) =>
                isActive ? "link-active" : "link-inactive"
              }
              to="/admin/entrances"
            >
              Entradas
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "link-active" : "link-inactive"
              }
              to="/admin/sales"
            >
              Salidas / Facturacion
            </NavLink>
          </SubMenu>
        )}
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="#"
          onClick={() => setShowUsersSubmain(!showUsersSubmain)}
        >
          <FaUsers />
          Gestion de Usuarios
        </NavLink>
        {showUsersSubmain && (
          <SubMenu>
            <NavLink
              className={({ isActive }) =>
                isActive ? "link-active" : "link-inactive"
              }
              to="/admin/users"
            >
              Usuarios
            </NavLink>
          </SubMenu>
        )}
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="/admin/reports"
        >
          <TbReport />
          Reportes
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? "link-active" : "link-inactive"
          }
          to="#"
          onClick={() => setShowInfoSubmain(!showInfoSubmain)}
        >
          <GrConfigure />
          Configuracion
        </NavLink>
        {showInfoSubmain && (
          <SubMenu>
            <NavLink
              className={({ isActive }) =>
                isActive ? "link-active" : "link-inactive"
              }
              to="/admin/infocompany"
            >
              Informacion de Empresa
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "link-active" : "link-inactive"
              }
              to="/admin/changepassword"
            >
              Cambiar contraseña
            </NavLink>
          </SubMenu>
        )}
      </SideNav>
      <Content>
        <Outlet />
        <Logout />
      </Content>
    </StyledDashboard>
  );
};

export default Dashboard;

const StyledDashboard = styled.div`
  display: flex;
  height: 100%;
  overflow-x: hidden;
`;

const SideNav = styled.div`
  border-right: 1px solid #fafbfc;
  height: calc(100vh - 16px);
  position: fixed;
  width: 270px;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background-color: white;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border-radius: 10px;
  h3 {
    margin: 0 0 1rem 0;
    padding: 0;
    text-transform: uppercase;
    font-size: 17px;
  }

  a {
    text-decoration: none;
    margin-bottom: 1rem;
    font-size: 14px;
    display: flex;
    align-items: center;
    font-weight: 700;
    color: gray;
    svg {
      margin-right: 1rem;
      font-size: 25px;
    }
  }
`;

const SubMenu = styled.div`
  margin-left: 2rem;
  margin-bottom: 1rem;
  a {
    margin-bottom: 0.5rem;
    font-size: 13px;
    font-weight: 400;
    color: darkgray;

    &.link-active {
      color: black;
    }
    &.link-inactive {
      color: gray;
    }
  }
`;

const Content = styled.div`
  margin-left: 270px;
  padding-left: 3rem;
  padding-right: 3rem;
  padding-top: 2rem;
  width: calc(100% - 270px);
  background: #f8f9fa;
  min-height: calc(100vh - 50px);
  border-radius: 10px;
`;
