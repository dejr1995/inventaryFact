import styled from "styled-components";

export const TableReport = styled.table`
  width: 100%;
  font-size: 0.875rem;
  border-collapse: collapse;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);

  thead {
    background: linear-gradient(to right, #f3f4f6, #e5e7eb);
    color: #374151;
  }

  th {
    padding: 0.75rem;
    text-align: left;
    font-weight: 600;
  }

  tbody {
    background-color: #ffffff;
  }

  td {
    padding: 0.75rem;
    border-top: 1px solid #e5e7eb;
  }

  tr:hover {
    background-color: #f9fafb;
    transition: background-color 0.3s ease;
  }

  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .text-success {
    color: #16a34a;
    font-weight: 500;
  }
`;
