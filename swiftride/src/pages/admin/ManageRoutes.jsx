import { useState } from 'react'
import { popularRoutes, CITIES } from '../../data/buses'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { MdAdd, MdEdit, MdDelete, MdClose, MdRoute } from 'react-icons/md'

export default function ManageRoutes() {
  const [routes, setRoutes] = useState(popularRoutes)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingIdx, setEditingIdx] = useState(null)
  const [form, setForm] = useState({ from: '', to: '', price: '', duration: '' })

  const openAdd = () => {
    setForm({ from: '', to: '', price: '', duration: '' })
    setEditingIdx(null)
    setModalOpen(true)
  }

  const openEdit = (idx) => {
    setForm({ ...routes[idx] })
    setEditingIdx(idx)
    setModalOpen(true)
  }

  const handleDelete = (idx) => {
    setRoutes(prev => prev.filter((_, i) => i !== idx))
    toast.success('Route removed')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.from || !form.to || !form.price) {
      toast.error('Please fill required fields')
      return
    }

    if (editingIdx !== null) {
      setRoutes(prev => prev.map((r, i) => i === editingIdx ? { ...r, ...form, price: Number(form.price) } : r))
      toast.success('Route updated')
    } else {
      setRoutes(prev => [...prev, {
        ...form,
        price: Number(form.price),
        image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80'
      }])
      toast.success('Route added')
    }
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Routes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{routes.length} popular routes</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl">
          <MdAdd className="text-xl" /> Add Route
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-500 uppercase">
              <th className="text-left px-5 py-3">Route</th>
              <th className="text-left px-5 py-3">Duration</th>
              <th className="text-left px-5 py-3">Starting Price</th>
              <th className="text-left px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {routes.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                  {r.from} → {r.to}
                </td>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{r.duration}</td>
                <td className="px-5 py-3 font-semibold text-orange-500">{formatCurrency(r.price)}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(i)} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg">
                      <MdEdit />
                    </button>
                    <button onClick={() => handleDelete(i)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg">
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {routes.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <MdRoute className="text-4xl mx-auto mb-2" />
            <p>No routes yet</p>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 dark:text-white">{editingIdx !== null ? 'Edit Route' : 'Add Route'}</h3>
              <button onClick={() => setModalOpen(false)}><MdClose className="text-xl text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">From *</label>
                  <select value={form.from} onChange={e => setForm(p => ({ ...p, from: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none">
                    <option value="">Select city</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">To *</label>
                  <select value={form.to} onChange={e => setForm(p => ({ ...p, to: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none">
                    <option value="">Select city</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Duration</label>
                  <input value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                    placeholder="e.g. 8h 30min"
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Starting Price (₦) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                    placeholder="5000"
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
