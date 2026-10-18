import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Map, 
  Home as HomeIcon, 
  FileText, 
  Scale, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  Receipt, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  HelpCircle, 
  FileCheck,
  Trash2,
  Eye,
  Plus
} from 'lucide-react';
import { luxuryEasing, unravelContainer, unravelItem, fadeUpVariant } from '../components/animation/motionVariants';
import ScrollReveal, { UnravelHeading } from '../components/animation/ScrollReveal';
import MagneticButton from '../components/animation/MagneticButton';
import adminApi from '../services/adminApi';
import './GetStarted.css';

export const GetStarted = ({ initialCustomer, onCaseCreated, isCustomerPortal = false }) => {
  const [searchParams] = useSearchParams();
  const preSelectedService = searchParams.get('service') || 'builder';

  // Read stored customer if logged in or passed from props
  const storedCust = initialCustomer || (() => {
    try {
      const raw = localStorage.getItem('suraksha_customer');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const [activeStep, setActiveStep] = useState(1);
  const [selectedService, setSelectedService] = useState(preSelectedService);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [caseId, setCaseId] = useState('');

  const [formData, setFormData] = useState({
    serviceType: preSelectedService,
    propertyType: 'Apartment / Flat',
    city: '',
    state: '',
    projectOrSurvey: '',
    sellerOrBuilder: '',
    customerName: storedCust?.name || '',
    customerEmail: storedCust?.email || '',
    customerPhone: storedCust?.phone || '',
    comments: '',
    uploadedFilesCount: 0
  });

  // Sync if storedCust loads or changes
  useEffect(() => {
    if (storedCust) {
      setFormData(prev => ({
        ...prev,
        customerName: prev.customerName || storedCust.name || '',
        customerEmail: prev.customerEmail || storedCust.email || '',
        customerPhone: prev.customerPhone || storedCust.phone || ''
      }));
    }
  }, [storedCust]);

  const [errors, setErrors] = useState({});
  const formCardRef = React.useRef(null);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!selectedService) {
        newErrors.serviceType = 'Please select a verification service to continue.';
      }
    }

    if (step === 2) {
      if (!formData.propertyType?.trim()) {
        newErrors.propertyType = 'Property category is required';
      }
      if (!formData.city?.trim()) {
        newErrors.city = 'City & State is required';
      }
      if (!formData.projectOrSurvey?.trim()) {
        newErrors.projectOrSurvey = 'Project / Layout / Society name is required';
      }
      if (!formData.sellerOrBuilder?.trim()) {
        newErrors.sellerOrBuilder = 'Builder / Developer / Seller name is required';
      }
      if (!formData.comments?.trim()) {
        newErrors.comments = 'Please provide notes or specific concerns to guide our verification';
      }
    }

    if (step === 3) {
      if (formData.uploadedFilesCount === 0) {
        newErrors.propertyDocs = 'Please upload at least one relevant property document';
      }
      if (!formData.customerName?.trim()) {
        newErrors.customerName = 'Full legal name is required';
      }
      if (!formData.customerPhone?.trim()) {
        newErrors.customerPhone = 'Mobile number is required';
      } else if (!/^[0-9+\s-]{8,15}$/.test(formData.customerPhone.trim())) {
        newErrors.customerPhone = 'Please enter a valid mobile number';
      }
      if (!formData.customerEmail?.trim()) {
        newErrors.customerEmail = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail.trim())) {
        newErrors.customerEmail = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToStep = (stepNumber) => {
    // If going forward, validate current step first
    if (stepNumber > activeStep) {
      const isValid = validateStep(activeStep);
      if (!isValid) {
        // Smooth scroll to top of form so error is visible
        if (formCardRef.current) {
          const offsetTop = formCardRef.current.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top: Math.max(0, offsetTop), behavior: 'smooth' });
        }
        return;
      }
    }

    setErrors({});
    setActiveStep(stepNumber);
    // Smoothly scroll to the intake form card / stepper at the top
    if (formCardRef.current) {
      const offsetTop = formCardRef.current.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (searchParams.get('service')) {
      setSelectedService(searchParams.get('service'));
      setFormData(prev => ({ ...prev, serviceType: searchParams.get('service') }));
    }
  }, [searchParams]);

  const serviceOptions = [
    {
      id: 'builder',
      title: 'Builder Verification',
      desc: 'Company track record, litigations & RERA check',
      icon: Building2
    },
    {
      id: 'land',
      title: 'Land & Plot Verification',
      desc: '30-year EC, ownership title & revenue records',
      icon: Map
    },
    {
      id: 'apartment',
      title: 'Apartment & Villa',
      desc: 'Sanctioned plans, OC/CC, UDS & builder deeds',
      icon: HomeIcon
    },
    {
      id: 'document',
      title: 'Document Review',
      desc: 'Scrutiny of sale deed, agreement & tax receipts',
      icon: FileText
    },
    {
      id: 'due-diligence',
      title: 'Legal Due Diligence',
      desc: '360° advocate opinion & risk scorecard',
      icon: Scale
    }
  ];

  const handleServiceSelect = (id) => {
    setSelectedService(id);
    setFormData({ ...formData, serviceType: id });
  };

  const REQUIRED_DOC_CATEGORIES = [
    {
      id: 'sale_deed',
      title: '1. Current Registered Sale Deed',
      telugu: 'ప్రస్తుత రిజిస్టర్డ్ సేల్ డీడ్',
      desc: 'Latest registered title deed in favor of current owner/seller'
    },
    {
      id: 'link_docs',
      title: '2. Link Documents / Parent Deeds',
      telugu: 'గత 30 సంవత్సరాలకు సంబంధించినవి',
      desc: 'Prior chain of title deeds tracing ownership continuity for 30 years'
    },
    {
      id: 'encumbrance_cert',
      title: '3. Encumbrance Certificate (30 Years EC)',
      telugu: '30 సంవత్సరాల ఈసీ సర్టిఫికేట్ (Form 15/16)',
      desc: 'Online / Sub-registrar issued 30 years encumbrance statement'
    },
    {
      id: 'sanction_plan',
      title: '4. Approved Layout Plan & Building Sanction Plan',
      telugu: 'అప్రూవ్డ్ లేఅవుట్ ప్లాన్ & బిల్డింగ్ సాంక్షన్ ప్లాన్',
      desc: 'GHMC/HMDA/DTCP/Panchayat approved master layout and building permission'
    },
    {
      id: 'rera_cert',
      title: '5. RERA Registration Certificate',
      telugu: 'Under-construction లేదా కొత్తగా నిర్మించిన ప్రాపర్టీకి వర్తిస్తే',
      desc: 'Official state RERA project certificate (if new or under construction)'
    },
    {
      id: 'tax_receipts',
      title: '6. Mutation Certificate / Khata / Patta Passbook',
      telugu: 'Mutation Certificate / Khata / Patta Passbook',
      desc: 'Mutation certificate / Khata / Patta Passbook'
    }
  ];

  // Document files mapped by category id
  const [docFiles, setDocFiles] = useState({
    sale_deed: [],
    link_docs: [],
    encumbrance_cert: [],
    sanction_plan: [],
    rera_cert: [],
    tax_receipts: []
  });

  const handleDocCategoryUpload = (catId, filesList) => {
    const newFiles = Array.from(filesList);
    setDocFiles(prev => {
      const updated = {
        ...prev,
        [catId]: [...prev[catId], ...newFiles]
      };
      const totalCount = Object.values(updated).reduce((acc, curr) => acc + curr.length, 0);
      setFormData(f => ({ ...f, uploadedFilesCount: totalCount }));
      return updated;
    });
    if (errors.propertyDocs) setErrors(prev => ({ ...prev, propertyDocs: null }));
  };

  const handleRemoveDocFile = (catId, indexToRemove) => {
    setDocFiles(prev => {
      const updatedList = prev[catId].filter((_, idx) => idx !== indexToRemove);
      const updated = { ...prev, [catId]: updatedList };
      const totalCount = Object.values(updated).reduce((acc, curr) => acc + curr.length, 0);
      setFormData(f => ({ ...f, uploadedFilesCount: totalCount }));
      return updated;
    });
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateStep(3);
    if (!isValid) {
      if (formCardRef.current) {
        const offsetTop = formCardRef.current.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: Math.max(0, offsetTop), behavior: 'smooth' });
      }
      return;
    }

    setSubmitting(true);
    try {
      // Build multipart FormData to stream files directly to Cloudinary
      const payload = new FormData();
      payload.append('serviceType', formData.serviceType);
      payload.append('propertyType', formData.propertyType);
      payload.append('city', `${formData.city}${formData.state ? `, ${formData.state}` : ''}`);
      payload.append('projectOrSurvey', formData.projectOrSurvey);
      payload.append('sellerOrBuilder', formData.sellerOrBuilder);
      payload.append('customerName', formData.customerName);
      payload.append('customerEmail', formData.customerEmail);
      payload.append('customerPhone', formData.customerPhone);
      payload.append('comments', formData.comments || '');
      payload.append('uploadedFilesCount', formData.uploadedFilesCount || 1);

      // Append all categorized files with friendly prefixed filenames
      REQUIRED_DOC_CATEGORIES.forEach((cat) => {
        const catFileList = docFiles[cat.id] || [];
        catFileList.forEach((file) => {
          // Clone with descriptive prefix so advocate & admin know exact category
          const customName = `${cat.id.toUpperCase()}_${file.name}`;
          const renamedFile = new File([file], customName, { type: file.type });
          payload.append('documents', renamedFile);
        });
      });

      // Post case directly into Neon PostgreSQL database & Cloudinary
      const res = await adminApi.createClient(payload);
      if (res.success && res.case) {
        setCaseId(res.case.case_reference);
        if (typeof onCaseCreated === 'function') {
          onCaseCreated(res.case);
        }
      } else {
        const generatedId = `PS-${Math.floor(100000 + Math.random() * 900000)}`;
        setCaseId(generatedId);
      }
    } catch (err) {
      console.error('Error posting case to server:', err);
      const generatedId = `PS-${Math.floor(100000 + Math.random() * 900000)}`;
      setCaseId(generatedId);
    } finally {
      setSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="verification-page">
      {/* Hero Strip */}
      <div className="verification-hero-strip">
        <div className="container">
          <motion.div
            variants={unravelContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.span variants={fadeUpVariant} className="section-badge section-badge-dark">
              Intake Portal
            </motion.span>
            <div style={{ overflow: 'hidden', margin: '0.6rem 0' }}>
              <motion.h1 variants={unravelItem} className="verification-main-title">
                Start Property Legal Verification
              </motion.h1>
            </div>
            <motion.p variants={fadeUpVariant} className="verification-main-subtitle">
              Submit your property particulars to receive a case-specific quotation and initiate advocate verification.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <div className="container verification-container">
        {/* Progress Tracker (3 Steps) */}
        {!isSubmitted && (
          <div className="intake-stepper">
            <div className={`stepper-step ${activeStep >= 1 ? 'active' : ''} ${activeStep > 1 ? 'completed' : ''}`}>
              <div className="stepper-circle">1</div>
              <span>Select Service</span>
            </div>
            <div className="stepper-divider"></div>
            <div className={`stepper-step ${activeStep >= 2 ? 'active' : ''} ${activeStep > 2 ? 'completed' : ''}`}>
              <div className="stepper-circle">2</div>
              <span>Property Details</span>
            </div>
            <div className="stepper-divider"></div>
            <div className={`stepper-step ${activeStep >= 3 ? 'active' : ''}`}>
              <div className="stepper-circle">3</div>
              <span>Documents & Contact</span>
            </div>
          </div>
        )}

        {isSubmitted ? (
          /* SUCCESS STATE */
          <motion.div 
            className="intake-success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: luxuryEasing }}
          >
            <motion.div 
              className="success-icon-wrap"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, delay: 0.2 }}
            >
              <CheckCircle2 size={68} className="success-check-icon" />
            </motion.div>
            <span className="success-tag">Request Received</span>
            <h2 className="success-case-title">Your Case Reference: {caseId}</h2>
            <p className="success-case-desc">
              Thank you, <strong>{formData.customerName}</strong>. Our senior legal admin team has received your verification request for <strong>{formData.projectOrSurvey || 'your property'}</strong>.
            </p>

            <div className="success-next-steps">
              <h4>What Happens Next:</h4>
              <div className="next-step-row">
                <span className="step-badge-num">1</span>
                <div>
                  <strong>Document Assessment:</strong> Our legal operations desk inspects the uploaded records.
                </div>
              </div>
              <div className="next-step-row">
                <span className="step-badge-num">2</span>
                <div>
                  <strong>Custom Quotation:</strong> You will receive a transparent quote via email & SMS within 2–4 hours.
                </div>
              </div>
              <div className="next-step-row">
                <span className="step-badge-num">3</span>
                <div>
                  <strong>Advocate Assignment:</strong> Upon quotation approval, a practicing property lawyer begins verification.
                </div>
              </div>
            </div>

            <div className="success-actions">
              <MagneticButton strength={12}>
                <Link to={isCustomerPortal ? "/customer/dashboard" : "/login"} className="btn-gold">
                  <span>Go to Customer Dashboard</span>
                  <ArrowRight size={18} />
                </Link>
              </MagneticButton>
              <Link to={isCustomerPortal ? "/customer/past-applications" : "/"} className="btn-navy-outline">
                <span>{isCustomerPortal ? "View Past Applications" : "Return to Home"}</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          /* INTAKE FORM WITH ANIMATED STEP PANES */
          <form ref={formCardRef} onSubmit={handleSubmit} className="intake-form-box">
            <AnimatePresence mode="wait">
              {/* STEP 1: SELECT SERVICE */}
              {activeStep === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: luxuryEasing }}
                  className="intake-step-pane"
                >
                  <div className="step-pane-header">
                    <h3>Step 1: Choose Your Verification Service</h3>
                    <p>Select the verification tier that best fits your property transaction.</p>
                  </div>

                  <div className="service-selection-grid">
                    {serviceOptions.map((svc) => {
                      const Icon = svc.icon;
                      const isSelected = selectedService === svc.id;
                      return (
                        <motion.div 
                          key={svc.id} 
                          className={`service-option-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleServiceSelect(svc.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="service-option-icon">
                            <Icon size={24} />
                          </div>
                          <h4>{svc.title}</h4>
                          <p>{svc.desc}</p>
                          <div className="service-radio">
                            <div className={`radio-dot ${isSelected ? 'checked' : ''}`}></div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="step-nav-row flex-end">
                    <MagneticButton strength={12}>
                      <button 
                        type="button" 
                        className="btn-intake-continue"
                        onClick={() => goToStep(2)}
                      >
                        <span>Continue to Property Details</span>
                        <ArrowRight size={18} />
                      </button>
                    </MagneticButton>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PROPERTY DETAILS */}
              {activeStep === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: luxuryEasing }}
                  className="intake-step-pane"
                >
                  <div className="step-pane-header">
                    <h3>Step 2: Property Particulars</h3>
                    <p>Provide basic information to help our advocates locate revenue & municipal records.</p>
                  </div>

                  <div className="form-grid-2">
                    <div className={`form-field ${errors.propertyType ? 'field-error' : ''}`}>
                      <label>Property Category *</label>
                      <select 
                        required
                        value={formData.propertyType}
                        onChange={(e) => {
                          setFormData({...formData, propertyType: e.target.value});
                          if (errors.propertyType) setErrors(prev => ({...prev, propertyType: null}));
                        }}
                      >
                        <option value="Apartment / Flat">Apartment / Flat</option>
                        <option value="Independent Villa">Independent Villa</option>
                        <option value="Open Plot / Layout">Open Plot / Layout</option>
                        <option value="Agricultural Land">Agricultural Land</option>
                        <option value="Commercial Space">Commercial Space</option>
                      </select>
                      {errors.propertyType && <span className="field-error-msg">{errors.propertyType}</span>}
                    </div>

                    <div className={`form-field ${errors.city ? 'field-error' : ''}`}>
                      <label>City & State *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Hyderabad, Telangana" 
                        required 
                        value={formData.city}
                        onChange={(e) => {
                          setFormData({...formData, city: e.target.value});
                          if (errors.city) setErrors(prev => ({...prev, city: null}));
                        }}
                      />
                      {errors.city && <span className="field-error-msg">{errors.city}</span>}
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className={`form-field ${errors.projectOrSurvey ? 'field-error' : ''}`}>
                      <label>Project / Layout / Society Name *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Prestige High Fields / Survey No. 84" 
                        required 
                        value={formData.projectOrSurvey}
                        onChange={(e) => {
                          setFormData({...formData, projectOrSurvey: e.target.value});
                          if (errors.projectOrSurvey) setErrors(prev => ({...prev, projectOrSurvey: null}));
                        }}
                      />
                      {errors.projectOrSurvey && <span className="field-error-msg">{errors.projectOrSurvey}</span>}
                    </div>

                    <div className={`form-field ${errors.sellerOrBuilder ? 'field-error' : ''}`}>
                      <label>Builder / Developer / Seller Name *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Prestige Group or Seller Name" 
                        required
                        value={formData.sellerOrBuilder}
                        onChange={(e) => {
                          setFormData({...formData, sellerOrBuilder: e.target.value});
                          if (errors.sellerOrBuilder) setErrors(prev => ({...prev, sellerOrBuilder: null}));
                        }}
                      />
                      {errors.sellerOrBuilder && <span className="field-error-msg">{errors.sellerOrBuilder}</span>}
                    </div>
                  </div>

                  <div className={`form-field ${errors.comments ? 'field-error' : ''}`}>
                    <label>Additional Notes / Specific Concerns *</label>
                    <textarea 
                      rows={3} 
                      required
                      placeholder="Mention specific concerns such as delay in OC, ancestral title dispute history, or bank mortgage questions..."
                      value={formData.comments}
                      onChange={(e) => {
                        setFormData({...formData, comments: e.target.value});
                        if (errors.comments) setErrors(prev => ({...prev, comments: null}));
                      }}
                    ></textarea>
                    {errors.comments && <span className="field-error-msg">{errors.comments}</span>}
                  </div>

                  <div className="step-nav-row">
                    <button 
                      type="button" 
                      className="btn-intake-back"
                      onClick={() => goToStep(1)}
                    >
                      <span>Back</span>
                    </button>
                    <MagneticButton strength={12}>
                      <button 
                        type="button" 
                        className="btn-intake-continue"
                        onClick={() => goToStep(3)}
                      >
                        <span>Continue to Documents & Contact</span>
                        <ArrowRight size={18} />
                      </button>
                    </MagneticButton>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: DOCUMENTS & CONTACT */}
              {activeStep === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: luxuryEasing }}
                  className="intake-step-pane"
                >
                  <div className="step-pane-header">
                    <h3>Step 3: Document Upload & Your Contact</h3>
                    <p>Upload any available paperwork and provide contact details for quotation delivery.</p>
                  </div>

                  {/* Individual Upload Options for each Document */}
                  <div className={`upload-dropzone-box ${errors.propertyDocs ? 'field-error' : ''}`}>
                    <div className="docs-section-heading">
                      <div>
                        <label className="field-req-label" style={{ marginBottom: 2 }}>
                          Required Property Documents Upload *
                        </label>
                        <p className="docs-section-sub">
                          Please upload available documents under each category below. (Upload at least one document to proceed).
                        </p>
                      </div>
                      {formData.uploadedFilesCount > 0 && (
                        <div className="total-files-counter-badge">
                          <FileCheck size={16} />
                          <span>{formData.uploadedFilesCount} File(s) Attached</span>
                        </div>
                      )}
                    </div>

                    {errors.propertyDocs && (
                      <div className="doc-error-banner">
                        <AlertTriangle size={18} />
                        <span>{errors.propertyDocs}</span>
                      </div>
                    )}

                    {/* 6 Category Upload Cards Grid */}
                    <div className="doc-categories-upload-grid">
                      {REQUIRED_DOC_CATEGORIES.map((cat, idx) => {
                        const currentFiles = docFiles[cat.id] || [];
                        const isUploaded = currentFiles.length > 0;
                        const inputId = `doc-input-${cat.id}`;

                        return (
                          <div 
                            key={cat.id} 
                            className={`doc-upload-card ${isUploaded ? 'has-files' : ''}`}
                          >
                            <div className="doc-card-header-row">
                              <div className="doc-card-badge-wrap">
                                <span className="doc-badge-number">{idx + 1}</span>
                                {isUploaded ? (
                                  <span className="doc-status-tag tag-uploaded">
                                    <CheckCircle2 size={12} />
                                    <span>{currentFiles.length} Uploaded</span>
                                  </span>
                                ) : (
                                  <span className="doc-status-tag tag-pending">
                                    <span>Optional / Required</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="doc-card-body">
                              <h4 className="doc-card-title">{cat.title.replace(/^\d+\.\s*/, '')}</h4>
                              <div className="doc-telugu-pill">
                                <span>{cat.telugu}</span>
                              </div>
                              <p className="doc-card-hint">{cat.desc}</p>
                            </div>

                            {/* File List if files already chosen for this slot */}
                            {currentFiles.length > 0 && (
                              <div className="doc-files-selected-list">
                                {currentFiles.map((file, fileIdx) => (
                                  <div key={fileIdx} className="doc-file-item">
                                    <div className="doc-file-info">
                                      <div className="doc-file-type-icon">
                                        <FileCheck size={14} />
                                      </div>
                                      <div className="doc-file-text-col">
                                        <span className="doc-filename" title={file.name}>
                                          {file.name}
                                        </span>
                                        <span className="doc-filesize">
                                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      className="doc-file-remove-btn"
                                      onClick={() => handleRemoveDocFile(cat.id, fileIdx)}
                                      title="Remove this file"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Hidden file input & styled upload button */}
                            <div className="doc-card-actions">
                              <input
                                type="file"
                                id={inputId}
                                multiple
                                className="file-hidden-input"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    handleDocCategoryUpload(cat.id, e.target.files);
                                  }
                                }}
                              />
                              <label htmlFor={inputId} className={`doc-slot-upload-btn ${isUploaded ? 'btn-uploaded' : ''}`}>
                                {isUploaded ? (
                                  <>
                                    <Plus size={16} />
                                    <span>Add More Pages / Files</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload size={16} />
                                    <span>Upload Document</span>
                                  </>
                                )}
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="form-section-title-tag">Contact Information for Quotation</div>

                  <div className="form-grid-3">
                    <div className={`form-field ${errors.customerName ? 'field-error' : ''}`}>
                      <label>Full Legal Name *</label>
                      <input 
                        type="text" 
                        placeholder="Enter your name" 
                        required 
                        value={formData.customerName}
                        onChange={(e) => {
                          setFormData({...formData, customerName: e.target.value});
                          if (errors.customerName) setErrors(prev => ({...prev, customerName: null}));
                        }}
                      />
                      {errors.customerName && <span className="field-error-msg">{errors.customerName}</span>}
                    </div>

                    <div className={`form-field ${errors.customerPhone ? 'field-error' : ''}`}>
                      <label>Mobile Number (for SMS & WhatsApp) *</label>
                      <input 
                        type="tel" 
                        placeholder="+91 98765 43210" 
                        required 
                        value={formData.customerPhone}
                        onChange={(e) => {
                          setFormData({...formData, customerPhone: e.target.value});
                          if (errors.customerPhone) setErrors(prev => ({...prev, customerPhone: null}));
                        }}
                      />
                      {errors.customerPhone && <span className="field-error-msg">{errors.customerPhone}</span>}
                    </div>

                    <div className={`form-field ${errors.customerEmail ? 'field-error' : ''}`}>
                      <label>Email Address *</label>
                      <input 
                        type="email" 
                        placeholder="name@example.com" 
                        required 
                        value={formData.customerEmail}
                        onChange={(e) => {
                          setFormData({...formData, customerEmail: e.target.value});
                          if (errors.customerEmail) setErrors(prev => ({...prev, customerEmail: null}));
                        }}
                      />
                      {errors.customerEmail && <span className="field-error-msg">{errors.customerEmail}</span>}
                    </div>
                  </div>

                  <div className="intake-notice">
                    <ShieldCheck size={20} className="intake-shield" />
                    <p>
                      <strong>Confidential & Encrypted:</strong> All property documents are stored in 256-bit encrypted storage and scrutinized exclusively by bar-admitted property advocates.
                    </p>
                  </div>

                  <div className="step-nav-row">
                    <button 
                      type="button" 
                      className="btn-intake-back"
                      onClick={() => goToStep(2)}
                    >
                      <span>Back</span>
                    </button>
                    <MagneticButton strength={14}>
                      <button 
                        type="submit" 
                        disabled={submitting}
                        className="btn-intake-submit"
                      >
                        <span>{submitting ? 'Submitting ...' : 'Submit Verification Request'}</span>
                        <ArrowRight size={18} />
                      </button>
                    </MagneticButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        )}
      </div>
    </div>
  );
};

export default GetStarted;
