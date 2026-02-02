import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';

dotenv.config();

const coursesData = {
  'Cybersecurity': [
    {
      title: 'Cybersecurity Fundamentals',
      shortDescription: 'Learn the basics of cybersecurity, threats, and protection techniques',
      description: 'Comprehensive introduction to cybersecurity covering network security, cryptography, ethical hacking basics, and security best practices. Perfect for beginners interested in cybersecurity careers.',
      level: 'Beginner',
      language: 'English',
      actualPrice: 3499,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Cybersecurity fundamentals',
        'Network security basics',
        'Cryptography essentials',
        'Common security threats',
        'Security best practices'
      ],
      lessons: [
        { title: 'Introduction to Cybersecurity', description: 'Overview of cybersecurity landscape', duration: 35, order: 1, isFree: true },
        { title: 'Network Security Basics', description: 'Understanding network protocols and security', duration: 45, order: 2, isFree: true },
        { title: 'Cryptography Fundamentals', description: 'Encryption and decryption techniques', duration: 50, order: 3, isFree: false },
        { title: 'Common Cyber Threats', description: 'Understanding malware, phishing, and attacks', duration: 40, order: 4, isFree: false },
        { title: 'Security Best Practices', description: 'Implementing security measures', duration: 45, order: 5, isFree: false }
      ]
    },
    {
      title: 'Ethical Hacking Complete Course',
      shortDescription: 'Learn ethical hacking and penetration testing techniques',
      description: 'Master ethical hacking with hands-on penetration testing. Learn to identify vulnerabilities, perform security audits, and protect systems from cyber attacks.',
      level: 'Intermediate',
      language: 'English',
      actualPrice: 4999,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Ethical hacking fundamentals',
        'Penetration testing methodology',
        'Vulnerability assessment',
        'Web application security',
        'Network penetration testing'
      ],
      lessons: [
        { title: 'Ethical Hacking Introduction', description: 'Understanding ethical hacking', duration: 30, order: 1, isFree: true },
        { title: 'Information Gathering', description: 'Reconnaissance techniques', duration: 45, order: 2, isFree: true },
        { title: 'Scanning and Enumeration', description: 'Network scanning methods', duration: 55, order: 3, isFree: false },
        { title: 'Exploitation Techniques', description: 'Exploiting vulnerabilities', duration: 60, order: 4, isFree: false },
        { title: 'Post-Exploitation', description: 'Maintaining access and reporting', duration: 50, order: 5, isFree: false }
      ]
    },
    {
      title: 'Network Security & Firewalls',
      shortDescription: 'Master network security, firewalls, and intrusion detection systems',
      description: 'Learn to secure networks with firewalls, IDS/IPS, VPNs, and security policies. Understand network architecture security and implement protection mechanisms.',
      level: 'Intermediate',
      language: 'English',
      actualPrice: 3999,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Network security architecture',
        'Firewall configuration',
        'IDS/IPS implementation',
        'VPN setup and management',
        'Security policy creation'
      ],
      lessons: [
        { title: 'Network Security Basics', description: 'Network security fundamentals', duration: 35, order: 1, isFree: true },
        { title: 'Firewall Technologies', description: 'Understanding firewall types', duration: 45, order: 2, isFree: true },
        { title: 'IDS and IPS Systems', description: 'Intrusion detection and prevention', duration: 50, order: 3, isFree: false },
        { title: 'VPN Configuration', description: 'Setting up secure VPNs', duration: 55, order: 4, isFree: false },
        { title: 'Security Policies', description: 'Creating security policies', duration: 40, order: 5, isFree: false }
      ]
    },
    {
      title: 'Web Application Security',
      shortDescription: 'Learn to secure web applications from OWASP Top 10 vulnerabilities',
      description: 'Comprehensive guide to web application security covering OWASP Top 10, secure coding practices, authentication, and protection against common web attacks.',
      level: 'Advanced',
      language: 'English',
      actualPrice: 4499,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'OWASP Top 10 vulnerabilities',
        'Secure coding practices',
        'Authentication and authorization',
        'XSS and CSRF protection',
        'SQL injection prevention'
      ],
      lessons: [
        { title: 'Web Security Introduction', description: 'Understanding web security', duration: 30, order: 1, isFree: true },
        { title: 'OWASP Top 10 Overview', description: 'Common web vulnerabilities', duration: 50, order: 2, isFree: true },
        { title: 'XSS and CSRF Attacks', description: 'Cross-site scripting and CSRF', duration: 55, order: 3, isFree: false },
        { title: 'SQL Injection', description: 'Preventing SQL injection', duration: 45, order: 4, isFree: false },
        { title: 'Secure Authentication', description: 'Implementing secure auth', duration: 50, order: 5, isFree: false }
      ]
    },
    {
      title: 'Cloud Security Essentials',
      shortDescription: 'Secure cloud infrastructure and applications on AWS, Azure, and GCP',
      description: 'Master cloud security across major platforms. Learn IAM, encryption, compliance, and best practices for securing cloud-native applications.',
      level: 'Intermediate',
      language: 'English',
      actualPrice: 4999,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Cloud security fundamentals',
        'IAM and access control',
        'Data encryption in cloud',
        'Compliance and governance',
        'Cloud security monitoring'
      ],
      lessons: [
        { title: 'Cloud Security Basics', description: 'Introduction to cloud security', duration: 35, order: 1, isFree: true },
        { title: 'IAM Best Practices', description: 'Identity and access management', duration: 45, order: 2, isFree: true },
        { title: 'Data Encryption', description: 'Encrypting data at rest and transit', duration: 50, order: 3, isFree: false },
        { title: 'Compliance Standards', description: 'Meeting compliance requirements', duration: 40, order: 4, isFree: false },
        { title: 'Security Monitoring', description: 'Monitoring cloud security', duration: 45, order: 5, isFree: false }
      ]
    }
  ],
  'Cloud Computing': [
    {
      title: 'AWS Cloud Practitioner Complete Guide',
      shortDescription: 'Master AWS fundamentals and prepare for Cloud Practitioner certification',
      description: 'Comprehensive AWS course covering core services, architecture, pricing, and security. Perfect preparation for AWS Certified Cloud Practitioner exam.',
      level: 'Beginner',
      language: 'English',
      actualPrice: 3999,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'AWS core services (EC2, S3, RDS)',
        'Cloud computing fundamentals',
        'AWS pricing and billing',
        'Security and compliance',
        'AWS global infrastructure'
      ],
      lessons: [
        { title: 'AWS Introduction', description: 'Getting started with AWS', duration: 30, order: 1, isFree: true },
        { title: 'EC2 and Compute Services', description: 'Understanding EC2 instances', duration: 50, order: 2, isFree: true },
        { title: 'Storage Services (S3, EBS)', description: 'AWS storage solutions', duration: 45, order: 3, isFree: false },
        { title: 'Database Services', description: 'RDS and DynamoDB', duration: 50, order: 4, isFree: false },
        { title: 'Networking and Security', description: 'VPC and security groups', duration: 55, order: 5, isFree: false }
      ]
    },
    {
      title: 'Microsoft Azure Fundamentals',
      shortDescription: 'Learn Azure cloud services and prepare for AZ-900 certification',
      description: 'Complete guide to Microsoft Azure covering compute, storage, networking, and core services. Excellent preparation for Azure Fundamentals certification.',
      level: 'Beginner',
      language: 'English',
      actualPrice: 3499,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Azure core concepts',
        'Virtual Machines and App Services',
        'Azure Storage solutions',
        'Azure networking basics',
        'Security and identity'
      ],
      lessons: [
        { title: 'Azure Overview', description: 'Introduction to Microsoft Azure', duration: 35, order: 1, isFree: true },
        { title: 'Compute Services', description: 'VMs and App Services', duration: 45, order: 2, isFree: true },
        { title: 'Storage Solutions', description: 'Blob, File, and Queue storage', duration: 40, order: 3, isFree: false },
        { title: 'Networking Basics', description: 'Virtual networks and gateways', duration: 50, order: 4, isFree: false },
        { title: 'Identity Management', description: 'Azure AD and security', duration: 45, order: 5, isFree: false }
      ]
    },
    {
      title: 'Google Cloud Platform (GCP) Essentials',
      shortDescription: 'Master Google Cloud Platform core services and architecture',
      description: 'Learn GCP fundamentals including Compute Engine, Cloud Storage, BigQuery, and Kubernetes Engine. Build and deploy applications on Google Cloud.',
      level: 'Beginner',
      language: 'English',
      actualPrice: 3999,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'GCP core services',
        'Compute Engine and App Engine',
        'Cloud Storage and databases',
        'BigQuery for analytics',
        'Kubernetes Engine basics'
      ],
      lessons: [
        { title: 'GCP Introduction', description: 'Getting started with GCP', duration: 30, order: 1, isFree: true },
        { title: 'Compute Services', description: 'Compute and App Engine', duration: 45, order: 2, isFree: true },
        { title: 'Storage and Databases', description: 'Cloud Storage and SQL', duration: 50, order: 3, isFree: false },
        { title: 'BigQuery Analytics', description: 'Data analytics with BigQuery', duration: 55, order: 4, isFree: false },
        { title: 'Kubernetes Engine', description: 'Container orchestration', duration: 60, order: 5, isFree: false }
      ]
    },
    {
      title: 'Cloud Architecture & Design Patterns',
      shortDescription: 'Design scalable and resilient cloud architectures',
      description: 'Learn cloud architecture patterns, microservices, serverless computing, and best practices for building scalable applications in the cloud.',
      level: 'Advanced',
      language: 'English',
      actualPrice: 5499,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Cloud architecture patterns',
        'Microservices architecture',
        'Serverless computing',
        'High availability design',
        'Cost optimization strategies'
      ],
      lessons: [
        { title: 'Architecture Fundamentals', description: 'Cloud architecture basics', duration: 40, order: 1, isFree: true },
        { title: 'Microservices Design', description: 'Building microservices', duration: 60, order: 2, isFree: true },
        { title: 'Serverless Architecture', description: 'Serverless patterns and Lambda', duration: 55, order: 3, isFree: false },
        { title: 'High Availability', description: 'Designing for resilience', duration: 50, order: 4, isFree: false },
        { title: 'Cost Optimization', description: 'Reducing cloud costs', duration: 45, order: 5, isFree: false }
      ]
    },
    {
      title: 'Multi-Cloud Strategy & Management',
      shortDescription: 'Manage applications across AWS, Azure, and GCP platforms',
      description: 'Master multi-cloud deployment strategies, cloud migration, and managing workloads across different cloud providers. Learn hybrid cloud architecture.',
      level: 'Advanced',
      language: 'English',
      actualPrice: 5999,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Multi-cloud architecture',
        'Cloud migration strategies',
        'Hybrid cloud solutions',
        'Cloud management tools',
        'Cost and performance optimization'
      ],
      lessons: [
        { title: 'Multi-Cloud Overview', description: 'Understanding multi-cloud', duration: 35, order: 1, isFree: true },
        { title: 'Migration Strategies', description: 'Moving to multi-cloud', duration: 50, order: 2, isFree: true },
        { title: 'Hybrid Cloud Setup', description: 'On-premises and cloud integration', duration: 55, order: 3, isFree: false },
        { title: 'Management Tools', description: 'Managing multiple clouds', duration: 45, order: 4, isFree: false },
        { title: 'Optimization', description: 'Cost and performance tuning', duration: 50, order: 5, isFree: false }
      ]
    }
  ]
};

