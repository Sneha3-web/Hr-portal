import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  MapPin, 
  Award, 
  Code, 
  Globe, 
  Sparkles,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

const DOMAIN_DEFAULT_SKILLS = {
  'Full Stack Developer': 'React.js, Node.js, Express, MongoDB, REST APIs, JavaScript',
  'Java Developer': 'Core Java, Spring Boot, Hibernate, MySQL, REST APIs, Microservices',
  'Python Developer': 'Python, Django, FastAPI, PostgreSQL, REST APIs, Pandas',
  'Devops': 'Docker, Kubernetes, AWS, CI/CD, Linux, Terraform, Jenkins',
  'React.js Developer': 'React.js, Redux, JavaScript (ES6+), HTML5, CSS3, Tailwind',
  'Data Analyst': 'Python, SQL, Power BI, Excel, Pandas, Data Visualization, Tableau',
  'Testing Role': 'Selenium, Manual Testing, JUnit, TestNG, API Testing, Postman',
  'Machine Learning': 'Python, TensorFlow, PyTorch, Scikit-learn, Data Modeling, NLP',
  'Frontend Developer': 'HTML5, CSS3, JavaScript, React.js, Responsive Design, Bootstrap',
  'Node.js Developer': 'Node.js, Express, MongoDB, REST APIs, TypeScript, Redis',
  'Others': 'Problem Solving, Analytical Skills, Software Engineering, Git'
};

export default function StudentUploadModal({
  categories = [],
  onClose,
  onUploadSuccess
}) {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    education: 'B.E / B.Tech Computer Science',
    passingYear: '2024',
    cgpa: '',
    category: 'Full Stack Developer',
    experience: 'Fresher (2024 Batch)',
    location: 'Bangalore',
    skills: DOMAIN_DEFAULT_SKILLS['Full Stack Developer'],
    linkedin: '',
    github: '',
    bio: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  // File selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
      if (!['.pdf', '.docx', '.doc'].includes(ext)) {
        setError('Please upload a PDF or Word document (.pdf, .docx, .doc).');
        return;
      }
      if (selectedFile.size > 15 * 1024 * 1024) {
        setError('Resume file size must be under 15MB.');
        return;
      }

      setFile(selectedFile);
      setError('');

      // Auto-extract candidate name from file name if blank
      let cleanName = selectedFile.name.replace(/\.[^/.]+$/, '');
      cleanName = cleanName.replace(/_Resume.*$/i, '')
                           .replace(/Resume.*$/i, '')
                           .replace(/_CV.*$/i, '')
                           .replace(/CV.*$/i, '')
                           .replace(/[-_.]+/g, ' ')
                           .trim();
      if (cleanName && !formData.name) {
        setFormData((prev) => ({
          ...prev,
          name: cleanName.replace(/\b\w/g, l => l.toUpperCase()),
          email: prev.email || `${cleanName.toLowerCase().replace(/\s+/g, '.')}@candidate.org`
        }));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      const suggestedSkills = DOMAIN_DEFAULT_SKILLS[value] || DOMAIN_DEFAULT_SKILLS['Others'];
      setFormData((prev) => ({
        ...prev,
        category: value,
        skills: prev.skills === DOMAIN_DEFAULT_SKILLS[prev.category] ? suggestedSkills : prev.skills
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your official email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your contact / WhatsApp number.');
      return;
    }
    if (!file) {
      setError('Please attach your resume file (PDF or DOCX).');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('resume', file);
      
      const payload = {
        ...formData,
        source: 'Student Portal Form',
        rating: '4.8',
        bio: formData.bio || `Trained in ${formData.category} at Global Minds Technologies. Ready for immediate joining with strong practical project background.`
      };

      Object.keys(payload).forEach((k) => {
        data.append(k, payload[k]);
      });

      const res = await fetch('/api/candidates', {
        method: 'POST',
        body: data
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to submit resume');

      // Trigger Confetti
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 }
      });

      const refId = 'GMT-STU-' + Math.floor(100000 + Math.random() * 900000);
      setSubmittedData({
        refId,
        name: formData.name,
        category: formData.category,
        email: formData.email,
        fileName: file.name
      });

      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.message || 'Something went wrong while uploading your resume.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div 
        className="modal-content modal-lg" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img 
              src="/logo.jpg" 
              alt="Global Minds Technologies" 
              style={{
                height: '42px',
                width: 'auto',
                borderRadius: '8px',
                background: '#ffffff',
                padding: '3px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.28rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  Student Resume Submission
                </h3>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  fontWeight: 700,
                  border: '1px solid #bfdbfe'
                }}>
                  Placement Cell
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                Global Minds Technologies — Submit your verified resume directly into our corporate hiring pool.
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} title="Close">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '24px', overflowY: 'auto' }}>
          {submittedData ? (
            /* Success State */
            <div style={{ textAlign: 'center', padding: '30px 16px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#ecfdf5',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
                Resume Submitted Successfully!
              </h3>
              <p style={{ color: '#475569', fontSize: '0.92rem', maxWidth: '480px', margin: '0 auto 20px', lineHeight: '1.5' }}>
                Congratulations <strong>{submittedData.name}</strong>! Your profile and resume (<em>{submittedData.fileName}</em>) have been added to the <strong>{submittedData.category}</strong> verified talent pool.
              </p>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px 20px',
                maxWidth: '460px',
                margin: '0 auto 24px',
                textAlign: 'left',
                fontSize: '0.86rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Reference ID:</span>
                  <strong style={{ color: '#2563eb' }}>{submittedData.refId}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Domain / Role:</span>
                  <strong style={{ color: '#0f172a' }}>{submittedData.category}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Email Address:</span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{submittedData.email}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onClose}
                  style={{ padding: '10px 28px', fontSize: '0.94rem' }}
                >
                  Done / View on Portal
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setSubmittedData(null);
                    setFile(null);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      college: '',
                      education: 'B.E / B.Tech Computer Science',
                      passingYear: '2024',
                      cgpa: '',
                      category: 'Full Stack Developer',
                      experience: 'Fresher (2024 Batch)',
                      location: 'Bangalore',
                      skills: DOMAIN_DEFAULT_SKILLS['Full Stack Developer'],
                      linkedin: '',
                      github: '',
                      bio: ''
                    });
                  }}
                  style={{ padding: '10px 20px', fontSize: '0.94rem' }}
                >
                  Submit Another Resume
                </button>
              </div>
            </div>
          ) : (
            /* Student Upload Form */
            <form onSubmit={handleSubmit}>
              {/* Form Guidance Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
                padding: '14px 18px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Sparkles size={22} color="#2563eb" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.84rem', color: '#1e3a8a', lineHeight: '1.45' }}>
                  <strong>Direct Placement Intake:</strong> Fill out your training & educational details below. Once uploaded, verified corporate recruiters will be able to preview and download your resume for technical interviews.
                </div>
              </div>

              {error && (
                <div style={{
                  padding: '12px 16px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  color: '#dc2626',
                  fontSize: '0.88rem',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600
                }}>
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* SECTION 1: Resume Document Upload */}
              <div style={{ marginBottom: '22px' }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '8px' }}>
                  Upload Resume File (PDF or Word DOCX) *
                </label>
                <div
                  className="file-dropzone"
                  onClick={() => document.getElementById('student-resume-file-input').click()}
                  style={{
                    border: file ? '2px solid #22c55e' : '2px dashed #93c5fd',
                    background: file ? '#f0fdf4' : '#f8fafc',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    padding: '24px 20px',
                    textAlign: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    id="student-resume-file-input"
                    type="file"
                    accept=".pdf,.docx,.doc"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  {file ? (
                    <div>
                      <FileCheck size={38} color="#16a34a" style={{ margin: '0 auto 8px' }} />
                      <div style={{ fontWeight: 700, color: '#15803d', fontSize: '0.98rem' }}>
                        ✓ Attached: {file.name}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '3px' }}>
                        Size: {(file.size / 1024).toFixed(1)} KB • Click to choose a different file
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload size={38} color="#3b82f6" style={{ margin: '0 auto 8px' }} />
                      <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.98rem' }}>
                        Click to browse or drag & drop your resume here
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '3px' }}>
                        Supports PDF, DOC, DOCX up to 15MB
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: Personal Information */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={16} color="#2563eb" />
                  <span>Personal Details</span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      placeholder="e.g. Akash Kumar"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="e.g. akash.kumar@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Contact / WhatsApp Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Preferred Job Location *</label>
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
                      <option value="Any Location">Any Location / Open to Relocate</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Academic Qualifications */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GraduationCap size={16} color="#2563eb" />
                  <span>Academic Qualifications</span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                  <div>
                    <label className="form-label">College / University Name *</label>
                    <input
                      type="text"
                      name="college"
                      className="form-input"
                      placeholder="e.g. BMS College of Engineering"
                      value={formData.college}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Degree & Specialization *</label>
                    <select
                      name="education"
                      className="form-select"
                      value={formData.education}
                      onChange={handleInputChange}
                    >
                      <option value="B.E / B.Tech Computer Science">B.E / B.Tech Computer Science</option>
                      <option value="B.E / B.Tech Information Science">B.E / B.Tech Information Science</option>
                      <option value="B.E / B.Tech Electronics & Comm (ECE)">B.E / B.Tech Electronics & Comm (ECE)</option>
                      <option value="B.E / B.Tech Mechanical / Civil / Other">B.E / B.Tech Other Branches</option>
                      <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                      <option value="MCA">MCA (Master of Computer Applications)</option>
                      <option value="B.Sc Computer Science / IT">B.Sc Computer Science / IT</option>
                      <option value="M.Tech Computer Science">M.Tech Computer Science</option>
                      <option value="Other Degree">Other Graduate / Post-Graduate</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Passing Out Year *</label>
                    <select
                      name="passingYear"
                      className="form-select"
                      value={formData.passingYear}
                      onChange={handleInputChange}
                    >
                      <option value="2025">2025 Batch (Upcoming)</option>
                      <option value="2024">2024 Batch (Recent Graduate)</option>
                      <option value="2023">2023 Batch</option>
                      <option value="2022">2022 Batch</option>
                      <option value="2021">2021 or Earlier</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">CGPA / Aggregate Percentage *</label>
                    <input
                      type="text"
                      name="cgpa"
                      className="form-input"
                      placeholder="e.g. 8.4 CGPA or 78%"
                      value={formData.cgpa}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Training Track & Technical Skills */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Code size={16} color="#2563eb" />
                  <span>Domain Track & Technical Skills (Global Minds)</span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label">Course / Domain Category *</label>
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
                  <div>
                    <label className="form-label">Experience Level *</label>
                    <div className="form-stepper-row">
                      <button
                        type="button"
                        className="form-step-btn"
                        onClick={() => {
                          const exps = ['Fresher (2024 Batch)', '1-2 Years Experience', '2+ Years Experience'];
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
                        <option value="Fresher (2024 Batch)">Fresher (0 - 1 Years)</option>
                        <option value="1-2 Years Experience">1 - 2 Years Experience</option>
                        <option value="2+ Years Experience">2+ Years Experience</option>
                      </select>
                      <button
                        type="button"
                        className="form-step-btn"
                        onClick={() => {
                          const exps = ['Fresher (2024 Batch)', '1-2 Years Experience', '2+ Years Experience'];
                          const idx = exps.indexOf(formData.experience);
                          if (idx < exps.length - 1 && idx >= 0) {
                            setFormData({ ...formData, experience: exps[idx + 1] });
                          }
                        }}
                        disabled={formData.experience === '2+ Years Experience'}
                        title="Increase Experience (+)"
                        aria-label="Increase Experience"
                      >
                        +
                      </button>
                    </div>

                    <div className="form-pills-row">
                      {[
                        { label: 'Fresher (0-1y)', val: 'Fresher (2024 Batch)' },
                        { label: '1 - 2 Years', val: '1-2 Years Experience' },
                        { label: '2+ Years', val: '2+ Years Experience' }
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
                </div>

                <div>
                  <label className="form-label">Key Technical Skills * (Comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    className="form-input"
                    placeholder="e.g. React.js, Node.js, Express, MongoDB, REST APIs"
                    value={formData.skills}
                    onChange={handleInputChange}
                    required
                  />
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '4px' }}>
                    Tip: Mention programming languages, frameworks, databases, and development tools you are proficient in.
                  </div>
                </div>
              </div>

              {/* SECTION 5: Links & Brief Bio (Optional) */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={16} color="#2563eb" />
                  <span>Portfolio Links & Summary (Optional)</span>
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      name="linkedin"
                      className="form-input"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="form-label">GitHub / Portfolio URL</label>
                    <input
                      type="url"
                      name="github"
                      className="form-input"
                      placeholder="https://github.com/username"
                      value={formData.github}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Brief Bio / Technical Summary</label>
                  <textarea
                    name="bio"
                    className="form-input"
                    rows="2"
                    placeholder="e.g. Certified Full Stack developer with capstone project experience in modern web apps and REST architecture."
                    value={formData.bio}
                    onChange={handleInputChange}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '12px',
                borderTop: '1px solid #e2e8f0',
                paddingTop: '18px'
              }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  style={{ padding: '10px 20px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{
                    padding: '11px 28px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Upload size={16} />
                  <span>{isSubmitting ? 'Submitting Resume...' : 'Submit Resume to Portal'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
