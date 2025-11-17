import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";

export default function Contact() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Are your products 100% organic?",
      answer:
        "Yes, all our products are certified organic and made using natural ingredients without any artificial preservatives.",
    },
    {
      question: "Do you ship across India?",
      answer:
        "Absolutely! We deliver our healthy products to all major cities and towns across India.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is shipped, you'll receive an email with a tracking link to follow your package in real time.",
    },
    {
      question: "Can I return a product if I'm not satisfied?",
      answer:
        "Yes, we offer a hassle-free return policy. Contact our support team within 7 days of delivery.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[#faf8f5] min-h-screen flex flex-col items-center">
      {/* --- Contact Header --- */}
      <section className="text-center py-16">
        <h1 
          className="text-4xl font-bold text-gray-900 mb-2 transform transition-all duration-700 hover:scale-105"
          style={{
            animation: "fadeInDown 0.8s ease-out"
          }}
        >
          Get in Touch
        </h1>
        <p 
          className="text-gray-600 text-lg transform transition-all duration-700 delay-200"
          style={{
            animation: "fadeInUp 0.8s ease-out 0.2s both"
          }}
        >
          We'd love to hear from you — reach out anytime!
        </p>
      </section>

      {/* --- Contact Info Cards --- */}
      <section 
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-xl p-10 mx-auto flex flex-col items-center -mt-8 transform transition-all duration-1000"
        style={{
          animation: "slideUpFade 1s ease-out 0.3s both"
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 w-full">
          {/* Phone */}
          <div 
            className="flex flex-col items-center justify-center border rounded-lg p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-green-200 cursor-pointer group"
            style={{
              animation: "fadeInLeft 0.8s ease-out 0.5s both"
            }}
          >
            <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
              <FaPhoneAlt className="text-green-500 text-3xl mb-3" />
            </div>
            <p className="text-gray-700 font-medium transition-colors duration-300 group-hover:text-green-600">
              +91 91488 68051
            </p>
          </div>

          {/* Email */}
          <div 
            className="flex flex-col items-center justify-center border rounded-lg p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-green-200 cursor-pointer group"
            style={{
              animation: "fadeInUp 0.8s ease-out 0.7s both"
            }}
          >
            <div className="transform transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12">
              <FaEnvelope className="text-green-500 text-3xl mb-3" />
            </div>
            <p className="text-gray-700 font-medium transition-colors duration-300 group-hover:text-green-600">
              delightico468@gmail.com
            </p>
          </div>

          {/* Address */}
          <div 
            className="flex flex-col items-center justify-center border rounded-lg p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-green-200 cursor-pointer group"
            style={{
              animation: "fadeInRight 0.8s ease-out 0.9s both"
            }}
          >
            <div className="transform transition-all duration-300 group-hover:scale-110">
              <FaMapMarkerAlt className="text-green-500 text-3xl mb-3" />
            </div>
            <p className="text-gray-700 font-medium transition-colors duration-300 group-hover:text-green-600 text-center">
              132 AECS Layout <br />
              ITPL Main Road, Kundalahalli <br />
              Bangalore 560037, India
            </p>
          </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section 
        className="w-full max-w-4xl mt-20 mb-20 px-6 transform transition-all duration-1000"
        style={{
          animation: "fadeIn 1s ease-out 1.1s both"
        }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 transform transition-all duration-500 hover:scale-105">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => toggleFAQ(index)}
              style={{
                animation: `slideInRight 0.6s ease-out ${1.2 + index * 0.1}s both`
              }}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 text-lg transition-colors duration-300 group-hover:text-green-700">
                  {faq.question}
                </h3>
                <span className="text-green-600 text-xl transform transition-transform duration-300">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>
              {openIndex === index && (
                <div 
                  className="overflow-hidden"
                  style={{
                    animation: "slideDown 0.4s ease-out"
                  }}
                >
                  <p className="mt-2 text-gray-600 text-sm transform transition-all duration-500">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 100px;
          }
        }
      `}</style>
    </div>
  );
}