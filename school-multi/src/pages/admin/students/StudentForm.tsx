import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, X } from 'lucide-react'
import { useTenant } from '../../../contexts/TenantContext'
import { useAuth } from '../../../contexts/AuthContext'
import { createStudent, updateStudent, getStudentById } from '../../../services/studentService'
import { StudentFormData } from '../../../types'
import '../../../styles/students.scss'

const StudentForm: React.FC = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const { tenant } = useTenant()
    const { user } = useAuth()
    const isEditMode = Boolean(id)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState<StudentFormData>({
        nis: '',
        full_name: '',
        status: 'active'
    })

    useEffect(() => {
        if (isEditMode && id) {
            loadStudent(id)
        }
    }, [id])

    const loadStudent = async (studentId: string) => {
        try {
            const student = await getStudentById(studentId)
            if (student) {
                setFormData(student as StudentFormData)
            }
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!tenant) {
            setError('No tenant found')
            return
        }

        setLoading(true)
        setError(null)

        try {
            if (isEditMode && id) {
                await updateStudent(id, formData, user?.id)
            } else {
                await createStudent(tenant.id, formData, user?.id)
            }
            navigate('/admin/students')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="student-form-page">
            <div className="page-header">
                <button className="btn-back" onClick={() => navigate('/admin/students')}>
                    <ArrowLeft size={20} />
                    Back to Students
                </button>
                <h1>{isEditMode ? 'Edit Student' : 'Add New Student'}</h1>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="student-form">
                {/* Personal Information */}
                <div className="form-section">
                    <h2>Personal Information</h2>
                    <div className="form-grid">
                        <div className="form-group required">
                            <label>NIS *</label>
                            <input
                                type="text"
                                name="nis"
                                value={formData.nis}
                                onChange={handleChange}
                                required
                                maxLength={50}
                            />
                        </div>

                        <div className="form-group">
                            <label>NISN</label>
                            <input
                                type="text"
                                name="nisn"
                                value={formData.nisn || ''}
                                onChange={handleChange}
                                maxLength={50}
                            />
                        </div>

                        <div className="form-group required">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                required
                                maxLength={255}
                            />
                        </div>

                        <div className="form-group">
                            <label>Nickname</label>
                            <input
                                type="text"
                                name="nickname"
                                value={formData.nickname || ''}
                                onChange={handleChange}
                                maxLength={100}
                            />
                        </div>

                        <div className="form-group">
                            <label>Gender</label>
                            <select name="gender" value={formData.gender || ''} onChange={handleChange}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Birth Place</label>
                            <input
                                type="text"
                                name="birth_place"
                                value={formData.birth_place || ''}
                                onChange={handleChange}
                                maxLength={100}
                            />
                        </div>

                        <div className="form-group">
                            <label>Birth Date</label>
                            <input
                                type="date"
                                name="birth_date"
                                value={formData.birth_date || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Religion</label>
                            <select name="religion" value={formData.religion || ''} onChange={handleChange}>
                                <option value="">Select Religion</option>
                                <option value="Islam">Islam</option>
                                <option value="Kristen">Kristen</option>
                                <option value="Katolik">Katolik</option>
                                <option value="Hindu">Hindu</option>
                                <option value="Buddha">Buddha</option>
                                <option value="Konghucu">Konghucu</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="form-section">
                    <h2>Contact Information</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                maxLength={50}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                maxLength={255}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Address</label>
                            <textarea
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                                rows={3}
                            />
                        </div>

                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city || ''}
                                onChange={handleChange}
                                maxLength={100}
                            />
                        </div>

                        <div className="form-group">
                            <label>Province</label>
                            <input
                                type="text"
                                name="province"
                                value={formData.province || ''}
                                onChange={handleChange}
                                maxLength={100}
                            />
                        </div>

                        <div className="form-group">
                            <label>Postal Code</label>
                            <input
                                type="text"
                                name="postal_code"
                                value={formData.postal_code || ''}
                                onChange={handleChange}
                                maxLength={20}
                            />
                        </div>
                    </div>
                </div>

                {/* Academic Information */}
                <div className="form-section">
                    <h2>Academic Information</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Class</label>
                            <input
                                type="text"
                                name="class"
                                value={formData.class || ''}
                                onChange={handleChange}
                                placeholder="e.g., 10 IPA 1"
                                maxLength={50}
                            />
                        </div>

                        <div className="form-group">
                            <label>Major</label>
                            <input
                                type="text"
                                name="major"
                                value={formData.major || ''}
                                onChange={handleChange}
                                placeholder="e.g., IPA, IPS"
                                maxLength={100}
                            />
                        </div>

                        <div className="form-group">
                            <label>Academic Year</label>
                            <input
                                type="text"
                                name="academic_year"
                                value={formData.academic_year || ''}
                                onChange={handleChange}
                                placeholder="e.g., 2024/2025"
                                maxLength={20}
                            />
                        </div>

                        <div className="form-group">
                            <label>Admission Date</label>
                            <input
                                type="date"
                                name="admission_date"
                                value={formData.admission_date || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group required">
                            <label>Status *</label>
                            <select name="status" value={formData.status} onChange={handleChange} required>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="graduated">Graduated</option>
                                <option value="transferred">Transferred</option>
                                <option value="dropped">Dropped</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Parent Information */}
                <div className="form-section">
                    <h2>Parent/Guardian Information</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Father's Name</label>
                            <input
                                type="text"
                                name="father_name"
                                value={formData.father_name || ''}
                                onChange={handleChange}
                                maxLength={255}
                            />
                        </div>

                        <div className="form-group">
                            <label>Father's Phone</label>
                            <input
                                type="tel"
                                name="father_phone"
                                value={formData.father_phone || ''}
                                onChange={handleChange}
                                maxLength={50}
                            />
                        </div>

                        <div className="form-group">
                            <label>Father's Occupation</label>
                            <input
                                type="text"
                                name="father_occupation"
                                value={formData.father_occupation || ''}
                                onChange={handleChange}
                                maxLength={100}
                            />
                        </div>

                        <div className="form-group">
                            <label>Mother's Name</label>
                            <input
                                type="text"
                                name="mother_name"
                                value={formData.mother_name || ''}
                                onChange={handleChange}
                                maxLength={255}
                            />
                        </div>

                        <div className="form-group">
                            <label>Mother's Phone</label>
                            <input
                                type="tel"
                                name="mother_phone"
                                value={formData.mother_phone || ''}
                                onChange={handleChange}
                                maxLength={50}
                            />
                        </div>

                        <div className="form-group">
                            <label>Mother's Occupation</label>
                            <input
                                type="text"
                                name="mother_occupation"
                                value={formData.mother_occupation || ''}
                                onChange={handleChange}
                                maxLength={100}
                            />
                        </div>

                        <div className="form-group">
                            <label>Guardian's Name</label>
                            <input
                                type="text"
                                name="guardian_name"
                                value={formData.guardian_name || ''}
                                onChange={handleChange}
                                maxLength={255}
                            />
                        </div>

                        <div className="form-group">
                            <label>Guardian's Phone</label>
                            <input
                                type="tel"
                                name="guardian_phone"
                                value={formData.guardian_phone || ''}
                                onChange={handleChange}
                                maxLength={50}
                            />
                        </div>

                        <div className="form-group">
                            <label>Guardian's Relation</label>
                            <input
                                type="text"
                                name="guardian_relation"
                                value={formData.guardian_relation || ''}
                                onChange={handleChange}
                                placeholder="e.g., Uncle, Aunt"
                                maxLength={50}
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="form-section">
                    <h2>Additional Information</h2>
                    <div className="form-group full-width">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes || ''}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Any additional notes about the student..."
                        />
                    </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/students')}>
                        <X size={20} />
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <Save size={20} />
                        {loading ? 'Saving...' : isEditMode ? 'Update Student' : 'Create Student'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default StudentForm
