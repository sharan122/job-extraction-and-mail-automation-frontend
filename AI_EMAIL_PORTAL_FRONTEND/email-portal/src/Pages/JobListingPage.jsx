import React, { useState, useEffect } from "react";
import { useViewAllJobs, UserAppliedJobs, useJobApplication } from "../API/api";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from 'lucide-react';

const JobListingPage = () => {
  const jobApplicationMutation = useJobApplication();
  const navigate = useNavigate();
  const { data: jobs } = useViewAllJobs();
  const { data: userjobs } = UserAppliedJobs();
  const [selectedJob, setSelectedJob] = useState(null);
  const [locationFilter, setLocationFilter] = useState("");
  const [activeLocations, setActiveLocations] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (jobs && jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }

    // Extract unique locations for filter
    if (jobs && jobs.length > 0) {
      const uniqueLocations = [...new Set(jobs.map((job) => job.location))];
      setActiveLocations(uniqueLocations);
    }
  }, [jobs, selectedJob]);

  const appliedJobIds = userjobs?.applied_jobs || [];

  const handleJobSelect = (job) => {
    setSelectedJob(job);
  };

  const handleLocationSelect = (location) => {
    setLocationFilter(location);
    setIsFilterOpen(false);
  };

  const clearFilter = () => {
    setLocationFilter("");
  };

  // Filter jobs based on location
  const filteredJobs = jobs
    ? jobs.filter((job) =>
        locationFilter ? job.location === locationFilter : true
      )
    : [];

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container px-4">
        <h2 className="mb-4 fw-bold text-center">Job Opportunities</h2>
        <div className="flex justify-end w-full">
      <a 
        href="/extract" 
        className="flex items-center gap-2 text-blue-600 font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:translate-x-1 group"
      >
        Try our Job Description Extractor
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </div>
        <div className="row gx-4 gy-4">
          {/* Job Listings - Left Panel */}
          <div className="col-lg-5">
            <div className="bg-white rounded-3 shadow-sm h-100">
              <div className="p-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="m-0 fw-bold">Available Positions</h5>
                  <span className="badge bg-primary rounded-pill">
                    {filteredJobs.length || 0} jobs
                  </span>
                </div>

                {/* Location Filter */}
                <div className="position-relative">
                  <div
                    className="form-control d-flex justify-content-between align-items-center cursor-pointer"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center">
                      <i className="bi bi-geo-alt me-2 text-primary"></i>
                      {locationFilter ? (
                        <span>{locationFilter}</span>
                      ) : (
                        <span className="text-secondary">
                          Filter by location
                        </span>
                      )}
                    </div>
                    <div>
                      {locationFilter ? (
                        <button
                          className="btn btn-sm btn-link text-decoration-none p-0 me-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearFilter();
                          }}
                        >
                          <i className="bi bi-x-circle"></i>
                        </button>
                      ) : null}
                      <i
                        className={`bi bi-chevron-${
                          isFilterOpen ? "up" : "down"
                        }`}
                      ></i>
                    </div>
                  </div>

                  {/* Dropdown for locations */}
                  {isFilterOpen && (
                    <div className="position-absolute start-0 end-0 bg-white shadow-sm border rounded-3 mt-1 z-index-dropdown">
                      <div
                        className="p-2"
                        style={{ maxHeight: "200px", overflowY: "auto" }}
                      >
                        {activeLocations.length > 0 ? (
                          activeLocations.map((location, index) => (
                            <div
                              key={index}
                              className="p-2 rounded-2 location-option d-flex align-items-center justify-content-between"
                              onClick={() => handleLocationSelect(location)}
                              style={{ cursor: "pointer" }}
                            >
                              <div className="d-flex align-items-center">
                                <i className="bi bi-geo-alt me-2 text-primary"></i>
                                <span>{location}</span>
                              </div>
                              {locationFilter === location && (
                                <i className="bi bi-check text-primary"></i>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-center text-secondary">
                            No locations available
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="job-list p-3"
                style={{ maxHeight: "65vh", overflowY: "auto" }}
              >
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className={`card mb-3 hover-shadow ${
                        selectedJob && selectedJob.id === job.id
                          ? "border-start border-4 border-primary shadow"
                          : "border-0"
                      }`}
                      onClick={() => handleJobSelect(job)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="mb-1 fw-bold">{job.title}</h5>
                            <p className="mb-1 text-primary">
                              {job.company_name}
                            </p>
                            <div className="d-flex mt-2 align-items-center">
                              <i className="bi bi-geo-alt me-1 text-secondary"></i>
                              <span className="text-secondary">
                                {job.location}
                              </span>
                            </div>
                          </div>
                          {job.is_applied && (
                            <span className="badge bg-success">Applied</span>
                          )}
                        </div>
                        <div className="mt-3 d-flex flex-wrap gap-2">
                          <span className="badge bg-light text-dark">
                            {job.salary}
                          </span>
                          <span className="badge bg-light text-dark">
                            {job.employmentType || "Full-Time"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <i className="bi bi-search fs-2 text-secondary mb-3"></i>
                    <p className="mb-0 text-secondary">
                      {locationFilter
                        ? `No jobs found in ${locationFilter}`
                        : "No jobs available at the moment"}
                    </p>
                    {locationFilter && (
                      <button
                        className="btn btn-outline-primary mt-3 rounded-pill"
                        onClick={clearFilter}
                      >
                        <i className="bi bi-arrow-repeat me-2"></i>
                        Clear filter
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Details - Right Panel */}
          <div className="col-lg-7">
            {selectedJob ? (
              <div className="card border-0 shadow h-100">
                <div className="card-header bg-white p-4 border-0">
                  <div className="row align-items-start">
                    <div className="col-md-8">
                      <h3 className="fw-bold mb-2">{selectedJob.title}</h3>
                      <p className="text-primary mb-2">
                        {selectedJob.company || selectedJob.company_name}
                      </p>
                      <div className="d-flex align-items-center text-secondary mb-2">
                        <i className="bi bi-geo-alt me-2"></i>
                        <span>{selectedJob.location}</span>
                      </div>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        <span className="badge bg-light text-dark">
                          {selectedJob.employmentType || "Full-Time"}
                        </span>
                        <span className="badge bg-light text-dark">
                          {selectedJob.salary}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                      {selectedJob.is_applied ? (
                        <button
                          className="btn btn-success rounded-pill px-4 w-100"
                          disabled
                        >
                          <i className="bi bi-check-circle me-2"></i>Applied
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary rounded-pill px-4 w-100"
                          onClick={() => {
                            jobApplicationMutation.mutate(selectedJob.id);
                            navigate(`/jobapplication/${selectedJob.id}`);
                          }}
                        >
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="card-body p-4">
                  <div className="row mb-4 g-3">
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded-3 h-100">
                        <div className="d-flex align-items-center mb-2">
                          <div className="bg-white p-2 rounded-circle me-3 text-primary">
                            <i className="bi bi-currency-dollar"></i>
                          </div>
                          <h6 className="fw-bold m-0">Compensation</h6>
                        </div>
                        <p className="m-0">
                          {selectedJob.salary || "Competitive salary"}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded-3 h-100">
                        <div className="d-flex align-items-center mb-2">
                          <div className="bg-white p-2 rounded-circle me-3 text-primary">
                            <i className="bi bi-briefcase"></i>
                          </div>
                          <h6 className="fw-bold m-0">Job Type</h6>
                        </div>
                        <p className="m-0">
                          {selectedJob.employmentType || "Full-Time"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="job-details mb-4">
                    <h5 className="fw-bold mb-3">Job Description</h5>
                    <p className="text-secondary mb-4">
                      {selectedJob.job_description ||
                        "We are seeking a talented professional to join our dynamic team. This role offers competitive compensation and excellent growth opportunities."}
                    </p>

                    <h5 className="fw-bold mb-3">Key Responsibilities</h5>
                    <ul className="text-secondary ps-4">
                      {selectedJob.responsibilities ? (
                        selectedJob.responsibilities.map((resp, index) => (
                          <li key={index} className="mb-2">
                            {resp}
                          </li>
                        ))
                      ) : (
                        <>
                          <li className="mb-2">
                            Work collaboratively with cross-functional teams
                          </li>
                          <li className="mb-2">
                            Contribute to project planning and execution
                          </li>
                          <li className="mb-2">
                            Deliver high-quality results within deadlines
                          </li>
                          <li className="mb-2">
                            Maintain professional communication with
                            stakeholders
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="card-footer bg-white p-4 border-top text-center">
                  {selectedJob.is_applied ? (
                    <p className="mb-0 text-success fw-bold">
                      <i className="bi bi-check-circle me-2"></i>
                      You have already applied for this position
                    </p>
                  ) : (
                    <button
                      className="btn btn-primary px-5 py-2 rounded-pill"
                      onClick={() => {
                        jobApplicationMutation.mutate(selectedJob.id);
                        navigate(`/jobapplication/${selectedJob.id}`);
                      }}
                    >
                      <i className="bi bi-send me-2"></i>
                      Submit Application
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3 shadow h-100 d-flex flex-column justify-content-center align-items-center p-5">
                <div className="text-center">
                  <i className="bi bi-file-earmark-text fs-1 text-secondary mb-4"></i>
                  <h4>Select a Job</h4>
                  <p className="text-secondary">
                    Click on any job listing to view detailed information
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add some custom CSS for hover effects */}
      <style jsx>{`
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }

        .location-option:hover {
          background-color: #f8f9fa;
        }

        .z-index-dropdown {
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

export default JobListingPage;