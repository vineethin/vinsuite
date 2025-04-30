import React, { useState } from 'react';
import axios from 'axios';

const DefectPredictor = () => {
  const [formData, setFormData] = useState({
    change_size: '',
    severity_score: '',
    days_since_commit: '',
    component: '',
    developer: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const components = ['Login Module', 'Payment Module', 'User Profile', 'Dashboard', 'Reporting'];
  const developers = ['Dev1', 'Dev2', 'Dev3', 'Dev4'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict-defect', formData);
      setResult(response.data);
    } catch (error) {
      alert('❌ Prediction failed. Please check backend connection.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 shadow-xl rounded-2xl bg-white mt-10">
      <h2 className="text-2xl font-semibold mb-4">AI Defect Risk Predictor</h2>

      <input name="change_size" type="number" placeholder="Change Size" value={formData.change_size} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
      <input name="severity_score" type="number" placeholder="Severity Score (1–4)" value={formData.severity_score} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />
      <input name="days_since_commit" type="number" placeholder="Days Since Commit" value={formData.days_since_commit} onChange={handleChange} className="w-full p-2 mb-2 border rounded" />

      <select name="component" value={formData.component} onChange={handleChange} className="w-full p-2 mb-2 border rounded">
        <option value="">Select Component</option>
        {components.map(comp => <option key={comp} value={comp}>{comp}</option>)}
      </select>

      <select name="developer" value={formData.developer} onChange={handleChange} className="w-full p-2 mb-4 border rounded">
        <option value="">Select Developer</option>
        {developers.map(dev => <option key={dev} value={dev}>{dev}</option>)}
      </select>

      <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {loading ? 'Predicting...' : 'Predict'}
      </button>

      {result && (
        <div className="mt-6 p-4 border-t">
          <p className="text-lg font-bold">Defect Risk Score: {result.defect_risk_score}%</p>
          <p className={`text-md ${result.recommendation === 'High Risk' ? 'text-red-600' : 'text-green-600'}`}>
            Recommendation: {result.recommendation}
          </p>
        </div>
      )}
    </div>
  );
};

export default DefectPredictor;
