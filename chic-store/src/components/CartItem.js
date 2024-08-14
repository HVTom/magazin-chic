import Image from 'next/image';

const CartItem = ({ item, onDelete }) => {

  const handleDelete = async () => {
    try {
      await onDelete(item);
    } catch {

    }
  }

  return (
    <div className="flex xl:justify-even lg:justify-even sm:justify-between items-center border-l-2 p-4 my-4 hover:bg-gray-100">
      <div className="flex items-center">
        {item.thumbnail ? (
          <Image
            src={item.thumbnail}
            width={100}
            height={200}
            alt={item.name}
          />
        ) : (
          <div className="w-100 h-200 bg-gray-200"></div>
        )}
        <div className="ml-8">
          <p className="text-lg">{item.name}</p>
          <p className="text-lg">Mărime: {item.size}</p>
          <div className="flex flex-row">
            <p className="text-lg">Culoare: </p>
            <div
              className="ml-2 w-6 h-6 rounded-full border border-gray-300"
              style={{ backgroundColor: item.color }}
            >
            </div>
          </div>
          {item.new_price ?
            (
              <p className="text-lg text-red-600">{item.new_price.toFixed(2)} Lei</p>
            ) : (
              <p className="text-lg text-red-600">{item.price.toFixed(2)} Lei</p>
            )
          }
        </div>
      </div>

      <button onClick={handleDelete}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-7 h-7 cursor-pointer transform transition-transform hover:scale-125 hover:text-red-500 ml-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default CartItem;