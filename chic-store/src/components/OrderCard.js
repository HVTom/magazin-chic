import Image from "next/image";

const OrderCard = ({ order, onReturnOrder }) => {
  const orderDate = new Date(order.date);
  const currentDate = new Date();
  const daysPassed = Math.floor((currentDate - orderDate) / (1000 * 60 * 60 * 24));
  const canReturn = daysPassed <= 14 && order.status !== 'returnat';

  const getBackgroundColor = () => {
    switch (order.status) {
      case 'in asteptare':
        return 'bg-yellow-100';
      case 'returnat':
        return 'bg-red-100';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className={`my-8 p-2 border border-gray hover:border-black ${getBackgroundColor()}`}>
      <div className="flex flex-row">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center mt-4">
            <div className="mr-4">
              <Image
                src={item.thumbnail || '/images/placeholder.jpg'}
                width={70}
                height={100}
                alt={item.name}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-row justify-even mt-2">
        <div>
          <p>Număr comandă</p>
          <p>{order.id}</p>
        </div>
        <div className="border-r border-gray-300 mx-12"></div>
        <div>
          <p>Dată comandă</p>
          <p>{new Date(order.date).toLocaleDateString()}</p>
        </div>
        <div className="border-r border-gray-300 mx-12"></div>
        <div>
          <p>Total</p>
          <p>{order.amount} RON</p>
        </div>
        <div className="border-r border-gray-300 mx-12"></div>
        <div>
          <p>Status:</p>
          <p>{order.status}</p>
        </div>
      </div>
      
      {canReturn && (
        <div className="mt-4">
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => onReturnOrder(order.id)}
          >
            Returneaza Comanda
          </button>
        </div>
      )}
    </div>
  )
}

export default OrderCard;