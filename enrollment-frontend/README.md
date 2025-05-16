# Perpetual Help College - Enrollment System Frontend

This is the frontend application for the Perpetual Help College Enrollment System. It provides user interfaces for students, teachers, and administrators to interact with the enrollment system.

## Technology Stack

- **Next.js**: React framework for server-side rendering and static site generation
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable UI components
- **React Hook Form**: Form validation library
- **Zod**: Schema validation
- **Recharts**: Charting library for data visualization
- **SWR**: React Hooks for data fetching

## Directory Structure

```bash
enrollment-frontend/
├── public/                 # Static assets
│   └── images/             # Image assets
├── src/                    # Source code
│   ├── app/                # Next.js app directory
│   │   ├── (auth)/         # Authentication pages
│   │   ├── (dashboard)/    # Dashboard pages
│   │   ├── api/            # API routes
│   │   └── layout.tsx      # Root layout
│   ├── components/         # Reusable components
│   │   ├── ui/             # UI components
│   │   ├── forms/          # Form components
│   │   └── dashboard/      # Dashboard components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utility functions
│   ├── services/           # API services
│   └── types/              # TypeScript type definitions
├── styles/                 # Global styles
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Setup and Installation

### Prerequisites

- Node.js (v18.x or higher)
- npm (v9.x or higher)

### Installation Steps

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Edit the `.env.local` file with your specific configuration:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   npm start
   ```

## Features

### Authentication

- Login for students, teachers, and administrators
- Role-based access control
- JWT authentication with refresh tokens
- Secure password handling
- Remember me functionality

### Student Dashboard

- View enrolled courses
- Check grades and academic progress
- View class schedules
- Access financial information
- Update personal profile

### Teacher Dashboard

- Manage classes and course materials
- Submit and update grades
- Track attendance
- View teaching schedules
- Update personal profile

### Admin Dashboard

- Register new students and teachers
- Manage user accounts
- Create and manage courses
- Assign teachers to courses
- System configuration

### Global Admin Dashboard

- All administrator capabilities
- Create and manage admin accounts
- System-wide configuration
- Access to all system features

## Theme Support

The application supports multiple themes:

- Light mode
- Dark mode
- System preference

Theme preferences are saved to the backend API for persistence across devices.

## Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile devices

## Component Library

The application uses a custom component library built with shadcn/ui and Tailwind CSS. Key components include:

- Button
- Card
- Dialog
- Dropdown
- Form inputs
- Table
- Tabs
- Toast notifications

## Data Visualization

The dashboard includes various charts and graphs for data visualization:

- Bar charts for grade distribution
- Line charts for attendance tracking
- Pie charts for enrollment statistics
- Progress indicators for completion status

## API Integration

The frontend communicates with the backend API using:

- Fetch API for data retrieval
- SWR for data fetching and caching
- Custom hooks for API calls
- Proper error handling and loading states

## Testing

Run tests with:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

## Deployment

The application can be deployed to various platforms:

- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Traditional hosting with Node.js server

## Browser Support

The application supports modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

[MIT License](LICENSE)
