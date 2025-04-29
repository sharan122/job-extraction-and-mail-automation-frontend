import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaEnvelope, FaRobot, FaCheckCircle, FaBriefcase, FaCog, FaCode } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

  return (
    <div>
      {/* Hero Section with Gradient Background */}
      <section className="hero position-relative d-flex align-items-center justify-content-center text-center min-vh-80" style={{ minHeight: "80vh" }}>
        <div 
          className="overlay position-absolute w-100 h-100" 
          style={{ 
            background: "linear-gradient(135deg, rgba(37, 34, 206, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)",
            zIndex: -1 
          }}
        ></div>
        
        <Container className="position-relative py-5">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="display-3 text-light fw-bold mb-4"
          >
            AI-Powered Email Portal
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="lead text-light mb-5 mx-auto"
            style={{ maxWidth: "700px", fontSize: "1.25rem" }}
          >
            Discover job opportunities from newly funded companies and send perfectly crafted application emails with our AI technology.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="d-flex justify-content-center gap-3"
          >
            {user ? (
              <Button 
                onClick={() => navigate('/joblist')} 
                variant="light" 
                size="lg" 
                className="rounded-pill px-4 fw-bold"
              >
                Get Started
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => navigate('/login')} 
                  variant="light" 
                  size="lg" 
                  className="rounded-pill px-4 fw-bold"
                >
                  Get Started
                </Button>
                <Button 
                  onClick={() => navigate('/register')} 
                  variant="outline-light" 
                  size="lg" 
                  className="rounded-pill px-4"
                >
                  Create Account
                </Button>
              </>
            )}
          </motion.div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features py-5">
        <Container>
          <motion.div 
            className="text-center mb-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="badge bg-primary text-white px-3 py-2 mb-3">FEATURES</span>
            <h2 className="display-5 fw-bold">Everything You Need</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
              Our platform combines AI technology with job market insights to help you land your dream job faster.
            </p>
          </motion.div>
          
          <Row className="g-4">
            <Col lg={4} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-100 border-0 shadow-sm rounded-lg transition-all hover-shadow">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                        <FaBriefcase size={28} className="text-primary" />
                      </div>
                      <h4 className="fw-bold mb-0">Latest Job Openings</h4>
                    </div>
                    <p className="text-muted mb-0">Discover exclusive job opportunities from newly funded companies with high growth potential.</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            
            <Col lg={4} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-100 border-0 shadow-sm rounded-lg transition-all hover-shadow">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                        <FaRobot size={28} className="text-primary" />
                      </div>
                      <h4 className="fw-bold mb-0">AI-Powered Emails</h4>
                    </div>
                    <p className="text-muted mb-0">Generate personalized and effective emails using OpenAI API technology.</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            
            <Col lg={4} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="h-100 border-0 shadow-sm rounded-lg transition-all hover-shadow">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                        <FaCode size={28} className="text-primary" />
                      </div>
                      <h4 className="fw-bold mb-0">Job Detail Extraction</h4>
                    </div>
                    <p className="text-muted mb-0">Automatically extract job details from listings to create targeted application emails.</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            
            <Col lg={4} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Card className="h-100 border-0 shadow-sm rounded-lg transition-all hover-shadow">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                        <FaEnvelope size={28} className="text-primary" />
                      </div>
                      <h4 className="fw-bold mb-0">Customizable Prompts</h4>
                    </div>
                    <p className="text-muted mb-0">Fine-tune email generation with customizable prompts to match your personal style.</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            
            <Col lg={4} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="h-100 border-0 shadow-sm rounded-lg transition-all hover-shadow">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                        <FaCog size={28} className="text-primary" />
                      </div>
                      <h4 className="fw-bold mb-0">SMTP Settings</h4>
                    </div>
                    <p className="text-muted mb-0">Configure multiple email accounts to send your applications from different addresses.</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            
            <Col lg={4} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="h-100 border-0 shadow-sm rounded-lg transition-all hover-shadow">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                        <FaCheckCircle size={28} className="text-primary" />
                      </div>
                      <h4 className="fw-bold mb-0">Optimized for Success</h4>
                    </div>
                    <p className="text-muted mb-0">Increase response rates with AI-driven job opportunity emails tailored to each position.</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call To Action */}
      <section className="cta py-5" style={{ background: "linear-gradient(135deg, rgba(37, 34, 206, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)" }}>
        <Container>
          <motion.div 
            className="text-center py-5"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="display-5 fw-bold text-white mb-4">Ready to Transform Your Job Search?</h2>
            <p className="lead text-white opacity-80 mb-5 mx-auto" style={{ maxWidth: "700px" }}>
              Start sending personalized, AI-powered application emails today and stand out from the competition.
            </p>
            <Button 
              onClick={() => user ? navigate('/joblist') : navigate('/login')} 
              variant="light" 
              size="lg" 
              className="rounded-pill px-5 py-3 fw-bold"
            >
              {user ? "Go to Dashboard" : "Get Started Now"}
            </Button>
          </motion.div>
        </Container>
      </section>

      {/* Add custom styles */}
      <style jsx>{`
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        .min-vh-80 {
          min-height: 80vh;
        }
      `}</style>
    </div>
  );
}