import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || ''

function ManualEntryForm({ onCreated }) {
  const [form, setForm] = useState({ name: '', phone: '', area: '', job_category: '', description: '', assigned_sales_whatsapp: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API}/leads`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.ok) {
        onCreated(data.lead)
        setForm({ name: '', phone: '', area: '', job_category: '', description: '', assigned_sales_whatsapp: '' })
      } else {
        alert('Failed to create lead')
      }
    } catch (e) {
      console.error(e)
      alert('Error creating lead')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 bg-white/70 backdrop-blur p-4 rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="border rounded p-2" placeholder="Name" name="name" value={form.name} onChange={handleChange} required />
        <input className="border rounded p-2" placeholder="Phone" name="phone" value={form.phone} onChange={handleChange} required />
        <input className="border rounded p-2" placeholder="Area" name="area" value={form.area} onChange={handleChange} />
        <input className="border rounded p-2" placeholder="Job category" name="job_category" value={form.job_category} onChange={handleChange} />
        <input className="border rounded p-2 md:col-span-2" placeholder="Description" name="description" value={form.description} onChange={handleChange} />
        <input className="border rounded p-2 md:col-span-2" placeholder="Assigned sales WhatsApp (+60...)" name="assigned_sales_whatsapp" value={form.assigned_sales_whatsapp} onChange={handleChange} />
      </div>
      <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">{loading ? 'Saving...' : 'Add Lead'}</button>
    </form>
  )
}

function LeadList({ refresh }) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API}/leads`)
        const data = await res.json()
        setLeads(data.leads || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [refresh])

  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-2">Recent Leads</h2>
      {loading ? <div>Loading...</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Area</th>
                <th className="p-2 border">Job</th>
                <th className="p-2 border">Source</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Assigned</th>
                <th className="p-2 border">Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l._id}>
                  <td className="p-2 border">{l.name}</td>
                  <td className="p-2 border">{l.phone}</td>
                  <td className="p-2 border">{l.area || '-'}</td>
                  <td className="p-2 border">{l.job_category || '-'}</td>
                  <td className="p-2 border">{l.source}</td>
                  <td className="p-2 border">{l.status}</td>
                  <td className="p-2 border">{l.assigned_sales_whatsapp || '-'}</td>
                  <td className="p-2 border">{new Date(l.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [refresh, setRefresh] = useState(0)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">PK Lead Intake & Follow-up</h1>
        <ManualEntryForm onCreated={() => setRefresh(r => r + 1)} />
        <LeadList refresh={refresh} />
      </div>
    </div>
  )
}
