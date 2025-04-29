import React, { useState } from 'react'
import axios from 'axios'
import { ArrowRight, Loader2, Briefcase, Building, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useJobApplication } from '../API/api'

const JobExtraction = ({ token }) => {
    const jobApplicationMutation = useJobApplication ();
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [job, setJob] = useState(null)
    const navigate = useNavigate()

    
       const importJob = async () => {
         try {
           setLoading(true)
           const { data } = await axios.post(
             'http://127.0.0.1:8000/api/extract/',
             { url },
             { headers: { Authorization: `Bearer ${token}` } }
           )
           setJob(data) 
          // once the job is saved/extracted, redirect to your email generator
       
          jobApplicationMutation.mutate(data.id);
          navigate(`/jobapplication/${data.id}`)
         } catch (err) {
           console.error(err)
           alert('Could not import job details.')
         } finally {
           setLoading(false)
         }
       }

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8">

        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900">Job Details Extraction</h2>
          <p className="text-gray-500 mt-2">Import job details from any URL in seconds</p>
        </div>

        {/* URL Input */}
        <div className="mb-10">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
            <label className="block text-sm font-medium text-blue-700 mb-3">
              Paste job link:
            </label>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com/jobs/123"
                className="flex-1 px-5 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-shadow shadow-sm"
              />
              <button
                onClick={importJob}
                disabled={loading || !url}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-shadow shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="ml-2">Importing...</span>
                  </>
                ) : (
                  <>
                    <span>Import</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Extracted Job Details */}
        {job && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 border-b border-gray-200 pb-4">
              <h3 className="text-2xl font-bold text-gray-900">Extracted Job Details</h3>
              <span className="mt-3 md:mt-0 bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-semibold">
                Import Successful
              </span>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="w-5 h-5 mr-2 text-indigo-500" />
                  Job Title
                </label>
                <input
                  name="title"
                  defaultValue={job.title}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-shadow shadow-sm"
                />
              </div>

              <div className="flex flex-col">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-5 h-5 mr-2 text-indigo-500" />
                  Company
                </label>
                <input
                  name="company"
                  defaultValue={job.company}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-shadow shadow-sm"
                />
              </div>

              <div className="col-span-full flex flex-col">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-5 h-5 mr-2 text-indigo-500" />
                  Job Description
                </label>
                <textarea
                  name="job_description"
                  defaultValue={job.job_description}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-shadow shadow-sm resize-none"
                />
              </div>

              {/* …other fields */}

              <div className="col-span-full flex justify-end pt-4">
                <button
                  type="submit"
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-shadow shadow-md"
                >
                  Save Job Details
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobExtraction
