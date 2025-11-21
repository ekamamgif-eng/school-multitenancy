import React, { useState } from 'react'
import { FileText, Download, Eye, Trash2, Upload, Search, Filter, FolderOpen } from 'lucide-react'

interface Document {
    id: string
    name: string
    type: string
    size: string
    uploadedBy: string
    uploadedAt: string
    category: 'report' | 'assignment' | 'certificate' | 'other'
}

const DocumentsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [documents] = useState<Document[]>([
        {
            id: '1',
            name: 'Student Progress Report Q1 2024.pdf',
            type: 'PDF',
            size: '2.4 MB',
            uploadedBy: 'Sarah Johnson',
            uploadedAt: '2024-01-15',
            category: 'report'
        },
        {
            id: '2',
            name: 'Mathematics Assignment Week 5.docx',
            type: 'DOCX',
            size: '856 KB',
            uploadedBy: 'Michael Chen',
            uploadedAt: '2024-01-18',
            category: 'assignment'
        },
        {
            id: '3',
            name: 'Attendance Certificate 2023.pdf',
            type: 'PDF',
            size: '1.2 MB',
            uploadedBy: 'Admin Staff',
            uploadedAt: '2024-01-10',
            category: 'certificate'
        },
        {
            id: '4',
            name: 'Science Lab Report - Chemistry.pdf',
            type: 'PDF',
            size: '3.1 MB',
            uploadedBy: 'Emma Wilson',
            uploadedAt: '2024-01-20',
            category: 'report'
        },
        {
            id: '5',
            name: 'English Essay - Shakespeare Analysis.docx',
            type: 'DOCX',
            size: '654 KB',
            uploadedBy: 'James Anderson',
            uploadedAt: '2024-01-22',
            category: 'assignment'
        }
    ])

    const categories = [
        { value: 'all', label: 'All Documents' },
        { value: 'report', label: 'Reports' },
        { value: 'assignment', label: 'Assignments' },
        { value: 'certificate', label: 'Certificates' },
        { value: 'other', label: 'Other' }
    ]

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const getCategoryColor = (category: string) => {
        const colors = {
            report: '#3b82f6',
            assignment: '#10b981',
            certificate: '#f59e0b',
            other: '#6b7280'
        }
        return colors[category as keyof typeof colors] || colors.other
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Documents</h1>
                    <p className="page-subtitle">Manage and access your school documents</p>
                </div>
                <button className="btn btn-primary">
                    <Upload size={20} />
                    Upload Document
                </button>
            </div>

            <div className="documents-toolbar">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <Filter size={20} />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="documents-stats">
                <div className="stat-item">
                    <FolderOpen size={24} />
                    <div>
                        <div className="stat-value">{documents.length}</div>
                        <div className="stat-label">Total Documents</div>
                    </div>
                </div>
                <div className="stat-item">
                    <FileText size={24} />
                    <div>
                        <div className="stat-value">{documents.filter(d => d.category === 'report').length}</div>
                        <div className="stat-label">Reports</div>
                    </div>
                </div>
                <div className="stat-item">
                    <FileText size={24} />
                    <div>
                        <div className="stat-value">{documents.filter(d => d.category === 'assignment').length}</div>
                        <div className="stat-label">Assignments</div>
                    </div>
                </div>
            </div>

            <div className="documents-grid">
                {filteredDocuments.map(doc => (
                    <div key={doc.id} className="document-card">
                        <div className="document-icon" style={{ background: `${getCategoryColor(doc.category)}15` }}>
                            <FileText size={32} style={{ color: getCategoryColor(doc.category) }} />
                        </div>

                        <div className="document-info">
                            <h3 className="document-name">{doc.name}</h3>
                            <div className="document-meta">
                                <span className="document-type">{doc.type}</span>
                                <span className="document-size">{doc.size}</span>
                            </div>
                            <div className="document-details">
                                <span>By {doc.uploadedBy}</span>
                                <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="document-actions">
                            <button className="action-btn" title="View">
                                <Eye size={18} />
                            </button>
                            <button className="action-btn" title="Download">
                                <Download size={18} />
                            </button>
                            <button className="action-btn action-btn--danger" title="Delete">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredDocuments.length === 0 && (
                <div className="empty-state">
                    <FileText size={64} />
                    <h3>No documents found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            )}
        </div>
    )
}

export default DocumentsPage
