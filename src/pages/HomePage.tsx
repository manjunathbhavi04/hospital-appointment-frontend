
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Phone, Calendar, Clock, MapPin, Heart, CheckCircle } from "lucide-react";

export default function HomePage() {
  const services = [
    {
      icon: <Heart className="h-10 w-10 text-hospital-600" />,
      title: "Cardiology",
      description: "Expert care for heart conditions with advanced diagnostic and treatment options."
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-hospital-600" />,
      title: "General Check-ups",
      description: "Comprehensive health assessments to keep you in optimal health."
    },
    {
      icon: <Calendar className="h-10 w-10 text-hospital-600" />,
      title: "Specialized Care",
      description: "Specialized medical services tailored to your specific health needs."
    }
  ];
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-hospital-800 to-hospital-600 text-white">
        <div className="max-w-screen-xl mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Your Health Is Our Priority</h1>
          <p className="text-xl max-w-2xl mb-8">
            Providing exceptional care with compassion and expertise. Our team of professionals is dedicated to your wellbeing.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/appointments">
              <Button size="lg" className="bg-white text-hospital-600 hover:bg-gray-100">
                Book Appointment
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-12 bg-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <Phone className="h-6 w-6 text-hospital-600 mt-1 mr-4" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Emergency Contact</h3>
                <p className="text-gray-600">(123) 456-7890</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="h-6 w-6 text-hospital-600 mt-1 mr-4" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Working Hours</h3>
                <p className="text-gray-600">Mon-Fri: 8:00 AM - 8:00 PM</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-hospital-600 mt-1 mr-4" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Location</h3>
                <p className="text-gray-600">123 Hospital Street, Healthcare City</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We offer a wide range of medical services to meet all your healthcare needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-hospital-600 text-white">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our healthcare professionals are ready to help you. Book an appointment today.
          </p>
          <Link to="/appointments">
            <Button size="lg" className="bg-white text-hospital-600 hover:bg-gray-100">
              Book Appointment
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
