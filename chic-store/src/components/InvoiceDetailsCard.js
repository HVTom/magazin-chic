import React from 'react';

const InvoiceDetailsCard = ({ invoice, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>

      <div className="relative bg-white p-8 rounded-lg shadow-xl max-w-3xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Detalii Comandă</h2>

        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Informații Client</h3>
          <p><strong>Nume:</strong> {invoice.first_name} {invoice.last_name}</p>
          <p><strong>Email:</strong> {invoice.email}</p>
          <p><strong>Telefon:</strong> {invoice.phone}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Detalii Comandă</h3>
          <p><strong>ID Comandă:</strong> {invoice.order_id}</p>
          <p><strong>Data Comandă:</strong> {new Date(invoice.order_date).toLocaleString()}</p>
          <p><strong>Status:</strong> {invoice.status}</p>
          <p><strong>Preț Total:</strong> {invoice.total_price.toFixed(2)} LEI</p>
          <p><strong>Adresă Livrare:</strong> {invoice.shipping_address}</p>
          <p><strong>Metodă Plată:</strong> {invoice.payment_method}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Detalii Facturare</h3>
          <p><strong>Tip Factură:</strong> {invoice.invoice_type === 'personal' ? 'Persoană Fizică' : 'Persoană Juridică'}</p>
          {invoice.invoice_type === 'personal' ? (
            <>
              <p><strong>Nume:</strong> {invoice.billing_first_name} {invoice.billing_last_name}</p>
            </>
          ) : (
            <>
              <p><strong>Companie:</strong> {invoice.billing_company_name}</p>
              <p><strong>CUI:</strong> {invoice.billing_cui}</p>
            </>
          )}
          <p><strong>Adresă:</strong> {invoice.billing_street}, {invoice.billing_city}, {invoice.billing_county}, {invoice.billing_zip_code}</p>
          <p><strong>Telefon:</strong> {invoice.billing_phone}</p>
          <p><strong>Email:</strong> {invoice.billing_email}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Produse Comandate</h3>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Produs</th>
                <th className="text-left">Preț</th>
                <th className="text-left">Mărime</th>
                <th className="text-left">Culoare</th>
              </tr>
            </thead>
            <tbody>
              {invoice.order_items.map((item, index) => (
                <tr key={index}>
                  <td>{item.item_name}</td>
                  <td>{item.price.toFixed(2)} LEI</td>
                  <td>{item.size}</td>
                  <td>
                    <div className="flex items-center">
                      <div
                        className="w-6 h-6 rounded-full mr-2 border-2 border-indigo-500"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      {item.color}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center">
          <button
            className="bg-gray-200 text-black px-4 py-2 rounded mt-6 hover:bg-gray-300"
            onClick={onClose}
          >
            Închide
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsCard;