import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, RefreshCw, FolderPlus } from 'lucide-react';

export default function UploadResumeModal({
  categories,
  onClose,
  onUploadSuccess,
  onTriggerDesktopSync
}) {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Full Stack Developer',
    email: '',
    phone: '',
    experience: 'Fresher (2024 Batch)',
    education: 'B.E / B.Tech Computer Science (2024)',
    passingYear: '2024',
    location: 'Bangalore',
    skills: 'React.js, Node.js, Express, MongoDB, REST APIs',
    availability: 'Immediate (0 - 15 Days)',
    bio: 'Certified developer trained in industry standard best practices, scalable coding, and full project lifecycle.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle file select
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-extract candidate name from filename
      let rawName = selectedFile.name.replace(/\.[^/.]+$/, '');
      rawName = rawName.replace(/_Resume.*$/i, '')
                       .replace(/Resume.*$/i, '')
                       .replace(/_CV.*$/i, '')
                       .replace(/[-_.]+/g, ' ')
                       .trim();
      if (rawName && !formData.name) {
        setFormData((prev) => ({
          ...prev,
          name: rawName.replace(/\b\w/g, l => l.toUpperCase()),
          email: `${rawName.toLowerCase().replace(/\s+/g, '.')}@candidate.org`
        }));
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError('Please provide candidate name.');
      return;
    }
    if (!file) {
      setError('Please attach a resume document (PDF or DOCX).');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const data = new FormData();
      data.append('resume', file);
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const res = await fetch('/api/candidates', {
        method: 'POST',
        body: data
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to upload candidate');

      setSuccessMsg(`Resume for "${formData.name}" uploaded successfully under "${formData.category}"!`);
      setTimeout(() => {
        if (onUploadSuccess) onUploadSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSyncDesktop = async () => {
    setIsSyncing(true);
    setError('');
    try {
      const res = await fetch('/api/sync-resumes', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');
      setSuccessMsg(`Success! Scanned and synced ${data.total} resumes directly from your Desktop folder.`);
      if (onTriggerDesktopSync) onTriggerDesktopSync();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #2563eb, #8b5cf6)',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              color: 'white'
            }}>
              <Upload size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Upload Student Resume</h3>
              <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                Add new student profiles to the hiring pool or auto-sync your Desktop folder
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Quick Auto-Sync Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div>
              <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FolderPlus size={18} color="#2563eb" />
                <span>Auto-Sync Desktop Resumes Folder</span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#475569' }}>
                Quickly re-scan your <strong>Desktop/Resumes</strong> folder to auto-index all student resumes.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleSyncDesktop}
              disabled={isSyncing}
              style={{ whiteSpace: 'nowrap' }}
            >
              <RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Desktop Resumes'}</span>
            </button>
          </div>

          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: '#f87171',
              fontSize: '0.88rem',
              marginBottom: '18px'
            }}>
              {error}
            </div>
          )}

          {successMsg && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: '#34d399',
              fontSize: '0.88rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* File Upload Dropzone */}
            <div className="form-group">
              <label className="form-label">Resume Document (PDF or Word DOCX) *</label>
              <div 
                className="file-dropzone"
                onClick={() => document.getElementById('resume-file-input').click()}
              >
                <input
                  id="resume-file-input"
                  type="file"
                  accept=".pdf,.docx,.doc"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <FileText size={38} color="#60a5fa" style={{ marginBottom: '10px' }} />
                {file ? (
                  <div>
                    <div style={{ fontWeight: 700, color: '#34d399', fontSize: '1rem' }}>
                      ✓ {file.name}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
                      Size: {(file.size / 1024).toFixed(1)} KB • Click to change file
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.95rem' }}>
                      Click to choose student resume or drag & drop here
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
                      Supports PDF, DOC, DOCX up to 15MB
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Candidate Details */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Candidate Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  required
                  placeholder="e.g. S. Stephen Neel Kamal"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category / Tech Domain *</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Java Developer">Java Developer</option>
                  <option value="Python Developer">Python Developer</option>
                  <option value="Devops">Devops</option>
                  <option value="React.js Developer">React.js Developer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Testing Role">Testing Role</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Node.js Developer">Node.js Developer</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="candidate@talenthub.org"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Experience</label>
                <div className="form-stepper-row">
                  <button
                    type="button"
                    className="form-step-btn"
                    onClick={() => {
                      const exps = ['Fresher (2024 Batch)', 'Fresher (2025 Batch)', '1 Year', '2 Years', '3 Years', '5+ Years'];
                      const idx = exps.indexOf(formData.experience);
                      if (idx > 0) setFormData({ ...formData, experience: exps[idx - 1] });
                    }}
                    disabled={formData.experience === 'Fresher (2024 Batch)'}
                    title="Decrease Experience (-)"
                    aria-label="Decrease Experience"
                  >
                    -
                  </button>
                  <select
                    name="experience"
                    className="form-select"
                    style={{ flex: 1 }}
                    value={formData.experience}
                    onChange={handleInputChange}
                  >
                    <option value="Fresher (2024 Batch)">Fresher (2024 Batch)</option>
                    <option value="Fresher (2025 Batch)">Fresher (2025 Batch)</option>
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="3 Years">3 Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                  <button
                    type="button"
                    className="form-step-btn"
                    onClick={() => {
                      const exps = ['Fresher (2024 Batch)', 'Fresher (2025 Batch)', '1 Year', '2 Years', '3 Years', '5+ Years'];
                      const idx = exps.indexOf(formData.experience);
                      if (idx < exps.length - 1 && idx >= 0) {
                        setFormData({ ...formData, experience: exps[idx + 1] });
                      }
                    }}
                    disabled={formData.experience === '5+ Years'}
                    title="Increase Experience (+)"
                    aria-label="Increase Experience"
                  >
                    +
                  </button>
                </div>

                <div className="form-pills-row">
                  {[
                    { label: 'Fresher', val: 'Fresher (2024 Batch)' },
                    { label: '1 Yr', val: '1 Year' },
                    { label: '2 Yrs', val: '2 Years' },
                    { label: '3 Yrs', val: '3 Years' },
                    { label: '5+ Yrs', val: '5+ Years' }
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      className={`form-pill-btn ${formData.experience === item.val ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, experience: item.val })}
                    >
                      {formData.experience === item.val ? `✓ ${item.label}` : item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Location</label>
                <select
                  name="location"
                  className="form-select"
                  value={formData.location}
                  onChange={handleInputChange}
                >
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Remote / Hybrid">Remote / Hybrid</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Degree / Education</label>
                <input
                  type="text"
                  name="education"
                  className="form-input"
                  placeholder="e.g. B.E / B.Tech Computer Science"
                  value={formData.education}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Availability / Notice Period</label>
                <input
                  type="text"
                  name="availability"
                  className="form-input"
                  placeholder="e.g. Immediate (0 - 15 Days)"
                  value={formData.availability || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Technical Skills (Comma-separated)</label>
              <input
                type="text"
                name="skills"
                className="form-input"
                placeholder="e.g. Core Java, Spring Boot, MySQL, REST APIs, Git"
                value={formData.skills}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Profile Highlights / Bio</label>
              <textarea
                name="bio"
                className="form-textarea"
                rows="2"
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                <Upload size={16} />
                <span>{isSubmitting ? 'Uploading Candidate...' : 'Save & Publish Candidate'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
