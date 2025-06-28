import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

class StorageService {
  private readonly CHAT_MESSAGES_KEY = 'chat_messages';

  // Save messages to local storage
  async saveMessages(messages: Message[]): Promise<void> {
    try {
      // Convert Date objects to strings for storage
      const messagesForStorage = messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      }));
      
      await AsyncStorage.setItem(
        this.CHAT_MESSAGES_KEY,
        JSON.stringify(messagesForStorage)
      );
    } catch (error) {
      console.error('Error saving messages:', error);
      // Don't throw error on web, just log it
      if (Platform.OS !== 'web') {
        throw error;
      }
    }
  }

  // Load messages from local storage
  async loadMessages(): Promise<Message[]> {
    try {
      const storedMessages = await AsyncStorage.getItem(this.CHAT_MESSAGES_KEY);
      
      if (!storedMessages) {
        return [];
      }

      const parsedMessages = JSON.parse(storedMessages);
      
      // Convert timestamp strings back to Date objects
      return parsedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  }

  // Clear all stored messages
  async clearMessages(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CHAT_MESSAGES_KEY);
      console.log('AsyncStorage cleared successfully');
    } catch (error) {
      console.error('Error clearing messages:', error);
      // On web, try alternative clearing method
      if (Platform.OS === 'web') {
        try {
          await AsyncStorage.clear();
          console.log('AsyncStorage.clear() executed as fallback');
        } catch (clearError) {
          console.error('AsyncStorage.clear() also failed:', clearError);
        }
      }
      // Don't throw error, let the UI handle it gracefully
    }
  }

  // Add a single message to storage
  async addMessage(message: Message): Promise<void> {
    try {
      const existingMessages = await this.loadMessages();
      const updatedMessages = [...existingMessages, message];
      await this.saveMessages(updatedMessages);
    } catch (error) {
      console.error('Error adding message:', error);
      // Don't throw error on web
      if (Platform.OS !== 'web') {
        throw error;
      }
    }
  }
}

export default new StorageService(); 