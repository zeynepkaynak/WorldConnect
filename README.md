# 🌍 World ID Pool

A modern Next.js application that leverages **World ID verification** for secure authentication and enables users to connect with each other through a sophisticated friend management system. Built with cutting-edge technologies including Next.js 14, TypeScript, Tailwind CSS, and Aceternity UI.

![World ID Pool Banner](https://via.placeholder.com/800x200/0f172a/ffffff?text=World+ID+Pool)

## 🚀 Features

### 🔐 **World ID Authentication**
- **Secure Login**: Users authenticate using World ID verification system
- **Session Management**: JWT-like session tokens with secure expiration handling
- **Privacy First**: No personal data stored, only World ID nullifier hash
- **Seamless Integration**: IDKit integration for smooth user experience

### 👤 **Personal Profile System**
- **Unique User Profiles**: Each verified user gets a personalized profile
- **Username Customization**: Users can set and update their display names
- **Profile Analytics**: View account creation date and activity status
- **Secure Session Handling**: Persistent sessions across browser refreshes

### 🎯 **Friend Connection System**
- **Dual Connection Methods**: 
  - 📱 **QR Code Sharing**: Generate and scan personal QR codes
  - 🔤 **Friend Codes**: 6-character alphanumeric codes for easy sharing
- **Friend Requests**: Send, receive, accept, or reject friend requests
- **Real-time Updates**: Instant friend list updates without page refresh
- **Friend Management**: View all connected friends with their details

### 🎨 **Modern UI/UX**
- **Aceternity UI**: Beautiful, modern interface components
- **Aurora Background**: Stunning animated background effects
- **Responsive Design**: Optimized for all device sizes
- **Dark Theme**: Elegant dark mode design
- **Toast Notifications**: User-friendly feedback system

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Aceternity UI** - Modern UI component library
- **shadcn/ui** - High-quality component system
- **Framer Motion** - Smooth animations and transitions

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **World ID Integration** - Secure identity verification
- **Session Management** - Custom session handling system
- **RESTful Architecture** - Clean API design patterns

### **Additional Libraries**
- **IDKit** - World ID verification SDK
- **QRCode** - QR code generation
- **Sonner** - Toast notification system
- **Lucide React** - Beautiful icon library
- **UUID** - Unique identifier generation

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or later)
- **npm** or **yarn** package manager
- **World ID App ID** (for production use)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/worldid-pool.git
cd worldid-pool
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
# World ID Configuration
NEXT_PUBLIC_WLD_APP_ID=your_world_id_app_id
NEXT_PUBLIC_WLD_ACTION=verify_human

# Development Settings
NODE_ENV=development
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

### 5. Open Application
Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How It Works

### 🔐 **Authentication Flow**

1. **World ID Verification**
   - User clicks "Verify with World ID" button
   - World ID app opens for biometric verification
   - Cryptographic proof is generated and verified
   - Unique nullifier hash is created for the user

2. **Session Creation**
   - System generates a secure session token
   - User profile is created or retrieved
   - Session token is stored in browser localStorage
   - User is redirected to their profile page

3. **Profile Access**
   - Session token validates user identity
   - Profile data is fetched from secure storage
   - User gains access to all platform features

### 👥 **Friend System**

1. **Profile Generation**
   - Each user receives a unique 6-character friend code
   - Personal QR code is generated containing the friend code
   - Both can be shared to connect with others

2. **Friend Requests**
   ```
   User A                    User B
   ┌─────────────────┐      ┌─────────────────┐
   │ Scans QR Code   │ ───► │ Receives Request │
   │ or Enters Code  │      │ in Profile      │
   └─────────────────┘      └─────────────────┘
            │                        │
            │                        ▼
            │               ┌─────────────────┐
            │               │ Accept/Reject   │
            │               │ Decision        │
            │               └─────────────────┘
            │                        │
            ▼                        ▼
   ┌─────────────────┐      ┌─────────────────┐
   │ Friends List    │ ◄──► │ Friends List    │
   │ Updated         │      │ Updated         │
   └─────────────────┘      └─────────────────┘
   ```

