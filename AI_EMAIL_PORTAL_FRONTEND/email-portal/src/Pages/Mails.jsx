import React, { useState } from 'react';
import { useMails } from '../API/api';
import { Search, SendHorizonal, Calendar, Archive, AlertCircle, ChevronLeft, ChevronRight, MailCheck, Printer, Download } from 'lucide-react';

export default function MailViewer() {
  const { data: mails = [], isLoading, isError, error } = useMails();
  const [selectedMailId, setSelectedMailId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 font-medium">Loading your sent mail history...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">Unable to load  mails</h3>
          <p className="text-red-600 mb-4">{error.message}</p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const filteredMails = mails.filter(mail => 
    mail.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (mail.body && mail.body.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (mail.company_name && mail.company_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const selectedMail = mails.find(m => m.id === selectedMailId);
  
  // Get the index of the current mail for navigation
  const currentIndex = mails.findIndex(m => m.id === selectedMailId);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < mails.length - 1 && currentIndex !== -1;

  // Format mail content to preserve spacing and line breaks
  const formatMailContent = (content) => {
    if (!content) return "";
    // Replace newlines with appropriate HTML breaks to maintain spacing
    return content.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar: Sent Mail History */}
      <div className="w-80 bg-white border-r shadow-sm overflow-y-auto flex flex-col">
        <div className="p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <SendHorizonal className="mr-2 text-green-500" size={20} /> 
            Sent History
          </h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search sent mails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
        
        {filteredMails.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-gray-500">
            <MailCheck className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-center">
              {searchQuery ? "No matches found" : "No mails sent yet"}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 flex-1">
            {filteredMails.map(mail => (
              <li
                key={mail.id}
                onClick={() => setSelectedMailId(mail.id)}
                className={`px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                  mail.id === selectedMailId ? 'bg-green-50 border-l-4 border-green-600 pl-3' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-medium truncate ${mail.id === selectedMailId ? 'text-green-700' : 'text-gray-800'}`}>
                    {mail.subject}
                  </h4>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Sent</span>
                </div>
                {mail.company_name && (
                  <p className="text-sm font-medium truncate text-gray-600 mb-1">To: {mail.company_name}</p>
                )}
                <p className="text-xs truncate text-gray-500 flex items-center">
                  <Calendar size={12} className="mr-1 inline" />
                  {new Date(mail.created_at).toLocaleDateString()} • {new Date(mail.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Main Content: Sent Mail Details */}
      <div className="flex-1 overflow-auto bg-gray-50 flex flex-col">
        {!selectedMail ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="bg-white/50 p-12 rounded-xl text-center max-w-md">
              <SendHorizonal className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No sent mail selected</h3>
              <p className="text-gray-500">
                {mails.length > 0 
                  ? "Select a sent mail from the sidebar to view its contents" 
                  : "You haven't sent any mails yet."}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white border-b p-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center">
                <button 
                  onClick={() => setSelectedMailId(null)}
                  className="mr-4 p-2 rounded-full hover:bg-gray-100 text-gray-600"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-lg font-bold text-gray-800 truncate max-w-lg">
                  {selectedMail.subject}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {/* <button 
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                  title="Print mail"
                >
                  <Printer size={18} />
                </button>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                  title="Download mail"
                >
                  <Download size={18} />
                </button> */}
                <div className="mx-2 h-6 border-r border-gray-200"></div>
                <button 
                  onClick={() => {
                    if (hasPrevious) setSelectedMailId(mails[currentIndex - 1].id);
                  }}
                  disabled={!hasPrevious}
                  className={`p-2 rounded-full ${hasPrevious ? 'hover:bg-gray-100 text-gray-600' : 'text-gray-300 cursor-not-allowed'}`}
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm text-gray-500">
                  {currentIndex + 1} of {mails.length}
                </span>
                <button 
                  onClick={() => {
                    if (hasNext) setSelectedMailId(mails[currentIndex + 1].id);
                  }}
                  disabled={!hasNext}
                  className={`p-2 rounded-full ${hasNext ? 'hover:bg-gray-100 text-gray-600' : 'text-gray-300 cursor-not-allowed'}`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 flex-1 overflow-auto">
              <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Mail Header */}
                <div className="border-b border-gray-200 bg-gray-50 p-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">{selectedMail.subject}</h1>
                  
                  <div className="flex flex-wrap gap-y-2 justify-between">
                    <div>
                   
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <span className="font-medium text-gray-700 mr-2">Company :</span>
                        <span>{selectedMail.company_name || "Company"} </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium text-gray-700 mr-2">Date:</span>
                        <span>{new Date(selectedMail.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium self-start">
                      <SendHorizonal size={14} className="inline mr-1" /> Sent Successfully
                    </div>
                  </div>
                </div>
                
                {/* Mail Body - With Professional Email Formatting */}
                <div className="p-8 text-gray-700 leading-relaxed">
                  {/* Proper email format with spacing */}
                  <div className="min-h-64 whitespace-pre-line font-sans">
                    {selectedMail.body ? (
                      <>
                        {/* This preserves the formatting of the email including spacing */}
                        {formatMailContent(selectedMail.body)}
                      </>
                    ) : (
                      <p className="text-gray-400 italic">No content</p>
                    )}
                  </div>
                  
                  {/* Email signature with separator */}
                  {/* <div className="mt-12 pt-6 border-t border-gray-200">
                    <p className="font-medium">Your Name</p>
                    <p className="text-gray-500">Job Title</p>
                    <p className="text-gray-500">Company Name</p>
                    <p className="text-gray-500">your.email@example.com</p>
                    <p className="text-gray-500">+1 (123) 456-7890</p>
                  </div> */}
                </div>
                
                {/* Mail Footer */}
                <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
                  {/* <span className="text-xs text-gray-500">Sent via Your Application</span>
                  <div className="flex gap-2">
                    <button className="border border-gray-300 hover:bg-gray-100 text-gray-600 px-3 py-1 rounded-md transition text-sm flex items-center">
                      <Archive className="mr-1 h-4 w-4" />
                      Archive
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition text-sm flex items-center">
                      <SendHorizonal className="mr-1 h-4 w-4" />
                      Send Again
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}