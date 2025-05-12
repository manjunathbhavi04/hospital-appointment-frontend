
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">
              <span className="text-hospital-600">Health</span>
              <span className="text-hospital-800">Care</span>
            </h2>
            <p className="text-gray-600">
              Providing quality healthcare services for you and your family.
            </p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-hospital-600">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-hospital-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-hospital-600">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-hospital-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
            <address className="text-gray-600 not-italic">
              <p>123 Hospital Street</p>
              <p>Healthcare City, HC 12345</p>
              <p className="mt-2">Phone: (123) 456-7890</p>
              <p>Email: info@healthcare.com</p>
            </address>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} HealthCare Hospital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
