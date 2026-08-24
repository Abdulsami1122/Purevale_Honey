import React from 'react';
import { Microscope, FileCheck, Leaf } from 'lucide-react';
import './QualitySection.css';

const QualitySection = () => {
  return (
    <section className="section bg-white" id="quality">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">Uncompromising Quality</h2>
          <p className="section-subtitle">Tested, Certified, Trusted.</p>
        </div>
        
        <div className="quality-grid">
          <div className="quality-card">
            <div className="quality-icon-wrapper">
              <Microscope size={40} />
            </div>
            <h3>Laboratory Testing</h3>
            <p>Every batch undergoes rigorous independent lab testing for purity, pollen count, and absence of adulterants, meeting strict FDA and FSA standards.</p>
          </div>
          
          <div className="quality-card">
            <div className="quality-icon-wrapper">
              <FileCheck size={40} />
            </div>
            <h3>Export Documentation</h3>
            <p>We provide comprehensive Certificates of Analysis (COA), phytosanitary certificates, and full traceability documentation for seamless customs clearance.</p>
          </div>
          
          <div className="quality-card">
            <div className="quality-icon-wrapper">
              <Leaf size={40} />
            </div>
            <h3>Sustainable Sourcing</h3>
            <p>Our ethical harvesting practices protect local ecosystems and support rural beekeepers and farmers, ensuring long-term sustainability.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QualitySection;