3. **Connection Management**
   - View all pending friend requests
   - Accept or reject requests with one click
   - Browse connected friends list
   - Real-time status updates

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── v1/login/            # World ID authentication
│   │   ├── profile/             # User profile management
│   │   └── friends/             # Friend system APIs
│   ├── profile/                 # Profile page
│   │   └── page.tsx            # Main profile interface
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/                  # React Components
│   ├── ui/                     # UI Components
│   │   ├── button.tsx          # Button component
│   │   ├── card.tsx            # Card component
│   │   ├── input.tsx           # Input component
│   │   ├── tabs.tsx            # Tabs component
│   │   ├── avatar.tsx          # Avatar component
│   │   ├── badge.tsx           # Badge component
│   │   └── aurora-background.tsx # Aurora background
│   ├── world-id-login.tsx      # World ID login component
│   ├── icons.tsx               # Icon definitions
│   └── aurora-background-demo.tsx # Demo component
├── lib/                        # Utility Libraries
│   ├── storage.ts              # Global storage management
│   └── utils.ts                # Helper functions
└── types/                      # TypeScript Definitions
    └── index.ts                # Type definitions
```

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/login` - World ID verification and session creation
- `GET /api/v1/session/verify` - Session validation

### Profile Management
- `GET /api/profile` - Fetch user profile data
- `PUT /api/profile` - Update user profile information

### Friend System
- `GET /api/friends` - Get friends list and pending requests
- `POST /api/friends` - Send friend request
- `PUT /api/friends` - Accept/reject friend request

## 🎮 Usage Guide

### **Getting Started**
1. **Visit the Homepage**: Open the application in your browser
2. **World ID Verification**: Click "Verify with World ID" and complete biometric verification
3. **Profile Creation**: Your profile is automatically created upon successful verification
4. **Explore Features**: Navigate through your profile tabs to explore all features

### **Connecting with Friends**
1. **Share Your Code**: 
   - Go to "QR Code" tab to show your QR code
   - Or share your 6-character friend code from "Profile" tab
2. **Add Friends**:
   - Go to "Friends" tab
   - Enter a friend's code or scan their QR code
   - Send friend request
3. **Manage Requests**:
   - Check "Friends" tab for incoming requests
   - Accept or reject requests as desired
   - View your friends list

### **Profile Customization**
1. **Update Username**: Change your display name in the "Profile" tab
2. **View Details**: See your World ID, friend code, and account information
3. **Logout**: Securely end your session when done

## 🔒 Security Features

- **World ID Verification**: Cryptographic proof of human identity
- **Session Management**: Secure token-based authentication
- **Privacy Protection**: No personal data storage
- **Request Validation**: All API endpoints validate session tokens
- **Rate Limiting**: Built-in protection against abuse

## 🎯 Development

### **Running Tests**
```bash
# Check TypeScript types
npm run type-check

# Lint code
npm run lint

# Build for production
npm run build
```

### **Environment Variables**
```env
# Required for World ID
NEXT_PUBLIC_WLD_APP_ID=app_staging_xxx
NEXT_PUBLIC_WLD_ACTION=verify_human

# Optional
NODE_ENV=development
```

## 🚀 Deployment

### **Vercel (Recommended)**
1. Push your code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically

### **Other Platforms**
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment
- **Heroku**: Container deployment

## 🛣️ Roadmap

### **Upcoming Features**
- [ ] **Database Integration**: Replace in-memory storage with persistent database
- [ ] **Real World ID Verification**: Implement production World ID verification
- [ ] **Profile Images**: Upload and manage profile pictures
- [ ] **QR Scanner**: In-app QR code scanning functionality
- [ ] **Friend Groups**: Organize friends into custom groups
- [ ] **Activity Feed**: See friend activities and updates
- [ ] **Mobile App**: React Native companion app
- [ ] **Advanced Privacy**: Enhanced privacy controls

### **Technical Improvements**
- [ ] **Rate Limiting**: Implement API rate limiting
- [ ] **Caching**: Add Redis caching layer
- [ ] **WebSockets**: Real-time friend updates
- [ ] **Push Notifications**: Browser push notifications
- [ ] **Analytics**: User behavior analytics
- [ ] **SEO Optimization**: Enhanced search engine optimization

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write clear commit messages
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **World ID Team** - For the amazing identity verification system
- **Aceternity UI** - For beautiful UI components
- **Next.js Team** - For the excellent React framework
- **Vercel** - For seamless deployment platform

## 📞 Support

- **Documentation**: Check this README and inline comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join GitHub Discussions for questions
- **Email**: Contact the development team

---

**Built with ❤️ for ETH Global Hackathon**

*Connecting humans in the digital world through verified identity and meaningful relationships.*
