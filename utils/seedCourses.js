import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';

dotenv.config();

const coursesData = {
  'Web Development': [
    {
      title: 'Complete HTML & CSS for Beginners',
      shortDescription: 'Learn HTML and CSS from scratch and build beautiful responsive websites',
      description: 'Master the fundamentals of web development with HTML5 and CSS3. This comprehensive course covers everything from basic tags to advanced CSS Grid and Flexbox layouts. Perfect for absolute beginners who want to start their web development journey.',
      level: 'Beginner',
      language: 'English',
      actualPrice: 2999,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'HTML5 semantic elements and structure',
        'CSS3 styling and animations',
        'Responsive design with Flexbox and Grid',
        'Build real-world website projects',
        'Modern web development best practices'
      ],
      lessons: [
        { title: 'Introduction to HTML', description: 'Understanding HTML basics and structure', duration: 30, order: 1, isFree: true },
        { title: 'HTML Forms and Input Elements', description: 'Creating interactive forms', duration: 45, order: 2, isFree: true },
        { title: 'CSS Fundamentals', description: 'Styling with CSS selectors and properties', duration: 40, order: 3, isFree: false },
        { title: 'Flexbox Layout', description: 'Creating flexible layouts with Flexbox', duration: 50, order: 4, isFree: false },
        { title: 'CSS Grid System', description: 'Advanced layouts with CSS Grid', duration: 55, order: 5, isFree: false }
      ]
    },
    {
      title: 'JavaScript Mastery - Zero to Hero',
      shortDescription: 'Master JavaScript programming from basics to advanced concepts',
      description: 'Become a JavaScript expert with this comprehensive course covering ES6+, async programming, DOM manipulation, and modern JavaScript features. Build real projects and understand core concepts deeply.',
      level: 'Beginner',
      language: 'English',
      actualPrice: 3999,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'JavaScript fundamentals and ES6+ features',
        'DOM manipulation and event handling',
        'Asynchronous JavaScript and Promises',
        'Object-oriented programming in JavaScript',
        'Build interactive web applications'
      ],
      lessons: [
        { title: 'JavaScript Basics', description: 'Variables, data types, and operators', duration: 35, order: 1, isFree: true },
        { title: 'Functions and Scope', description: 'Understanding functions and closures', duration: 40, order: 2, isFree: true },
        { title: 'Arrays and Objects', description: 'Working with data structures', duration: 45, order: 3, isFree: false },
        { title: 'DOM Manipulation', description: 'Interacting with HTML elements', duration: 50, order: 4, isFree: false },
        { title: 'Async JavaScript', description: 'Promises, async/await, and fetch API', duration: 60, order: 5, isFree: false }
      ]
    },
    {
      title: 'React JS Complete Course 2024',
      shortDescription: 'Build modern web apps with React, Hooks, Context API and React Router',
      description: 'Learn React from scratch and build production-ready applications. Master React Hooks, Context API, React Router, and state management. Create real-world projects with best practices.',
      level: 'Intermediate',
      language: 'English',
      actualPrice: 4999,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'React components and JSX',
        'React Hooks - useState, useEffect, useContext',
        'State management and data flow',
        'React Router for navigation',
        'Build full-stack React applications'
      ],
      lessons: [
        { title: 'React Fundamentals', description: 'Components, props, and JSX', duration: 40, order: 1, isFree: true },
        { title: 'React Hooks Deep Dive', description: 'useState, useEffect, and custom hooks', duration: 55, order: 2, isFree: true },
        { title: 'State Management', description: 'Context API and global state', duration: 50, order: 3, isFree: false },
        { title: 'React Router', description: 'Client-side routing and navigation', duration: 45, order: 4, isFree: false },
        { title: 'Building Real Projects', description: 'E-commerce app with React', duration: 90, order: 5, isFree: false }
      ]
    },
    {
      title: 'Node.js & Express Backend Development',
      shortDescription: 'Build scalable REST APIs and backend applications with Node.js and Express',
      description: 'Master backend development with Node.js and Express. Learn to build RESTful APIs, authentication, database integration with MongoDB, and deploy production-ready applications.',
      level: 'Intermediate',
      language: 'English',
      actualPrice: 4499,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Node.js fundamentals and npm',
        'Express.js framework and routing',
        'MongoDB and Mongoose ODM',
        'JWT authentication and authorization',
        'REST API best practices'
      ],
      lessons: [
        { title: 'Node.js Basics', description: 'Understanding Node.js and modules', duration: 35, order: 1, isFree: true },
        { title: 'Express Framework', description: 'Building web servers with Express', duration: 45, order: 2, isFree: true },
        { title: 'MongoDB Integration', description: 'Database operations with Mongoose', duration: 50, order: 3, isFree: false },
        { title: 'Authentication & JWT', description: 'Secure user authentication', duration: 60, order: 4, isFree: false },
        { title: 'REST API Development', description: 'Build complete CRUD APIs', duration: 70, order: 5, isFree: false }
      ]
    },
    {
      title: 'Full Stack MERN Development',
      shortDescription: 'Build complete web applications with MongoDB, Express, React and Node.js',
      description: 'Become a full-stack developer by mastering the MERN stack. Build and deploy complete web applications from scratch with authentication, real-time features, and production deployment.',
      level: 'Advanced',
      language: 'English',
      actualPrice: 5999,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Full MERN stack architecture',
        'React frontend with Redux',
        'Node.js and Express backend',
        'MongoDB database design',
        'Deployment on AWS/Heroku'
      ],
      lessons: [
        { title: 'MERN Stack Overview', description: 'Understanding the full stack', duration: 30, order: 1, isFree: true },
        { title: 'Frontend with React', description: 'Building responsive UI', duration: 60, order: 2, isFree: true },
        { title: 'Backend API Development', description: 'RESTful APIs with Express', duration: 65, order: 3, isFree: false },
        { title: 'Database Design', description: 'MongoDB schema and relationships', duration: 55, order: 4, isFree: false },
        { title: 'Deployment & DevOps', description: 'Deploy to production', duration: 75, order: 5, isFree: false }
      ]
    }
  ],

  'Mobile Development': [
    {
      title: 'React Native Complete Guide',
      shortDescription: 'Build native mobile apps for iOS and Android with React Native',
      description: 'Learn React Native from scratch and create beautiful cross-platform mobile applications. Master navigation, state management, native features, and app deployment.',
      level: 'Intermediate',
      language: 'English',
      actualPrice: 4999,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'React Native fundamentals',
        'Mobile UI components',
        'Navigation with React Navigation',
        'Native device features',
        'Publish apps to App Store and Play Store'
      ],
      lessons: [
        { title: 'React Native Setup', description: 'Environment setup and first app', duration: 40, order: 1, isFree: true },
        { title: 'Core Components', description: 'View, Text, Image, ScrollView', duration: 45, order: 2, isFree: true },
        { title: 'Navigation', description: 'Stack and Tab navigation', duration: 50, order: 3, isFree: false },
        { title: 'State Management', description: 'Redux and Context in mobile apps', duration: 55, order: 4, isFree: false },
        { title: 'Publishing Apps', description: 'Deploy to stores', duration: 60, order: 5, isFree: false }
      ]
    },
    {
      title: 'Flutter & Dart Complete Course',
      shortDescription: 'Build beautiful native apps for iOS and Android with Flutter',
      description: 'Master Flutter and Dart to create stunning cross-platform mobile applications. Learn widgets, state management, animations, and deploy apps to both platforms.',
      level: 'Beginner',
      language: 'English',
      actualPrice: 4799,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Dart programming language',
        'Flutter widgets and layouts',
        'State management with Provider',
        'Firebase integration',
        'Build and deploy mobile apps'
      ],
      lessons: [
        { title: 'Dart Fundamentals', description: 'Learn Dart programming', duration: 45, order: 1, isFree: true },
        { title: 'Flutter Widgets', description: 'StatelessWidget and StatefulWidget', duration: 50, order: 2, isFree: true },
        { title: 'Layouts and Styling', description: 'Creating beautiful UIs', duration: 55, order: 3, isFree: false },
        { title: 'State Management', description: 'Provider and Riverpod', duration: 60, order: 4, isFree: false },
        { title: 'Firebase Integration', description: 'Backend services with Firebase', duration: 65, order: 5, isFree: false }
      ]
    },
    {
      title: 'Android Development with Kotlin',
      shortDescription: 'Build native Android apps using Kotlin and Android Studio',
      description: 'Learn Android app development with Kotlin. Master Android SDK, Material Design, Jetpack components, and build production-ready Android applications.',
      level: 'Intermediate',
      language: 'English',
      actualPrice: 4599,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Kotlin programming for Android',
        'Android SDK and lifecycle',
        'Material Design implementation',
        'Room database and ViewModel',
        'Publish apps to Play Store'
      ],
      lessons: [
        { title: 'Kotlin Basics', description: 'Kotlin syntax and features', duration: 40, order: 1, isFree: true },
        { title: 'Android Components', description: 'Activities, Fragments, Intents', duration: 50, order: 2, isFree: true },
        { title: 'UI Design', description: 'XML layouts and Material Design', duration: 45, order: 3, isFree: false },
        { title: 'Data Persistence', description: 'Room database and SharedPreferences', duration: 55, order: 4, isFree: false },
        { title: 'App Publishing', description: 'Release to Google Play Store', duration: 50, order: 5, isFree: false }
      ]
    },
    {
      title: 'iOS Development with Swift',
      shortDescription: 'Create native iOS apps using Swift and Xcode',
      description: 'Master iOS development with Swift. Learn UIKit, SwiftUI, Core Data, and build beautiful iOS applications for iPhone and iPad.',
      level: 'Intermediate',
      language: 'English',
      actualPrice: 5299,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Swift programming language',
        'UIKit and SwiftUI frameworks',
        'iOS app architecture patterns',
        'Core Data and networking',
        'Publish to App Store'
      ],
      lessons: [
        { title: 'Swift Fundamentals', description: 'Swift syntax and basics', duration: 45, order: 1, isFree: true },
        { title: 'UIKit Basics', description: 'ViewControllers and Storyboards', duration: 50, order: 2, isFree: true },
        { title: 'SwiftUI Introduction', description: 'Declarative UI with SwiftUI', duration: 55, order: 3, isFree: false },
        { title: 'Data Management', description: 'Core Data and UserDefaults', duration: 60, order: 4, isFree: false },
        { title: 'App Store Submission', description: 'Submit to Apple App Store', duration: 50, order: 5, isFree: false }
      ]
    },
    {
      title: 'Progressive Web Apps (PWA)',
      shortDescription: 'Build installable web apps that work offline with PWA technology',
      description: 'Learn to create Progressive Web Apps that combine the best of web and mobile apps. Master service workers, offline functionality, and app-like experiences.',
      level: 'Intermediate',
      language: 'English',
      actualPrice: 3999,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'PWA fundamentals and concepts',
        'Service Workers and caching',
        'Offline functionality',
        'Web app manifest',
        'Push notifications'
      ],
      lessons: [
        { title: 'PWA Introduction', description: 'What are Progressive Web Apps', duration: 30, order: 1, isFree: true },
        { title: 'Service Workers', description: 'Caching and offline support', duration: 50, order: 2, isFree: true },
        { title: 'App Manifest', description: 'Making web apps installable', duration: 40, order: 3, isFree: false },
        { title: 'Push Notifications', description: 'Engaging users with notifications', duration: 45, order: 4, isFree: false },
        { title: 'Building a PWA', description: 'Complete PWA project', duration: 70, order: 5, isFree: false }
      ]
    }
  ],

  'Data Science': [
    {
      title: 'Python for Data Science',
      shortDescription: 'Learn Python programming for data analysis and visualization',
      description: 'Master Python for data science with NumPy, Pandas, Matplotlib, and Seaborn. Analyze datasets, create visualizations, and prepare data for machine learning.',
      level: 'Beginner',
      language: 'English',
      actualPrice: 4299,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Python programming basics',
        'NumPy for numerical computing',
        'Pandas for data manipulation',
        'Data visualization with Matplotlib',
        'Exploratory data analysis'
      ],
      lessons: [
        { title: 'Python Basics', description: 'Python syntax and data types', duration: 40, order: 1, isFree: true },
        { title: 'NumPy Arrays', description: 'Array operations and broadcasting', duration: 45, order: 2, isFree: true },
        { title: 'Pandas DataFrames', description: 'Data manipulation and analysis', duration: 55, order: 3, isFree: false },
        { title: 'Data Visualization', description: 'Creating charts and plots', duration: 50, order: 4, isFree: false },
        { title: 'EDA Project', description: 'Complete data analysis project', duration: 75, order: 5, isFree: false }
      ]
    },
    {
      title: 'Statistics for Data Science',
      shortDescription: 'Master statistical concepts essential for data science and analytics',
      description: 'Learn statistics fundamentals including probability, hypothesis testing, regression, and statistical inference. Essential for any data scientist.',
      level: 'Beginner',
      language: 'English',
      actualPrice: 3999,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Descriptive statistics',
        'Probability distributions',
        'Hypothesis testing',
        'Linear and logistic regression',
        'Statistical inference'
      ],
      lessons: [
        { title: 'Statistics Fundamentals', description: 'Mean, median, mode, variance', duration: 40, order: 1, isFree: true },
        { title: 'Probability Theory', description: 'Probability concepts and distributions', duration: 45, order: 2, isFree: true },
        { title: 'Hypothesis Testing', description: 'T-tests, ANOVA, Chi-square', duration: 50, order: 3, isFree: false },
        { title: 'Regression Analysis', description: 'Linear and multiple regression', duration: 55, order: 4, isFree: false },
        { title: 'Statistical Inference', description: 'Confidence intervals and p-values', duration: 50, order: 5, isFree: false }
      ]
    },
    {
      title: 'Data Visualization Mastery',
      shortDescription: 'Create stunning data visualizations with Python and JavaScript libraries',
      description: 'Master data visualization with matplotlib, seaborn, plotly, and D3.js. Learn to tell compelling stories with data through effective visualizations.',
      level: 'Intermediate',
      language: 'English',
      actualPrice: 3799,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Visualization best practices',
        'Matplotlib and Seaborn',
        'Interactive plots with Plotly',
        'Dashboard creation',
        'Storytelling with data'
      ],
      lessons: [
        { title: 'Visualization Basics', description: 'Chart types and when to use them', duration: 35, order: 1, isFree: true },
        { title: 'Matplotlib Deep Dive', description: 'Advanced plotting techniques', duration: 45, order: 2, isFree: true },
        { title: 'Seaborn Statistical Plots', description: 'Statistical visualizations', duration: 40, order: 3, isFree: false },
        { title: 'Interactive Plotly', description: 'Interactive and animated plots', duration: 50, order: 4, isFree: false },
        { title: 'Dashboard Project', description: 'Build analytics dashboard', duration: 70, order: 5, isFree: false }
      ]
    },
    {
      title: 'SQL for Data Analysis',
      shortDescription: 'Master SQL queries and database management for data analytics',
      description: 'Learn SQL from basics to advanced queries. Master joins, subqueries, window functions, and optimize database queries for data analysis.',
      level: 'Beginner',
      language: 'English',
      actualPrice: 3499,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'SQL fundamentals and syntax',
        'JOIN operations and subqueries',
        'Window functions',
        'Query optimization',
        'Database design basics'
      ],
      lessons: [
        { title: 'SQL Basics', description: 'SELECT, WHERE, ORDER BY', duration: 35, order: 1, isFree: true },
        { title: 'Joins and Relationships', description: 'INNER, LEFT, RIGHT, FULL joins', duration: 45, order: 2, isFree: true },
        { title: 'Aggregate Functions', description: 'GROUP BY, HAVING, aggregations', duration: 40, order: 3, isFree: false },
        { title: 'Window Functions', description: 'ROW_NUMBER, RANK, PARTITION BY', duration: 50, order: 4, isFree: false },
        { title: 'Advanced Queries', description: 'CTEs, subqueries, optimization', duration: 55, order: 5, isFree: false }
      ]
    },
    {
      title: 'Big Data with Apache Spark',
      shortDescription: 'Process large-scale data with Apache Spark and PySpark',
      description: 'Learn big data processing with Apache Spark. Master RDDs, DataFrames, Spark SQL, and build scalable data pipelines for large datasets.',
      level: 'Advanced',
      language: 'English',
      actualPrice: 5499,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Apache Spark architecture',
        'PySpark programming',
        'Spark SQL and DataFrames',
        'Distributed computing concepts',
        'Big data processing pipelines'
      ],
      lessons: [
        { title: 'Spark Introduction', description: 'Big data and Spark basics', duration: 40, order: 1, isFree: true },
        { title: 'RDDs and Operations', description: 'Resilient Distributed Datasets', duration: 50, order: 2, isFree: true },
        { title: 'Spark DataFrames', description: 'Working with structured data', duration: 55, order: 3, isFree: false },
        { title: 'Spark SQL', description: 'SQL queries on big data', duration: 50, order: 4, isFree: false },
        { title: 'Data Pipeline Project', description: 'Build production pipeline', duration: 80, order: 5, isFree: false }
      ]
    }
  ],

  'Machine Learning': [
    {
      title: 'Machine Learning A-Z',
      shortDescription: 'Complete machine learning course from basics to advanced algorithms',
      description: 'Master machine learning with Python, scikit-learn, and real-world projects. Learn supervised, unsupervised learning, and model evaluation techniques.',
      level: 'Intermediate',
      language: 'English',
      actualPrice: 5999,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'ML fundamentals and algorithms',
        'Supervised and unsupervised learning',
        'Feature engineering and selection',
        'Model evaluation and tuning',
        'Deploy ML models in production'
      ],
      lessons: [
        { title: 'ML Fundamentals', description: 'Introduction to machine learning', duration: 45, order: 1, isFree: true },
        { title: 'Linear Regression', description: 'First ML algorithm', duration: 50, order: 2, isFree: true },
        { title: 'Classification Algorithms', description: 'Logistic regression, SVM, Decision trees', duration: 60, order: 3, isFree: false },
        { title: 'Clustering', description: 'K-means, hierarchical clustering', duration: 55, order: 4, isFree: false },
        { title: 'Model Deployment', description: 'Deploy models with Flask', duration: 70, order: 5, isFree: false }
      ]
    },
    {
      title: 'Deep Learning with TensorFlow',
      shortDescription: 'Build neural networks and deep learning models with TensorFlow',
      description: 'Master deep learning with TensorFlow and Keras. Build CNNs, RNNs, and implement cutting-edge architectures for computer vision and NLP.',
      level: 'Advanced',
      language: 'English',
      actualPrice: 6499,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Neural networks fundamentals',
        'TensorFlow and Keras',
        'Convolutional Neural Networks',
        'Recurrent Neural Networks',
        'Transfer learning and deployment'
      ],
      lessons: [
        { title: 'Neural Networks Basics', description: 'Perceptrons and activation functions', duration: 50, order: 1, isFree: true },
        { title: 'TensorFlow Introduction', description: 'Building models with TensorFlow', duration: 55, order: 2, isFree: true },
        { title: 'CNNs for Images', description: 'Image classification with CNNs', duration: 65, order: 3, isFree: false },
        { title: 'RNNs and LSTMs', description: 'Sequence models', duration: 60, order: 4, isFree: false },
        { title: 'Transfer Learning', description: 'Using pre-trained models', duration: 70, order: 5, isFree: false }
      ]
    },
    {
      title: 'Natural Language Processing',
      shortDescription: 'Process and analyze text data with NLP techniques and transformers',
      description: 'Master NLP with Python, NLTK, spaCy, and transformers. Build chatbots, sentiment analysis, text classification, and work with large language models.',
      level: 'Advanced',
      language: 'English',
      actualPrice: 5799,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Text preprocessing and tokenization',
        'Word embeddings and Word2Vec',
        'Transformers and BERT',
        'Sentiment analysis',
        'Build NLP applications'
      ],
      lessons: [
        { title: 'NLP Fundamentals', description: 'Text processing basics', duration: 45, order: 1, isFree: true },
        { title: 'Text Preprocessing', description: 'Tokenization, stemming, lemmatization', duration: 50, order: 2, isFree: true },
        { title: 'Word Embeddings', description: 'Word2Vec, GloVe, FastText', duration: 55, order: 3, isFree: false },
        { title: 'Transformers', description: 'BERT, GPT, and attention mechanism', duration: 70, order: 4, isFree: false },
        { title: 'NLP Project', description: 'Build chatbot or sentiment analyzer', duration: 80, order: 5, isFree: false }
      ]
    },
    {
      title: 'Computer Vision with OpenCV',
      shortDescription: 'Process images and videos with OpenCV and deep learning',
      description: 'Learn computer vision from scratch with OpenCV and deep learning. Master image processing, object detection, face recognition, and video analysis.',
      level: 'Intermediate',
      language: 'English',
      actualPrice: 5299,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'OpenCV fundamentals',
        'Image processing techniques',
        'Object detection with YOLO',
        'Face recognition',
        'Video analysis applications'
      ],
      lessons: [
        { title: 'OpenCV Basics', description: 'Read, display, and manipulate images', duration: 40, order: 1, isFree: true },
        { title: 'Image Processing', description: 'Filters, transformations, edge detection', duration: 50, order: 2, isFree: true },
        { title: 'Feature Detection', description: 'SIFT, SURF, ORB features', duration: 55, order: 3, isFree: false },
        { title: 'Object Detection', description: 'YOLO and SSD models', duration: 65, order: 4, isFree: false },
        { title: 'Face Recognition', description: 'Build face recognition system', duration: 70, order: 5, isFree: false }
      ]
    },
    {
      title: 'MLOps - ML in Production',
      shortDescription: 'Deploy, monitor and maintain machine learning models in production',
      description: 'Master MLOps practices for production ML systems. Learn CI/CD for ML, model monitoring, version control, and scalable deployment strategies.',
      level: 'Advanced',
      language: 'English',
      actualPrice: 5999,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'MLOps fundamentals',
        'Model versioning with MLflow',
        'CI/CD for ML pipelines',
        'Model monitoring and drift detection',
        'Scalable ML deployment'
      ],
      lessons: [
        { title: 'MLOps Introduction', description: 'ML lifecycle and challenges', duration: 35, order: 1, isFree: true },
        { title: 'Model Versioning', description: 'MLflow and experiment tracking', duration: 50, order: 2, isFree: true },
        { title: 'ML Pipelines', description: 'Automated training pipelines', duration: 60, order: 3, isFree: false },
        { title: 'Model Monitoring', description: 'Detect drift and performance issues', duration: 55, order: 4, isFree: false },
        { title: 'Production Deployment', description: 'Deploy on Kubernetes', duration: 75, order: 5, isFree: false }
      ]
    }
  ],

  'DevOps': [
    {
      title: 'Docker Containerization Complete',
      shortDescription: 'Master Docker containers for application deployment and DevOps',
      description: 'Learn Docker from basics to advanced concepts. Master containers, images, Docker Compose, networking, and orchestration for modern application deployment.',
      level: 'Beginner',
      language: 'English',
      actualPrice: 3999,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Docker fundamentals',
        'Container lifecycle management',
        'Docker images and Dockerfiles',
        'Docker Compose for multi-container apps',
        'Container best practices'
      ],
      lessons: [
        { title: 'Docker Basics', description: 'Containers vs VMs, installation', duration: 35, order: 1, isFree: true },
        { title: 'Docker Images', description: 'Creating and managing images', duration: 45, order: 2, isFree: true },
        { title: 'Dockerfile', description: 'Writing efficient Dockerfiles', duration: 50, order: 3, isFree: false },
        { title: 'Docker Compose', description: 'Multi-container applications', duration: 55, order: 4, isFree: false },
        { title: 'Docker Networking', description: 'Container networking and volumes', duration: 50, order: 5, isFree: false }
      ]
    },
    {
      title: 'Kubernetes Orchestration',
      shortDescription: 'Deploy and manage containerized applications with Kubernetes',
      description: 'Master Kubernetes for container orchestration. Learn pods, services, deployments, scaling, and production-ready Kubernetes cluster management.',
      level: 'Intermediate',
      language: 'English',
      actualPrice: 5499,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Kubernetes architecture',
        'Pods, services, and deployments',
        'ConfigMaps and Secrets',
        'Scaling and load balancing',
        'Production cluster management'
      ],
      lessons: [
        { title: 'K8s Fundamentals', description: 'Kubernetes architecture and concepts', duration: 45, order: 1, isFree: true },
        { title: 'Pods and Services', description: 'Core Kubernetes objects', duration: 50, order: 2, isFree: true },
        { title: 'Deployments', description: 'Managing application lifecycle', duration: 55, order: 3, isFree: false },
        { title: 'Configuration', description: 'ConfigMaps, Secrets, and volumes', duration: 50, order: 4, isFree: false },
        { title: 'Production Best Practices', description: 'Monitoring and troubleshooting', duration: 70, order: 5, isFree: false }
      ]
    },
    {
      title: 'CI/CD with Jenkins & GitHub Actions',
      shortDescription: 'Automate build, test, and deployment pipelines',
      description: 'Master continuous integration and deployment with Jenkins and GitHub Actions. Build automated pipelines for testing, building, and deploying applications.',
      level: 'Intermediate',
      language: 'English',
      actualPrice: 4299,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'CI/CD fundamentals',
        'Jenkins pipeline creation',
        'GitHub Actions workflows',
        'Automated testing',
        'Deployment automation'
      ],
      lessons: [
        { title: 'CI/CD Introduction', description: 'Continuous integration concepts', duration: 35, order: 1, isFree: true },
        { title: 'Jenkins Setup', description: 'Install and configure Jenkins', duration: 40, order: 2, isFree: true },
        { title: 'Jenkins Pipelines', description: 'Create declarative pipelines', duration: 55, order: 3, isFree: false },
        { title: 'GitHub Actions', description: 'Automate with GitHub workflows', duration: 50, order: 4, isFree: false },
        { title: 'Complete Pipeline', description: 'Build end-to-end CI/CD pipeline', duration: 65, order: 5, isFree: false }
      ]
    },
    {
      title: 'Terraform Infrastructure as Code',
      shortDescription: 'Automate infrastructure provisioning with Terraform',
      description: 'Learn infrastructure as code with Terraform. Provision and manage cloud resources on AWS, Azure, and GCP with declarative configuration.',
      level: 'Intermediate',
      language: 'English',
      actualPrice: 4799,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Infrastructure as Code concepts',
        'Terraform syntax and workflow',
        'Provider configuration',
        'State management',
        'Multi-cloud provisioning'
      ],
      lessons: [
        { title: 'Terraform Basics', description: 'IaC and Terraform introduction', duration: 40, order: 1, isFree: true },
        { title: 'HCL Syntax', description: 'HashiCorp Configuration Language', duration: 45, order: 2, isFree: true },
        { title: 'Resources & Modules', description: 'Creating and organizing resources', duration: 50, order: 3, isFree: false },
        { title: 'State Management', description: 'Remote state and locking', duration: 55, order: 4, isFree: false },
        { title: 'AWS Infrastructure', description: 'Provision complete AWS setup', duration: 70, order: 5, isFree: false }
      ]
    },
    {
      title: 'AWS DevOps Complete Guide',
      shortDescription: 'Master AWS services for DevOps and cloud infrastructure',
      description: 'Learn AWS DevOps tools and services. Master EC2, S3, RDS, Lambda, CloudFormation, and build complete cloud infrastructure.',
      level: 'Intermediate',
      language: 'English',
      actualPrice: 5299,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'AWS core services',
        'EC2 and auto-scaling',
        'AWS Lambda serverless',
        'CloudFormation templates',
        'AWS CodePipeline for CI/CD'
      ],
      lessons: [
        { title: 'AWS Fundamentals', description: 'AWS services overview', duration: 40, order: 1, isFree: true },
        { title: 'EC2 & Networking', description: 'Virtual servers and VPC', duration: 50, order: 2, isFree: true },
        { title: 'Storage Services', description: 'S3, EBS, and databases', duration: 55, order: 3, isFree: false },
        { title: 'Lambda Serverless', description: 'Serverless computing', duration: 60, order: 4, isFree: false },
        { title: 'CI/CD on AWS', description: 'CodePipeline and CodeDeploy', duration: 65, order: 5, isFree: false }
      ]
    }
  ],

  'DSA': [
    {
      title: 'Data Structures & Algorithms Mastery',
      shortDescription: 'Master DSA for coding interviews and competitive programming',
      description: 'Complete DSA course covering arrays, linked lists, trees, graphs, sorting, searching, dynamic programming, and problem-solving techniques.',
      level: 'Beginner',
      language: 'English',
      actualPrice: 4999,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Arrays, strings, and hashing',
        'Linked lists and stacks',
        'Trees and graphs',
        'Sorting and searching algorithms',
        'Dynamic programming patterns'
      ],
      lessons: [
        { title: 'Arrays & Strings', description: 'Array manipulation and string problems', duration: 50, order: 1, isFree: true },
        { title: 'Linked Lists', description: 'Singly and doubly linked lists', duration: 55, order: 2, isFree: true },
        { title: 'Trees', description: 'Binary trees, BST, traversals', duration: 60, order: 3, isFree: false },
        { title: 'Graphs', description: 'BFS, DFS, shortest path', duration: 65, order: 4, isFree: false },
        { title: 'Dynamic Programming', description: 'DP patterns and problems', duration: 75, order: 5, isFree: false }
      ]
    },
    {
      title: 'LeetCode Interview Preparation',
      shortDescription: 'Solve top 150 LeetCode problems with detailed explanations',
      description: 'Master coding interviews by solving curated LeetCode problems. Learn patterns, techniques, and strategies to ace technical interviews at top companies.',
      level: 'Intermediate',
      language: 'English',
      actualPrice: 3999,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Problem-solving patterns',
        'Time and space complexity',
        'Top 150 LeetCode problems',
        'Interview strategies',
        'Code optimization techniques'
      ],
      lessons: [
        { title: 'Two Pointers Pattern', description: 'Solving with two pointers', duration: 45, order: 1, isFree: true },
        { title: 'Sliding Window', description: 'Window-based problems', duration: 50, order: 2, isFree: true },
        { title: 'Backtracking', description: 'Recursive backtracking problems', duration: 60, order: 3, isFree: false },
        { title: 'Graph Algorithms', description: 'Graph traversal and paths', duration: 65, order: 4, isFree: false },
        { title: 'Mock Interviews', description: 'Practice with real scenarios', duration: 70, order: 5, isFree: false }
      ]
    },
    {
      title: 'Competitive Programming',
      shortDescription: 'Master algorithms for competitive programming contests',
      description: 'Learn advanced algorithms and techniques for competitive programming. Master Codeforces, CodeChef, and AtCoder style problems.',
      level: 'Advanced',
      language: 'English',
      actualPrice: 4799,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Advanced data structures',
        'Graph algorithms',
        'Number theory',
        'Computational geometry',
        'Contest strategies'
      ],
      lessons: [
        { title: 'Contest Basics', description: 'Fast I/O and templates', duration: 40, order: 1, isFree: true },
        { title: 'Advanced DS', description: 'Segment trees, Fenwick trees', duration: 60, order: 2, isFree: true },
        { title: 'Graph Advanced', description: 'Dijkstra, Floyd-Warshall, MST', duration: 65, order: 3, isFree: false },
        { title: 'Number Theory', description: 'Modular arithmetic, primes', duration: 55, order: 4, isFree: false },
        { title: 'Practice Contests', description: 'Virtual contests and analysis', duration: 80, order: 5, isFree: false }
      ]
    },
    {
      title: 'System Design for Interviews',
      shortDescription: 'Design scalable systems for software engineering interviews',
      description: 'Master system design concepts for interviews at FAANG companies. Learn to design Twitter, YouTube, Instagram, and other large-scale systems.',
      level: 'Advanced',
      language: 'English',
      actualPrice: 5499,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'System design fundamentals',
        'Scalability and load balancing',
        'Database design',
        'Caching strategies',
        'Design popular systems'
      ],
      lessons: [
        { title: 'Design Fundamentals', description: 'Basics of system design', duration: 45, order: 1, isFree: true },
        { title: 'Scalability', description: 'Horizontal vs vertical scaling', duration: 50, order: 2, isFree: true },
        { title: 'Database Design', description: 'SQL vs NoSQL, sharding', duration: 60, order: 3, isFree: false },
        { title: 'Caching & CDN', description: 'Redis, Memcached, CDN strategies', duration: 55, order: 4, isFree: false },
        { title: 'Design Examples', description: 'Twitter, YouTube, Uber design', duration: 85, order: 5, isFree: false }
      ]
    },
    {
      title: 'Algorithm Design & Analysis',
      shortDescription: 'Learn algorithm design techniques and complexity analysis',
      description: 'Master algorithm design paradigms including divide-and-conquer, greedy, dynamic programming, and analyze time-space complexity.',
      level: 'Intermediate',
      language: 'English',
      actualPrice: 4299,
      offerPrice: 0,
      isFree: true,
      whatYouWillLearn: [
        'Algorithm design paradigms',
        'Complexity analysis',
        'Divide and conquer',
        'Greedy algorithms',
        'Advanced sorting techniques'
      ],
      lessons: [
        { title: 'Complexity Analysis', description: 'Big O, Omega, Theta notation', duration: 40, order: 1, isFree: true },
        { title: 'Divide & Conquer', description: 'Merge sort, quick sort', duration: 50, order: 2, isFree: true },
        { title: 'Greedy Algorithms', description: 'Activity selection, Huffman coding', duration: 55, order: 3, isFree: false },
        { title: 'Dynamic Programming', description: 'Memoization and tabulation', duration: 65, order: 4, isFree: false },
        { title: 'Advanced Sorting', description: 'Radix sort, counting sort', duration: 50, order: 5, isFree: false }
      ]
    }
  ]
};

const seedCourses = async () => {
  try {
    console.log('🌱 Starting course seeding...\n');
    
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

    // Count existing courses
    const existingCount = await Course.countDocuments();
    console.log(`📊 Existing courses: ${existingCount}\n`);

    const instructorData = {
      name: 'Md Mijanur Molla',
      bio: 'Expert instructor with 5+ years of experience in teaching technology and programming. Passionate about making complex concepts simple and accessible.',
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
          const exists = await Course.findOne({ 
            title: course.title,
            category: category 
          });
          
          if (!exists) {
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
    console.log('🎉 COURSE SEEDING COMPLETE!');
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

seedCourses();
