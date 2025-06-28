# ChatBot Mobile App

A modern, cross-platform chatbot application built with React Native and Expo, featuring a clean UI and seamless integration with a Flask backend API.

## 🚀 Features

- **Cross-platform**: Works on iOS, Android, and Web
- **Real-time Chat**: Instant messaging with AI-powered responses
- **Persistent Storage**: Messages are saved locally using AsyncStorage
- **Clean UI**: Modern, intuitive interface with smooth animations
- **Offline Support**: Basic offline functionality with local message storage
- **Responsive Design**: Adapts to different screen sizes and orientations
- **Error Handling**: Graceful error handling with user-friendly messages

## 📱 Screenshots

*Screenshots will be added here once the app is running*

## 🛠️ Tech Stack

- **Frontend**: React Native 0.79.4
- **Framework**: Expo SDK 53
- **Language**: TypeScript
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: AsyncStorage for local data persistence
- **Icons**: Expo Vector Icons
- **Backend Integration**: RESTful API with Flask

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Flask Backend** (see Backend Setup section)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd my-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure API Endpoint

Edit `config/api.ts` to point to your Flask backend:

```typescript
export const API_CONFIG = {
  LOCALHOST: 'http://127.0.0.1:5000',      // For web development
  COMPUTER_IP: 'http://192.168.100.111:5000', // For mobile development
  PRODUCTION: 'https://your-production-domain.com',
};
```

### 4. Start the Development Server

```bash
npm start
# or
yarn start
```

### 5. Run on Different Platforms

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

## 🔧 Backend Setup

This app requires a Flask backend server. Make sure your Flask server is running and accessible at the configured API endpoint.

### Flask Backend Requirements

Your Flask server should have a `/chat` endpoint that accepts POST requests with the following format:

```json
{
  "message": "User message here"
}
```

And returns responses in one of these formats:

```json
{
  "response": "Bot response here"
}
```

or

```json
{
  "reply": "Bot response here"
}
```

## 📁 Project Structure

```
my-app/
├── App.tsx                 # Main application component
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── assets/                # Images and static assets
├── config/
│   └── api.ts            # API configuration
├── services/
│   ├── chatService.ts    # Chat API integration
│   └── storageService.ts # Local storage management
└── README.md             # This file
```

## 🎯 Key Components

### App.tsx
The main application component that handles:
- Message state management
- UI rendering
- User interactions
- API communication

### services/chatService.ts
Handles communication with the Flask backend:
- Message sending
- Response formatting
- Error handling

### services/storageService.ts
Manages local data persistence:
- Message storage and retrieval
- Data clearing functionality

### config/api.ts
Configuration for different environments:
- Development URLs
- Production URLs
- Environment detection

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory for environment-specific configurations:

```env
API_URL=http://your-backend-url:5000
```

### API Configuration

Modify `config/api.ts` to match your backend setup:

```typescript
export const API_CONFIG = {
  LOCALHOST: 'http://127.0.0.1:5000',
  COMPUTER_IP: 'http://YOUR_COMPUTER_IP:5000',
  PRODUCTION: 'https://your-production-domain.com',
};
```

## 📱 Usage

1. **Start the app** using `npm start`
2. **Send messages** by typing in the input field and pressing send
3. **Clear chat** using the clear button in the header
4. **View message history** - messages are automatically saved locally

## 🐛 Troubleshooting

### Common Issues

1. **Connection Error**: Make sure your Flask backend is running and accessible
2. **API URL Issues**: Verify the IP address in `config/api.ts` matches your computer's IP
3. **Expo Issues**: Try clearing the cache with `expo start -c`

### Debug Mode

Enable debug logging by checking the browser console or React Native debugger for detailed error messages.

## 🚀 Deployment

### Building for Production

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Build for Web
expo build:web
```

### Publishing to App Stores

1. Configure your app in `app.json`
2. Build the production version
3. Submit to Apple App Store and Google Play Store

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- React Native community for the excellent documentation
- Flask community for the backend framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting](#troubleshooting) section
2. Search existing [issues](../../issues)
3. Create a new issue with detailed information

---

**Happy coding! 🎉**
