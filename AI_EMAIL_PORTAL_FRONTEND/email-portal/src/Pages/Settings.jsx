import React, { useEffect, useState } from 'react';
import { useCreatePrompt, useCreateSMTPConfig, useDeletePrompt, useDeleteSMTPConfig, usePrompts, useSendEmail, useSMTPConfigs, useUpdatePrompt, useUpdateSMTPConfig } from '../API/api';
import { toast, Toaster } from 'react-hot-toast';
export default function Settings() {
  const [activeTab, setActiveTab] = useState('prompts'); // 'prompts' or 'email'
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shadow-sm">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800">Settings</h1>
        </div>
        <nav className="mt-2">
          <button
            onClick={() => setActiveTab('prompts')}
            className={`flex items-center w-full px-6 py-3 text-left ${
              activeTab === 'prompts' 
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Prompts
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center w-full px-6 py-3 text-left ${
              activeTab === 'email' 
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email Settings
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        {activeTab === 'prompts' && <PromptSettings />}
        {activeTab === 'email' && <EmailSettings />}
      </div>
    </div>
  );
}

function PromptSettings() {
  const { data: prompts = [], isLoading } = usePrompts();
  const createPrompt = useCreatePrompt();
  const updatePrompt = useUpdatePrompt();
  const deletePrompt = useDeletePrompt();

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', template: '', is_active: false });
  const [showForm, setShowForm] = useState(false);

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (form.name.trim().length > 100) {
      toast.error('Name must be at most 100 characters');
      return false;
    }
    if (!form.template.trim()) {
      toast.error('Template is required');
      return false;
    }
    if (form.template.trim().length < 10) {
      toast.error('Template must be at least 10 characters long');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editing) {
      updatePrompt.mutate(
        { id: editing.id, ...form },
        {
          onSuccess: () => {
            toast.success('Prompt updated successfully');
            resetForm();
            setShowForm(false);
          },
          onError: (err) => {
            toast.error(err.message || 'Failed to update prompt');
          },
        }
      );
    } else {
      createPrompt.mutate(
        form,
        {
          onSuccess: () => {
            toast.success('Prompt created successfully');
            resetForm();
            setShowForm(false);
          },
          onError: (err) => {
            toast.error(err.message || 'Failed to create prompt');
          },
        }
      );
    }
  };

  const handleEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, template: p.template, is_active: p.is_active });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      deletePrompt.mutate(id, {
        onSuccess: () => toast.success('Prompt deleted'),
        onError: (err) => toast.error(err.message || 'Delete failed'),
      });
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', template: '', is_active: false });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div>
      {/* Toast container */}
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Prompt Templates</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Prompt
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {editing ? 'Edit Prompt' : 'New Prompt'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter prompt name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className={`w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${!form.name.trim() ? 'border-red-500' : 'border-gray-300'}`}
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
              <textarea
                placeholder="Enter your Prompt"
                value={form.template}
                onChange={e => setForm({ ...form, template: e.target.value })}
                rows={6}
                className={`w-full border rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${!form.template.trim() ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>

            <div className="flex items-center">
              <input
                id="is_active"
                type="checkbox"
                checked={form.is_active}
                onChange={e => setForm({ ...form, is_active: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                Set as active
              </label>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editing ? 'Update' : 'Create'}
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        prompts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No prompts yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new prompt template.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {prompts.map(p => (
                <li key={p.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>                        
                          {p.is_active ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">{p.name}</h4>
                        {p.is_active && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1 text-sm rounded-md border border-gray-300 text-red-600 hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
}


function EmailSettings() {
  const { data: configs = [], isLoading } = useSMTPConfigs();
  const createConfig = useCreateSMTPConfig();
  const updateConfig = useUpdateSMTPConfig();
  const deleteConfig = useDeleteSMTPConfig();
  const sendEmail = useSendEmail();

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', host: '', port: 587,
    username: '', password: '',
    use_tls: true, use_ssl: false,
    is_default: false,
  });
  const [showForm, setShowForm] = useState(false);
  const [sendData, setSendData] = useState({
    appl_id: '',
    receiver_email: '',
    smtp_config_id: null,
  });
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const resetForm = () => {
    setEditing(null);
    setShowForm(false);
    setForm(initialForm);
    setErrors({});
  };

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        host: editing.host,
        port: editing.port,
        username: editing.username,
        password: '',
        use_tls: editing.use_tls,
        use_ssl: editing.use_ssl,
        is_default: editing.is_default,
      });
      setErrors({});
    }
  }, [editing]);

  const validateConfig = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.host.trim()) errs.host = 'Host is required';
    if (!form.port || form.port <= 0 || form.port > 65535) errs.port = 'Port must be between 1 and 65535';
    if (!form.username.trim()) errs.username = 'Username is required';
    if (!editing && !form.password) errs.password = 'Password is required';
    if (form.use_tls && form.use_ssl) errs.tls_ssl = 'Cannot use both TLS and SSL';
    return errs;
  };

  const handleSave = () => {
    const errs = validateConfig();
    if (Object.keys(errs).length) {
      setErrors(errs);
      Object.values(errs).forEach(msg => toast.error(msg));
      return;
    }

    const payload = editing ? { id: editing.id, ...form } : form;
    const action = editing ? updateConfig : createConfig;
    action.mutate(payload, {
      onSuccess: () => {
        toast.success(editing ? 'Configuration updated' : 'Configuration created');
        setShowForm(false);
        setEditing(null);
        setForm({ name: '', host: '', port: 587, username: '', password: '', use_tls: true, use_ssl: false, is_default: false });
        setErrors({});
      },
      onError: (err) => {
        const message = err.response?.data?.error || err.message;
        toast.error(`Error: ${message}`);
      }
    });
  };

  const handleEdit = (cfg) => {
    setEditing(cfg);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this SMTP configuration?')) {
      deleteConfig.mutate(id, {
        onSuccess: () => toast.success('Configuration deleted'),
        onError: (err) => toast.error(err.message),
      });
    }
  };

  const validateSend = () => {
    const errs = {};
    if (!sendData.appl_id) errs.appl_id = 'Application ID is required';
    if (!sendData.receiver_email) errs.receiver_email = 'Receiver email is required';
    else if (!/^\S+@\S+\.\S+$/.test(sendData.receiver_email)) errs.receiver_email = 'Invalid email format';
    if (!sendData.smtp_config_id) errs.smtp_config_id = 'Select an SMTP configuration';
    return errs;
  };

  const handleSend = () => {
    const errs = validateSend();
    if (Object.keys(errs).length) {
      Object.values(errs).forEach(msg => toast.error(msg));
      return;
    }

    setIsSending(true);
    sendEmail.mutate(sendData, {
      onSuccess: () => {
        toast.success('Test email sent');
        setIsSending(false);
      },
      onError: (err) => {
        const message = err.response?.data?.error || err.message;
        toast.error(`Error: ${message}`);
        setIsSending(false);
      }
    });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  
    return (
      <div>
         <Toaster position="top-right" />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">SMTP Connections</h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New SMTP
            </button>
          )}
        </div>
  
        {showForm ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {editing ? 'Edit SMTP Configuration' : 'Add SMTP Configuration'}
            </h3>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Configuration name"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
                <input
                  type="text"
                  placeholder="SMTP server host"
                  value={form.host}
                  onChange={e => setForm({...form, host: e.target.value})}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                <input
                  type="number"
                  placeholder="587"
                  value={form.port}
                  onChange={e => setForm({...form, port: parseInt(e.target.value, 10) || 587})}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Email or username"
                  value={form.username}
                  onChange={e => setForm({...form, username: e.target.value})}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder={editing ? "Leave blank to keep current password" : "Password"}
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex items-center space-x-6 mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.use_tls}
                    onChange={e => setForm({...form, use_tls: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Use TLS</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.use_ssl}
                    onChange={e => setForm({...form, use_ssl: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Use SSL</span>
                </label>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.is_default}
                    onChange={e => setForm({...form, is_default: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Set as default configuration</span>
                </label>
              </div>
            </div>
  
            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {editing ? 'Update' : 'Create'}
              </button>
              <button
                onClick={() => { resetForm(); setShowForm(false); }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          configs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No SMTP configurations yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new SMTP server configuration.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {configs.map(cfg => (
                  <li key={cfg.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cfg.is_default ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">{cfg.name}</h4>
                          <div className="text-sm text-gray-500">
                            {cfg.host}:{cfg.port} • {cfg.username}
                            {cfg.is_default && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Default</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(cfg)} 
                          className="px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(cfg.id)} 
                          className="px-3 py-1 text-sm rounded-md border border-gray-300 text-red-600 hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>
    );
  }