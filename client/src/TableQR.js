import React from "react";
import { QRCodeCanvas } from "qrcode.react";

function TableQR() {

  const tables = [1,2,3,4,5,6,7,8,9,10];

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>

      <h1>🍽 Restaurant Table QR Codes</h1>

      {tables.map((table) => (
        <div key={table} style={{ marginBottom: "40px" }}>

          <h3>Table {table}</h3>

          <QRCodeCanvas
            value={`http://localhost:3000/?table=${table}`}
            size={200}
          />

          <p>
            http://localhost:3000/?table={table}
          </p>

        </div>
      ))}

    </div>
  );
}

export default TableQR;