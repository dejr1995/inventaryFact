import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clientsAllFetch } from "../../../store/slices/ClientSlice";
import { productsAllFetch } from "../../../store/slices/ProductSlice";
import { resetSaleStatus, saleCreate } from "../../../store/slices/SaleSlice";
import styled from "styled-components";
import { PrimaryButton } from "../../styles/CommonStyled";
import { TableReport } from "../../styles/Table";

const CreateSale = () => {
  const dispatch = useDispatch();
  const { createStatus, error } = useSelector((state) => state.sales);
  const { list: products } = useSelector((state) => state.products);
  const { list: clients } = useSelector((state) => state.clients);

  const [formData, setFormData] = useState({
    clientId: "",
    serieId: "",
    metodo_pago: "Efectivo",
    codigo_operacion: "",
    items: [],
  });
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Cargar datos iniciales
  useEffect(() => {
    dispatch(productsAllFetch());
    dispatch(clientsAllFetch());
  }, [dispatch]);

  // Resetear estado después de 3 segundos si la venta se registró con éxito
  useEffect(() => {
    if (createStatus === "success") {
      // Limpiar campos
      setFormData({
        clientId: "",
        serieId: "",
        metodo_pago: "Efectivo",
        codigo_operacion: "",
        items: [],
      });
      setSelectedProduct("");
      setQuantity(1);

      // Resetear estado global
      setTimeout(() => dispatch(resetSaleStatus()), 3000);
    }
  }, [createStatus, dispatch]);

  const handleAddItem = () => {
    if (!selectedProduct || quantity < 1) return;
    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const newItem = {
      productId: selectedProduct,
      quantity: Number(quantity),
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    setSelectedProduct("");
    setQuantity(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const confirmSale = window.confirm(
      "¿Estás seguro de que deseas generar esta venta?"
    );

    if (!confirmSale) {
      return; // Si el usuario cancela, no hacemos nada
    }

    // Validar que se hayan completado todos los campos requeridos
    if (
      !formData.clientId ||
      !formData.serieId ||
      !formData.metodo_pago ||
      !formData.codigo_operacion ||
      formData.items.length === 0
    ) {
      alert(
        "Por favor, complete todos los campos y agregue al menos un producto."
      );
      return;
    }
    console.log("Datos enviados:", formData);
    dispatch(saleCreate(formData));
  };

  return (
    <StyledCreateProduct>
      <StyledForm onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        {createStatus === "success" && (
          <div
            style={{
              position: "absolute",
              top: "22%",
              left: "55%",
              color: "#16a34a",
            }}
          >
            Venta registrada!
          </div>
        )}
        {/* Selector de Cliente */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 30px",
          }}
        >
          {/* Campo para Serie ID (código de serie, ej. "F002") */}
          <div>
            <label>Serie de Factura: </label>
            <select
              required
              value={formData.serieId}
              onChange={(e) =>
                setFormData({ ...formData, serieId: e.target.value })
              }
            >
              <option value="">Seleccione Serie</option>
              <option value="F001">F001</option>
              <option value="F002">F002</option>
              <option value="F003">F003</option>
              <option value="F004">F004</option>
              <option value="F005">F005</option>
            </select>
          </div>

          <div>
            <label>Cliente: </label>
            <select
              required
              value={formData.clientId}
              onChange={(e) =>
                setFormData({ ...formData, clientId: e.target.value })
              }
            >
              <option value="">Seleccione cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nombres} {client.apellidos}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 30px",
          }}
        >
          <div>
            <label>Método de Pago: </label>
            <select
              style={{ width: "135px", padding: "0.44rem 0" }}
              required
              value={formData.metodo_pago}
              onChange={(e) =>
                setFormData({ ...formData, metodo_pago: e.target.value })
              }
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Campo para Código de Operación */}
          <div>
            <label>Referencia: </label>
            <input
              style={{ width: "220px", padding: "0.04rem 0.4rem" }}
              type="text"
              required
              value={formData.codigo_operacion}
              onChange={(e) =>
                setFormData({ ...formData, codigo_operacion: e.target.value })
              }
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 30px",
          }}
        >
          {/* Agregar Producto */}
          <div>
            <label>Producto: </label>
            <select
              style={{ width: "182px", padding: "0.44rem 0" }}
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="">Seleccione un producto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.nombre} - S/ {product.precio}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div>
              <label>Cantidad: </label>
              <input
                style={{ width: "50px", padding: "0.04rem 1rem" }}
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              style={{
                cursor: "pointer",
              }}
            >
              Agregar producto
            </button>
          </div>
        </div>

        {/* Lista de Productos Agregados */}
        <div>
          {formData.items.length > 0 && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 30px",
                }}
              >
                <SubTitle>Productos agregados: </SubTitle>
                <PrimaryButton
                  style={{ marginRight: "1rem", width: "250px" }}
                  type="submit"
                  disabled={createStatus === "pending"}
                >
                  {createStatus === "pending"
                    ? "Procesando..."
                    : "Generar Venta"}
                </PrimaryButton>
              </div>
              <div
                style={{
                  height: "250px",
                  overflowY: "auto",
                }}
              >
                <TableReport>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => {
                      const product = products.find(
                        (p) => p.id === item.productId
                      );
                      return (
                        <tr key={index}>
                          <td>{product?.nombre}</td>
                          <td>{item.quantity}</td>
                          <td>S/ {product?.precio}</td>
                          <td>S/ {item.quantity * product?.precio}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </TableReport>
              </div>
            </div>
          )}
        </div>
        {error && (
          <div className="error">
            {error.message || "Ocurrió un error al crear la venta"}
          </div>
        )}
      </StyledForm>
    </StyledCreateProduct>
  );
};

export default CreateSale;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 700px;
  width: 100%;
  margin-top: 2rem;
  padding: 50px;
  background-color: white;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;

  select,
  input {
    padding: 7px;
    min-height: 30px;
    outline: none;
    border-radius: 5px;
    border: 1px solid rgb(182, 182, 182);
    margin: 0.3rem 0;

    &:focus {
      border: 2px solid rgb(0, 208, 255);
    }
  }

  select {
    color: rgb(95, 95, 95);
  }
`;

const StyledCreateProduct = styled.div`
  display: flex;
  width: 100%;
  height: 460px;
  justify-content: center;
`;

export const SubTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #111827;
`;
