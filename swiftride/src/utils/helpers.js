export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const formatShortDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const generateSeatNumbers = (total) => {
  return Array.from({ length: total }, (_, i) => i + 1)
}

export const getInitials = (name) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const validatePhone = (phone) => {
  return /^(\+234|0)[789][01]\d{8}$/.test(phone.replace(/\s/g, ''))
}

export const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed': return 'text-green-600 bg-green-50'
    case 'cancelled': return 'text-red-600 bg-red-50'
    case 'completed': return 'text-blue-600 bg-blue-50'
    case 'pending': return 'text-yellow-600 bg-yellow-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

export const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
