import React from "react";
import { Container, Card, Spinner, Alert } from "react-bootstrap";
import { UserAppliedJobs } from "../API/api";

const AppliedJobsPage = () => {
  const {
    data: appliedJobsData,
    isLoading,
    error,
  } = UserAppliedJobs();

  if (isLoading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">Error loading applied jobs.</Alert>;

  const appliedJobs = appliedJobsData?.applied_jobs || [];

  return (
    <Container className="mt-4">
      <h2>Applied Jobs</h2>
      {appliedJobs.length === 0 ? (
        <Alert variant="info">You haven't applied for any jobs yet.</Alert>
      ) : (
        appliedJobs.map((job) => (
          <Card key={job.id} className="mb-3">
            <Card.Body>
              <Card.Title>{job.title}</Card.Title>
              <Card.Text>{job.job_description}</Card.Text>
              <Card.Text>
                <strong>Company:</strong> {job.company_name}
              </Card.Text>
              <Card.Text>
                <strong>Location:</strong> {job.location}
              </Card.Text>
              <div className="text-success fw-bold">
                <i className="bi bi-check-circle me-2"></i>Applied
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default AppliedJobsPage;
