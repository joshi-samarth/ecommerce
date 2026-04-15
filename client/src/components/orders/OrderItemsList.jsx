import React from 'react'
import { Link } from 'react-router-dom'

const OrderItemsList = ({ items }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-2">Image</th>
            <th className="text-left py-3 px-2">Product</th>
            <th className="text-center py-3 px-2">Qty</th>
            <th className="text-right py-3 px-2">Unit Price</th>
            <th className="text-right py-3 px-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-3 px-2">
                <img
                  src={item.image || 'https://via.placeholder.com/60'}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover"
                />
              </td>
              <td className="py-3 px-2">
                {item.product && item.product.slug ? (
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="font-medium">{item.name}</span>
                )}
              </td>
              <td className="py-3 px-2 text-center">{item.quantity}</td>
              <td className="py-3 px-2 text-right">
                ₹{item.price.toLocaleString('en-IN')}
              </td>
              <td className="py-3 px-2 text-right font-semibold">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrderItemsList
