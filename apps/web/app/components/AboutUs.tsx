"use client";

import { Heart, Users, Lightbulb, TrendingUp, Code, DollarSign, Palette, Megaphone, UserCheck } from "lucide-react";

const AboutUs = () => {
  const team = [
    {
      id: 1,
      name: "Arjun Sharma",
      role: "Co-Founder & COO",
      specialization: "Operations, Technology & Finance",
      description: "Arjun brings 8+ years of experience in educational technology and operations management. He oversees the technical infrastructure, financial planning, and operational efficiency that keeps Vidwanic running smoothly.",
      skills: ["Operations Management", "EdTech", "Financial Planning", "System Architecture"],
      icons: [Code, DollarSign],
      gradient: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      name: "Priya Mehta",
      role: "Co-Founder & Creative Director",
      specialization: "Content, Design & Ideation",
      description: "Priya is the creative force behind Vidwanic's engaging content. With her background in education and design thinking, she ensures every article resonates with students while maintaining educational excellence.",
      skills: ["Content Strategy", "Educational Design", "Creative Direction", "Curriculum Development"],
      icons: [Palette, Lightbulb],
      gradient: "from-pink-500 to-rose-600"
    },
    {
      id: 3,
      name: "Rahul Patel",
      role: "Co-Founder & Growth Lead",
      specialization: "Marketing & User Management",
      description: "Rahul drives Vidwanic's growth and community engagement. His expertise in digital marketing and user experience helps us connect with schools and students across India, building lasting relationships.",
      skills: ["Digital Marketing", "Community Building", "User Experience", "Partnership Development"],
      icons: [Megaphone, UserCheck],
      gradient: "from-green-500 to-teal-600"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Student-Centric",
      description: "Every decision we make starts with asking: 'How will this benefit our students?'"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "We believe education is a collaborative journey between students, teachers, and parents."
    },
    {
      icon: Lightbulb,
      title: "Innovation in Education",
      description: "We constantly seek innovative ways to make learning more engaging and effective."
    },
    {
      icon: TrendingUp,
      title: "Continuous Growth",
      description: "We're committed to evolving with the changing needs of modern education."
    }
  ];

  return (
    <section className="w-full bg-white py-20 md:py-24 lg:py-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-10 w-80 h-80 bg-vidwanic-peach/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-vidwanic-pink/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-vidwanic-orange/10 text-vidwanic-orange font-medium text-sm mb-6">
            <Heart className="w-4 h-4 mr-2" />
            Our Story
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-vidwanic-text mb-6">
            Meet the Team Behind
            <span className="block text-vidwanic-orange">Vidwanic</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            We're three passionate educators and entrepreneurs united by a simple belief: learning should be exciting, 
            accessible, and meaningful for every student.
          </p>
          
          {/* Mission Statement */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-vidwanic-text mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              To transform education by creating engaging, relevant content that bridges the gap between traditional learning 
              and the real world, empowering students to become curious, informed, and confident global citizens.
            </p>
          </div>
        </div>

        {/* Team Members */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-vidwanic-text text-center mb-16">The Founding Team</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {team.map((member) => (
              <div
                key={member.id}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-vidwanic-orange/30 relative overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-r ${member.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                <div className="relative">
                  {/* Avatar */}
                  <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${member.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-2xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  {/* Member Info */}
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-vidwanic-text mb-2 group-hover:text-vidwanic-orange transition-colors duration-300">
                      {member.name}
                    </h4>
                    <p className="text-vidwanic-orange font-semibold mb-2">
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      {member.specialization}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-6">
                    {member.description}
                  </p>

                  {/* Skills */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full group-hover:bg-vidwanic-orange/10 group-hover:text-vidwanic-orange transition-colors duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Icons */}
                  <div className="flex justify-center gap-4">
                    {member.icons.map((Icon, index) => (
                      <div
                        key={index}
                        className={`w-10 h-10 bg-gradient-to-r ${member.gradient} rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-vidwanic-text mb-4">Our Values</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at Vidwanic
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-vidwanic-orange/10 rounded-full flex items-center justify-center">
                  <value.icon className="w-6 h-6 text-vidwanic-orange" />
                </div>
                <h4 className="font-bold text-vidwanic-text mb-2">{value.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Stats */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-vidwanic-text mb-4">Our Journey So Far</h3>
            <p className="text-gray-600">
              From a small idea to impacting thousands of students across India
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-vidwanic-orange mb-2">3</div>
              <div className="text-sm text-gray-600">Years of Impact</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-vidwanic-orange mb-2">500+</div>
              <div className="text-sm text-gray-600">Partner Schools</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-vidwanic-orange mb-2">50k+</div>
              <div className="text-sm text-gray-600">Students Reached</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-vidwanic-orange mb-2">15+</div>
              <div className="text-sm text-gray-600">States Covered</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;