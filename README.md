# AI Summarizer Chrome Extension

A full-stack Chrome extension that uses OpenAI's GPT model to summarize web page content with user authentication and data persistence.

## Main Features

- **User Authentication**: Register/login system with JWT tokens
- **AI-Powered Summarization**: Uses OpenAI's GPT-3.5 Turbo model
- **Content Extraction**: Extracts main content from web pages using Mozilla's Readability.js
- **Data Persistence**: Saves summaries to cloud database with user-specific access
- **Modern UI**: Clean, professional interface with tabbed navigation
- **Summary History**: View and manage all your past summaries
- **Secure**: Password hashing and JWT authentication

## Architecture

### Frontend (Chrome Extension)
- **Popup Interface**: Modern UI with login/register forms and tabbed navigation
- **Content Script**: Extracts text from web pages
- **Chrome Storage**: Securely stores authentication tokens

### Backend (Node.js/Express)
- **RESTful API**: Handles authentication, summarization, and data management
- **Database**: MongoDB with Mongoose ODM for data persistence
- **Authentication**: JWT-based user authentication with bcrypt password hashing
- **AI Integration**: OpenAI API for content summarization
- **Deployment**: Live backend deployed on Railway

## Installation
1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension will automatically connect to the deployed backend

## Backend Setup

The backend is deployed on Railway and includes:

### Environment Variables
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `OPENAI_API_KEY`: Your OpenAI API key

### API Endpoints
- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: User authentication
- `POST /api/summaries`: Create new summary
- `GET /api/summaries`: Get user's summaries
- `DELETE /api/summaries/:id`: Delete specific summary

## Usage

1. **Register/Login**: Create an account or sign in
2. **Navigate**: Go to any webpage you want to summarize
3. **Summarize**: Click the extension icon and use the "Summarize" tab
4. **View History**: Check the "History" tab to see all your summaries
5. **Manage**: Delete summaries you no longer need

## Technologies Used

### Frontend
- JavaScript (ES6+)
- Chrome Extensions API
- HTML5/CSS3 with modern design
- Chrome Storage API

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- OpenAI API
- CORS for cross-origin requests

### Deployment
- Railway (Backend hosting)
- MongoDB Atlas (Database)
- GitHub (Version control)

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based sessions
- **CORS Protection**: Proper cross-origin request handling
- **Input Validation**: Server-side validation for all inputs
- **User Isolation**: Users can only access their own data

## Deployment Status

✅ **Backend**: Deployed and live on Railway  
✅ **Database**: MongoDB Atlas cloud database  
✅ **Extension**: Ready for installation  
✅ **Authentication**: Fully functional  
✅ **AI Integration**: Working with OpenAI API  

## Future Improvements

- [ ] Add customizable summary length
- [ ] Support for different summarization styles
- [ ] Export summaries to various formats
- [ ] Advanced filtering and search in history

## License

This project is open source and available under the [ISC License](LICENSE). 