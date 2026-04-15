import { useState, useCallback } from 'react'
import axios from '../api/axios'

const useOrders = () => {
  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10
  })

  const fetchOrders = useCallback(async (customFilters = {}) => {
    try {
      setLoading(true)
      setError(null)

      const params = { ...filters, ...customFilters }

      const response = await axios.get('/api/orders/my-orders', { params })

      if (response.data.success) {
        setOrders(response.data.data)
        setPagination(response.data.pagination)
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to fetch orders'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page on filter change
    }))
  }, [])

  const changePage = useCallback((page) => {
    setFilters(prev => ({
      ...prev,
      page
    }))
  }, [])

  const cancelOrder = async (orderId, reason = '') => {
    try {
      setLoading(true)
      const response = await axios.put(`/api/orders/${orderId}/cancel`, {
        reason
      })

      if (response.data.success) {
        // Refetch orders to show updated status
        await fetchOrders()
        return { success: true, data: response.data.data }
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to cancel order'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  return {
    orders,
    pagination,
    loading,
    error,
    filters,
    fetchOrders,
    updateFilter,
    changePage,
    cancelOrder
  }
}

export default useOrders
