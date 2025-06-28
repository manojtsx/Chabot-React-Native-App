import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import chatService from './services/chatService';
import storageService from './services/storageService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  // Load saved messages on app startup
  useEffect(() => {
    loadSavedMessages();
  }, []);

  const loadSavedMessages = async () => {
    try {
      const savedMessages = await storageService.loadMessages();
      
      if (savedMessages.length === 0) {
        // If no saved messages, show welcome message
        const welcomeMessage: Message = {
          id: '1',
          text: 'Hello! How can I help you today?',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        await storageService.saveMessages([welcomeMessage]);
      } else {
        setMessages(savedMessages);
      }
    } catch (error) {
      console.error('Error loading saved messages:', error);
      // Fallback to welcome message
      const welcomeMessage: Message = {
        id: '1',
        text: 'Hello! How can I help you today?',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } finally {
      setIsInitializing(false);
    }
  };

  const saveMessagesToStorage = async (newMessages: Message[]) => {
    try {
      await storageService.saveMessages(newMessages);
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    await saveMessagesToStorage(updatedMessages);
    
    const currentInput = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      // Send message to Flask backend
      const response = await chatService.sendMessage(currentInput);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response || 'Sorry, I couldn\'t process your request.',
        isUser: false,
        timestamp: new Date(),
      };
      
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      await saveMessagesToStorage(finalMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error message to user
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error connecting to the server. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      await saveMessagesToStorage(finalMessages);
      
      Alert.alert(
        'Connection Error',
        'Unable to connect to the chat server. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    console.log('Clear chat button pressed');
    
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            console.log('User confirmed clear chat');
            try {
              // Clear from storage first
              await storageService.clearMessages();
              console.log('Storage cleared successfully');
              
              // Create new welcome message
              const welcomeMessage: Message = {
                id: Date.now().toString(),
                text: 'Hello! How can I help you today?',
                isUser: false,
                timestamp: new Date(),
              };
              
              // Update state immediately
              setMessages([welcomeMessage]);
              console.log('Messages state updated');
              
              // Save the welcome message
              await storageService.saveMessages([welcomeMessage]);
              console.log('Welcome message saved to storage');
              
              // Force scroll to top
              if (flatListRef.current) {
                flatListRef.current.scrollToOffset({ offset: 0, animated: true });
              }
              
            } catch (error) {
              console.error('Error clearing chat:', error);
              
              // Fallback: clear state even if storage fails
              const welcomeMessage: Message = {
                id: Date.now().toString(),
                text: 'Hello! How can I help you today?',
                isUser: false,
                timestamp: new Date(),
              };
              
              setMessages([welcomeMessage]);
              console.log('Fallback: Messages state updated');
              
              Alert.alert(
                'Warning', 
                'Chat cleared but there was an issue with storage. Your messages may reappear after refresh.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.botMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.botBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.isUser ? styles.userText : styles.botText
        ]}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  const renderLoadingIndicator = () => {
    if (!isLoading) return null;
    
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingBubble}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>Typing...</Text>
        </View>
      </View>
    );
  };

  if (isInitializing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingScreen}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingScreenText}>Loading chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manoj Chat</Text>
        <View style={styles.headerSubtitle}>
          <View style={styles.onlineIndicator} />
          <Text style={styles.onlineText}>Online</Text>
        </View>
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={clearChat}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderLoadingIndicator}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor="#999"
              multiline
              maxLength={500}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (inputText.trim() === '' || isLoading) && styles.sendButtonDisabled
              ]}
              onPress={sendMessage}
              disabled={inputText.trim() === '' || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons 
                  name="send" 
                  size={20} 
                  color={inputText.trim() === '' ? '#ccc' : '#fff'} 
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingScreenText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  headerSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
    top: 15,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 5,
  },
  onlineText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  clearButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageContainer: {
    marginVertical: 5,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 5,
  },
  botBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  loadingBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f8f8',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
});
