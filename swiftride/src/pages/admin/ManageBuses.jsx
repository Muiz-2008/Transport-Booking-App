import { useState } from 'react'
import { buses as initialBuses, CITIES } from '../../data/buses'
import { formatCurrency } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { MdAdd, MdEdit, MdDelete, MdClose, MdSearch, MdDirectionsBus } from 'react-icons/md'

const emptyBus = {
  company: '', type: 'Standard', from: '', to: '',
  departure: '', arrival: '', price: '', totalSeats: 40,
  amenities: [],
}

const busTypes = ['Standard', 'Executive', 'VIP', 'Premium']
const amenityOptions = ['AC', 'WiFi', 'USB Charging', 'Reclining Seats', 'Onboard Toilet', 'Blanket']

export default function ManageBuses() {
  const [busList, setBusList] = useState(initialBuses)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBus, setEditingBus] = useState(null)
  const [form, setForm] = useState(emptyBus)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = busList.filter(b =>
    b.company.toLowerCase().includes(search.toLowerCase()) ||
    b.from.toLowerCase().includes(search.toLowerCase()) ||
    b.to.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setForm(emptyBus)
    setEditingBus(null)
    setModalOpen(true)
  }

  const openEdit = (bus) => {
    setForm({ ...bus })
    setEditingBus(bus.id)
    setModalOpen(true)
  }

  const handleDelete = (id) => {
    setBusList(prev => prev.filter(b => b.id !== id))
    toast.success('Bus removed')
    setDeleteConfirm(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.company || !form.from || !form.to || !form.departure || !form.price) {
      toast.error('Please fill in all required fields')
      return
    }

    if (editingBus) {
      setBusList(prev => prev.map(b => b.id === editingBus ? { ...b, ...form, price: Number(form.price) } : b))
      toast.success('Bus updated')
    } else {
      const newBus = {
        ...form,
        id: Date.now().toString(),
        companyLogo: form.company.slice(0, 3).toUpperCase(),
        busNumber: `${form.company.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        price: Number(form.price),
        totalSeats: Number(form.totalSeats),
        bookedSeats: [],
        rating: 4.0,
        reviews: 0,
        popular: false,
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
      }
      setBusList(prev => [...prev, newBus])
      toast.success('Bus added successfully!')
    }
    setModalOpen(false)
  }

  const toggleAmenity = (a) => {
    setForm(p => ({
      ...p,
      amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a]
    }))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Buses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{busList.length} buses registered</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
        >
          <MdAdd className="text-xl" /> Add Bus
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search buses..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:border-orange-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Company</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Route</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Price</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Seats</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map(bus => (
                <tr key={bus.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-950/30 rounded-lg flex items-center justify-center text-xs font-bold text-orange-600">
                        {bus.companyLogo}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{bus.company}</p>
                        <p className="text-xs text-gray-400">{bus.busNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                    {bus.from} → {bus.to}
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                      {bus.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                    {formatCurrency(bus.price)}
                  </td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">
                    {bus.totalSeats - bus.bookedSeats.length}/{bus.totalSeats}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(bus)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(bus.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              <MdDirectionsBus className="text-4xl mx-auto mb-2" />
              <p>No buses found</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Delete Bus?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 dark:text-white">
                {editingBus ? 'Edit Bus' : 'Add New Bus'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                <MdClose className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Company Name *</label>
                  <input
                    value={form.company}
                    onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                    placeholder="e.g. GIG Mobility"
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:border-orange-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Bus Type</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none"
                  >
                    {busTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">From *</label>
                  <select
                    value={form.from}
                    onChange={e => setForm(p => ({ ...p, from: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none"
                  >
                    <option value="">Select city</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">To *</label>
                  <select
                    value={form.to}
                    onChange={e => setForm(p => ({ ...p, to: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none"
                  >
                    <option value="">Select city</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Departure Time *</label>
                  <input
                    type="time"
                    value={form.departure}
                    onChange={e => setForm(p => ({ ...p, departure: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Arrival Time</label>
                  <input
                    type="time"
                    value={form.arrival}
                    onChange={e => setForm(p => ({ ...p, arrival: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Price (₦) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                    placeholder="15000"
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Total Seats</label>
                  <input
                    type="number"
                    value={form.totalSeats}
                    onChange={e => setForm(p => ({ ...p, totalSeats: Number(e.target.value) }))}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {amenityOptions.map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAmenity(a)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        form.amenities?.includes(a)
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium">
                  {editingBus ? 'Save Changes' : 'Add Bus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
