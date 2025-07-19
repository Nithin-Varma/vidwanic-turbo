import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample publications
  const publications = [
    {
      title: "The Future of Learning",
      description: "This month's issue explores how technology is reshaping education, career opportunities in emerging fields, financial literacy for students, and inspiring stories of young innovators making a difference in their communities.",
      shortDesc: "Explore how technology is transforming education and discover career opportunities in emerging fields.",
      price: 299,
      suitableFor: "Class 9-12 Students",
      totalPurchases: 1250,
      schoolPurchases: 45,
    },
    {
      title: "Science Wonders",
      description: "Dive deep into the fascinating world of science with breakthrough discoveries, space exploration updates, environmental conservation tips, and fun experiments you can try at home.",
      shortDesc: "Discover amazing scientific breakthroughs and space exploration updates.",
      price: 249,
      suitableFor: "Class 6-10 Students", 
      totalPurchases: 980,
      schoolPurchases: 32,
    },
    {
      title: "Career Compass",
      description: "Navigate your future with comprehensive career guidance, skill development tips, interview preparation, scholarship opportunities, and success stories from young achievers.",
      shortDesc: "Your complete guide to career planning and skill development.",
      price: 199,
      suitableFor: "Class 10-12 Students",
      totalPurchases: 750,
      schoolPurchases: 28,
    },
    {
      title: "Digital Age Learning",
      description: "Master the digital world with coding tutorials, digital literacy, online safety, artificial intelligence basics, and how to leverage technology for better learning outcomes.",
      shortDesc: "Learn coding, AI basics, and digital literacy skills.",
      price: 349,
      suitableFor: "Class 8-12 Students",
      totalPurchases: 620,
      schoolPurchases: 25,
    },
    {
      title: "Environmental Heroes",
      description: "Join the fight for our planet with climate change awareness, sustainable living practices, conservation projects, renewable energy insights, and youth environmental activism.",
      shortDesc: "Learn about climate change and become an environmental champion.",
      price: 229,
      suitableFor: "Class 5-9 Students",
      totalPurchases: 890,
      schoolPurchases: 38,
    },
    {
      title: "Innovation Station",
      description: "Spark your creativity with invention stories, startup basics, design thinking, problem-solving techniques, and profiles of young entrepreneurs changing the world.",
      shortDesc: "Discover the world of innovation and entrepreneurship.",
      price: 279,
      suitableFor: "Class 9-12 Students",
      totalPurchases: 540,
      schoolPurchases: 22,
    },
    {
      title: "Health & Wellness",
      description: "Build healthy habits with nutrition guides, mental health awareness, fitness routines for students, stress management techniques, and the importance of work-life balance.",
      shortDesc: "Your guide to physical and mental well-being.",
      price: 199,
      suitableFor: "All Students",
      totalPurchases: 1100,
      schoolPurchases: 42,
    },
    {
      title: "Global Perspectives",
      description: "Expand your worldview with international news analysis, cultural exchanges, global citizenship concepts, language learning tips, and stories from students around the world.",
      shortDesc: "Explore cultures and develop a global mindset.",
      price: 259,
      suitableFor: "Class 7-12 Students",
      totalPurchases: 430,
      schoolPurchases: 18,
    }
  ];

  console.log('📚 Creating publications...');
  
  for (const pub of publications) {
    const created = await prisma.magazine.create({
      data: pub,
    });
    console.log(`✅ Created publication: ${created.title}`);
  }

  // Create a sample user for comments
  console.log('👤 Creating sample user...');
  const sampleUser = await prisma.user.create({
    data: {
      name: 'Sample Student',
      email: 'student@example.com',
    },
  });

  // Get all created publications
  const allPublications = await prisma.magazine.findMany();

  // Create sample comments
  console.log('💬 Creating sample comments...');
  const sampleComments = [
    "This issue was incredibly insightful! The section on emerging technologies really opened my eyes to future career possibilities.",
    "Great content as always. The practical tips and real-world examples make complex topics easy to understand.",
    "I love how this magazine balances theoretical knowledge with practical applications. Perfect for students like me!",
    "The writing style is engaging and the topics are very relevant to what we're studying in school.",
    "This helped me understand complex concepts better than my textbooks. Highly recommended!",
    "Amazing issue! The career guidance section was particularly helpful for planning my future.",
    "The interactive elements and illustrations make learning so much more enjoyable.",
    "Perfect blend of educational content and entertainment. Keep up the great work!"
  ];

  for (let i = 0; i < allPublications.length; i++) {
    const publication = allPublications[i];
    const numComments = Math.floor(Math.random() * 3) + 1; // 1-3 comments per publication

    for (let j = 0; j < numComments; j++) {
      const randomComment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
      
      await prisma.comment.create({
        data: {
          content: randomComment,
          userId: sampleUser.id,
          magazineId: publication.id,
        },
      });
    }
    
    console.log(`✅ Added ${numComments} comments to: ${publication.title}`);
  }

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });