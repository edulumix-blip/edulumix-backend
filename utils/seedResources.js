import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Resource from '../models/Resource.js';

dotenv.config();

const resourcesData = {
  'Software Notes': [
    // Programming Languages
    { title: 'JavaScript Complete Notes - MDN', subcategory: 'JavaScript', description: 'Complete JavaScript documentation and guides from Mozilla Developer Network', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBko3tY0Z8WZQg-YgN6W6Xr0YYqn5BUHrh_Q&s', isVideo: false },
    { title: 'Python Tutorial - Official Docs', subcategory: 'Python', description: 'Official Python documentation and tutorial for beginners to advanced', link: 'https://docs.python.org/3/tutorial/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdXfu2x1yPs3D5cKQqJOqWQQHwQCKqWP1Geg&s', isVideo: false },
    { title: 'Java Programming Notes', subcategory: 'Java', description: 'Comprehensive Java programming notes covering OOP, Collections, Multithreading', link: 'https://docs.oracle.com/javase/tutorial/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwNwKK-pEwLCGY5JEbRhJqxqLxmGBG_Q8r3g&s', isVideo: false },
    { title: 'C++ Reference Guide', subcategory: 'C++', description: 'Complete C++ language reference and standard library documentation', link: 'https://cplusplus.com/reference/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzFN4IPEcL4PmxHxnqwPWLqJsUoGxo2YqPxg&s', isVideo: false },
    { title: 'C Programming Notes', subcategory: 'C', description: 'Learn C programming from basics to advanced with examples', link: 'https://www.learn-c.org/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_hLKKemLN8YF5gPQbN-wOPY4ZkH6qN9QVFA&s', isVideo: false },
    
    // Web Development
    { title: 'HTML5 Complete Guide', subcategory: 'Web Development', description: 'HTML5 semantic elements, forms, APIs and best practices', link: 'https://developer.mozilla.org/en-US/docs/Web/HTML', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoJt1RGYqBqKvQYBxL9vYW8YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'CSS3 Advanced Techniques', subcategory: 'Web Development', description: 'CSS Grid, Flexbox, Animations and Responsive Design', link: 'https://developer.mozilla.org/en-US/docs/Web/CSS', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbniBfFBQqK_qH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'React JS Documentation', subcategory: 'Web Development', description: 'Official React documentation with hooks, context and best practices', link: 'https://react.dev/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlGmKtrnxElpqw3AExKXPWWBulcwjlvDJa1Q&s', isVideo: false },
    { title: 'Node.js Complete Guide', subcategory: 'Web Development', description: 'Node.js API documentation, modules and async programming', link: 'https://nodejs.org/docs/latest/api/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpP0R8H4tcvljqCdOPVQpqxRe8BJVQ8kVW-A&s', isVideo: false },
    { title: 'Express.js Framework', subcategory: 'Web Development', description: 'Express.js routing, middleware and RESTful API development', link: 'https://expressjs.com/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0nRVRzD5qE3cYJQYKQYKQYKQYKQYKQYKQYA&s', isVideo: false },
    
    // Data Structures & Algorithms
    { title: 'DSA Complete Notes', subcategory: 'DSA', description: 'Arrays, LinkedList, Trees, Graphs, DP with examples and complexity', link: 'https://github.com/TheAlgorithms', thumbnail: 'https://repository-images.githubusercontent.com/105765844/e6e5fa00-6fa7-11ea-9950-027fb6269e82', isVideo: false },
    { title: 'Algorithm Visualizations', subcategory: 'DSA', description: 'Visual representations of sorting, searching and graph algorithms', link: 'https://visualgo.net/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'Big O Cheat Sheet', subcategory: 'DSA', description: 'Time and space complexity of common algorithms and data structures', link: 'https://www.bigocheatsheet.com/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // Database
    { title: 'SQL Complete Tutorial', subcategory: 'Database', description: 'SQL queries, joins, subqueries, indexing and optimization', link: 'https://www.w3schools.com/sql/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'MongoDB Documentation', subcategory: 'Database', description: 'NoSQL database operations, aggregation and schema design', link: 'https://www.mongodb.com/docs/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'PostgreSQL Tutorial', subcategory: 'Database', description: 'Advanced PostgreSQL features, JSON, full-text search', link: 'https://www.postgresql.org/docs/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcUqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // Operating Systems
    { title: 'Operating Systems Notes', subcategory: 'OS', description: 'Process management, memory, file systems, synchronization', link: 'https://www.geeksforgeeks.org/operating-systems/', thumbnail: 'https://media.geeksforgeeks.org/wp-content/cdn-uploads/20230807133054/Operating-system-tutorial.png', isVideo: false },
    { title: 'Linux Command Line Basics', subcategory: 'Linux', description: 'Essential Linux commands, shell scripting and system administration', link: 'https://linuxcommand.org/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcVqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // Computer Networks
    { title: 'Computer Networks Notes', subcategory: 'Networks', description: 'OSI model, TCP/IP, HTTP, DNS, routing protocols', link: 'https://www.geeksforgeeks.org/computer-network-tutorials/', thumbnail: 'https://media.geeksforgeeks.org/wp-content/uploads/20230417045622/Computer-Network-Tutorial.webp', isVideo: false },
    
    // Software Engineering
    { title: 'Design Patterns', subcategory: 'Software Engineering', description: 'Gang of Four design patterns with examples in multiple languages', link: 'https://refactoring.guru/design-patterns', thumbnail: 'https://refactoring.guru/images/patterns/cards/singleton-mini.png', isVideo: false },
    { title: 'System Design Primer', subcategory: 'System Design', description: 'Scalability, load balancing, caching, databases for large systems', link: 'https://github.com/donnemartin/system-design-primer', thumbnail: 'https://repository-images.githubusercontent.com/79000898/4e9e9f80-d5cf-11e9-924c-d0e1e6a0e75d', isVideo: false },
  ],

  'Interview Notes': [
    // Programming Interview Prep
    { title: 'LeetCode Problem Solutions', subcategory: 'Coding Interview', description: '1000+ LeetCode problems with detailed solutions and explanations', link: 'https://github.com/doocs/leetcode', thumbnail: 'https://repository-images.githubusercontent.com/149001191/cf5d9c80-586f-11ea-80a5-ea4e2c2b51ac', isVideo: false },
    { title: 'Blind 75 LeetCode Questions', subcategory: 'Coding Interview', description: 'Curated list of 75 must-do LeetCode problems for interviews', link: 'https://neetcode.io/practice', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'Coding Interview Patterns', subcategory: 'Coding Interview', description: '14 patterns to solve any coding interview problem', link: 'https://hackernoon.com/14-patterns-to-ace-any-coding-interview-question-c5bb3357f6ed', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'Interview Questions - JavaScript', subcategory: 'JavaScript Interview', description: '100+ JavaScript interview questions with answers', link: 'https://github.com/sudheerj/javascript-interview-questions', thumbnail: 'https://repository-images.githubusercontent.com/146973011/53626e00-5d48-11ea-826e-d7d7a68c5bb0', isVideo: false },
    { title: 'React Interview Questions', subcategory: 'React Interview', description: '500+ React interview questions for all experience levels', link: 'https://github.com/sudheerj/reactjs-interview-questions', thumbnail: 'https://repository-images.githubusercontent.com/148149416/e3e8a600-5d48-11ea-9b2f-4c53abc32a3d', isVideo: false },
    { title: 'Node.js Interview Questions', subcategory: 'Node.js Interview', description: 'Common Node.js interview questions with detailed answers', link: 'https://github.com/learning-zone/nodejs-interview-questions', thumbnail: 'https://repository-images.githubusercontent.com/344671705/ebb10a00-7b23-11eb-8a21-d4e1f7d4d5c2', isVideo: false },
    
    // System Design Interview
    { title: 'System Design Interview', subcategory: 'System Design', description: 'How to design Twitter, YouTube, Instagram and other systems', link: 'https://github.com/checkcheckzz/system-design-interview', thumbnail: 'https://repository-images.githubusercontent.com/30213355/a98c9d00-586f-11ea-9f71-5c3e8e8e8e8e', isVideo: false },
    { title: 'Grokking System Design', subcategory: 'System Design', description: 'System design fundamentals and case studies', link: 'https://github.com/lei-hsia/grokking-system-design', thumbnail: 'https://repository-images.githubusercontent.com/234567890/grokking-system-design', isVideo: false },
    
    // Database Interview
    { title: 'SQL Interview Questions', subcategory: 'Database Interview', description: 'Complex SQL queries, joins, indexing interview questions', link: 'https://www.interviewbit.com/sql-interview-questions/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'MongoDB Interview Questions', subcategory: 'Database Interview', description: 'NoSQL, aggregation, sharding interview questions', link: 'https://www.geeksforgeeks.org/mongodb-interview-questions/', thumbnail: 'https://media.geeksforgeeks.org/wp-content/uploads/20230417050000/MongoDB-Interview-Questions.webp', isVideo: false },
    
    // OOP Interview
    { title: 'OOP Interview Questions', subcategory: 'OOP Interview', description: 'Object-oriented programming concepts and principles', link: 'https://www.interviewbit.com/oops-interview-questions/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcUqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // OS Interview
    { title: 'Operating Systems Interview', subcategory: 'OS Interview', description: 'Process, threads, deadlock, memory management questions', link: 'https://www.interviewbit.com/operating-system-interview-questions/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcVqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // Networks Interview
    { title: 'Networking Interview Questions', subcategory: 'Networks Interview', description: 'TCP/IP, HTTP, DNS, routing protocols interview prep', link: 'https://www.interviewbit.com/networking-interview-questions/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcWqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // HR Interview
    { title: 'HR Interview Questions', subcategory: 'HR Interview', description: 'Common HR questions, behavioral questions and best answers', link: 'https://www.geeksforgeeks.org/top-hr-interview-questions/', thumbnail: 'https://media.geeksforgeeks.org/wp-content/uploads/20230417050000/HR-Interview-Questions.webp', isVideo: false },
    { title: 'Tell Me About Yourself - Guide', subcategory: 'HR Interview', description: 'How to answer "Tell me about yourself" in interviews', link: 'https://www.themuse.com/advice/tell-me-about-yourself-interview-question-answer-examples', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcXqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // Company Specific
    { title: 'Google Interview Process', subcategory: 'Company Specific', description: 'How Google interviews work, what to expect and tips', link: 'https://www.geeksforgeeks.org/google-interview-preparation/', thumbnail: 'https://media.geeksforgeeks.org/wp-content/uploads/20230417050000/Google-Interview.webp', isVideo: false },
    { title: 'Amazon Interview Experience', subcategory: 'Company Specific', description: 'Amazon interview questions, leadership principles', link: 'https://www.geeksforgeeks.org/amazon-interview-preparation/', thumbnail: 'https://media.geeksforgeeks.org/wp-content/uploads/20230417050000/Amazon-Interview.webp', isVideo: false },
    { title: 'Microsoft Interview Guide', subcategory: 'Company Specific', description: 'Microsoft technical and behavioral interview prep', link: 'https://www.geeksforgeeks.org/microsoft-interview-preparation/', thumbnail: 'https://media.geeksforgeeks.org/wp-content/uploads/20230417050000/Microsoft-Interview.webp', isVideo: false },
    
    // Resume & CV
    { title: 'Tech Resume Template', subcategory: 'Resume', description: 'ATS-friendly resume templates for software engineers', link: 'https://github.com/sb2nov/resume', thumbnail: 'https://repository-images.githubusercontent.com/1234567890/resume-template', isVideo: false },
    { title: 'Resume Writing Tips', subcategory: 'Resume', description: 'How to write a winning tech resume that gets interviews', link: 'https://www.resumeworded.com/resume-examples/software-engineer', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcYqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
  ],

  'Tools & Technology': [
    // Version Control
    { title: 'Git Complete Tutorial', subcategory: 'Version Control', description: 'Git commands, branching, merging, rebasing and best practices', link: 'https://git-scm.com/doc', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcZqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'GitHub Actions CI/CD', subcategory: 'DevOps', description: 'Automate workflows with GitHub Actions for CI/CD pipelines', link: 'https://docs.github.com/en/actions', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcaqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // Containerization
    { title: 'Docker Complete Guide', subcategory: 'Docker', description: 'Containerization, Docker Compose, multi-stage builds', link: 'https://docs.docker.com/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcbqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'Kubernetes Basics', subcategory: 'Kubernetes', description: 'Container orchestration, pods, services, deployments', link: 'https://kubernetes.io/docs/tutorials/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GccqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // Cloud Platforms
    { title: 'AWS Free Tier Guide', subcategory: 'Cloud - AWS', description: 'EC2, S3, Lambda, RDS basics for AWS free tier', link: 'https://aws.amazon.com/free/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcdqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'Google Cloud Platform', subcategory: 'Cloud - GCP', description: 'Compute Engine, Cloud Storage, BigQuery tutorials', link: 'https://cloud.google.com/docs', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GceqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'Microsoft Azure Tutorial', subcategory: 'Cloud - Azure', description: 'Azure services, virtual machines, web apps', link: 'https://docs.microsoft.com/en-us/azure/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcfqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // IDEs and Editors
    { title: 'VS Code Extensions', subcategory: 'IDE', description: 'Top VS Code extensions for productivity and development', link: 'https://code.visualstudio.com/docs', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcgqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'Vim Tutorial', subcategory: 'Editor', description: 'Learn Vim editor commands and shortcuts', link: 'https://www.openvim.com/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GchqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // API Tools
    { title: 'Postman API Testing', subcategory: 'API Testing', description: 'REST API testing, collections, automation with Postman', link: 'https://learning.postman.com/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GciqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'Swagger/OpenAPI Docs', subcategory: 'API Documentation', description: 'API documentation with Swagger and OpenAPI specifications', link: 'https://swagger.io/docs/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcjqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // Testing
    { title: 'Jest Testing Framework', subcategory: 'Testing', description: 'Unit testing JavaScript applications with Jest', link: 'https://jestjs.io/docs/getting-started', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GckqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'Selenium WebDriver', subcategory: 'Testing', description: 'Browser automation and testing with Selenium', link: 'https://www.selenium.dev/documentation/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GclqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // Package Managers
    { title: 'npm Package Manager', subcategory: 'Package Manager', description: 'Node Package Manager commands and best practices', link: 'https://docs.npmjs.com/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcmqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'pip Python Packages', subcategory: 'Package Manager', description: 'Python package installation and virtual environments', link: 'https://pip.pypa.io/en/stable/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcnqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // Build Tools
    { title: 'Webpack Configuration', subcategory: 'Build Tools', description: 'Module bundler configuration and optimization', link: 'https://webpack.js.org/concepts/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcoqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'Vite Build Tool', subcategory: 'Build Tools', description: 'Next generation fast build tool for modern web', link: 'https://vitejs.dev/guide/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcpqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // Monitoring
    { title: 'Grafana Monitoring', subcategory: 'Monitoring', description: 'Application and infrastructure monitoring dashboards', link: 'https://grafana.com/docs/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcqqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // Databases Tools
    { title: 'MongoDB Compass', subcategory: 'Database Tools', description: 'GUI for MongoDB database management and queries', link: 'https://www.mongodb.com/products/compass', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcrqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'MySQL Workbench', subcategory: 'Database Tools', description: 'Visual database design and administration tool for MySQL', link: 'https://www.mysql.com/products/workbench/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcsqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
  ],

  'Trending Technology': [
    // Artificial Intelligence & ML
    { title: 'Machine Learning Crash Course', subcategory: 'Machine Learning', description: 'Google AI fundamentals of machine learning with TensorFlow', link: 'https://developers.google.com/machine-learning/crash-course', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GctqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'Deep Learning Specialization', subcategory: 'Deep Learning', description: 'Neural networks, CNNs, RNNs from deeplearning.ai', link: 'https://www.deeplearning.ai/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcuqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'TensorFlow Tutorial', subcategory: 'ML Framework', description: 'Build machine learning models with TensorFlow', link: 'https://www.tensorflow.org/tutorials', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcvqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'PyTorch Deep Learning', subcategory: 'ML Framework', description: 'PyTorch tutorials for computer vision and NLP', link: 'https://pytorch.org/tutorials/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcwqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // Generative AI
    { title: 'ChatGPT API Guide', subcategory: 'Generative AI', description: 'OpenAI GPT models integration and best practices', link: 'https://platform.openai.com/docs/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcxqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'Stable Diffusion Guide', subcategory: 'Generative AI', description: 'AI image generation with Stable Diffusion', link: 'https://stability.ai/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcyqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'LangChain Framework', subcategory: 'Generative AI', description: 'Build LLM-powered applications with LangChain', link: 'https://python.langchain.com/docs/get_started/introduction', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GczqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // Blockchain & Web3
    { title: 'Blockchain Basics', subcategory: 'Blockchain', description: 'Understanding blockchain, cryptocurrency and consensus', link: 'https://www.blockchain.com/learning-portal', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9Gc0qH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'Ethereum Smart Contracts', subcategory: 'Web3', description: 'Solidity programming and smart contract development', link: 'https://ethereum.org/en/developers/docs/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9Gc1qH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'Web3.js Documentation', subcategory: 'Web3', description: 'Interact with Ethereum blockchain using JavaScript', link: 'https://web3js.readthedocs.io/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9Gc2qH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // Cloud Native
    { title: 'Serverless Architecture', subcategory: 'Cloud Native', description: 'AWS Lambda, Azure Functions, Google Cloud Functions', link: 'https://www.serverless.com/framework/docs/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9Gc3qH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'Microservices Architecture', subcategory: 'Architecture', description: 'Designing and building microservices-based systems', link: 'https://microservices.io/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9Gc4qH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // DevOps & SRE
    { title: 'Terraform Infrastructure', subcategory: 'IaC', description: 'Infrastructure as Code with Terraform', link: 'https://developer.hashicorp.com/terraform/tutorials', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9Gc5qH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'Jenkins CI/CD Pipeline', subcategory: 'DevOps', description: 'Continuous integration and deployment with Jenkins', link: 'https://www.jenkins.io/doc/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9Gc6qH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // Mobile Development
    { title: 'React Native Guide', subcategory: 'Mobile Dev', description: 'Build native apps for iOS and Android with React', link: 'https://reactnative.dev/docs/getting-started', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9Gc7qH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'Flutter Development', subcategory: 'Mobile Dev', description: 'Cross-platform mobile apps with Dart and Flutter', link: 'https://docs.flutter.dev/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9Gc8qH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // Edge Computing & IoT
    { title: 'IoT with Raspberry Pi', subcategory: 'IoT', description: 'Internet of Things projects with Raspberry Pi', link: 'https://www.raspberrypi.com/documentation/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9Gc9qH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'Arduino Projects', subcategory: 'IoT', description: 'Microcontroller programming and IoT applications', link: 'https://www.arduino.cc/en/Tutorial/HomePage', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9Gc-qH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    
    // Cybersecurity
    { title: 'Ethical Hacking Basics', subcategory: 'Cybersecurity', description: 'Penetration testing and ethical hacking fundamentals', link: 'https://www.hackerone.com/ethical-hacker', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GdAqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
    { title: 'OWASP Top 10', subcategory: 'Security', description: 'Web application security risks and prevention', link: 'https://owasp.org/www-project-top-ten/', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GdBqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A&s', isVideo: false },
  ],

  'Video Resources': [
    // Programming Channels
    { title: 'Traversy Media - Web Dev', subcategory: 'Web Development', description: 'Full stack web development tutorials and crash courses', link: 'https://www.youtube.com/@TraversyMedia', thumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_mKzklyPPhghBJQGYF6iF-CJMvMV_4pMp_6VS1CdtY=s176-c-k-c0x00ffffff-no-rj', isVideo: true },
    { title: 'FreeCodeCamp Full Courses', subcategory: 'Programming', description: 'Complete courses on programming, data science and more', link: 'https://www.youtube.com/@freecodecamp', thumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_k_J-KZd8LH0GJvw8MkJj3vp6VVxl2k8EctMwPdNiKR=s176-c-k-c0x00ffffff-no-rj', isVideo: true },
    { title: 'CodeWithHarry Hindi', subcategory: 'Programming Hindi', description: 'Programming tutorials in Hindi for Indian students', link: 'https://www.youtube.com/@CodeWithHarry', thumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_lzGASTEHCMxuGXy8ULjGDH3MYT9VDcFQJRMnWJGQA=s176-c-k-c0x00ffffff-no-rj', isVideo: true },
    { title: 'CS Dojo - Algorithms', subcategory: 'DSA', description: 'Data structures and algorithms explained simply', link: 'https://www.youtube.com/@CSDojo', thumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_nY8MnQC71xH-r63kHbX0dvIU0_CQCxJFHwDwGhWA=s176-c-k-c0x00ffffff-no-rj', isVideo: true },
    { title: 'Corey Schafer Python', subcategory: 'Python', description: 'In-depth Python programming tutorials', link: 'https://www.youtube.com/@coreyms', thumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_kX6J6yJsJCGt4FjQGKLQE0zVCp8VqWQ8nJVvDr=s176-c-k-c0x00ffffff-no-rj', isVideo: true },
    
    // Web Development
    { title: 'Net Ninja - Modern Web', subcategory: 'Web Development', description: 'React, Vue, Node.js and modern web technologies', link: 'https://www.youtube.com/@NetNinja', thumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_kqVcrNOh8VwZkIo2kqUWVPPK8CQKUCVr9KnqJ2=s176-c-k-c0x00ffffff-no-rj', isVideo: true },
    { title: 'Web Dev Simplified', subcategory: 'Web Development', description: 'Simplifying web development one video at a time', link: 'https://www.youtube.com/@WebDevSimplified', thumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_m7J6VqWqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A=s176-c-k-c0x00ffffff-no-rj', isVideo: true },
    { title: 'Fireship Quick Tutorials', subcategory: 'Web Development', description: '100 seconds tutorials on modern web tech', link: 'https://www.youtube.com/@Fireship', thumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_kn8VqWqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A=s176-c-k-c0x00ffffff-no-rj', isVideo: true },
    
    // DSA & Competitive Programming
    { title: 'Abdul Bari Algorithms', subcategory: 'Algorithms', description: 'Algorithm analysis and design masterclass', link: 'https://www.youtube.com/@abdul_bari', thumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_lo8VqWqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A=s176-c-k-c0x00ffffff-no-rj', isVideo: true },
    { title: 'Striver DSA Playlist', subcategory: 'DSA', description: 'Complete DSA playlist for placements', link: 'https://www.youtube.com/@takeUforward', thumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_kp8VqWqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A=s176-c-k-c0x00ffffff-no-rj', isVideo: true },
    { title: 'NeetCode LeetCode Solutions', subcategory: 'Coding Interview', description: 'LeetCode problem solutions with explanations', link: 'https://www.youtube.com/@NeetCode', thumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_kq8VqWqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A=s176-c-k-c0x00ffffff-no-rj', isVideo: true },
    
    // System Design
    { title: 'System Design Primer', subcategory: 'System Design', description: 'System design interview preparation videos', link: 'https://www.youtube.com/@SystemDesignInterview', thumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_kr8VqWqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A=s176-c-k-c0x00ffffff-no-rj', isVideo: true },
    { title: 'Gaurav Sen System Design', subcategory: 'System Design', description: 'System design concepts explained with examples', link: 'https://www.youtube.com/@gkcs', thumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_ks8VqWqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A=s176-c-k-c0x00ffffff-no-rj', isVideo: true },
    
    // Machine Learning & AI
    { title: 'Sentdex Python & ML', subcategory: 'Machine Learning', description: 'Python programming and machine learning tutorials', link: 'https://www.youtube.com/@sentdex', thumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_kt8VqWqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A=s176-c-k-c0x00ffffff-no-rj', isVideo: true },
    { title: 'Krish Naik ML Playlist', subcategory: 'Machine Learning', description: 'Complete machine learning and data science', link: 'https://www.youtube.com/@krishnaik06', thumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_ku8VqWqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A=s176-c-k-c0x00ffffff-no-rj', isVideo: true },
    
    // DevOps & Cloud
    { title: 'TechWorld with Nana', subcategory: 'DevOps', description: 'DevOps, Docker, Kubernetes tutorials', link: 'https://www.youtube.com/@TechWorldwithNana', thumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_kv8VqWqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A=s176-c-k-c0x00ffffff-no-rj', isVideo: true },
    { title: 'freeCodeCamp DevOps', subcategory: 'DevOps', description: 'Complete DevOps bootcamp and certifications', link: 'https://www.youtube.com/watch?v=j5Zsa_eOXeY', thumbnail: 'https://i.ytimg.com/vi/j5Zsa_eOXeY/maxresdefault.jpg', isVideo: true },
    
    // Mobile Development
    { title: 'Flutter Explained', subcategory: 'Mobile Development', description: 'Flutter and Dart programming tutorials', link: 'https://www.youtube.com/@FlutterExplained', thumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_kw8VqWqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A=s176-c-k-c0x00ffffff-no-rj', isVideo: true },
    { title: 'React Native Tutorial', subcategory: 'Mobile Development', description: 'Build mobile apps with React Native', link: 'https://www.youtube.com/watch?v=0-S5a0eXPoc', thumbnail: 'https://i.ytimg.com/vi/0-S5a0eXPoc/maxresdefault.jpg', isVideo: true },
    
    // Career & Interview
    { title: 'Clément Mihailescu', subcategory: 'Career', description: 'Ex-Google engineer sharing interview tips', link: 'https://www.youtube.com/@clem', thumbnail: 'https://yt3.googleusercontent.com/ytc/AIdro_kx8VqWqH9YqH9YqH9YqH9YqH9YqH9YqH9YqH9A=s176-c-k-c0x00ffffff-no-rj', isVideo: true },
  ],

  'Software Project': [
    // Full Stack Projects
    { title: 'MERN Stack E-commerce', subcategory: 'Full Stack', description: 'Complete e-commerce website with payment integration', link: 'https://github.com/basir/amazona', thumbnail: 'https://repository-images.githubusercontent.com/123456789/mern-ecommerce', isVideo: false },
    { title: 'Social Media App - MERN', subcategory: 'Full Stack', description: 'Facebook/Instagram clone with posts, likes, comments', link: 'https://github.com/adrianhajdin/project_mern_memories', thumbnail: 'https://repository-images.githubusercontent.com/234567890/social-media', isVideo: false },
    { title: 'Netflix Clone React', subcategory: 'Frontend', description: 'Netflix UI clone with TMDB API integration', link: 'https://github.com/adrianhajdin/project_netflix_clone', thumbnail: 'https://repository-images.githubusercontent.com/345678901/netflix-clone', isVideo: false },
    { title: 'Zoom Clone WebRTC', subcategory: 'Full Stack', description: 'Video conferencing app with WebRTC and Socket.io', link: 'https://github.com/adrianhajdin/project_video_chat', thumbnail: 'https://repository-images.githubusercontent.com/456789012/zoom-clone', isVideo: false },
    { title: 'WhatsApp Clone MERN', subcategory: 'Full Stack', description: 'Real-time chat application with Socket.io', link: 'https://github.com/adrianhajdin/project_whatsapp_mern', thumbnail: 'https://repository-images.githubusercontent.com/567890123/whatsapp-clone', isVideo: false },
    
    // React Projects
    { title: 'Admin Dashboard React', subcategory: 'React', description: 'Modern admin panel with charts and data tables', link: 'https://github.com/adrianhajdin/project_syncfusion_dashboard', thumbnail: 'https://repository-images.githubusercontent.com/678901234/admin-dashboard', isVideo: false },
    { title: 'Portfolio Website React', subcategory: 'React', description: 'Responsive portfolio with animations and contact form', link: 'https://github.com/adrianhajdin/project_modern_ui_ux_portfolio', thumbnail: 'https://repository-images.githubusercontent.com/789012345/portfolio', isVideo: false },
    { title: 'E-learning Platform', subcategory: 'React', description: 'Online course platform with video streaming', link: 'https://github.com/adrianhajdin/project_e_learning', thumbnail: 'https://repository-images.githubusercontent.com/890123456/elearning', isVideo: false },
    { title: 'Restaurant Website', subcategory: 'React', description: 'Modern restaurant website with menu and booking', link: 'https://github.com/adrianhajdin/project_restaurant', thumbnail: 'https://repository-images.githubusercontent.com/901234567/restaurant', isVideo: false },
    { title: 'Crypto Dashboard', subcategory: 'React', description: 'Cryptocurrency tracker with live prices and charts', link: 'https://github.com/adrianhajdin/project_cryptoverse', thumbnail: 'https://repository-images.githubusercontent.com/012345678/crypto-dashboard', isVideo: false },
    
    // Node.js Backend
    { title: 'REST API Node Express', subcategory: 'Backend', description: 'Scalable REST API with authentication and MongoDB', link: 'https://github.com/hagopj13/node-express-boilerplate', thumbnail: 'https://repository-images.githubusercontent.com/123456780/rest-api', isVideo: false },
    { title: 'GraphQL API Server', subcategory: 'Backend', description: 'GraphQL server with Apollo and PostgreSQL', link: 'https://github.com/apollographql/apollo-server', thumbnail: 'https://repository-images.githubusercontent.com/234567801/graphql-api', isVideo: false },
    { title: 'Microservices Architecture', subcategory: 'Backend', description: 'Microservices with Docker, RabbitMQ, and MongoDB', link: 'https://github.com/ErshadISM/microservices-nodejs', thumbnail: 'https://repository-images.githubusercontent.com/345678902/microservices', isVideo: false },
    
    // Python Projects
    { title: 'Django Blog Application', subcategory: 'Python', description: 'Full-featured blog with authentication and comments', link: 'https://github.com/CoreyMSchafer/code_snippets/tree/master/Django_Blog', thumbnail: 'https://repository-images.githubusercontent.com/456789003/django-blog', isVideo: false },
    { title: 'Flask REST API', subcategory: 'Python', description: 'RESTful API with Flask, SQLAlchemy and JWT', link: 'https://github.com/miguelgrinberg/microblog', thumbnail: 'https://repository-images.githubusercontent.com/567890104/flask-api', isVideo: false },
    { title: 'Data Analysis Dashboard', subcategory: 'Python', description: 'Interactive dashboards with Dash and Plotly', link: 'https://github.com/plotly/dash-sample-apps', thumbnail: 'https://repository-images.githubusercontent.com/678901205/data-dashboard', isVideo: false },
    
    // Machine Learning Projects
    { title: 'Image Classification CNN', subcategory: 'ML', description: 'Image classifier using Convolutional Neural Networks', link: 'https://github.com/tensorflow/models/tree/master/official/vision/image_classification', thumbnail: 'https://repository-images.githubusercontent.com/789012306/image-classification', isVideo: false },
    { title: 'Chatbot with NLP', subcategory: 'ML', description: 'AI chatbot using transformers and BERT', link: 'https://github.com/gunthercox/ChatterBot', thumbnail: 'https://repository-images.githubusercontent.com/890123407/chatbot', isVideo: false },
    { title: 'Recommendation System', subcategory: 'ML', description: 'Movie recommendation using collaborative filtering', link: 'https://github.com/microsoft/recommenders', thumbnail: 'https://repository-images.githubusercontent.com/901234508/recommendation', isVideo: false },
    
    // Mobile App Projects
    { title: 'React Native Food Delivery', subcategory: 'Mobile', description: 'Food delivery app with maps and payment', link: 'https://github.com/CleverProgrammers/uber-eats-clone-react-native', thumbnail: 'https://repository-images.githubusercontent.com/012345609/food-delivery', isVideo: false },
    { title: 'Flutter Expense Tracker', subcategory: 'Mobile', description: 'Personal finance tracker with charts', link: 'https://github.com/academind/flutter-complete-guide-course-resources', thumbnail: 'https://repository-images.githubusercontent.com/123456710/expense-tracker', isVideo: false },
  ],

  'Hardware Project': [
    // Arduino Projects
    { title: 'Arduino LED Control', subcategory: 'Arduino', description: 'Control LED lights with Arduino and sensors', link: 'https://create.arduino.cc/projecthub/arduino/led-control-e45652', thumbnail: 'https://hackster.imgix.net/uploads/attachments/1234567/led_control.jpg', isVideo: false },
    { title: 'Temperature Monitor System', subcategory: 'Arduino', description: 'Real-time temperature monitoring with DHT11 sensor', link: 'https://create.arduino.cc/projecthub/arduino/temperature-monitor', thumbnail: 'https://hackster.imgix.net/uploads/attachments/2345678/temp_monitor.jpg', isVideo: false },
    { title: 'Smart Home Automation', subcategory: 'Arduino', description: 'IoT-based home automation with Arduino and Wi-Fi', link: 'https://create.arduino.cc/projecthub/arduino/smart-home', thumbnail: 'https://hackster.imgix.net/uploads/attachments/3456789/smart_home.jpg', isVideo: false },
    { title: 'Line Following Robot', subcategory: 'Robotics', description: 'Autonomous robot that follows black line', link: 'https://create.arduino.cc/projecthub/arduino/line-follower', thumbnail: 'https://hackster.imgix.net/uploads/attachments/4567890/line_robot.jpg', isVideo: false },
    { title: 'Obstacle Avoiding Robot', subcategory: 'Robotics', description: 'Robot that detects and avoids obstacles using ultrasonic', link: 'https://create.arduino.cc/projecthub/arduino/obstacle-robot', thumbnail: 'https://hackster.imgix.net/uploads/attachments/5678901/obstacle_robot.jpg', isVideo: false },
    
    // Raspberry Pi Projects
    { title: 'Raspberry Pi Web Server', subcategory: 'Raspberry Pi', description: 'Set up Apache/Nginx web server on Raspberry Pi', link: 'https://projects.raspberrypi.org/en/projects/raspberry-pi-web-server', thumbnail: 'https://projects-static.raspberrypi.org/projects/raspberry-pi-web-server/cover.png', isVideo: false },
    { title: 'Home Security Camera', subcategory: 'Raspberry Pi', description: 'DIY security camera with motion detection', link: 'https://projects.raspberrypi.org/en/projects/security-camera', thumbnail: 'https://projects-static.raspberrypi.org/projects/security-camera/cover.png', isVideo: false },
    { title: 'Weather Station', subcategory: 'Raspberry Pi', description: 'Monitor weather data with sensors and display', link: 'https://projects.raspberrypi.org/en/projects/weather-station', thumbnail: 'https://projects-static.raspberrypi.org/projects/weather-station/cover.png', isVideo: false },
    { title: 'Voice Assistant Pi', subcategory: 'Raspberry Pi', description: 'Build Alexa/Google Assistant clone', link: 'https://projects.raspberrypi.org/en/projects/voice-assistant', thumbnail: 'https://projects-static.raspberrypi.org/projects/voice-assistant/cover.png', isVideo: false },
    { title: 'Retro Gaming Console', subcategory: 'Raspberry Pi', description: 'RetroPie gaming system with classic games', link: 'https://retropie.org.uk/docs/', thumbnail: 'https://retropie.org.uk/wp-content/uploads/2020/07/retropie-logo.png', isVideo: false },
    
    // ESP32/ESP8266 IoT
    { title: 'ESP32 WiFi Weather Station', subcategory: 'IoT', description: 'IoT weather station with web dashboard', link: 'https://randomnerdtutorials.com/esp32-weather-station/', thumbnail: 'https://i0.wp.com/randomnerdtutorials.com/wp-content/uploads/2019/05/ESP32-DHT11-DHT22-Web-Server.jpg', isVideo: false },
    { title: 'Smart Door Lock ESP8266', subcategory: 'IoT', description: 'Smartphone-controlled door lock system', link: 'https://how2electronics.com/smart-door-lock-using-esp8266/', thumbnail: 'https://how2electronics.com/wp-content/uploads/2020/12/Smart-Door-Lock.jpg', isVideo: false },
    { title: 'Plant Watering System', subcategory: 'IoT', description: 'Automatic plant watering with soil moisture sensor', link: 'https://how2electronics.com/iot-plant-watering-system/', thumbnail: 'https://how2electronics.com/wp-content/uploads/2020/11/Plant-Watering.jpg', isVideo: false },
    
    // Sensors & Modules
    { title: 'Ultrasonic Distance Sensor', subcategory: 'Sensors', description: 'Measure distance using HC-SR04 ultrasonic sensor', link: 'https://create.arduino.cc/projecthub/arduino/ultrasonic-sensor', thumbnail: 'https://hackster.imgix.net/uploads/attachments/6789012/ultrasonic.jpg', isVideo: false },
    { title: 'RFID Access Control', subcategory: 'Sensors', description: 'RFID card-based door access system', link: 'https://create.arduino.cc/projecthub/arduino/rfid-access', thumbnail: 'https://hackster.imgix.net/uploads/attachments/7890123/rfid.jpg', isVideo: false },
    { title: 'GPS Tracker Module', subcategory: 'GPS', description: 'Real-time GPS tracking with NEO-6M module', link: 'https://how2electronics.com/gps-tracker-using-arduino/', thumbnail: 'https://how2electronics.com/wp-content/uploads/2020/10/GPS-Tracker.jpg', isVideo: false },
    
    // Drone & RC Projects
    { title: 'DIY Quadcopter Drone', subcategory: 'Drone', description: 'Build your own quadcopter with flight controller', link: 'https://how2electronics.com/build-quadcopter-drone/', thumbnail: 'https://how2electronics.com/wp-content/uploads/2019/12/Quadcopter.jpg', isVideo: false },
    { title: 'RC Car with Arduino', subcategory: 'RC', description: 'Bluetooth/WiFi controlled RC car project', link: 'https://create.arduino.cc/projecthub/arduino/rc-car', thumbnail: 'https://hackster.imgix.net/uploads/attachments/8901234/rc_car.jpg', isVideo: false },
    
    // 3D Printing
    { title: '3D Printer from Scratch', subcategory: '3D Printing', description: 'Build RepRap 3D printer with Arduino RAMPS', link: 'https://reprap.org/wiki/Build_A_RepRap', thumbnail: 'https://reprap.org/mediawiki/images/thumb/e/e0/Mendel.jpg/300px-Mendel.jpg', isVideo: false },
    { title: 'CNC Machine Arduino', subcategory: 'CNC', description: 'DIY CNC machine using GRBL and Arduino', link: 'https://www.instructables.com/Arduino-CNC-Machine/', thumbnail: 'https://content.instructables.com/ORIG/F1C/H2Y3/J8L5M6N7/F1CH2Y3J8L5M6N7.jpg', isVideo: false },
  ],
};

const seedResources = async () => {
  try {
    console.log('🌱 Starting resource seeding...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get super admin
    const superAdmin = await User.findOne({ role: 'super_admin' });
    if (!superAdmin) {
      console.log('❌ No super admin found! Run npm run seed first.');
      process.exit(1);
    }
    console.log(`👤 Found Super Admin: ${superAdmin.name}\n`);

    // Count existing resources
    const existingCount = await Resource.countDocuments();
    console.log(`📊 Existing resources: ${existingCount}\n`);

    let totalAdded = 0;
    let categoryStats = {};

    // Process each category
    for (const [category, resources] of Object.entries(resourcesData)) {
      console.log(`\n📂 Processing category: ${category}`);
      console.log(`   Resources to add: ${resources.length}`);
      
      let addedInCategory = 0;
      
      for (const resource of resources) {
        try {
          // Check if resource already exists
          const exists = await Resource.findOne({ 
            title: resource.title,
            category: category 
          });
          
          if (!exists) {
            await Resource.create({
              ...resource,
              category: category,
              postedBy: superAdmin._id,
            });
            addedInCategory++;
            totalAdded++;
          }
        } catch (err) {
          console.log(`   ⚠️  Skipped: ${resource.title.substring(0, 40)}... (${err.message})`);
        }
      }
      
      categoryStats[category] = addedInCategory;
      console.log(`   ✅ Added ${addedInCategory} resources`);
    }

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 SEEDING COMPLETE!');
    console.log('='.repeat(60));
    console.log(`\n📊 Summary by Category:`);
    for (const [category, count] of Object.entries(categoryStats)) {
      console.log(`   ${category}: ${count} resources`);
    }
    console.log(`\n✨ Total resources added: ${totalAdded}`);
    console.log(`📚 Total resources in database: ${existingCount + totalAdded}`);
    console.log('\n✅ All done! Resources are ready to explore.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding resources:', error.message);
    process.exit(1);
  }
};

seedResources();
