import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../store/slices/AuthSlice";
import { SlLogout } from "react-icons/sl";
import styled from "styled-components";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Content onClick={handleLogout}>
      <SlLogout size={25} />
      <div>Cerrar Sesión</div>
    </Content>
  );
};

export default Logout;

const Content = styled.button`
  position: fixed;
  bottom: 20px;
  left: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #ff416c, #ff4b2b);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 150px;
  &:hover {
    background: linear-gradient(135deg, #e63946, #d62828);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;
