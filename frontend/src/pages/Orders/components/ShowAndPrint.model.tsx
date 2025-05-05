import React from 'react';
import { Dialog } from 'primereact/dialog';
import { useGetInvoiceByIdQuery } from '../../../provider/queries/Orders.query';
import Loader from '../../../components/Loader';
import moment from 'moment';
import Barcode from 'react-barcode';
import { usePDF } from 'react-to-pdf';
// import QRCode from 'qrcode.react'; // For QR code generation
import logo from '../../../assets/logo.png'; // Add your company logo here

const ShowAndPrintModel = ({ setVisible, visible, id }) => {
  const { data, isLoading, isError, isFetching } = useGetInvoiceByIdQuery(id);
  const { toPDF, targetRef } = usePDF();

  if (isFetching || isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <>something went wrong</>;
  }

  const calculateGST = (amount) => {
    const gstRate = 0.18; // 18% GST
    return amount * gstRate;
  };

  const calculateTotal = (items) => {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => sum + item.price, 0);
  };

  const handlePrint = () => {
    window.print(); // Trigger print functionality
  };

  return (
    <Dialog 
      draggable={false} 
      visible={visible} 
      className="w-[90%] mx-auto lg:mx-0 lg:w-2/3" 
      onHide={() => setVisible(false)}
    >
      <div ref={targetRef} className="m-0 px-5 relative">
        {/* Watermark */}
        {/* <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <h1 className="text-6xl font-bold text-black-300 transform rotate-45">IMS</h1>
        </div> */}

        {/* Company Header */}
        <div className="text-center mb-4">
          <img src={logo} alt="Company Logo" className="w-24 h-24 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">TAX INVOICE</h1>
          <p className="text-sm text-gray-600">Potheri, SRM Nagar, Kattankulathur, Tamil Nadu 603203</p>
          <p className="text-sm text-gray-600">Phone: +91 6265416516 | Email: {data?.user?.email || 'abhijitgyan121@gmail.com'}</p>
        </div>

        {/* Invoice Title & Number */}
        <div className="flex justify-between items-center border-b-2 border-t-2 py-2">
          <h2 className="text-xl font-semibold">IMS</h2>
          <div className="text-right">
            <p className="font-semibold">Invoice No: IMS-{data?._id?.slice(-6)}</p>
            <p>Date: {moment(data?.createdAt).format("ll")}</p>
          </div>
        </div>

        {/* Billing Details Grid */}
        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Bill To */}
          <div className="border p-3 rounded">
            <h3 className="font-semibold mb-2">Bill To:</h3>
            <p className="capitalize">{data?.consumer?.name}</p>
            <p className="text-sm">{data?.consumer?.address}</p>
            <p className="text-sm">Phone: {data?.consumer?.phone || '91XXXX78454'}</p>
            <p className="text-sm">GSTIN: {data?.consumer?.gstin || 'PQ154583U48'}</p>
          </div>

          {/* Ship To */}
          <div className="border p-3 rounded">
            <h3 className="font-semibold mb-2">Supplier Details:</h3>
            <p>{data?.user?.name}</p>
            <p className="text-sm">Email: {data?.user?.email}</p>
            <p className="text-sm">Phone: {data?.user?.phone || '91XXXX78454'}</p>
            <p className="text-sm">GSTIN: 10AI78OF45F</p>
            <p className="text-sm">PAN: AAZPM1234C</p>
            <div className="mt-2">
              <Barcode displayValue={false} width={1} height={40} value={data?._id} />
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-6">
          <table className="w-full border-collapse border">
            <thead className="bg-gray-50">
              <tr>
                <th className="border p-2 text-sm">Sr. No.</th>
                <th className="border p-2 text-sm">Item Description</th>
                <th className="border p-2 text-sm">HSN/SAC</th>
                <th className="border p-2 text-sm">Qty</th>
                <th className="border p-2 text-sm">Rate</th>
                <th className="border p-2 text-sm">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data?.items?.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2 capitalize">{item.name}</td>
                  <td className="border p-2 text-center">8517</td>
                  <td className="border p-2 text-center">1</td>
                  <td className="border p-2 text-center">₹{item.price}</td>
                  <td className="border p-2 text-center">₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculations */}
        <div className="flex justify-end mt-4">
          <div className="w-64 border rounded p-3">
            <div className="flex justify-between mb-2">
              <span>Sub Total:</span>
              <span>₹{calculateTotal(data?.items)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>CGST (9%):</span>
              <span>₹{(calculateGST(calculateTotal(data?.items)) / 2).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>SGST (9%):</span>
              <span>₹{(calculateGST(calculateTotal(data?.items)) / 2).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Grand Total:</span>
              <span>₹{(calculateTotal(data?.items) + calculateGST(calculateTotal(data?.items))).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Terms and Bank Details */}
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="text-sm">
            <h3 className="font-semibold mb-2">Terms & Conditions:</h3>
            <ol className="list-decimal ml-4 text-gray-600">
              <li>Payment should be done within 30 days</li>
              <li>Goods once sold will not be taken back</li>
              <li>We declare that this invoice shows actual price of goods</li>
            </ol>
          </div>
          <div className="text-sm">
            <h3 className="font-semibold mb-2">Bank Details:</h3>
            <p>Bank Name: HDFC Bank</p>
            <p>A/C No: XXXX XXXX 9584 9841</p>
            <p>IFSC Code: HDFC0001234</p>
            <p>Branch: Potheri</p>
          </div>
        </div>

        {/* QR Code for Quick Access */}
        {/* <div className="mt-6 flex justify-center">
          <QRCode value={https://your-invoice-link.com/invoice/${data?._id}} size={128} />
        </div> */}

        {/* Footer */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-end">
            <div className="text-sm text-gray-600">
              <p>This is a computer generated invoice</p>
            </div>
            <div className="text-right">
              <p className="font-semibold mb-8">From IMS</p>
              <p>Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>

      {/* Generate PDF and Print Buttons */}
      <footer className="mt-4 flex justify-end gap-4">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          onClick={handlePrint}
        >
          Print Invoice
        </button>
        <button
          className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          onClick={() => toPDF({
            method: "open",
            page: { format: "A4" }
          })}
        >
          Generate PDF
        </button>
      </footer>
    </Dialog>
  );
};

export default ShowAndPrintModel;