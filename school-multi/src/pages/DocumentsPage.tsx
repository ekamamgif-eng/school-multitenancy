import React, { useState, useRef } from 'react'
import axios, { AxiosProgressEvent } from 'axios'
import { FileText, Download, Eye, Trash2, Upload, Search, Filter, FolderOpen, X, CheckCircle, AlertCircle } from 'lucide-react'
import '../styles/upload-modal.scss'

interface Document {
    id: string
    name: string
    type: string
    size: string
    uploadedBy: string
    uploadedAt: string
    category: 'report' | 'assignment' | 'certificate' | 'other'
    url?: string
}

interface UploadFile {
    file: File
    preview?: string
    category: 'report' | 'assignment' | 'certificate' | 'other'
    status: 'pending' | 'uploading' | 'success' | 'error'
    progress: number
    error?: string
}

const DocumentsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [showDownloadModal, setShowDownloadModal] = useState(false)
    const [viewingDocument, setViewingDocument] = useState<Document | null>(null)
    const [downloadingDocument, setDownloadingDocument] = useState<Document | null>(null)
    const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    // Initialize documents from localStorage or default data
    const [documents, setDocuments] = useState<Document[]>(() => {
        const savedDocs = localStorage.getItem('school_documents')
        if (savedDocs) {
            return JSON.parse(savedDocs)
        }
        return [
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
        ]
    })

    // Save to localStorage whenever documents change
    React.useEffect(() => {
        localStorage.setItem('school_documents', JSON.stringify(documents))
    }, [documents])

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

    // View document
    const handleViewDocument = (doc: Document) => {
        console.log('Viewing document:', doc.name)
        setViewingDocument(doc)
        setShowViewModal(true)
    }

    // Download document
    const handleDownloadDocument = (doc: Document) => {
        console.log('Downloading document:', doc.name)

        if (doc.url) {
            // If we have a direct URL (e.g. from Cloudinary), try to download it
            const link = document.createElement('a')
            link.href = doc.url
            link.target = '_blank'
            link.download = doc.name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            return
        }

        // Show download modal for demo version
        setDownloadingDocument(doc)
        setShowDownloadModal(true)
    }

    // Delete document
    const handleDeleteDocument = (doc: Document) => {
        // Show confirmation dialog
        const confirmed = window.confirm(
            `Are you sure you want to delete this document?\n\n` +
            `Name: ${doc.name}\n` +
            `Type: ${doc.type}\n` +
            `Size: ${doc.size}\n\n` +
            `This action cannot be undone.`
        )

        if (confirmed) {
            console.log('Deleting document:', doc.name)

            // Remove from documents list
            setDocuments(prev => prev.filter(d => d.id !== doc.id))

            // Show success message
            alert(`Document "${doc.name}" has been deleted successfully.`)
        }
    }

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    // Handle file selection
    const handleFileSelect = (files: FileList | null) => {
        if (!files) return

        const newFiles: UploadFile[] = Array.from(files).map(file => ({
            file,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
            category: 'other',
            status: 'pending',
            progress: 0
        }))

        setUploadFiles(prev => [...prev, ...newFiles])
    }

    // Drag and drop handlers
    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        handleFileSelect(e.dataTransfer.files)
    }

    // Update file category
    const updateFileCategory = (index: number, category: 'report' | 'assignment' | 'certificate' | 'other') => {
        setUploadFiles(prev => {
            const newFiles = [...prev]
            newFiles[index] = { ...newFiles[index], category }
            return newFiles
        })
    }

    // Remove file
    const removeFile = (index: number) => {
        setUploadFiles(prev => {
            const newFiles = [...prev]
            if (newFiles[index].preview) {
                URL.revokeObjectURL(newFiles[index].preview!)
            }
            newFiles.splice(index, 1)
            return newFiles
        })
    }

    // Handle upload
    const handleUpload = async () => {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

        if (!cloudName || !uploadPreset) {
            alert('Cloudinary configuration is missing. Please check your .env file for VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.')
            return
        }

        setIsUploading(true)
        let successCount = 0

        try {
            for (let i = 0; i < uploadFiles.length; i++) {
                const uploadFile = uploadFiles[i]

                // Skip if already uploaded
                if (uploadFile.status === 'success') {
                    successCount++
                    continue
                }

                // Update status to uploading
                setUploadFiles(prev => {
                    const newFiles = [...prev]
                    newFiles[i] = { ...newFiles[i], status: 'uploading', progress: 0 }
                    return newFiles
                })

                const formData = new FormData()
                formData.append('file', uploadFile.file)
                formData.append('upload_preset', uploadPreset)
                formData.append('folder', 'school-documents')
                formData.append('access_mode', 'public') // Force public access

                try {
                    const response = await axios.post(
                        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                        formData,
                        {
                            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                                const progress = progressEvent.total
                                    ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                                    : 0

                                setUploadFiles(prev => {
                                    const newFiles = [...prev]
                                    newFiles[i] = { ...newFiles[i], progress }
                                    return newFiles
                                })
                            }
                        }
                    )

                    // Update status to success
                    setUploadFiles(prev => {
                        const newFiles = [...prev]
                        newFiles[i] = { ...newFiles[i], status: 'success', progress: 100 }
                        return newFiles
                    })

                    // Add to documents list with real URL
                    const newDoc: Document = {
                        id: Date.now().toString(),
                        name: uploadFile.file.name,
                        type: uploadFile.file.name.split('.').pop()?.toUpperCase() || 'FILE',
                        size: formatFileSize(uploadFile.file.size),
                        uploadedBy: 'Current User',
                        uploadedAt: new Date().toISOString().split('T')[0],
                        category: uploadFile.category,
                        url: response.data.secure_url
                    }

                    console.log('Uploaded to:', response.data.secure_url)

                    setDocuments(prev => [newDoc, ...prev])
                    successCount++

                } catch (error) {
                    console.error('Upload failed:', error)
                    setUploadFiles(prev => {
                        const newFiles = [...prev]
                        newFiles[i] = { ...newFiles[i], status: 'error', error: 'Upload failed' }
                        return newFiles
                    })
                }
            }

            // Close modal if all successful
            if (successCount === uploadFiles.length) {
                setTimeout(() => {
                    setShowUploadModal(false)
                    setUploadFiles([])
                }, 1000)
            }
        } catch (error) {
            console.error('Upload process error:', error)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Documents</h1>
                    <p className="page-subtitle">Manage and access your school documents</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
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
                            <button
                                className="action-btn"
                                title="View"
                                onClick={() => handleViewDocument(doc)}
                            >
                                <Eye size={18} />
                            </button>
                            <button
                                className="action-btn"
                                title="Download"
                                onClick={() => handleDownloadDocument(doc)}
                            >
                                <Download size={18} />
                            </button>
                            <button
                                className="action-btn action-btn--danger"
                                title="Delete"
                                onClick={() => handleDeleteDocument(doc)}
                            >
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

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="modal-overlay" onClick={() => !isUploading && setShowUploadModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Upload Documents</h2>
                            <button
                                className="modal-close"
                                onClick={() => !isUploading && setShowUploadModal(false)}
                                disabled={isUploading}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {/* Drop Zone */}
                            <div
                                className={`upload-dropzone ${isDragging ? 'upload-dropzone--dragging' : ''}`}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload size={48} />
                                <h3>Drag & drop files here</h3>
                                <p>or click to browse</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    onChange={(e) => handleFileSelect(e.target.files)}
                                    style={{ display: 'none' }}
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                                />
                            </div>

                            {/* File List */}
                            {uploadFiles.length > 0 && (
                                <div className="upload-files-list">
                                    {uploadFiles.map((uploadFile, index) => (
                                        <div key={index} className="upload-file-item">
                                            <div className="upload-file-icon">
                                                {uploadFile.preview ? (
                                                    <img src={uploadFile.preview} alt={uploadFile.file.name} />
                                                ) : (
                                                    <FileText size={24} />
                                                )}
                                            </div>

                                            <div className="upload-file-info">
                                                <div className="upload-file-name">{uploadFile.file.name}</div>
                                                <div className="upload-file-size">{formatFileSize(uploadFile.file.size)}</div>

                                                {/* Category Selector */}
                                                {uploadFile.status === 'pending' && (
                                                    <select
                                                        value={uploadFile.category}
                                                        onChange={(e) => updateFileCategory(index, e.target.value as any)}
                                                        className="upload-file-category"
                                                    >
                                                        <option value="report">Report</option>
                                                        <option value="assignment">Assignment</option>
                                                        <option value="certificate">Certificate</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                )}

                                                {/* Progress Bar */}
                                                {uploadFile.status === 'uploading' && (
                                                    <div className="upload-progress">
                                                        <div
                                                            className="upload-progress-bar"
                                                            style={{ width: `${uploadFile.progress}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Status/Actions */}
                                            <div className="upload-file-status">
                                                {uploadFile.status === 'pending' && (
                                                    <button
                                                        onClick={() => removeFile(index)}
                                                        className="upload-file-remove"
                                                        disabled={isUploading}
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                )}
                                                {uploadFile.status === 'uploading' && (
                                                    <div className="upload-spinner" />
                                                )}
                                                {uploadFile.status === 'success' && (
                                                    <CheckCircle size={20} style={{ color: '#10b981' }} />
                                                )}
                                                {uploadFile.status === 'error' && (
                                                    <AlertCircle size={20} style={{ color: '#ef4444' }} />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowUploadModal(false)}
                                disabled={isUploading}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleUpload}
                                disabled={uploadFiles.length === 0 || isUploading || uploadFiles.every(f => f.status !== 'pending')}
                            >
                                {isUploading ? 'Uploading...' : `Upload ${uploadFiles.filter(f => f.status === 'pending').length} File(s)`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Document Modal */}
            {showViewModal && viewingDocument && (
                <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Document Details</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowViewModal(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="document-view">
                                {/* Document Icon or Preview */}
                                <div
                                    className="document-view__icon"
                                    style={{
                                        background: viewingDocument.url && ['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP'].includes(viewingDocument.type)
                                            ? 'transparent'
                                            : `${getCategoryColor(viewingDocument.category)}15`,
                                        overflow: 'hidden'
                                    }}
                                >
                                    {viewingDocument.url && ['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP'].includes(viewingDocument.type) ? (
                                        <img
                                            src={viewingDocument.url}
                                            alt={viewingDocument.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        />
                                    ) : (
                                        <FileText size={64} style={{ color: getCategoryColor(viewingDocument.category) }} />
                                    )}
                                </div>

                                {/* Document Info */}
                                <div className="document-view__info">
                                    <div className="info-row">
                                        <span className="info-label">Name:</span>
                                        <span className="info-value">{viewingDocument.name}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Type:</span>
                                        <span className="info-value">{viewingDocument.type}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Size:</span>
                                        <span className="info-value">{viewingDocument.size}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Category:</span>
                                        <span
                                            className="info-value info-value--badge"
                                            style={{
                                                background: `${getCategoryColor(viewingDocument.category)}15`,
                                                color: getCategoryColor(viewingDocument.category)
                                            }}
                                        >
                                            {viewingDocument.category.charAt(0).toUpperCase() + viewingDocument.category.slice(1)}
                                        </span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Uploaded by:</span>
                                        <span className="info-value">{viewingDocument.uploadedBy}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Upload Date:</span>
                                        <span className="info-value">
                                            {new Date(viewingDocument.uploadedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleDownloadDocument(viewingDocument)}
                            >
                                <Download size={20} />
                                Download
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowViewModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Download Document Modal */}
            {showDownloadModal && downloadingDocument && (
                <div className="modal-overlay" onClick={() => setShowDownloadModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Download Document</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowDownloadModal(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="document-view">
                                <div
                                    className="document-view__icon"
                                    style={{
                                        background: `${getCategoryColor(downloadingDocument.category)}15`,
                                        marginBottom: '1rem'
                                    }}
                                >
                                    <Download size={48} style={{ color: getCategoryColor(downloadingDocument.category) }} />
                                </div>

                                <div className="text-center" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                        {downloadingDocument.name}
                                    </h3>
                                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                        {downloadingDocument.size} • {downloadingDocument.type}
                                    </p>
                                </div>

                                <div className="info-row" style={{ background: '#eff6ff', border: '1px solid #bfdbfe', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e40af', fontWeight: 600 }}>
                                        <AlertCircle size={18} />
                                        <span>Demo Version</span>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: '#1e3a8a', lineHeight: '1.5' }}>
                                        In a production environment, this action would download the actual file from your cloud storage (Cloudinary/Supabase) or server.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowDownloadModal(false)}
                                style={{ width: '100%' }}
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DocumentsPage