const seedMoreCourses = async () => {
  try {
    console.log('🌱 Starting additional course seeding...');

    await mongoose.connect(process.env.MONGO_URI);
    console.log('\n✅ Connected to MongoDB');

    // Find super admin
    const superAdmin = await User.findOne({ 
      $or: [
        { role: 'superadmin' },
        { email: 'md.mijanur@edulearnix.in' }
      ]
    });
    if (!superAdmin) {
      console.error('❌ Super admin not found!');
      process.exit(1);
    }
    console.log(`\n👤 Found Super Admin: ${superAdmin.name}`);

    const existingCount = await Course.countDocuments();
    console.log(`📊 Existing courses: ${existingCount}\n`);

    const instructorData = {
      name: 'Md Mijanur Molla',
      bio: 'Expert instructor with experience in teaching technology and programming. Passionate about making complex concepts simple and accessible.',
      avatar: 'https://media.geeksforgeeks.org/auth/profile/fi1t8nnyh9spuyq9w9oy'
    };

    let totalAdded = 0;
    let categoryStats = {};

    // Process each category
    for (const [category, courses] of Object.entries(coursesData)) {
      console.log(`\n📂 Processing category: ${category}`);
      console.log(`   Courses to add: ${courses.length}`);
      
      let addedInCategory = 0;

      for (const course of courses) {
        try {
          // Check if course already exists
          const existingCourse = await Course.findOne({ 
            title: course.title,
            category: category 
          });

          if (!existingCourse) {
            // Calculate total duration and lessons
            const totalDuration = course.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
            const totalLessons = course.lessons.length;

            await Course.create({
              ...course,
              category: category,
              instructor: instructorData,
              postedBy: superAdmin._id,
              totalDuration,
              totalLessons,
              isPublished: true,
              isFeatured: false
            });
            addedInCategory++;
            totalAdded++;
          }
        } catch (err) {
          console.log(`   ⚠️  Skipped: ${course.title.substring(0, 40)}... (${err.message})`);
        }
      }
      
      categoryStats[category] = addedInCategory;
      console.log(`   ✅ Added ${addedInCategory} courses`);
    }

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 ADDITIONAL COURSE SEEDING COMPLETE!');
    console.log('='.repeat(60));
    console.log(`\n📊 Summary by Category:`);
    for (const [category, count] of Object.entries(categoryStats)) {
      console.log(`   ${category}: ${count} courses`);
    }
    console.log(`\n✨ Total courses added: ${totalAdded}`);
    console.log(`📚 Total courses in database: ${existingCount + totalAdded}`);
    console.log('\n✅ All done! Courses are ready to explore.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding courses:', error.message);
    process.exit(1);
  }
};

seedMoreCourses();
