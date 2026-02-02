import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Blog from '../models/Blog.js';

dotenv.config();

// Generate random date between now and 30 days ago
const getRandomDate = () => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30) + 1; // 1-30 days ago
  const randomDate = new Date(now);
  randomDate.setDate(now.getDate() - daysAgo);
  return randomDate;
};

const blogPosts = [
  // Trending Tech News
  {
    title: 'AI Revolution: ChatGPT-5 Released with Groundbreaking Features',
    shortDescription: 'OpenAI unveils ChatGPT-5 with revolutionary multimodal capabilities and 10x faster processing.',
    content: 'OpenAI has officially released ChatGPT-5, marking a significant milestone in artificial intelligence. The new model features enhanced reasoning capabilities, real-time data processing, and improved contextual understanding. Key improvements include 10x faster response times, advanced code generation, and seamless integration with third-party applications. Industry experts predict this will revolutionize how developers build AI-powered applications.',
    category: 'Trending Tech News',
    tags: ['AI', 'ChatGPT', 'OpenAI', 'Machine Learning'],
    coverImage: ''
  },
  {
    title: 'Meta Launches Revolutionary AR Glasses for Developers',
    shortDescription: 'Meta introduces AR glasses with holographic displays, changing the future of augmented reality.',
    content: 'Meta has unveiled its latest AR glasses designed specifically for developers. The device features lightweight design, 120° field of view, and advanced gesture recognition. With built-in AI processing and seamless smartphone integration, these glasses promise to revolutionize how we interact with digital content. Early reviews praise the comfort and battery life, lasting up to 8 hours on a single charge.',
    category: 'Trending Tech News',
    tags: ['AR', 'Meta', 'Augmented Reality', 'Wearables'],
    coverImage: ''
  },
  {
    title: 'Quantum Computing Breakthrough: IBM Achieves 1000-Qubit Processor',
    shortDescription: 'IBM reaches new milestone with 1000-qubit quantum processor, accelerating quantum computing era.',
    content: 'IBM has successfully demonstrated a 1000-qubit quantum processor, marking a major breakthrough in quantum computing. This advancement brings us closer to solving complex problems in drug discovery, climate modeling, and cryptography. The new processor shows improved error correction and stability, making it more practical for real-world applications. Researchers believe this could accelerate AI development and scientific discoveries.',
    category: 'Trending Tech News',
    tags: ['Quantum Computing', 'IBM', 'Technology', 'Innovation'],
    coverImage: ''
  },
  {
    title: 'Google Announces Gemini 2.0: The Most Powerful AI Model Yet',
    shortDescription: 'Google releases Gemini 2.0 with superior reasoning and multimodal capabilities surpassing GPT-4.',
    content: 'Google has launched Gemini 2.0, claiming it as the most capable AI model to date. The model demonstrates exceptional performance in mathematics, coding, and creative tasks. It features native multimodal understanding, processing text, images, audio, and video simultaneously. Developers can now access the API for integration into applications, with competitive pricing and generous rate limits.',
    category: 'Trending Tech News',
    tags: ['Google', 'AI', 'Gemini', 'Machine Learning'],
    coverImage: ''
  },
  {
    title: 'GitHub Copilot X: AI Pair Programming Reaches New Heights',
    shortDescription: 'GitHub unveils Copilot X with voice commands, PR reviews, and context-aware suggestions.',
    content: 'GitHub has introduced Copilot X, the next evolution of AI-powered coding assistant. New features include voice-to-code, automatic pull request descriptions, and intelligent test generation. The tool now understands entire codebases, providing context-aware suggestions that significantly reduce development time. Early adopters report 40% increase in productivity and fewer bugs in production code.',
    category: 'Trending Tech News',
    tags: ['GitHub', 'Copilot', 'AI', 'Developer Tools'],
    coverImage: ''
  },

  // Interesting Facts
  {
    title: '10 Mind-Blowing Facts About JavaScript You Didn\'t Know',
    shortDescription: 'Discover surprising JavaScript facts that will change how you think about the language.',
    content: 'JavaScript was created in just 10 days by Brendan Eich in 1995. Originally named Mocha, then LiveScript, before becoming JavaScript for marketing reasons. Did you know JavaScript has no relation to Java? The name was chosen to ride Java\'s popularity wave. JavaScript is the only language that runs natively in all browsers. With over 12 million developers, it\'s the most popular programming language. Node.js transformed JavaScript into a backend powerhouse. Fun fact: JavaScript can run on Mars rovers! NASA uses it for some space missions.',
    category: 'Interesting Facts',
    tags: ['JavaScript', 'Programming', 'History', 'Fun Facts'],
    coverImage: ''
  },
  {
    title: 'The Untold Story of How Linux Changed the World',
    shortDescription: 'From a college project to powering 90% of cloud infrastructure - the Linux journey.',
    content: 'In 1991, Linus Torvalds, a 21-year-old student, released Linux as a hobby project. Today, Linux powers 90% of cloud infrastructure, all Android devices, and most supercomputers. The Linux kernel has over 27 million lines of code contributed by thousands of developers worldwide. Major companies like Google, Amazon, and Microsoft rely heavily on Linux. Fun fact: The original Linux announcement email said it won\'t be big and professional like GNU. Today, Linux Foundation members include Apple, Microsoft, and Intel.',
    category: 'Interesting Facts',
    tags: ['Linux', 'Open Source', 'History', 'Technology'],
    coverImage: ''
  },
  {
    title: 'Python: From Hobby Project to World\'s Most Loved Language',
    shortDescription: 'How a Christmas holiday project became the go-to language for AI and data science.',
    content: 'Guido van Rossum created Python during Christmas 1989 as a hobby project. Named after Monty Python\'s Flying Circus, not the snake! Python\'s philosophy emphasizes code readability with significant whitespace. Today, it\'s the primary language for AI, ML, and data science. Instagram, YouTube, and Netflix heavily use Python in their backend. Python developers earn among the highest salaries globally. The Zen of Python contains 19 aphorisms, but the 20th remains mysterious and unwritten.',
    category: 'Interesting Facts',
    tags: ['Python', 'Programming', 'Data Science', 'History'],
    coverImage: ''
  },
  {
    title: 'The Internet: From 4 Computers to 5 Billion Users',
    shortDescription: 'Fascinating facts about the internet\'s evolution from ARPANET to the modern web.',
    content: 'The first internet message was "LO" - they were trying to send "LOGIN" but the system crashed! ARPANET started with just 4 computers in 1969. The first email was sent in 1971 by Ray Tomlinson, who also chose the @ symbol. The World Wide Web was created by Tim Berners-Lee in 1989 as a side project. The first website is still online at its original URL. Google processes over 8.5 billion searches daily. 90% of internet data was created in the last 2 years. Fun fact: More people have internet access than clean drinking water!',
    category: 'Interesting Facts',
    tags: ['Internet', 'History', 'Technology', 'Web'],
    coverImage: ''
  },
  {
    title: 'Amazing Facts About Programming Languages You Use Daily',
    shortDescription: 'Surprising origins and quirks of popular programming languages that power our world.',
    content: 'C was created to rewrite UNIX, which was originally written in assembly. C++ was called "C with Classes" initially. Java was originally designed for interactive television. JavaScript was created in 10 days (yes, that explains a lot!). Python can be written in just one line due to its flexibility. Ruby was influenced by Perl, Smalltalk, and Ada. Go was created by Google employees who got frustrated waiting for C++ to compile. Rust guarantees memory safety without garbage collection. Swift was designed to be "Objective-C without the C". Programming languages influence how we think about problems!',
    category: 'Interesting Facts',
    tags: ['Programming Languages', 'History', 'Technology', 'Fun Facts'],
    coverImage: ''
  },

  // Daily Coding
  {
    title: 'Daily Coding Challenge: Reverse a Linked List in One Pass',
    shortDescription: 'Master pointer manipulation with this classic interview question - solve it in O(n) time.',
    content: 'Today\'s challenge: Reverse a singly linked list in one pass without using extra space. This is a fundamental problem that tests your understanding of pointers and linked list manipulation. Approach: Use three pointers (prev, current, next) to reverse links while traversing. Time Complexity: O(n), Space Complexity: O(1). Tips: Draw diagrams to visualize pointer movements. Watch out for null pointer exceptions. Practice this problem until you can code it without thinking. Variations: Reverse in groups of K, Reverse alternate K nodes. Companies asking this: Google, Amazon, Microsoft, Facebook.',
    category: 'Daily Coding',
    tags: ['Coding Challenge', 'Linked List', 'Algorithm', 'Interview'],
    coverImage: ''
  },
  {
    title: 'Code Golf: Find Two Sum in Array - Shortest Solution',
    shortDescription: 'Classic LeetCode problem with multiple approaches from brute force to optimal HashMap solution.',
    content: 'Problem: Given an array and target sum, find indices of two numbers that add up to target. Brute Force: O(n²) - Check every pair. Better: Sort and two-pointer approach O(n log n). Optimal: HashMap for O(n) time and space. JavaScript solution: Use Map() for fast lookups. Python solution: Dictionary for elegant one-liner. Pro tip: Always ask about duplicates and multiple solutions. Edge cases: Empty array, single element, no solution exists. Follow-up questions: What if array is sorted? What if we need all pairs? Companies love this question: Apple, Amazon, LinkedIn, Microsoft.',
    category: 'Daily Coding',
    tags: ['LeetCode', 'Arrays', 'HashMap', 'Interview Prep'],
    coverImage: ''
  },
  {
    title: 'Binary Search Mastery: Find Peak Element Challenge',
    shortDescription: 'Apply binary search creatively to find local maximum in O(log n) time complexity.',
    content: 'Today\'s problem: Find a peak element in an array where peak is greater than neighbors. Intuition: Use binary search by comparing mid with neighbors. If mid < mid+1, peak exists on right. If mid > mid+1, peak exists on left. Code pattern: Modified binary search template. Time: O(log n), Space: O(1). Key insight: Array always has a peak (even in edges). Variations: Find all peaks, 2D peak finding. Real-world use: Signal processing, terrain analysis. Practice platforms: LeetCode #162, HackerRank, CodeForces. Master binary search - it appears in 30% of coding interviews!',
    category: 'Daily Coding',
    tags: ['Binary Search', 'Arrays', 'Algorithm', 'DSA'],
    coverImage: ''
  },
  {
    title: 'Dynamic Programming: Climbing Stairs Problem Explained',
    shortDescription: 'Learn DP fundamentals with this beginner-friendly Fibonacci variation problem.',
    content: 'Problem: You can climb 1 or 2 steps at a time. How many ways to reach nth step? Solution: Classic DP problem similar to Fibonacci. Recurrence: f(n) = f(n-1) + f(n-2). Approaches: 1) Recursion O(2^n) - too slow. 2) Memoization O(n) - top-down DP. 3) Tabulation O(n) - bottom-up DP. 4) Space optimized O(1) - only store last two values. Code in Python, Java, JavaScript. Master this pattern - it applies to many problems! Follow-ups: Jump k steps, cost array, print all paths. Companies asking: Google, Amazon, Microsoft, Bloomberg. DP is crucial for senior interviews!',
    category: 'Daily Coding',
    tags: ['Dynamic Programming', 'LeetCode', 'Fibonacci', 'Interview'],
    coverImage: ''
  },
  {
    title: 'String Manipulation: Valid Palindrome - Multiple Approaches',
    shortDescription: 'Master string techniques with palindrome checking using two-pointer and regex methods.',
    content: 'Challenge: Check if string is palindrome ignoring spaces, punctuation, and case. Approach 1: Two pointers O(n). Approach 2: Reverse and compare O(n). Approach 3: Regex cleaning then check. Edge cases: Empty string, single char, all spaces. Optimization: Skip non-alphanumeric without extra space. Follow-ups: Valid palindrome removing one character, longest palindromic substring. Languages: JavaScript trim() and toLowerCase(), Python isalnum() method. Advanced: Manacher\'s algorithm for longest palindrome O(n). Practice problems: LeetCode #125, #680, #5. Companies: Amazon, Microsoft, Facebook interview favorite!',
    category: 'Daily Coding',
    tags: ['Strings', 'Two Pointer', 'Palindrome', 'Algorithms'],
    coverImage: ''
  },

  // Software Developer
  {
    title: 'Clean Code Principles Every Developer Must Follow in 2026',
    shortDescription: 'Write maintainable, readable code that your future self will thank you for.',
    content: 'Clean code is not about working code, it\'s about code that others can easily understand and maintain. Key principles: 1) Meaningful names - avoid abbreviations. 2) Functions should do ONE thing. 3) Don\'t Repeat Yourself (DRY). 4) Comments explain WHY, not WHAT. 5) Error handling is not an afterthought. 6) Write tests first (TDD). 7) Keep functions small (max 20 lines). 8) Use consistent formatting. Uncle Bob\'s rules: Leave code cleaner than you found it. Code is read 10x more than written. Remember: Debugging is twice as hard as writing code. If you write clever code, you won\'t be able to debug it!',
    category: 'Software Developer',
    tags: ['Clean Code', 'Best Practices', 'Programming', 'Career'],
    coverImage: ''
  },
  {
    title: 'Git Workflow Mastery: From Beginner to Pro Developer',
    shortDescription: 'Master Git branching strategies, rebase, cherry-pick, and team collaboration workflows.',
    content: 'Git is more than just commit and push! Master these concepts: Branching strategies: Git Flow, GitHub Flow, Trunk-based development. Key commands: rebase vs merge, cherry-pick for selective commits, stash for temporary changes, reset vs revert. Team workflow: Create feature branches, write meaningful commit messages, use pull requests effectively. Pro tips: Use aliases for common commands, write descriptive commit messages (50 char summary), squash commits before merging. Advanced: Interactive rebase, bisect for bug hunting, reflog to recover lost commits. Common mistakes: Pushing to main, large binary files, commit secrets. Tools: GitKraken, SourceTree, VS Code Git integration.',
    category: 'Software Developer',
    tags: ['Git', 'Version Control', 'DevOps', 'Workflow'],
    coverImage: ''
  },
  {
    title: 'REST API Best Practices: Design APIs Like a Senior Engineer',
    shortDescription: 'Build scalable, maintainable REST APIs following industry standards and conventions.',
    content: 'Great APIs make integration effortless! Best practices: 1) Use nouns for endpoints, not verbs. 2) HTTP methods: GET, POST, PUT, PATCH, DELETE correctly. 3) Version your API (/v1/, /v2/). 4) Use plural nouns (/users, not /user). 5) Filtering, sorting, pagination for collections. 6) Proper HTTP status codes (200, 201, 400, 401, 404, 500). 7) Consistent error responses. 8) Rate limiting to prevent abuse. Security: Always use HTTPS, implement authentication (JWT, OAuth), validate input, sanitize output. Documentation: Use Swagger/OpenAPI, provide examples, explain error codes. Testing: Unit tests, integration tests, load testing. Remember: API is a contract - breaking changes need versioning!',
    category: 'Software Developer',
    tags: ['API', 'REST', 'Backend', 'Web Development'],
    coverImage: ''
  },
  {
    title: 'Database Optimization: Speed Up Your Queries 100x',
    shortDescription: 'Learn indexing strategies, query optimization, and performance tuning for databases.',
    content: 'Slow queries killing your app performance? Master these optimization techniques! Indexing: Create indexes on frequently queried columns, composite indexes for multiple columns, avoid over-indexing (slows writes). Query optimization: Use EXPLAIN to analyze, avoid SELECT *, use WHERE instead of HAVING, limit result sets. Schema design: Normalize to reduce redundancy, denormalize for read-heavy apps, use appropriate data types. Advanced: Connection pooling, query caching, read replicas, database sharding. Monitoring: Track slow queries, monitor CPU and memory usage. Common mistakes: N+1 query problem, missing indexes, large JOIN operations. Tools: pgAdmin, MySQL Workbench, DataGrip, monitoring with Prometheus. Remember: Premature optimization is evil, but ignoring performance is worse!',
    category: 'Software Developer',
    tags: ['Database', 'SQL', 'Performance', 'Optimization'],
    coverImage: ''
  },
  {
    title: 'Microservices Architecture: When and How to Implement',
    shortDescription: 'Learn microservices patterns, service communication, and when to choose monolith vs microservices.',
    content: 'Microservices are not always the answer! When to use: Large teams, different tech stacks needed, independent scaling required, complex domain. When NOT to use: Small teams, simple applications, unclear boundaries, lack of DevOps expertise. Key patterns: API Gateway for routing, Service discovery (Consul, Eureka), Circuit breaker for resilience, Event-driven communication (Kafka, RabbitMQ). Challenges: Distributed transactions, data consistency, increased complexity, network latency. Best practices: Database per service, containerization with Docker, orchestration with Kubernetes, monitoring and logging (ELK stack, Prometheus). Communication: REST for synchronous, Message queues for async, gRPC for high performance. Start with monolith, split when necessary!',
    category: 'Software Developer',
    tags: ['Microservices', 'Architecture', 'System Design', 'Backend'],
    coverImage: ''
  },

  // Web Development
  {
    title: 'React 19 Features: Everything You Need to Know',
    shortDescription: 'Explore Server Components, Actions, and new hooks revolutionizing React development.',
    content: 'React 19 brings game-changing features! Server Components: Render on server, reduce bundle size, improve performance. React Actions: Handle forms without useState, automatic pending states, optimistic updates. New hooks: useFormStatus for form states, useOptimistic for instant UI updates, use() for reading resources. Compiler improvements: Auto-memoization, better performance without useMemo/useCallback. Breaking changes: Remove legacy APIs, new strict mode behaviors. Migration guide: Update gradually, use codemods, test thoroughly. Best practices: Use Server Components by default, Client Components only when needed, leverage Actions for forms. Framework support: Next.js 14+, Remix, Gatsby fully support React 19. Future: Better Suspense, improved DevTools, streaming SSR improvements.',
    category: 'Web Development',
    tags: ['React', 'JavaScript', 'Frontend', 'Web'],
    coverImage: ''
  },
  {
    title: 'CSS Grid vs Flexbox: Complete Guide to Modern Layouts',
    shortDescription: 'Master CSS layout systems and know when to use Grid or Flexbox for perfect designs.',
    content: 'Grid and Flexbox solve different problems! Flexbox: One-dimensional layouts (rows OR columns), content-first design, flexible item sizing, perfect for navigation, cards. Grid: Two-dimensional layouts (rows AND columns), layout-first design, explicit positioning, perfect for page layouts, complex grids. When to use: Flexbox for components, Grid for page structure, combine both for powerful layouts. Grid features: Template areas for semantic layouts, auto-fit and auto-fill for responsive, minmax() for flexible sizing. Flexbox features: justify-content, align-items, gap property, flex-grow and flex-shrink. Pro tips: Use Grid for outer structure, Flexbox for inner components, CSS Grid is not overkill for simple layouts. Browser support: Both fully supported in modern browsers. Learn both - they complement each other!',
    category: 'Web Development',
    tags: ['CSS', 'Layout', 'Frontend', 'Design'],
    coverImage: ''
  },
  {
    title: 'TypeScript 5.5: Advanced Types and Best Practices',
    shortDescription: 'Level up your TypeScript skills with advanced patterns, generics, and type safety.',
    content: 'TypeScript 5.5 introduces powerful features! New: const type parameters, decorators in ES standard, performance improvements. Advanced types: Conditional types for flexible APIs, mapped types for transformations, template literal types for string manipulation. Generics: Write reusable code with type constraints, infer types automatically, use utility types (Partial, Pick, Omit). Best practices: Strict mode always, avoid any, prefer interfaces for objects, use type for unions, explicit return types for functions. Config: Use paths for aliases, enable strict checks, incremental compilation for speed. Common patterns: Discriminated unions for type safety, branded types for validation, builder pattern with types. Migration: Gradual adoption, start with .ts files, add types incrementally, use // @ts-check for JS files. Remember: Types are documentation that never lies!',
    category: 'Web Development',
    tags: ['TypeScript', 'JavaScript', 'Programming', 'Types'],
    coverImage: ''
  },
  {
    title: 'Web Performance Optimization: Make Your Site Lightning Fast',
    shortDescription: 'Achieve perfect Lighthouse scores with Core Web Vitals optimization techniques.',
    content: 'Speed matters - 1 second delay = 7% less conversions! Core Web Vitals: LCP (Largest Contentful Paint) < 2.5s, FID (First Input Delay) < 100ms, CLS (Cumulative Layout Shift) < 0.1. Optimization techniques: Images - WebP format, lazy loading, srcset for responsive, optimize size. Code - Tree shaking, code splitting, minification, compression. Loading - Defer non-critical JS, async scripts, preload critical resources, HTTP/2 for multiplexing. Rendering - SSR for fast initial load, CSR for interactivity, ISR for best of both. Caching - Service workers, cache headers, CDN for static assets. Tools: Lighthouse, WebPageTest, Chrome DevTools, Webpack Bundle Analyzer. Monitoring: Real User Monitoring (RUM), synthetic testing, performance budgets. Remember: Fast sites rank higher in Google!',
    category: 'Web Development',
    tags: ['Performance', 'Optimization', 'Web', 'SEO'],
    coverImage: ''
  },
  {
    title: 'Next.js 15: App Router, Server Actions, and Beyond',
    shortDescription: 'Build production-ready applications with Next.js 15\'s powerful features and patterns.',
    content: 'Next.js 15 redefines full-stack development! App Router: File-based routing with layouts, nested routes support, parallel routes, intercepting routes. Server Components: Default rendering on server, automatic code splitting, reduced bundle size. Server Actions: Server-side functions callable from client, form handling without API routes, type-safe RPC. Streaming: Progressive page rendering, instant loading states, Suspense boundaries. Data fetching: fetch() with caching, revalidation strategies, dynamic and static rendering. Middleware: Edge functions for authentication, redirects, headers. Deployment: Vercel for zero-config, Docker containers, self-hosting options. Best practices: Use Server Components by default, Client Components sparingly, leverage streaming for UX. Turbopack: 700x faster than Webpack. Migration from Pages Router: Gradual adoption possible!',
    category: 'Web Development',
    tags: ['Next.js', 'React', 'Full Stack', 'Framework'],
    coverImage: ''
  },

  // AI & Machine Learning
  {
    title: 'Getting Started with Machine Learning: Complete Roadmap',
    shortDescription: 'Your step-by-step guide from basics to building production ML models.',
    content: 'ML roadmap for beginners! Prerequisites: Python programming, linear algebra, statistics, calculus basics. Step 1: Learn Python libraries - NumPy for arrays, Pandas for data manipulation, Matplotlib for visualization. Step 2: ML fundamentals - supervised vs unsupervised, regression vs classification, training vs testing. Step 3: Algorithms - Linear regression, logistic regression, decision trees, random forests, SVM, neural networks. Step 4: Deep learning - TensorFlow or PyTorch, CNNs for images, RNNs for sequences, transformers. Step 5: Practical projects - Kaggle competitions, real datasets, deploy models. Resources: Andrew Ng\'s course, fast.ai, Coursera, Google Colab for free GPUs. Tools: Jupyter notebooks, scikit-learn, Keras. Career path: Data scientist, ML engineer, AI researcher. Remember: Practice is key - build projects!',
    category: 'AI & Machine Learning',
    tags: ['Machine Learning', 'AI', 'Python', 'Career'],
    coverImage: ''
  },
  {
    title: 'Build Your Own ChatGPT: Fine-tune LLMs for Custom Use Cases',
    shortDescription: 'Learn to fine-tune large language models using your own data and deploy them.',
    content: 'Create custom AI assistants! What you\'ll learn: Load pre-trained models (GPT-2, LLaMA, Mistral), fine-tune on custom data, optimize for specific tasks. Technologies: Hugging Face Transformers, LoRA for efficient fine-tuning, Quantization for smaller models. Process: 1) Prepare training data in correct format. 2) Choose base model based on task. 3) Configure training parameters. 4) Fine-tune with gradient accumulation. 5) Evaluate on validation set. 6) Deploy with inference optimization. Tools: Google Colab, AWS SageMaker, Modal for serverless. Cost optimization: Use smaller models, quantization, distillation. Use cases: Customer support bots, code generation, content creation, domain-specific QA. Ethical considerations: Bias mitigation, content filtering, responsible AI. Future: Smaller models with better performance!',
    category: 'AI & Machine Learning',
    tags: ['LLM', 'AI', 'NLP', 'ChatGPT'],
    coverImage: ''
  },
  {
    title: 'Computer Vision with YOLO: Real-time Object Detection',
    shortDescription: 'Build object detection systems using YOLOv8 for real-time applications.',
    content: 'Master real-time object detection! YOLOv8: Latest version, faster and more accurate, easy to use API. Applications: Security cameras, autonomous vehicles, retail analytics, healthcare diagnostics. Implementation: Install ultralytics library, load pre-trained model, run inference on images/videos, train custom models. Custom training: Collect labeled data, data augmentation, configure hyperparameters, train on GPU, export to ONNX/TensorRT. Performance: 640x640 input, 50+ FPS on GPU, mAP 53.9% on COCO. Deployment: Edge devices (Jetson Nano), cloud (AWS Lambda), mobile (TensorFlow Lite). Alternatives: SSD for speed, Mask R-CNN for segmentation, SAM for interactive. Tools: Roboflow for labeling, Weights & Biases for experiments. Projects: Face detection, license plate recognition, defect detection. Future: Foundation models, zero-shot detection!',
    category: 'AI & Machine Learning',
    tags: ['Computer Vision', 'YOLO', 'Deep Learning', 'AI'],
    coverImage: ''
  },
  {
    title: 'MLOps Best Practices: Deploy ML Models to Production',
    shortDescription: 'Learn CI/CD for ML, model monitoring, and production deployment strategies.',
    content: 'Bridge the gap between development and production! MLOps lifecycle: Data versioning (DVC), experiment tracking (MLflow, Weights & Biases), model versioning, containerization (Docker), orchestration (Kubernetes). Deployment strategies: REST API with FastAPI, batch predictions, real-time inference, edge deployment. Monitoring: Model drift detection, data drift, performance metrics, logging predictions. CI/CD: GitHub Actions for automation, automated testing, A/B testing models, canary deployments. Infrastructure: AWS SageMaker, Azure ML, GCP Vertex AI, or self-hosted. Best practices: Reproducible experiments, automated retraining, feature store, model registry. Challenges: Data quality, model degradation, scaling inference. Tools: Kubeflow, MLflow, Airflow for pipelines, Prometheus for monitoring. Remember: 90% of ML models never reach production - MLOps solves this!',
    category: 'AI & Machine Learning',
    tags: ['MLOps', 'DevOps', 'Production', 'Deployment'],
    coverImage: ''
  },
  {
    title: 'Generative AI: Create Images, Videos, and Music with AI',
    shortDescription: 'Explore Stable Diffusion, MidJourney alternatives, and generative models.',
    content: 'Create amazing content with AI! Image generation: Stable Diffusion XL for open-source, ControlNet for precise control, LoRA for fine-tuning styles, Inpainting for editing. Video generation: RunwayML Gen-2, Pika Labs, Stable Video Diffusion. Music: MusicGen, AudioCraft, Riffusion. Text-to-3D: Shap-E, DreamFusion. Implementation: Use Hugging Face diffusers, ComfyUI for workflows, Automatic1111 WebUI. Techniques: Prompt engineering for better results, negative prompts, CFG scale tuning, samplers comparison. Training: Fine-tune on custom datasets, DreamBooth for personalization, textual inversion. Applications: Marketing content, game assets, prototyping, personalized art. Ethics: Copyright concerns, deepfakes prevention, content attribution. Hardware: RTX 3060+ for local generation. Cloud: Replicate, Modal, Banana for inference. Future: Real-time generation, 3D world creation!',
    category: 'AI & Machine Learning',
    tags: ['Generative AI', 'Stable Diffusion', 'AI Art', 'Creative'],
    coverImage: ''
  },

  // Mobile Development
  {
    title: 'Flutter 3.5: Build Beautiful Cross-Platform Apps',
    shortDescription: 'Master Flutter with Material 3, performance improvements, and new widgets.',
    content: 'Flutter 3.5 brings exciting updates! New features: Material Design 3, improved performance, new widgets, better DevTools. Architecture: BLoC for state management, Clean Architecture for scalability, Repository pattern for data. UI/UX: Custom animations with Rive, adaptive layouts, dark mode support. Performance: const constructors, ListView.builder, image caching, reduce widget rebuilds. Native features: Platform channels, method channels, plugins. State management: Provider for simplicity, Riverpod for better syntax, BLoC for complex apps, GetX for rapid development. Navigation: GoRouter for declarative routing, nested navigation, deep linking. Backend integration: Dio for HTTP, Firebase for backend, GraphQL clients. Testing: Unit tests, widget tests, integration tests. Deployment: Play Store, App Store, code signing. Best practices: Null safety, proper widget lifecycle, efficient state management. Future: WASM support, better desktop!',
    category: 'Mobile Development',
    tags: ['Flutter', 'Mobile', 'Cross-platform', 'Dart'],
    coverImage: ''
  },
  {
    title: 'React Native: Native Mobile Apps with JavaScript',
    shortDescription: 'Build iOS and Android apps sharing code with React Native and Expo.',
    content: 'React Native enables true native development! Setup: Expo for managed workflow, bare React Native for flexibility. Core components: View, Text, Image, ScrollView, FlatList for performance. Navigation: React Navigation for stacks, tabs, drawers, deep linking. State management: Redux Toolkit, Zustand for lightweight, React Context. Styling: StyleSheet API, Styled Components, NativeWind for Tailwind. Native modules: Accessing native APIs, bridging native code, third-party libraries. Performance: Optimize renders, FlatList over ScrollView, Hermes engine, Fabric architecture. Development: Fast Refresh, debugging with Flipper, testing with Jest. Deployment: EAS Build for Expo, Fastlane for automation, OTA updates with CodePush. Alternatives: Compare with Flutter, native development. Best practices: TypeScript for type safety, proper component structure, error boundaries. Community: Large ecosystem, active development!',
    category: 'Mobile Development',
    tags: ['React Native', 'Mobile', 'JavaScript', 'Expo'],
    coverImage: ''
  },
  {
    title: 'iOS Development with Swift and SwiftUI',
    shortDescription: 'Create native iOS apps with modern Swift, SwiftUI, and Apple frameworks.',
    content: 'SwiftUI revolutionizes iOS development! Declarative UI: Build views with code, live preview, automatic state management. Swift basics: Value types, protocols, generics, async/await. SwiftUI components: Views, modifiers, containers, navigation, forms. Data flow: @State, @Binding, @ObservedObject, @EnvironmentObject, @Published. Navigation: NavigationStack, sheets, tabs, navigation split view. Lists: ForEach, List with sections, custom cells, search. Networking: URLSession, async/await, Codable for JSON. Data persistence: UserDefaults, Core Data, SwiftData (new). Concurrency: Tasks, actors, MainActor, structured concurrency. Testing: XCTest, UI testing, performance testing. App architecture: MVVM, Clean Architecture, Coordinator pattern. Frameworks: Combine for reactive, Core Location, MapKit, HealthKit. Deployment: App Store Connect, TestFlight, provisioning. Future: visionOS support, spatial computing!',
    category: 'Mobile Development',
    tags: ['iOS', 'Swift', 'SwiftUI', 'Apple'],
    coverImage: ''
  },
  {
    title: 'Android Development with Kotlin and Jetpack Compose',
    shortDescription: 'Build modern Android apps with Kotlin, Compose UI, and Android architecture.',
    content: 'Jetpack Compose is the future of Android! Modern Android: Kotlin first, Compose for UI, Material 3 design. Compose basics: Composables, modifiers, state, side effects, LaunchedEffect. UI components: Text, Button, TextField, LazyColumn for lists, Navigation. State management: remember, rememberSaveable, ViewModel, StateFlow. Architecture: MVVM with ViewModel, Clean Architecture, Repository pattern. Dependency injection: Hilt for DI, Koin alternative. Networking: Retrofit with coroutines, OkHttp, serialization with kotlinx. Database: Room for SQL, DataStore for preferences. Background work: WorkManager, Foreground services, AlarmManager. Testing: Unit tests with JUnit, UI tests with Espresso, Compose testing. Navigation: Compose Navigation, type-safe navigation, deep links. Performance: Recomposition optimization, derivedStateOf, remember smartly. Deployment: Play Store, signing, publishing. Future: Wear OS, Android Auto, TV!',
    category: 'Mobile Development',
    tags: ['Android', 'Kotlin', 'Jetpack Compose', 'Mobile'],
    coverImage: ''
  },
  {
    title: 'Mobile App Security: Protect Your Users\' Data',
    shortDescription: 'Implement encryption, secure storage, and authentication in mobile apps.',
    content: 'Security is not optional! Common vulnerabilities: Insecure data storage, weak authentication, insecure communication, code tampering. Data protection: Encrypt sensitive data, use Keychain (iOS) or Keystore (Android), never store credentials in plain text. Network security: HTTPS only, certificate pinning, ProGuard obfuscation (Android). Authentication: Biometric authentication (Face ID, fingerprint), OAuth 2.0, JWT tokens, refresh tokens. Session management: Secure token storage, automatic logout, handle token expiration. API security: API keys protection, rate limiting, input validation. Code protection: Obfuscation, jailbreak/root detection, anti-debugging. Best practices: Regular security audits, update dependencies, follow OWASP Mobile Top 10. Testing: Penetration testing, security scanners, static analysis. Compliance: GDPR, privacy policies, app permissions. Tools: MobSF, Burp Suite for testing. Remember: Security by design, not afterthought!',
    category: 'Mobile Development',
    tags: ['Security', 'Mobile', 'Authentication', 'Encryption'],
    coverImage: ''
  },

  // DevOps & Cloud
  {
    title: 'Docker Mastery: Containerize Everything',
    shortDescription: 'Master Docker containers, images, volumes, and multi-stage builds for production.',
    content: 'Containerization is essential for modern development! Docker basics: Images vs containers, Dockerfile for building, docker-compose for multi-container. Best practices: Multi-stage builds for smaller images, .dockerignore to exclude files, specific base images (alpine for size), non-root users for security. Dockerfile optimization: Layer caching, minimize layers, COPY vs ADD, use WORKDIR. Networking: Bridge, host, overlay networks, expose ports correctly. Volumes: Named volumes for persistence, bind mounts for development, tmpfs for temporary. Docker Compose: Define services, networks, volumes in YAML, orchestrate multiple containers, scale services. Security: Scan images for vulnerabilities, use official images, sign images, secret management. Debugging: docker logs, docker exec, docker inspect. Production: Health checks, restart policies, resource limits. Registry: Docker Hub, private registries, CI/CD integration. Alternative: Podman for daemonless. Future: WebAssembly containers!',
    category: 'DevOps & Cloud',
    tags: ['Docker', 'Containers', 'DevOps', 'Deployment'],
    coverImage: ''
  },
  {
    title: 'Kubernetes: Orchestrate Containers at Scale',
    shortDescription: 'Deploy, scale, and manage containerized applications with Kubernetes.',
    content: 'K8s is the container orchestration standard! Architecture: Control plane (API server, scheduler, controller), worker nodes, etcd. Core concepts: Pods (smallest unit), Deployments (manage replicas), Services (networking), ConfigMaps/Secrets (configuration). Deployment: kubectl commands, YAML manifests, Helm charts for templating. Networking: ClusterIP, NodePort, LoadBalancer, Ingress for HTTP routing. Storage: PersistentVolumes, PersistentVolumeClaims, StorageClasses. Scaling: Horizontal Pod Autoscaler, Vertical Pod Autoscaler, Cluster Autoscaler. Monitoring: Prometheus for metrics, Grafana for visualization, Loki for logs. Security: RBAC, Network Policies, Pod Security Standards, secret encryption. Service mesh: Istio, Linkerd for advanced traffic management. Best practices: Resource limits, liveness/readiness probes, namespaces for isolation. Local dev: Minikube, Kind, Docker Desktop. Managed services: EKS, GKE, AKS. Certifications: CKA, CKAD, CKS. Future: GitOps with ArgoCD!',
    category: 'DevOps & Cloud',
    tags: ['Kubernetes', 'K8s', 'Containers', 'Orchestration'],
    coverImage: ''
  },
  {
    title: 'CI/CD Pipeline: Automate Your Deployment Workflow',
    shortDescription: 'Build robust CI/CD pipelines with GitHub Actions, Jenkins, and GitLab CI.',
    content: 'Automate everything from commit to production! CI/CD benefits: Faster releases, fewer bugs, consistent builds, quick rollbacks. Pipeline stages: 1) Source - trigger on push/PR, 2) Build - compile code, run tests, 3) Test - unit, integration, E2E, 4) Deploy - staging then production. GitHub Actions: YAML workflows, matrix builds, reusable workflows, secrets management, environment protection. Jenkins: Pipeline as code (Jenkinsfile), plugins ecosystem, distributed builds. GitLab CI: .gitlab-ci.yml, AutoDevOps, container registry. Best practices: Test before deploy, parallel jobs for speed, fail fast, artifact management, deployment strategies (blue-green, canary, rolling). Testing: Unit tests first, integration tests, smoke tests in production. Monitoring: Track deployment metrics, DORA metrics, error rates. Security: SAST, DAST, dependency scanning. Tools: Docker for consistency, Terraform for infrastructure. Remember: If it hurts, do it more frequently!',
    category: 'DevOps & Cloud',
    tags: ['CI/CD', 'DevOps', 'Automation', 'GitHub Actions'],
    coverImage: ''
  },
  {
    title: 'Infrastructure as Code with Terraform',
    shortDescription: 'Manage cloud infrastructure with code using Terraform and best practices.',
    content: 'Declare your infrastructure, automate everything! Terraform basics: HCL language, providers (AWS, Azure, GCP), resources, data sources. Workflow: Write config, terraform init (download providers), plan (preview changes), apply (create resources), destroy (cleanup). Best practices: Version control terraform files, remote state (S3, Terraform Cloud), state locking, separate environments (dev, staging, prod). Modules: Reusable components, public registry, create custom modules. Variables: Input variables, outputs, local values, tfvars files. Advanced: count and for_each for multiple resources, dynamic blocks, conditionals. State management: Sensitive data, team collaboration, state locking. Security: Secrets management (Vault), least privilege IAM, scan code (tfsec, checkov). Testing: Terratest for Go-based tests, validate configs. Multi-cloud: Use same tool for AWS, Azure, GCP. Alternatives: Pulumi (use real programming languages), CloudFormation (AWS only). CI/CD integration: Atlantis for GitOps!',
    category: 'DevOps & Cloud',
    tags: ['Terraform', 'IaC', 'Cloud', 'DevOps'],
    coverImage: ''
  },
  {
    title: 'Monitoring and Observability: Keep Your System Healthy',
    shortDescription: 'Implement comprehensive monitoring with Prometheus, Grafana, and distributed tracing.',
    content: 'You can\'t improve what you don\'t measure! Three pillars: Metrics (numbers over time), Logs (discrete events), Traces (request journey). Metrics: Prometheus for collection, node_exporter for system, custom metrics with client libraries, alerting rules. Visualization: Grafana dashboards, PromQL queries, variable templates, alert notifications. Logging: ELK stack (Elasticsearch, Logstash, Kibana), Loki for lightweight, structured logging with JSON. Tracing: Jaeger for distributed tracing, OpenTelemetry standard, trace context propagation. APM: Application Performance Monitoring, track response times, error rates, throughput. Best practices: RED method (Rate, Errors, Duration), USE method (Utilization, Saturation, Errors), SLIs and SLOs. Alerting: Alert on symptoms not causes, avoid alert fatigue, runbooks for on-call. Tools: Datadog, New Relic for commercial, open-source alternatives. Remember: Observability is not just monitoring - it\'s understanding!',
    category: 'DevOps & Cloud',
    tags: ['Monitoring', 'Observability', 'Prometheus', 'DevOps'],
    coverImage: ''
  }
];

