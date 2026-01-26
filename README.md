# Road Damage Report System

A full-stack web application for citizens to report road damage and volunteers to manage and repair issues with animated UI and database integration.

## ✨ Features

### For Citizens
- **Easy Reporting**: Report road damage with photos and location
- **No Login Required**: Citizens can report without creating an account
- **Real-time Tracking**: Monitor the status of reported issues
- **Interactive Maps**: View exact locations of reported damage
- **Photo Upload**: Before and after photos for complete documentation

### For Volunteers
- **Secure Authentication**: Login system for authorized volunteers
- **Dashboard Management**: View and manage assigned reports
- **Status Updates**: Track progress from reported to completed
- **Before/After Photos**: Upload completion photos
- **Real-time Updates**: Changes reflect immediately across all users

### Technical Features
- **Animated UI**: Smooth animations and glass-morphism effects throughout
- **Database Integration**: All data stored in database (not localStorage)
- **Real-time Sync**: Updates reflect across all connected users
- **Photo Management**: Base64 photo storage and display
- **Interactive Maps**: OpenStreetMap and Google Maps integration
- **Responsive Design**: Works perfectly on all screen sizes

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Custom animations
- **Icons**: Lucide React
- **Backend**: Next.js API Routes with JSON database
- **Database**: File-based JSON database (easily migratable to PostgreSQL/MongoDB)
- **Deployment**: Ready for Vercel/Netlify

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd road-damage-report
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── reports/       # Report management API
│   │   └── volunteers/    # Volunteer management API
│   ├── dashboard/         # Public progress dashboard
│   ├── report/           # Citizen reporting page
│   ├── volunteer/         # Volunteer sections
│   │   ├── login/        # Volunteer login
│   │   └── dashboard/    # Volunteer dashboard
│   ├── globals.css       # Global styles and animations
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable components
│   ├── AnimatedLayout.tsx # Animated background component
│   └── PhotoDisplay.tsx   # Photo display component
├── lib/                 # Utilities and data
│   ├── api.ts            # API service functions
│   ├── database.ts       # Database operations
│   └── data.ts           # Mock data
├── types/               # TypeScript type definitions
├── utils/               # Helper utilities
│   ├── photoUtils.ts     # Photo conversion utilities
│   └── debugUtils.ts     # Debug utilities
└── data/                # Database files (auto-created)
    ├── reports.json      # Reports database
    └── volunteers.json   # Volunteers database
```

## 🎯 Usage

### Reporting Road Damage (Citizens)
1. Visit the home page
2. Click "Report Damage"
3. Select damage type (pothole, crack, tree fall, debris, flood damage, etc.)
4. Add description and location (auto-detects GPS)
5. Upload photos
6. Submit report

### Volunteer Management
1. Go to Volunteer Login
2. Create account or login (any email/password works for demo)
3. View dashboard with all reports
4. Update report status (in progress, completed)
5. Upload completion photos
6. Track progress

### Viewing Progress
- Visit the public dashboard to see overall statistics
- Track completion rates and priority breakdowns
- View recent activity and resolved issues
- See before/after photos

## 🔧 API Endpoints

### Reports API
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create new report
- `PATCH /api/reports` - Update report status

### Volunteers API
- `GET /api/volunteers` - Get all volunteers
- `POST /api/volunteers` - Login/signup volunteers

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically detect it's a Next.js app
4. Configure environment variables if needed
5. Deploy!

The application is configured for Vercel deployment with:
- Automatic builds on push
- Optimized for serverless functions
- Proper CORS headers for API routes

## ✨ Key Features Implemented

### Database Integration
- **Complete Database Storage**: All data stored in JSON database files
- **Real-time Updates**: Changes reflect immediately across all users
- **Persistent Storage**: Data survives browser refreshes and server restarts
- **Easy Migration**: Can be easily migrated to PostgreSQL/MongoDB

### Animated UI
- **Animated Backgrounds**: Floating particle effects on all pages
- **Glass Morphism**: Modern frosted glass effects
- **Smooth Transitions**: Entrance animations and hover effects
- **Interactive Elements**: Animated buttons and cards

### Photo Management
- **Base64 Storage**: Photos stored as base64 strings in database
- **Before/After Photos**: Complete documentation of damage and repairs
- **Clickable Images**: Click to view full-size photos
- **Error Handling**: Graceful handling of invalid photos

## 🎨 Design Features

### Responsive Design
- Mobile-first approach
- Touch-friendly interfaces
- Adaptive layouts for all screen sizes

### User Experience
- Intuitive navigation
- Clear visual hierarchy
- Smooth animations and micro-interactions
- Loading states and error handling

## 🔮 Future Enhancements

- Real database integration (PostgreSQL/MongoDB)
- Real-time notifications via WebSocket
- Advanced map integration with routing
- AI/ML integration for automatic damage detection
- Mobile app development (React Native)
- Volunteer rating and reputation system
- Integration with municipal systems
- Email notifications for report updates

## 📄 License

This project is licensed under the MIT License.
