# Glamour Gaze - Virtual Makeup Try-On App

A professional-grade virtual makeup application built with Next.js 15, featuring AI-powered facial landmark detection and realistic makeup rendering.

## ✨ Features

### 🎯 Core Functionality
- **Upload-based Try-On**: No webcam required - upload any image
- **AI Face Detection**: TensorFlow.js with 468 facial landmarks
- **Realistic Rendering**: Canvas API with proper blending modes
- **Multiple Categories**: Lips, Eyes, Cheeks, Eyebrows, Hair
- **Live Preview**: Instant makeup application and switching

### 💄 Makeup Categories
- **Lipstick**: Classic reds, pinks, berries, corals, nudes
- **Eyeshadow**: Smoky grays, golden glows, purples, bronzes
- **Blush**: Peach, rose, coral, berry tones
- **Eyebrows**: Natural enhancement and color matching
- **Hair Color**: Browns, blondes, reds, blacks

### 🔐 User Authentication
- Robust form validation with Zod
- React Hook Form integration
- Required fields: name, age, email
- Save and manage makeup trials
- User profile management

### 📱 Responsive Design
- Mobile-first approach
- ShadCN UI components
- Beautiful rose-orange-amber color scheme
- Touch-friendly interface

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **UI Library**: ShadCN UI + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Face Detection**: TensorFlow.js Face Landmarks Detection
- **Form Validation**: React Hook Form + Zod
- **State Management**: Zustand
- **Canvas Rendering**: HTML5 Canvas API
- **File Upload**: React Dropzone

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account
- Modern web browser with Canvas support

### Installation

1. **Clone and install dependencies**:
   \`\`\`bash
   git clone <repository-url>
   cd glamour-gaze
   npm install
   \`\`\`

2. **Set up Supabase**:
   - Create a new Supabase project
   - Run the SQL schema from \`scripts/schema.sql\`
   - Get your project URL and anon key

3. **Environment variables**:
   Create a \`.env.local\` file:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   \`\`\`

4. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**:
   Navigate to \`http://localhost:3000\`

## 🎨 Design System

### Color Palette
- **Primary**: Rose (500-700) - Main brand color
- **Secondary**: Orange (500-600) - Accent color  
- **Tertiary**: Amber (500-600) - Highlight color
- **Neutral**: Gray (50-900) - Text and backgrounds
- **Gradients**: Rose → Orange → Amber for buttons and highlights

### Typography
- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable sans-serif
- **UI Elements**: Medium weight for buttons and labels

## 📁 Project Structure

\`\`\`
src/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application page
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── makeup/            # Makeup-related components
│   └── ui/                # ShadCN UI components
├── lib/                   # Utilities and configurations
│   ├── stores/            # Zustand state management
│   ├── supabase/          # Supabase client configuration
│   ├── face-detection-tf.ts # TensorFlow.js integration
│   └── makeup-renderer.ts # Canvas rendering logic
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks
└── scripts/               # Database schema and migrations
\`\`\`

## 🎯 Usage Guide

### 1. **Sign Up/Sign In**
- Create an account with proper validation
- Form validation with Zod schemas
- Automatic profile creation

### 2. **Upload Your Photo**
- Drag & drop or click to upload
- Supports JPG, PNG, WebP (max 10MB)
- AI automatically detects facial landmarks

### 3. **Apply Makeup**
- Select a category (Lips, Eyes, Cheeks, etc.)
- Choose from curated color palettes
- See instant preview with realistic rendering

### 4. **Save & Share**
- Download your makeup trial
- Save to your profile
- Share with friends

## 🔧 Technical Implementation

### Face Detection
- Uses TensorFlow.js Face Landmarks Detection
- 468 facial landmarks for precise makeup application
- Handles edge cases and detection failures gracefully
- Better browser compatibility than MediaPipe

### Form Validation
- Zod schemas for type-safe validation
- React Hook Form for performance
- Real-time validation feedback
- Proper error handling

### Makeup Rendering
- Canvas API with proper blending modes
- Realistic color application with gradients
- Smooth edge rendering with Bezier curves
- Multiple blend modes: multiply, overlay, soft-light

## 🗄️ Database Schema

### Tables
- **users**: User profiles and preferences
- **makeup_presets**: Curated makeup colors and styles
- **makeup_trials**: Saved user makeup sessions

### Key Features
- Row Level Security (RLS) enabled
- User data isolation
- Efficient querying with indexes

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Add environment variables
3. Deploy automatically

### Manual Deployment
1. Build the application: \`npm run build\`
2. Deploy to your preferred hosting platform
3. Ensure environment variables are set

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Next.js 15, Supabase, and ShadCN UI**
**Glamour Gaze - Where Beauty Meets Technology ✨**
