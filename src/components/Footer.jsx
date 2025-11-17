
import { FaFacebookF, FaInstagram, } from 'react-icons/fa';
export default function Footer() {
  return (
    <footer className="bg-grey-300 border-t border-gray-200 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Quick Links Section */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Know More About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Visit Store</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Let's Connect</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Locate Stores</a></li>
            </ul>
          </div>

          {/* Policies Section */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Policies</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Refund Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="" className="bg-gray-200 p-2 rounded-full hover:bg-green-500 hover:text-white transition-colors">
                <FaFacebookF />
              </a>
              <a href="https://www.instagram.com/delightico/?hl=en" className="bg-gray-200 p-2 rounded-full hover:bg-green-500 hover:text-white transition-colors">
                <FaInstagram />
              </a>
              
            </div>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Newsletter</h3>
            <p className="text-gray-600 text-sm mb-3">Subscribe for updates</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 pt-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Taste the health in every bite!!
          </h2>
          <p className="text-gray-600">
            Copyright © {new Date().getFullYear()} | Delightico
          </p>
        </div>
      </div>
    </footer>
  );
}