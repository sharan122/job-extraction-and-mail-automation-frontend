import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {
  JobApplicationView,
  useEditApplication,
  useSendEmail,
  useRegenerateApplication
} from '../API/api';

export const JobApplication = () => {
  const { id } = useParams();
  const { data: jobapp, isLoading: isFetching } = JobApplicationView(id);

  const editApp    = useEditApplication();
  const sendEmail  = useSendEmail();
  const regenerate = useRegenerateApplication();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    body: '',
    receiver_email: ''
  });

  useEffect(() => {
    if (jobapp) {
      const entry = Array.isArray(jobapp) ? jobapp[0] : jobapp;
      setFormData({
        subject: entry.subject,
        body:    entry.body,
        receiver_email: entry.receiver_email || ''
      });
    }
  }, [jobapp]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const isValidEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSend = () => {
    if (!formData.receiver_email) {
      toast.error('Receiver email is required');
      return;
    }
    if (!isValidEmail(formData.receiver_email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    sendEmail.mutate(
      { id: jobapp[0]?.id, receiver_email: formData.receiver_email },
      {
        onSuccess: () => toast.success('Application sent successfully!'),
        onError: () => toast.error('Failed to send application. Please try again.')
      }
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    editApp.mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          toast.success('Application updated successfully!');
          setShowModal(false);
        },
        onError: () => {
          toast.error('Failed to update application.');
        }
      }
    );
  };

  const handleRegenerate = () => {
    regenerate.mutate(id, {
      onSuccess: data => {
        setFormData(fd => ({ ...fd, subject: data.subject, body: data.body }));
        toast.success('Email content regenerated!');
      },
      onError: () => toast.error('Failed to regenerate content.')
    });
  };

  const isSending = sendEmail.isLoading;
  const isEditing = editApp.isLoading;
  const isBusy = isFetching || regenerate.isLoading || isSending;

  return (
    <div className="container py-5">
      {/* Toast container */}
      <Toaster position="top-right" />

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 rounded-lg">
            <div className="card-header bg-gradient bg-primary text-white text-center py-3">
              <h3 className="mb-0">Job Application</h3>
            </div>
            <div className="card-body p-4 p-md-5 bg-light position-relative">

              {/* Overlay Loader */}
              {isBusy && (
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', zIndex: 10 }}
                >
                  <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h5 className="fw-bold">
                    {isFetching
                      ? 'AI is generating the email template…'
                      : regenerate.isLoading
                        ? 'Regenerating email…'
                        : 'Sending email…'}
                  </h5>
                  <p className="text-muted">
                    {isFetching
                      ? 'Please wait while we create your content.'
                      : regenerate.isLoading
                        ? 'Please wait while we update your content.'
                        : 'Please wait while we send your email.'}
                  </p>
                </div>
              )}

              <div className={isBusy ? 'invisible' : ''}>
                {/* Receiver Email */}
                <div className="mb-4">
                  <label htmlFor="receiver_email" className="form-label fw-bold">Receiver Email</label>
                  <input
                    type="email"
                    id="receiver_email"
                    name="receiver_email"
                    className="form-control form-control-lg border-0 shadow-sm"
                    value={formData.receiver_email}
                    onChange={handleChange}
                    disabled={isBusy}
                  />
                </div>

                {/* Subject + Regenerate/Edit Buttons */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="fw-bold m-0">Subject</h5>
                  <div>
                    <button
                      className="btn btn-outline-secondary me-2"
                      onClick={handleRegenerate}
                      disabled={regenerate.isLoading || isSending || isEditing}
                    >
                      {regenerate.isLoading ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Regenerating…</>
                      ) : (
                        <><i className="bi bi-arrow-clockwise me-1"></i>Regenerate</>
                      )}
                    </button>
                    <button
                      className="btn btn-outline-primary rounded-pill"
                      onClick={() => setShowModal(true)}
                      disabled={isSending || isEditing}
                    >
                      <i className="bi bi-pencil me-1"></i>Edit
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-white rounded shadow-sm">{formData.subject}</div>

                {/* Body */}
                <div className="mb-4 mt-4">
                  <h5 className="fw-bold">Cover Letter</h5>
                  <div className="p-3 bg-white rounded shadow-sm" style={{ whiteSpace: 'pre-wrap' }}>
                    {formData.body}
                  </div>
                </div>

                {/* Send Button */}
                <div className="text-end">
                  <button
                    className="btn btn-primary btn-lg px-5 rounded-pill shadow"
                    onClick={handleSend}
                    disabled={isSending || isBusy}
                  >
                    {isSending ? (
                      <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Sending…</>
                    ) : (
                      <><i className="bi bi-send me-1"></i>Send Application</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Edit Job Application</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-4">
                    <label htmlFor="subject" className="form-label fw-bold">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="form-control form-control-lg border-0 shadow-sm"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      disabled={isEditing}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="body" className="form-label fw-bold">Cover Letter</label>
                    <textarea
                      id="body"
                      name="body"
                      className="form-control form-control-lg border-0 shadow-sm"
                      rows="8"
                      value={formData.body}
                      onChange={handleChange}
                      required
                      disabled={isEditing}
                    />
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4 rounded-pill"
                      onClick={() => setShowModal(false)}
                      disabled={isEditing}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary px-4 rounded-pill"
                      disabled={isEditing}
                    >
                      {isEditing ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Saving…</>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplication;
