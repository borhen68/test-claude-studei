import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Heart, Users, Sparkles, Award } from 'lucide-react';

export const metadata = {
  title: 'About Us - Frametale',
  description: 'Learn about our mission to help families preserve their precious memories through beautiful photo books.',
};

export default function AboutPage() {
  const team = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      image: '/images/team/sarah.jpg',
      bio: 'Former photographer turned entrepreneur',
    },
    {
      name: 'Mike Rodriguez',
      role: 'CTO',
      image: '/images/team/mike.jpg',
      bio: 'AI and machine learning specialist',
    },
    {
      name: 'Emily Zhang',
      role: 'Head of Design',
      image: '/images/team/emily.jpg',
      bio: 'Award-winning book designer',
    },
    {
      name: 'David Kim',
      role: 'Operations Director',
      image: '/images/team/david.jpg',
      bio: 'Logistics and fulfillment expert',
    },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Quality First',
      description: 'We never compromise on print quality or materials. Every book is crafted with care.',
    },
    {
      icon: Users,
      title: 'Customer Focused',
      description: 'Your satisfaction is our priority. We listen, adapt, and continuously improve.',
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'Leveraging AI and technology to make photo book creation effortless.',
    },
    {
      icon: Award,
      title: 'Sustainability',
      description: 'Eco-friendly materials and carbon-neutral shipping for a better planet.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Preserving Memories, One Book at a Time
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We believe every photo tells a story, and every story deserves to be
            beautifully preserved for generations to come.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg text-gray-600">
            <p>
              Frametale was born from a simple frustration: thousands of photos
              sitting on phones and hard drives, never to be seen again. Our
              founder, Sarah, watched her grandmother flip through old photo
              albums with such joy, while her own children barely looked at
              digital photos on screens.
            </p>
            <p>
              That's when we realized the problem wasn't that people don't want
              physical photo books—it's that creating them was too time-consuming
              and complicated. So we set out to change that.
            </p>
            <p>
              By combining AI technology with professional design principles, we
              created a platform that makes beautiful photo books in minutes, not
              hours. Upload your photos, let our AI organize them into stunning
              layouts, and receive a professionally printed book at your door.
            </p>
            <p>
              Today, we've helped over 50,000 families preserve their memories.
              Every review, every thank-you message, and every photo of families
              enjoying their books reminds us why we do this.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Preserve Your Memories?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of families who trust Frametale with their precious
            moments.
          </p>
          <a
            href="/upload"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all"
          >
            Create Your Book
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
