# Frontend-Backend Integration Guide

This document explains how the React frontend has been integrated with the Spring Boot backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Java 17+ and Maven
- Both frontend and backend running simultaneously

### Running the Full Application

1. **Start the Backend** (Terminal 1):
   ```bash
   cd bookstore-backend
   mvn spring-boot:run
   ```
   Backend will be available at: `http://localhost:8080`

2. **Start the Frontend** (Terminal 2):
   ```bash
   npm install
   npm run dev
   ```
   Frontend will be available at: `http://localhost:3000`

3. **Access the Application**:
   - Open `http://localhost:3000` in your browser
   - The frontend will automatically connect to the backend API

## 🔧 Integration Details

### API Service Layer

The frontend uses a centralized API service layer located in `src/services/`:

- **`api.ts`**: Axios instance with base configuration, request/response interceptors
- **`authService.ts`**: Authentication-related API calls
- **`itemService.ts`**: Item management API calls  
- **`categoryService.ts`**: Category management API calls

### Authentication Flow

1. **Login/Register**: Users authenticate via `/api/auth/login` or `/api/auth/register`
2. **Token Storage**: JWT tokens are stored in localStorage
3. **Auto-Auth**: Tokens are automatically included in API requests
4. **Token Refresh**: Automatic logout on token expiration

### State Management

- **AuthContext**: React Context for global authentication state
- **Local State**: Component-level state for UI interactions
- **API State**: Loading, error, and success states for API calls

## 📁 File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Global auth state management
├── services/
│   ├── api.ts                   # Axios configuration
│   ├── authService.ts           # Authentication API calls
│   ├── itemService.ts           # Item management API calls
│   └── categoryService.ts       # Category API calls
├── components/
│   ├── LoginPage.tsx            # Updated with real auth
│   ├── ItemsPage.tsx            # Updated with real data
│   ├── AddItemPage.tsx          # Updated with real API
│   └── Navigation.tsx           # Updated with user info
└── App.tsx                      # Updated with auth routing
```

## 🔄 Data Flow

### 1. Authentication
```
User Login → AuthService → Backend API → JWT Token → AuthContext → UI Update
```

### 2. Item Loading
```
Component Mount → ItemService → Backend API → State Update → UI Render
```

### 3. Item Creation
```
Form Submit → Validation → ItemService → Backend API → Success/Error → UI Feedback
```

## 🎯 Key Features Implemented

### ✅ Authentication
- [x] User registration and login
- [x] JWT token management
- [x] Automatic token refresh
- [x] Protected routes
- [x] User session persistence

### ✅ Item Management
- [x] Browse all items with pagination
- [x] Search and filter items
- [x] Create new items (authenticated users)
- [x] Real-time data from backend
- [x] Loading and error states

### ✅ Category Management
- [x] Dynamic category loading
- [x] Category-based filtering
- [x] Category selection in forms

### ✅ UI/UX Improvements
- [x] Loading spinners
- [x] Error messages
- [x] Success notifications
- [x] Form validation
- [x] Responsive design

## 🔧 Configuration

### Environment Variables
The frontend is configured to connect to `http://localhost:8080` by default. To change this:

1. Update `src/services/api.ts`:
   ```typescript
   const API_BASE_URL = 'http://your-backend-url:port/api';
   ```

### CORS Configuration
The backend is configured to allow requests from `http://localhost:3000`. If you change the frontend port, update:

1. Backend `application.yml`:
   ```yaml
   cors:
     allowed-origins: http://localhost:YOUR_FRONTEND_PORT
   ```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS configuration matches frontend URL
   - Check that backend is running on port 8080

2. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check browser console for JWT errors

3. **API Connection Issues**
   - Verify backend is running and accessible
   - Check network tab in browser dev tools
   - Ensure API_BASE_URL is correct

4. **Data Not Loading**
   - Check browser console for errors
   - Verify backend database has sample data
   - Check network requests in dev tools

### Debug Mode

Enable debug logging by opening browser console and looking for:
- API request/response logs
- Authentication state changes
- Error messages with stack traces

## 🚀 Deployment

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update API_BASE_URL to point to production backend

### Backend Deployment
1. Build the JAR: `mvn clean package`
2. Deploy to your server
3. Configure production database
4. Update CORS settings for production frontend URL

## 📊 Sample Data

The backend comes with sample data:
- **Users**: john@example.com, jane@example.com, admin@example.com (password: password123)
- **Categories**: Books, Textbooks, Stationery, School Supplies
- **Items**: 6 sample items with images and descriptions

## 🔐 Security Notes

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- Passwords are hashed using BCrypt on the backend
- CORS is properly configured
- Input validation is implemented on both frontend and backend

## 📈 Performance Optimizations

- API calls are debounced for search
- Pagination reduces data transfer
- Images are lazy-loaded
- Error boundaries prevent crashes
- Loading states improve perceived performance

## 🧪 Testing

### Manual Testing Checklist
- [ ] User can register and login
- [ ] Items load and display correctly
- [ ] Search and filters work
- [ ] User can add new items
- [ ] Authentication persists on page refresh
- [ ] Logout works correctly
- [ ] Error messages display properly
- [ ] Loading states work correctly

### API Testing
Use the backend's H2 console at `http://localhost:8080/h2-console` to verify data persistence.

## 📝 Next Steps

Potential enhancements:
1. Add item editing and deletion
2. Implement user profiles
3. Add image upload functionality
4. Implement real-time notifications
5. Add advanced search features
6. Implement item favorites
7. Add user ratings and reviews
