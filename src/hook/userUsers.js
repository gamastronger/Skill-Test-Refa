import { useState, useEffect, useCallback } from 'react'
import { fetchUsers, createUser, updateUser, deleteUser } from '../services/dummyjson.js'

/**
 * Custom hook untuk mengelola users state dengan CRUD operations
 * Menggunakan localStorage untuk persistence karena DummyJSON tidak real persist
 */

const STORAGE_KEYS = {
  CREATED: 'dummyjson_created_users',
  UPDATED: 'dummyjson_updated_users',
  DELETED: 'dummyjson_deleted_ids',
}

/**
 * Helper functions untuk localStorage
 */
function getStorageData(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function setStorageData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

/**
 * Main hook
 */
export function useUsers(initialLimit = 30) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)
  const [limit] = useState(initialLimit)
  const [skip, setSkip] = useState(0)

  /**
   * Merge users dari API dengan data localStorage
   */
  const mergeWithLocalStorage = useCallback((apiUsers) => {
    // Get localStorage data
    const createdUsers = getStorageData(STORAGE_KEYS.CREATED) || []
    const updatedUsersMap = getStorageData(STORAGE_KEYS.UPDATED) || {}
    const deletedIds = getStorageData(STORAGE_KEYS.DELETED) || []

    // Filter out deleted users
    let merged = apiUsers.filter(user => !deletedIds.includes(user.id))

    // Apply updates from localStorage
    merged = merged.map(user => {
      const update = updatedUsersMap[user.id]
      return update ? { ...user, ...update } : user
    })

    // Prepend created users (yang belum ada di API)
    const mergedIds = new Set(merged.map(u => u.id))
    const newCreatedUsers = createdUsers.filter(u => !mergedIds.has(u.id))
    
    return [...newCreatedUsers, ...merged]
  }, [])

  /**
   * Load users dari API + merge dengan localStorage
   */
  const loadUsers = useCallback(async (newSkip = 0) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await fetchUsers(limit, newSkip)
      const merged = mergeWithLocalStorage(data.users || [])
      
      setUsers(merged)
      setTotal(data.total || 0)
      setSkip(newSkip)
    } catch (err) {
      setError(err.message || 'Failed to load users')
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }, [limit, mergeWithLocalStorage])

  /**
   * Create user baru
   */
  const handleCreate = useCallback(async (payload) => {
    setError(null)
    
    try {
      // Call API
      const newUser = await createUser(payload)
      
      // Save to localStorage
      const createdUsers = getStorageData(STORAGE_KEYS.CREATED) || []
      const updatedCreatedUsers = [newUser, ...createdUsers]
      setStorageData(STORAGE_KEYS.CREATED, updatedCreatedUsers)
      
      // PREPEND to state (optimistic update)
      setUsers(prevUsers => [newUser, ...prevUsers])
      
      return { success: true, user: newUser }
    } catch (err) {
      setError(err.message || 'Failed to create user')
      return { success: false, error: err.message }
    }
  }, [])

  /**
   * Update user yang sudah ada
   */
  const handleUpdate = useCallback(async (id, payload) => {
    setError(null)
    
    try {
      // Call API
      const updatedUser = await updateUser(id, payload)
      
      // Save to localStorage
      const updatedUsersMap = getStorageData(STORAGE_KEYS.UPDATED) || {}
      updatedUsersMap[id] = { ...updatedUsersMap[id], ...payload }
      setStorageData(STORAGE_KEYS.UPDATED, updatedUsersMap)
      
      // UPDATE state (immutable)
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === id ? { ...user, ...updatedUser } : user
        )
      )
      
      return { success: true, user: updatedUser }
    } catch (err) {
      setError(err.message || 'Failed to update user')
      return { success: false, error: err.message }
    }
  }, [])

  /**
   * Delete user
   */
  const handleDelete = useCallback(async (id) => {
    setError(null)
    
    try {
      // Call API
      await deleteUser(id)
      
      // Save to localStorage
      const deletedIds = getStorageData(STORAGE_KEYS.DELETED) || []
      if (!deletedIds.includes(id)) {
        setStorageData(STORAGE_KEYS.DELETED, [...deletedIds, id])
      }
      
      // REMOVE from state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id))
      
      return { success: true }
    } catch (err) {
      setError(err.message || 'Failed to delete user')
      return { success: false, error: err.message }
    }
  }, [])

  /**
   * Clear localStorage (untuk reset)
   */
  const clearLocalStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.CREATED)
    localStorage.removeItem(STORAGE_KEYS.UPDATED)
    localStorage.removeItem(STORAGE_KEYS.DELETED)
  }, [])

  /**
   * Pagination helpers
   */
  const nextPage = useCallback(() => {
    const newSkip = skip + limit
    if (newSkip < total) {
      loadUsers(newSkip)
    }
  }, [skip, limit, total, loadUsers])

  const prevPage = useCallback(() => {
    const newSkip = Math.max(0, skip - limit)
    loadUsers(newSkip)
  }, [skip, limit, loadUsers])

  const goToPage = useCallback((pageNumber) => {
    const newSkip = pageNumber * limit
    if (newSkip >= 0 && newSkip < total) {
      loadUsers(newSkip)
    }
  }, [limit, total, loadUsers])

  // Load users on mount
  useEffect(() => {
    loadUsers(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on mount

  return {
    // State
    users,
    loading,
    error,
    total,
    skip,
    limit,
    
    // CRUD operations
    loadUsers,
    handleCreate,
    handleUpdate,
    handleDelete,
    
    // Pagination
    nextPage,
    prevPage,
    goToPage,
    currentPage: Math.floor(skip / limit),
    totalPages: Math.ceil(total / limit),
    hasNextPage: skip + limit < total,
    hasPrevPage: skip > 0,
    
    // Utilities
    clearLocalStorage,
  }
}
