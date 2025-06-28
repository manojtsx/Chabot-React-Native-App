import { getApiUrl } from '../config/api';

interface ChatMessage {
  message: string;
}

interface ChatResponse {
  response: string;
}

class ChatService {
  // Use dynamic API URL based on environment
  private baseURL: string = getApiUrl();
  
  // Function to clean and format the response text
  private formatResponseText(text: string): string {
    if (!text) return '';
    
    return text
      // Handle markdown bold formatting
      .replace(/\*\*(.*?)\*\*/g, '$1')
      // Handle markdown italic formatting
      .replace(/\*(.*?)\*/g, '$1')
      // Handle escaped quotes
      .replace(/\\"/g, '"')
      // Handle escaped newlines
      .replace(/\\n/g, '\n')
      // Handle escaped tabs
      .replace(/\\t/g, '\t')
      // Handle escaped backslashes
      .replace(/\\\\/g, '\\')
      // Handle bullet points and lists
      .replace(/^\s*[-*+]\s+/gm, '• ')
      // Handle numbered lists
      .replace(/^\s*\d+\.\s+/gm, (match) => match.trim() + ' ')
      // Clean up multiple newlines
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Trim whitespace
      .trim();
  }

  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      console.log('Sending message to:', `${this.baseURL}/chat`);
      
      const response = await fetch(`${this.baseURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message
        } as ChatMessage),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw server response:', data);
      
      let responseText = '';
      
      // Handle different response formats from Flask server
      if (typeof data === 'string') {
        // If response is a direct string
        responseText = data;
      } else if (data.reply) {
        // If response has a 'reply' property (your server format)
        responseText = data.reply;
      } else if (data.response) {
        // If response has a 'response' property
        responseText = data.response;
      } else if (data.message) {
        // If response has a 'message' property
        responseText = data.message;
      } else {
        // Fallback: convert the entire response to string
        responseText = JSON.stringify(data);
      }

      // Format and clean the response text
      const formattedResponse = this.formatResponseText(responseText);
      
      return { response: formattedResponse };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}

export default new ChatService(); 