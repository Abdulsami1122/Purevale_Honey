import React, { useEffect, useState } from 'react'
import { Mail, RefreshCw } from 'lucide-react'
import api from '../../lib/api'
import './admin.css'

const formatDate = (value) => new Date(value).toLocaleString(undefined, {
  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
})

const AdminSubmissions = () => {
  const [tab, setTab] = useState('export')
  const [exportRows, setExportRows] = useState([])
  const [contactRows, setContactRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [exports, contacts] = await Promise.all([
        api.listExportInquiries(),
        api.listContactSubmissions(),
      ])
      setExportRows(exports)
      setContactRows(contacts)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const rows = tab === 'export' ? exportRows : contactRows

  return (
    <div className="admin-page-inner">
      <div className="admin-page-head">
        <h1 className="admin-h1">Submissions</h1>
        <button type="button" className="admin-btn" onClick={load} disabled={loading}>
          <RefreshCw size={15} className={loading ? 'admin-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="admin-tabs">
        <button type="button" className={tab === 'export' ? 'is-active' : ''} onClick={() => setTab('export')}>
          Export inquiries ({exportRows.length})
        </button>
        <button type="button" className={tab === 'contact' ? 'is-active' : ''} onClick={() => setTab('contact')}>
          Contact messages ({contactRows.length})
        </button>
      </div>

      {error && <div className="admin-alert">{error}</div>}
      <div className="admin-panel">
        {loading ? <p className="admin-empty">Loading submissions…</p> : rows.length === 0 ? (
          <p className="admin-empty">No submissions yet.</p>
        ) : tab === 'export' ? (
          <table className="admin-table">
            <thead><tr><th>Date</th><th>Company</th><th>Email</th><th>Destination</th><th>Product</th><th>Message</th></tr></thead>
            <tbody>{rows.map((row) => (
              <tr key={row.id}>
                <td>{formatDate(row.createdAt)}</td>
                <td>{row.companyName}</td>
                <td><a href={`mailto:${row.email}`}>{row.email}</a></td>
                <td>{row.destination}</td>
                <td>{row.product}</td>
                <td className="admin-submission-message">{row.message || '—'}</td>
              </tr>
            ))}</tbody>
          </table>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Date</th><th>Name</th><th>Phone</th><th>Email</th><th>Message</th></tr></thead>
            <tbody>{rows.map((row) => (
              <tr key={row.id}>
                <td>{formatDate(row.createdAt)}</td>
                <td>{row.name}</td>
                <td>{row.phone}</td>
                <td><a href={`mailto:${row.email}`}><Mail size={14} /> {row.email}</a></td>
                <td className="admin-submission-message">{row.message}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default AdminSubmissions
