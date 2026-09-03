import React, { useState } from 'react';
import { PackageOpen, Ship, ShieldCheck, Handshake } from 'lucide-react';
import api from '../lib/api';
import './WholesaleExport.css';

const WholesaleExport = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    destination: '',
    product: '',
    message: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      await api.submitExportInquiry(formData);
      setStatus('success');
      setFormData({ companyName: '', email: '', destination: '', product: '', message: '' });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setStatus('error');
    }
  };

  return (
    <section className="section bg-green text-cream" id="wholesale">
      <div className="container">
        <div className="wholesale-layout">
          <div className="wholesale-content">
            <h2 className="wholesale-title">Wholesale & Export</h2>
            <p className="wholesale-desc">
              We specialize in bulk exports to the USA, UK, and worldwide. Whether you need bulk ingredients for restaurants, retail-ready packaged goods, or private labeling solutions, Durrani Harvest is your trusted international partner.
            </p>
            
            <div className="wholesale-features">
              <div className="feature-item">
                <PackageOpen className="feature-icon" size={32} />
                <div>
                  <h4>Bulk Options</h4>
                  <p>Available in 5kg, 10kg, 25kg, and industrial drums.</p>
                </div>
              </div>
              
              <div className="feature-item">
                <Ship className="feature-icon" size={32} />
                <div>
                  <h4>Global Shipping</h4>
                  <p>Reliable logistics partners for USA & UK deliveries.</p>
                </div>
              </div>

              <div className="feature-item">
                <Handshake className="feature-icon" size={32} />
                <div>
                  <h4>Private Label</h4>
                  <p>Custom packaging and labeling for your own brand.</p>
                </div>
              </div>
            </div>

            <button className="btn btn-gold mt-4">Request Export Catalog</button>
          </div>
          
          <div className="wholesale-form-card text-dark">
            <h3>Export Inquiry</h3>
            <form className="export-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" required />
              </div>
              <div className="form-group">
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required />
              </div>
              <div className="form-group">
                <select name="destination" value={formData.destination} onChange={handleChange} required>
                  <option value="" disabled>Destination Country</option>
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="other">Other / Worldwide</option>
                </select>
              </div>
              <div className="form-group">
                <select name="product" value={formData.product} onChange={handleChange} required>
                  <option value="" disabled>Product of Interest</option>
                  <option value="honey">Pure Raw Honey</option>
                  <option value="jaggery">Natural Jaggery</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="form-group">
                <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message / Requirements (e.g. estimated monthly volume)" rows="4"></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending...' : 'Send Inquiry'}
              </button>
              {status === 'success' && <p style={{color: 'green', marginTop: '1rem', textAlign: 'center'}}>Inquiry sent successfully!</p>}
              {status === 'error' && <p style={{color: 'red', marginTop: '1rem', textAlign: 'center'}}>Failed to send inquiry. Please try again.</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WholesaleExport;