const seedBlogs = async () => {
  try {
    console.log('📝 Starting blog posts seeding...\n');

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

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
    console.log(`👤 Found Super Admin: ${superAdmin.name}\n`);

    const existingCount = await Blog.countDocuments();
    console.log(`📊 Existing blogs: ${existingCount}\n`);

    let addedCount = 0;
    let categoryStats = {};

    // Process each blog post
    for (const post of blogPosts) {
      try {
        // Check if post already exists
        const existing = await Blog.findOne({ title: post.title });
        
        if (!existing) {
          await Blog.create({
            ...post,
            author: superAdmin._id,
            createdAt: getRandomDate(), // Random date within last 30 days
            isPublished: true
          });
          
          addedCount++;
          categoryStats[post.category] = (categoryStats[post.category] || 0) + 1;
          console.log(`   ✅ Added: ${post.title.substring(0, 60)}...`);
        }
      } catch (error) {
        console.log(`   ⚠️  Skipped: ${post.title.substring(0, 50)}... (${error.message})`);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 BLOG SEEDING COMPLETE!');
    console.log('='.repeat(60));
    console.log(`\n📊 Summary by Category:`);
    for (const [category, count] of Object.entries(categoryStats)) {
      console.log(`   ${category}: ${count} posts`);
    }
    console.log(`\n✨ Total posts added: ${addedCount}`);
    console.log(`📚 Total posts in database: ${existingCount + addedCount}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding blogs:', error.message);
    process.exit(1);
  }
};

seedBlogs();
