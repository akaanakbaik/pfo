# Professional Portfolio Website

A stunning portfolio website with premium animations, admin dashboard, and dynamic features like real-time clock and device status indicators.

## Features

- **Modern Design**: Clean, professional layout with smooth animations
- **Dark/Light Mode**: Support for both light and dark themes with automatic detection of user preferences
- **Responsive Layout**: Optimized for all devices - mobile, tablet, and desktop
- **Real-Time Information**:
  - Current time display
  - Visitor's IP address 
  - Accurate visitor counter
  - Battery level indicator
- **Dynamic Content**: Admin dashboard to update all website content
- **Premium Animations**: Smooth transitions and interactive elements powered by Framer Motion
- **Background Music**: Toggle-able background music
- **Contact Form**: Functional contact form with validation
- **Network/Friends Section**: Display your professional connections

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Shadcn UI, Framer Motion
- **Backend**: Express.js with in-memory storage
- **State Management**: React Context API, TanStack Query
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight client-side routing

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/professional-portfolio.git
   cd professional-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5000`

## Admin Dashboard

The portfolio includes a comprehensive admin dashboard for content management.

### Accessing the Dashboard

1. Navigate to `/admin` route on your website
2. Login with your admin credentials (default: username: `admin`, password: `admin123`)

### Dashboard Features

1. **Statistics Overview**:
   - View real-time visitor count
   - Reset visitor counter when needed
   - Quick summaries of projects and network connections

2. **Content Management**:
   - **Profile Tab**: Update your personal information, skills, biography, and contact details
   - **Projects Tab**: Manage your portfolio projects including:
     - Project titles, descriptions, and categories
     - Technologies used in each project
     - Project images and links
     - GitHub repository URLs
   - **Network Tab**: Manage your professional connections

### Editing Content

The dashboard provides two editing methods:

1. **Form-based editing** for profile information with individual fields
2. **JSON-based editing** for projects and network connections, allowing for bulk updates

### Security Considerations

- Change the default admin password after initial setup
- The admin dashboard uses session-based authentication
- Sessions expire after inactivity for security

## Deployment to Vercel

### Prerequisites

1. Create a [Vercel account](https://vercel.com/signup) if you don't have one
2. Install the Vercel CLI: `npm i -g vercel`
3. Login to Vercel CLI: `vercel login`

### Deployment Steps

1. Prepare your application:
   ```bash
   # Make sure all changes are committed to your repository
   git add .
   git commit -m "Prepare for deployment"
   ```

2. Configure Vercel for optimal deployment:
   
   Create a `vercel.json` file in your project root:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "server/index.ts"
       },
       {
         "src": "/(.*)",
         "dest": "client/index.html"
       }
     ]
   }
   ```

3. Deploy to Vercel:
   ```bash
   # Deploy with environment configuration
   vercel --prod
   ```

4. Follow the prompts to set up your project. Make sure to set the following:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Development Command: `npm run dev`
   - Environment Variables: Add any necessary environment variables

5. After deployment, your site will be available at the URL provided by Vercel

### Post-Deployment Verification

1. Verify all routes and functionality are working properly
2. Test the admin dashboard to ensure content updates work in production
3. Check that animations and music player function correctly
4. Test responsive design on multiple devices

## Customization

### Updating Content

1. Access the admin dashboard at `/admin`
2. Login with the default credentials (username: `admin`, password: `admin123`)
3. Navigate to the sections you want to update:
   - Profile: Update your personal information, skills, and social links
   - Projects: Add, edit, or remove portfolio projects
   - Network: Manage your professional connections list

### Theme Customization

1. Modify the `theme.json` file in the root directory to change the primary color and theme preferences.
2. Edit the `tailwind.config.ts` file to customize additional colors and design elements.

### Adding New Features

1. Create new components in the `client/src/components` directory
2. Implement backend functionality in `server/routes.ts` and `server/storage.ts`
3. Update the schema in `shared/schema.ts` if you need to add new data types

## File Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── ui/         # Shadcn UI components
│   │   │   └── admin/      # Admin dashboard components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and configurations
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Entry point
│   └── index.html          # HTML template
├── server/                 # Backend Express application
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data storage implementation
│   └── utils.ts            # Backend utilities
├── shared/                 # Shared code between frontend and backend
│   └── schema.ts           # Data schemas
├── public/                 # Static assets
├── theme.json              # Theme configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── vite.config.ts          # Vite configuration
└── package.json            # Project dependencies
```

## Performance Optimizations

This portfolio website includes several performance optimizations:

1. **Hardware Acceleration**:
   - Uses CSS `transform-gpu` for hardware-accelerated animations
   - Selective application of `will-change` property only when needed
   - 3D transforms with proper `perspective` and `transform-style: preserve-3d`

2. **Animation Optimizations**:
   - Framer Motion's `layoutId` for smooth transitions
   - Animation orchestration to prevent layout thrashing
   - Debounced event handlers for scroll and resize events

3. **Image Optimizations**:
   - Lazy loading for all images using the `loading="lazy"` attribute
   - Proper sizing of images to avoid layout shifts
   - Optimized image formats for web delivery

4. **Code Splitting and Lazy Loading**:
   - Dynamic imports for non-critical components
   - Route-based code splitting for faster initial load

5. **State Management**:
   - Optimized React Context API usage with proper memoization
   - TanStack Query for efficient data fetching and caching

## Troubleshooting

### Common Issues

1. **Music player not working**: Ensure autoplay is allowed in your browser settings

2. **Admin login issues**: 
   - Default credentials are username: `admin`, password: `admin123`
   - Check browser console for any authentication errors

3. **Animation performance**: 
   - Try disabling some animations if performance issues occur on older devices
   - Adjust the `client/src/lib/animations.ts` parameters for better performance

4. **Deployment Issues**:
   - Double-check all environment variables are correctly set in Vercel
   - Ensure all file paths use proper case sensitivity for deployment on Linux servers

### Getting Help

If you encounter any issues, please:

1. Check the [GitHub repository issues](https://github.com/yourusername/professional-portfolio/issues)
2. Create a new issue with detailed information about your problem

## License

This project is licensed under the MIT License - see the LICENSE file for details.
