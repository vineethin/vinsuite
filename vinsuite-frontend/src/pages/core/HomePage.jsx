import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white text-gray-800">
      <header className="bg-white shadow p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">VinSuite 360</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Sign Up
          </button>
        </div>
      </header>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        variants={fadeInUp}
        className="text-center py-16 px-4 bg-black text-white"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 text-left">
            <h2 className="text-5xl font-bold mb-4">Innovative IT Solutions for Your Business</h2>
            <p className="mb-6">Empowering your business with cutting-edge IT services and AI-powered productivity tools.</p>
            <button onClick={() => navigate('/register')} className="bg-red-400 text-white px-5 py-2 rounded">Get Started</button>
          </div>
          <img
            src="https://images.pexels.com/photos/1181335/pexels-photo-1181335.jpeg"
            alt="team working"
            className="rounded-md shadow-lg md:w-1/2"
          />
        </div>
      </motion.section>

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
            src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg"
            alt="mission"
            className="rounded-md shadow-lg md:w-1/2"
          />
          <div className="md:w-1/2">
            <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
            <p>
              At VinSuite 360, our mission is to deliver innovative IT solutions that empower teams to thrive in the digital age. We focus on providing AI-powered, high-quality services that meet the evolving needs of developers, testers, DBAs, and project leaders.
            </p>
          </div>
        </div>
      </motion.section>

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
          <div className="bg-gray-200 text-gray-600 py-4 px-6 rounded shadow inline-block">
            Reviews coming soon!
          </div>
        </div>
      </motion.section>

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
          <form className="grid gap-4">
            <input
              type="text"
              placeholder="Name"
              className="border-b border-gray-400 p-2 outline-none"
            />
            <input
              type="email"
              placeholder="Email*"
              className="border-b border-gray-400 p-2 outline-none"
            />
            <textarea
              rows="4"
              placeholder="Tell us about your project"
              className="border-b border-gray-400 p-2 outline-none"
            ></textarea>
            <button className="bg-red-400 text-white px-6 py-2 rounded w-fit mx-auto">Send</button>
          </form>
          <p className="text-xs text-gray-400 mt-4">
            This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
          </p>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        variants={fadeInUp}
        className="bg-gray-100 py-12 px-4 text-center text-gray-700"
      >
        <h4 className="text-lg font-semibold mb-2">Questions or Comments?</h4>
        <p className="mb-6">
          We know that our clients have unique needs. Send us a message, and we will get back to you soon.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
          <div>
            <h5 className="text-lg font-bold mb-2">Vinsuite 360</h5>
          </div>
          <div>
            <h5 className="text-lg font-bold mb-2">Hours</h5>
            <ul className="text-sm">
              <li>Mon - Fri: 09:00 am – 05:00 pm</li>
              <li>Sat - Sun: Closed</li>
            </ul>
          </div>
        </div>
      </motion.section>

      <footer className="bg-gray-200 text-center py-6 text-sm text-gray-600">
        © {new Date().getFullYear()} VinSuite 360. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;