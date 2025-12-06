import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Calendar, User } from 'lucide-react'
import { getStudentById, deleteStudent } from '../../../services/studentService'
import { Student } from '../../../types'
import '../../../styles/students.scss'

const StudentDetail: React.FC = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    const [student, setStudent] = useState<Student | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (id) {
            loadStudent(id)
        }
    }, [id])

    const loadStudent = async (studentId: string) => {
        try {
            const data = await getStudentById(studentId)
            setStudent(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!student || !window.confirm(`Are you sure you want to delete ${student.full_name}?`)) {
            return
        }

        try {
            await deleteStudent(student.id)
            navigate('/admin/students')
        } catch (err: any) {
            alert(err.message)
        }
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return <div className="student-detail-page"><div className="loading-state">Loading...</div></div>
    }

    if (error || !student) {
        return (
            <div className="student-detail-page">
                <div className="error-message">{error || 'Student not found'}</div>
                <button className="btn btn-secondary" onClick={() => navigate('/admin/students')}>
                    Back to Students
                </button>
            </div>
        )
    }

    return (
        <div className="student-detail-page">
            {/* Header */}
            <div className="page-header">
                <button className="btn-back" onClick={() => navigate('/admin/students')}>
                    <ArrowLeft size={20} />
                    Back to Students
                </button>
                <div className="header-actions">
                    <button className="btn btn-secondary" onClick={() => navigate(`/admin/students/${id}/edit`)}>
                        <Edit size={18} />
                        Edit
                    </button>
                    <button className="btn btn-danger" onClick={handleDelete}>
                        <Trash2 size={18} />
                        Delete
                    </button>
                </div>
            </div>

            {/* Profile Card */}
            <div className="profile-card">
                <div className="profile-header">
                    {student.photo_url ? (
                        <img src={student.photo_url} alt={student.full_name} className="profile-photo" />
                    ) : (
                        <div className="profile-photo-placeholder">
                            <User size={48} />
                        </div>
                    )}
                    <div className="profile-info">
                        <h1>{student.full_name}</h1>
                        {student.nickname && <p className="nickname">"{student.nickname}"</p>}
                        <div className="profile-badges">
                            <span className={`status-badge status-${student.status}`}>{student.status}</span>
                            <span className="badge">{student.class || 'No Class'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Sections */}
            <div className="details-grid">
                {/* Personal Information */}
                <div className="detail-section">
                    <h2>Personal Information</h2>
                    <div className="detail-items">
                        <div className="detail-item">
                            <label>NIS</label>
                            <span>{student.nis}</span>
                        </div>
                        <div className="detail-item">
                            <label>NISN</label>
                            <span>{student.nisn || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Gender</label>
                            <span>{student.gender === 'male' ? 'Male' : student.gender === 'female' ? 'Female' : '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Birth Place</label>
                            <span>{student.birth_place || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Birth Date</label>
                            <span>{formatDate(student.birth_date)}</span>
                        </div>
                        <div className="detail-item">
                            <label>Religion</label>
                            <span>{student.religion || '-'}</span>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="detail-section">
                    <h2>Contact Information</h2>
                    <div className="detail-items">
                        <div className="detail-item">
                            <label><Phone size={16} /> Phone</label>
                            <span>{student.phone || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label><Mail size={16} /> Email</label>
                            <span>{student.email || '-'}</span>
                        </div>
                        <div className="detail-item full-width">
                            <label><MapPin size={16} /> Address</label>
                            <span>{student.address || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label>City</label>
                            <span>{student.city || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Province</label>
                            <span>{student.province || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Postal Code</label>
                            <span>{student.postal_code || '-'}</span>
                        </div>
                    </div>
                </div>

                {/* Academic Information */}
                <div className="detail-section">
                    <h2>Academic Information</h2>
                    <div className="detail-items">
                        <div className="detail-item">
                            <label>Class</label>
                            <span>{student.class || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Major</label>
                            <span>{student.major || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Academic Year</label>
                            <span>{student.academic_year || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label><Calendar size={16} /> Admission Date</label>
                            <span>{formatDate(student.admission_date)}</span>
                        </div>
                        {student.graduation_date && (
                            <div className="detail-item">
                                <label>Graduation Date</label>
                                <span>{formatDate(student.graduation_date)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Parent Information */}
                <div className="detail-section">
                    <h2>Parent/Guardian Information</h2>
                    <div className="detail-items">
                        <div className="detail-item">
                            <label>Father's Name</label>
                            <span>{student.father_name || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Father's Phone</label>
                            <span>{student.father_phone || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Father's Occupation</label>
                            <span>{student.father_occupation || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Mother's Name</label>
                            <span>{student.mother_name || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Mother's Phone</label>
                            <span>{student.mother_phone || '-'}</span>
                        </div>
                        <div className="detail-item">
                            <label>Mother's Occupation</label>
                            <span>{student.mother_occupation || '-'}</span>
                        </div>
                        {student.guardian_name && (
                            <>
                                <div className="detail-item">
                                    <label>Guardian's Name</label>
                                    <span>{student.guardian_name}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Guardian's Phone</label>
                                    <span>{student.guardian_phone || '-'}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Guardian's Relation</label>
                                    <span>{student.guardian_relation || '-'}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Additional Information */}
                {student.notes && (
                    <div className="detail-section full-width">
                        <h2>Additional Notes</h2>
                        <div className="notes-content">
                            {student.notes}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StudentDetail
