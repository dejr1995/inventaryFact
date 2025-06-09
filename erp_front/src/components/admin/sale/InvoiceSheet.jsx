import React from "react";
import styled from "styled-components";

const InvoiceSheet = ({ invoice, client, companyInfo }) => {
  const formattedCompany = {
    razon_social: companyInfo?.razon_social || "No registra",
    numero_ruc: companyInfo?.numero_ruc || "No registra",
    domicilio_fiscal: companyInfo?.domicilio_fiscal || "No registra",
    datos_contacto: companyInfo?.datos_contacto || "No registra",
  };
  // Se asegura de que invoice.items sea un array, incluso si es undefined
  const items = invoice.items || [];
  const subtotal = items.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  );
  const taxRate = 0.18; // Ejemplo: 18% de IGV
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <InvoiceContainer>
      <Header>
        <CompanyInfo>
          <CompanyName>{formattedCompany.razon_social}</CompanyName>
          <p>RUC: {formattedCompany.numero_ruc}</p>
          <p>Direccion: {formattedCompany.domicilio_fiscal}</p>
          <p>Email: {formattedCompany.datos_contacto}</p>
        </CompanyInfo>
        <InvoiceMeta>
          <InvoiceTitle>FACTURA</InvoiceTitle>
          <p>
            <strong>N°:</strong> {invoice.comprobante}
          </p>
          <p>
            <strong>Metodo de Pago:</strong> {invoice.metodo_pago}
          </p>
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(invoice.fecha).toLocaleDateString()}
          </p>
          <p>
            <strong>Estado:</strong> {invoice.estado}
          </p>
        </InvoiceMeta>
      </Header>

      <Section>
        <SectionTitle>Datos del Cliente</SectionTitle>
        <p>
          <strong>Nombre:</strong> {client.nombres} {client.apellidos}
        </p>
        <p>
          <strong>DNI:</strong> {client.dni}
        </p>
        <p>
          <strong>Dirección:</strong> {client.direccion}
        </p>
      </Section>

      <Section>
        <SectionTitle>Detalle de la Venta</SectionTitle>
        <Table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.productoNombre}</td>
                <td>{item.quantity}</td>
                <td>S/ {Number(item.unitPrice).toFixed(2)}</td>
                <td>
                  S/{" "}
                  {(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section>
        <SectionTitle>Totales</SectionTitle>
        <Totals>
          <p>
            <strong>Subtotal:</strong> S/ {subtotal.toFixed(2)}
          </p>
          <p>
            <strong>IGV (18%):</strong> S/ {tax.toFixed(2)}
          </p>
          <p>
            <strong>Total:</strong> S/ {total.toFixed(2)}
          </p>
        </Totals>
      </Section>

      <Footer>
        <p>Gracias por su compra.</p>
      </Footer>

      <PrintButton onClick={() => window.print()}>Imprimir Factura</PrintButton>
    </InvoiceContainer>
  );
};

export default InvoiceSheet;

const InvoiceContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  border: 1px solid #ddd;
  background: #fff;
  font-family: Arial, sans-serif;
  color: #333;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

const CompanyInfo = styled.div`
  flex: 1;
`;

const CompanyName = styled.h2`
  margin: 0 0 5px;
`;

const InvoiceMeta = styled.div`
  text-align: right;
`;

const InvoiceTitle = styled.h1`
  margin: 0;
  font-size: 28px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
  margin-bottom: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background: #f5f5f5;
  }
`;

const Totals = styled.div`
  text-align: right;
  p {
    margin: 5px 0;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 30px;
  font-style: italic;
`;

const PrintButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #0069d9;
  }
`;
