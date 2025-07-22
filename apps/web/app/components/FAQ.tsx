"use client";

import { HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I subscribe for my school?",
      answer: "Contact us with your school details and student count. We'll provide a customized package that fits your needs and budget."
    },
    {
      question: "What age groups does Vidwanic serve?",
      answer: "Our content is designed for students aged 8-18, with different sections tailored for different age groups and academic levels."
    },
    {
      question: "Can I get a sample issue?",
      answer: "Yes! Contact us to receive a free sample issue to evaluate our content quality and see if it fits your educational requirements."
    },
    {
      question: "How often are new issues published?",
      answer: "Vidwanic is published monthly, ensuring fresh and relevant content that keeps up with current educational trends and topics."
    },
    {
      question: "Is the content aligned with curriculum standards?",
      answer: "Yes, our content is carefully crafted to complement various curriculum standards while making learning engaging and fun."
    },
    {
      question: "Do you offer bulk discounts for schools?",
      answer: "Absolutely! We provide special pricing for schools and educational institutions. Contact us for a customized quote based on your requirements."
    }
  ];

  return (
    <section className="w-full bg-white py-20 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-vidwanic-orange/10 text-vidwanic-orange font-medium text-sm mb-6">
            <HelpCircle className="w-4 h-4 mr-2" />
            Got Questions?
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-vidwanic-text mb-6">
            Frequently Asked
            <span className="block text-vidwanic-orange">Questions</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Can't find what you're looking for? Here are answers to the most common questions about Vidwanic.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="group bg-gray-50 hover:bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-vidwanic-orange/30"
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-vidwanic-orange/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-vidwanic-orange/20 transition-colors duration-300">
                  <HelpCircle className="w-6 h-6 text-vidwanic-orange" />
                </div>
                <h3 className="text-xl font-bold text-vidwanic-text mb-3 group-hover:text-vidwanic-orange transition-colors duration-300">
                  {faq.question}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-vidwanic-background rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-vidwanic-text mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our team is here to help! Get in touch with us and we'll respond within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@vidwanic.com"
                className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-8 py-3 rounded-full transition-all duration-200"
              >
                Email Us
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-vidwanic-orange text-vidwanic-orange hover:bg-vidwanic-orange hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-200"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;