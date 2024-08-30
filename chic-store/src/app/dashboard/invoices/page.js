'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import InvoiceDetailsCard from "@/components/InvoiceDetailsCard";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "@/components/InvoicePDF";


const companyDetails = {
  name: "Magazin Chic",
  address: "Strada Bogdan Vodă",
  phone: "07XX XXX XXX",
  email: "imbracaminte.chic@gmail.com"
};


const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePopup, setActivePopup] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);


  useEffect(() => {
    fetchInvoices();
  }, []);


  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/invoices");
      setInvoices(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setError("Eroare la citirea comenzilor.");
      setLoading(false);
    }
  };

  const markAsShipped = async (orderId) => {
    const order = {
      orderId,
      status: 'expediat'
    }

    try {
      await axios.post("/api/invoices", order);
      fetchInvoices();
    } catch (error) {
      console.error("Error marking order as shipped:", error);
      alert("Eroare la marcarea comenzii ca 'expediată'.");
    }
  };

  const revertShippedMark = async (orderId) => {
    const order = {
      orderId,
      status: 'in asteptare'
    }

    try {
      await axios.post("/api/invoices", order);
      fetchInvoices();
    } catch (error) {
      console.error("Error reverting order as pending:", error);
      alert("Eroare la marcarea comenzii ca 'in asteptare'.");
    }
  };

  if (loading) return <div>Se încarcă...</div>;
  if (error) return <div>Eroare: {error}</div>;



  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFisrtRow = indexOfLastRow - rowsPerPage;
  const currentRows = invoices.slice(indexOfFisrtRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // backward/forward navigation
  const navigatePage = (direction) => {
    if (direction === 'forward' && currentPage < Math.ceil(invoices.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'backward' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  // Calculate total pages
  const totalPages = Math.ceil(invoices.length / rowsPerPage);

  // Determine which page numbers to show
  const pageNumbers = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }


  return (
    <div className="mb-4">
      <h1 className="text-2xl font-semibold my-4">Facturi</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Comenzii
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preț Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detalii
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Factură
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acțiuni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.map((invoice) => (
              <tr
                key={invoice.order_id}
                className={
                  invoice.status === 'in asteptare'
                    ? 'bg-yellow-100'
                    : invoice.status === 'expediat'
                      ? 'bg-green-100'
                      : invoice.status === 'returnat'
                        ? 'bg-red-100'
                        : ''
                }
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invoice.order_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invoice.first_name} {invoice.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(invoice.order_date).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invoice.total_price.toFixed(2)} LEI
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invoice.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => setActivePopup(invoice)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Vezi detalii
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <PDFDownloadLink
                    document={<InvoicePDF invoice={invoice} companyDetails={companyDetails} />}
                    fileName={`invoice-${invoice.order_id}.pdf`}
                  >
                    {({ blob, url, loading, error }) => (
                      <button
                        className={`text-indigo-600 hover:text-indigo-900 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        disabled={loading}
                      >
                        {loading ? 'Incarcare document...' : 'Descarcă PDF'}
                      </button>
                    )}
                  </PDFDownloadLink>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invoice.status === 'in asteptare' ?
                    (
                      <button
                        onClick={() => markAsShipped(invoice.order_id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Marchează ca expediat
                      </button>
                    ) : (
                      <button
                        onClick={() => revertShippedMark(invoice.order_id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Anulare
                      </button>
                    )
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <ul className="flex justify-center items-center space-x-2">
          <li>
            <button
              onClick={() => navigatePage('backward')}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-white hover:bg-gray-100'}`}
            >
              &lt;
            </button>
          </li>
          {pageNumbers.map((number) => (
            <li key={number}>
              <button
                onClick={() => paginate(number)}
                className={`px-3 py-1 border rounded ${currentPage === number ? 'bg-[#FFD700] text-black' : 'bg-white hover:bg-gray-100'}`}
              >
                {number}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => navigatePage('forward')}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-white hover:bg-gray-100'}`}
            >
              &gt;
            </button>
          </li>
        </ul>
      </div>

      {activePopup && (
        <InvoiceDetailsCard
          invoice={activePopup}
          onClose={() => setActivePopup(null)}
        />
      )}
    </div>
  );
};

export default Invoices;