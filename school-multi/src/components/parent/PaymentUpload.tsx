import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTenant } from '../../contexts/TenantContext'
import { uploadToCloudinary, validateFile } from '../../services/cloudinary'
import { processPaymentWithAI } from '../../services/ai'
import { supabase, tables } from '../../services/supabase'
import LoadingSpinner from '../common/LoadingSpinner'
import { PaymentSubmission, AIExtractedData } from '../../types'

interface PaymentFormData {
  studentId: string
  paymentType: 'spp' | 'uang_gedung' | 'uang_kegiatan' | 'lainnya'
  amount: string
  paymentDate: string
  description: string
}

const PaymentUpload: React.FC = () => {
  const { user } = useAuth()
  const { tenant } = useTenant()
  const [uploading, setUploading] = useState<boolean>(false)
  const [aiProcessing, setAiProcessing] = useState<boolean>(false)
  const [aiResults, setAiResults] = useState<AIExtractedData | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [formData, setFormData] = useState<PaymentFormData>({
    studentId: '',
    paymentType: 'spp',
    amount: '',
    paymentDate: '',
    description: ''
  })

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Validate file
      validateFile(file)
      
      // Create preview
      setPreview(URL.createObjectURL(file))
      
      // Start upload and AI processing
      setUploading(true)
      setAiProcessing(true)

      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(file)
      console.log('Upload success:', uploadResult)

      // Process with AI
      const aiData = await processPaymentWithAI(uploadResult.secure_url)
      setAiResults(aiData)

      // Auto-fill form with AI data
      setFormData(prev => ({
        ...prev,
        amount: aiData.amount?.value?.toString() || '',
        paymentDate: aiData.transfer_date?.value || ''
      }))

    } catch (error) {
      console.error('Upload failed:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
      setAiProcessing(false)
    }
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    
    if (!user) {
      alert('Please login first')
      return
    }

    if (!tenant) {
      alert('Tenant not detected')
      return
    }

    try {
      const submissionData: Omit<PaymentSubmission, 'id'> = {
        tenant_id: tenant.id,
        parent_id: user.id,
        student_id: formData.studentId,
        payment_type: formData.paymentType,
        amount: parseFloat(formData.amount),
        payment_date: formData.paymentDate,
        description: formData.description,
        proof_image_url: preview,
        ai_extracted_data: aiResults || undefined,
        status: 'pending',
        created_at: new Date().toISOString()
      }

      // Save to database
      const { error } = await supabase
        .from(tables.payment_submissions)
        .insert([submissionData])

      if (error) throw error

      alert('Payment submitted successfully! Waiting for verification.')
      
      // Reset form
      setFormData({
        studentId: '',
        paymentType: 'spp',
        amount: '',
        paymentDate: '',
        description: ''
      })
      setPreview('')
      setAiResults(null)

    } catch (error) {
      console.error('Submission failed:', error)
      alert('Submission failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  return (
    <div className="payment-upload-container">
      <h2>Upload Bukti Transfer</h2>
      <p>Unggah bukti transfer dan AI akan membantu membaca data secara otomatis</p>

      <form onSubmit={handleSubmit} className="payment-form">
        {/* File Upload Section */}
        <div className="upload-section">
          <label>Bukti Transfer:</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          {preview && (
            <div className="preview-container">
              <img src={preview} alt="Preview" className="preview-image" />
            </div>
          )}
        </div>

        {/* AI Processing Indicator */}
        {aiProcessing && (
          <div className="ai-processing">
            <LoadingSpinner />
            <p>AI sedang memproses bukti transfer...</p>
          </div>
        )}

        {/* AI Results */}
        {aiResults && (
          <div className="ai-results">
            <h4>📊 Data yang Terbaca AI:</h4>
            <div className="ai-data-grid">
              <div className="data-item">
                <span>Jumlah:</span>
                <strong>Rp {aiResults.amount.value.toLocaleString()}</strong>
                <span className="confidence-badge">
                  {Math.round(aiResults.amount.confidence * 100)}%
                </span>
              </div>
              <div className="data-item">
                <span>Tanggal:</span>
                <strong>{aiResults.transfer_date.value}</strong>
                <span className="confidence-badge">
                  {Math.round(aiResults.transfer_date.confidence * 100)}%
                </span>
              </div>
              <div className="data-item">
                <span>Akun Tujuan:</span>
                <strong>{aiResults.destination_account.value}</strong>
                <span className="confidence-badge">
                  {Math.round(aiResults.destination_account.confidence * 100)}%
                </span>
              </div>
            </div>
            <div className="overall-confidence">
              Tingkat Kepercayaan Overall: <strong>{Math.round(aiResults.overall_confidence * 100)}%</strong>
            </div>
          </div>
        )}

        {/* Manual Form Fields */}
        <div className="form-fields">
          <div className="form-group">
            <label>Jenis Pembayaran:</label>
            <select 
              name="paymentType"
              value={formData.paymentType}
              onChange={handleInputChange}
            >
              <option value="spp">SPP Bulanan</option>
              <option value="uang_gedung">Uang Gedung</option>
              <option value="uang_kegiatan">Uang Kegiatan</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <div className="form-group">
            <label>Jumlah:</label>
            <input
              type="number"
              name="amount"
              placeholder="Jumlah pembayaran"
              value={formData.amount}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Tanggal Transfer:</label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Keterangan:</label>
            <textarea
              name="description"
              placeholder="Keterangan tambahan..."
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={uploading || aiProcessing || !preview}
          className="submit-button"
        >
          {uploading ? 'Mengupload...' : 'Submit Pembayaran'}
        </button>
      </form>
    </div>
  )
}

export default PaymentUpload