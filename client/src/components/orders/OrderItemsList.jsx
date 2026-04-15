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
          {items.map((item, index) => {
            // Handle both cart items (item.product) and order items (item.name)
            const productName = item.name || item.product?.name || 'Unknown Product'
            const productImage = item.image || item.product?.images?.[0] || 'https://via.placeholder.com/60'
            const productSlug = item.product?.slug
            const itemPrice = item.price

            return (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-2">
                  <img
                    src={productImage}
                    alt={productName}
                    className="w-12 h-12 rounded object-cover"
                  />
                </td>
                <td className="py-3 px-2">
                  {productSlug ? (
                    <Link
                      to={`/products/${productSlug}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {productName}
                    </Link>
                  ) : (
                    <span className="font-medium">{productName}</span>
                  )}
                </td>
                <td className="py-3 px-2 text-center">{item.quantity}</td>
                <td className="py-3 px-2 text-right">
                  ₹{itemPrice.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-2 text-right font-semibold">
                  ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default OrderItemsList
