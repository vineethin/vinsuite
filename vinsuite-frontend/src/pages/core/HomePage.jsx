import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const HomePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState("");

  const testimonials = [
    { text: "VinSuite 360 improved our team productivity!", name: "John Doe, CEO of Example Corp." },
    { text: "This tool has streamlined our project management.", name: "Jane Smith, Project Manager" },
  ];

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus("");
    try {
      const res = await fetch("https://your-backend-domain.com/api/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      setContactStatus(text);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setContactStatus("❌ Error sending message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white text-gray-800">
      <header className="bg-white shadow p-6 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-blue-700">VinSuite 360</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            aria-label="Login"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            aria-label="Sign Up"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        variants={fadeInUp}
        className="relative w-full bg-cover bg-center h-auto md:h-screen"
        style={{ backgroundImage: 'url(/assets/vinsuite_homepage_optimized.webp)' }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white py-32 px-4 md:px-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">VinSuite – Making Technology Work for You</h1>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Smart, Simple Digital Tools for Everyone</h2>
          <p className="mb-6 text-lg">From daily productivity to team collaboration, VinSuite brings AI-powered simplicity to your fingertips.</p>
          <button
            onClick={() => navigate('/register')}
            className="bg-red-400 text-white px-6 py-3 rounded shadow-lg hover:bg-red-500 transition"
            aria-label="Get Started"
          >
            Get Started
          </button>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        variants={fadeInUp}
        className="bg-black text-white py-16 px-4"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <img
            src="/assets/mission.jpg"
            alt="mission"
            className="rounded-md shadow-lg md:w-1/2 hover:scale-105 transition-transform"
          />
          <div className="md:w-1/2">
            <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
            <p className="text-lg leading-relaxed">
              At VinSuite 360, we believe smart tools should work for everyone — not just tech experts. 
              Our mission is to bring AI-powered simplicity to your everyday digital tasks, helping individuals 
              and teams save time, stay organized, and get more done with less effort.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Customer Testimonials Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        variants={fadeInUp}
        className="bg-gray-50 py-16 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-semibold mb-4">What Our Customers Say</h3>
          <div className="flex flex-wrap justify-center gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-200 text-gray-600 py-4 px-6 rounded shadow-lg max-w-xs mx-auto">
                <blockquote className="italic">{testimonial.text}</blockquote>
                <footer className="mt-2">- {testimonial.name}</footer>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action (CTA) Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        variants={fadeInUp}
        className="bg-gradient-to-r from-blue-400 to-indigo-500 py-16 px-4 text-center text-white"
      >
        <h2 className="text-4xl font-bold mb-4">Ready to take your business to the next level?</h2>
        <p className="mb-6">Join hundreds of businesses already utilizing our AI-powered tools for seamless productivity.</p>
        <button
          onClick={() => navigate('/register')}
          className="bg-yellow-500 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-yellow-600 transition"
        >
          Get Started Now
        </button>
      </motion.section>

      {/* Contact Us Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        variants={fadeInUp}
        className="bg-white py-16 px-4 border-t"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Contact Us</h3>
          <form className="grid gap-4" onSubmit={handleContactSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleContactChange}
              className="border-b border-gray-400 p-2 outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email*"
              value={formData.email}
              onChange={handleContactChange}
              className="border-b border-gray-400 p-2 outline-none"
              required
            />
            <textarea
              name="message"
              rows="4"
              placeholder="Tell us about your project"
              value={formData.message}
              onChange={handleContactChange}
              className="border-b border-gray-400 p-2 outline-none"
              required
            ></textarea>
            <button type="submit" className="bg-red-400 text-white px-6 py-2 rounded w-fit mx-auto">Send</button>
          </form>
          {contactStatus && (
            <p className="text-sm text-center mt-4 text-gray-700">
              {contactStatus}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-4">
            This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
          </p>
        </div>
      </motion.section>

      {/* Footer Section */}
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        variants={fadeInUp}
        className="bg-gray-200 text-center py-6 text-sm text-gray-600"
      >
        <p>© {new Date().getFullYear()} VinSuite 360. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="https://twitter.com/vinsuite" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition">
            Twitter
          </a>
          <a href="https://linkedin.com/company/vinsuite" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition">
            LinkedIn
          </a>
          <a href="https://github.com/vinsuite" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition">
            GitHub
          </a>
        </div>
      </motion.footer>
    </div>
  );
};

export default HomePage;
