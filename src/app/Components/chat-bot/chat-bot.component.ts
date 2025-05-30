import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { marked } from 'marked';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface Message {
  text: string;
  user: boolean;
  timestamp: string;
  edited?: boolean;
}

interface Conversation {
  id: number;
  title: string;
  messages: Message[];
  timestamp: string;
  lastMessage: string;
}
@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,ReactiveFormsModule,AsyncPipe],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.scss',
})
export class ChatBotComponent implements OnInit {
  messages: any[] = [];
  conversationHistory: any[] = [];
  currentConversationId: number | null = null; // Track current conversation
  loading = false;
  showHistory = false;
  editingMessageId: number | null = null;
  editText = '';
  messageInput = new FormControl('');

  suggestedQuestions = [
    'How often should I water my plants?',
    'Why are my plant’s leaves turning brown or yellow?',
    'What are the best plants for beginners?',
    'How much sunlight do indoor plants need?',
    'What’s the best way to get rid of pests on plants?',
    'How do I know if I’m overwatering or underwatering my plant?',
  ];

  private updateTimeout: any = null; // For debouncing updates

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadFromLocalStorage();
    this.messageInput.valueChanges.subscribe(() => {
      this.updateInputState();
    });
    this.updateUI();
  }

  loadFromLocalStorage() {
    try {
      const savedHistory = localStorage.getItem('plantChatHistory');
      const savedMessages = localStorage.getItem('plantCurrentChat');
      const savedConversationId = localStorage.getItem('plantCurrentConversationId');

      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          this.conversationHistory = parsedHistory;
        }
      }

      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages)) {
          this.messages = parsedMessages;
        }
      }

      if (savedConversationId) {
        this.currentConversationId = parseInt(savedConversationId, 10);
      }
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
  }

  updateInputState() {
    const sendButton = document.getElementById('send-message-btn') as HTMLButtonElement;
    const clearInputBtn = document.getElementById('clear-input-btn');
    if (sendButton && clearInputBtn) {
      sendButton.disabled = !this.messageInput.value?.trim();
      clearInputBtn.style.display = this.messageInput.value ? 'block' : 'none';
    }
  }

  async onSendMessage() {
    const text = this.messageInput.value?.trim();
    if (text && !this.loading) {
      await this.handleSendMessage(text);
      this.messageInput.setValue('');
      this.updateInputState();
      this.updateUI();
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.messageInput.value?.trim() && !this.loading) {
      this.onSendMessage();
    }
  }

  clearInput() {
    this.messageInput.setValue('');
    this.updateInputState();
    document.getElementById('message-input')?.focus();
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;
    this.updateSidebarVisibility();
  }

  onClickOutsideSidebar(event: MouseEvent) {
    const sidebar = document.getElementById('sidebar');
    if (
      this.showHistory &&
      sidebar &&
      !sidebar.contains(event.target as Node) &&
      (event.target as HTMLElement).id !== 'toggle-history-btn'
    ) {
      this.showHistory = false;
      this.updateSidebarVisibility();
    }
  }

  updateSidebarVisibility() {
    // Handled by ngClass in the template
  }

  fillInputWithQuestion(question: string) {
    this.messageInput.setValue(question);
    this.updateInputState();
    document.getElementById('message-input')?.focus();
  }

  updateUI() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const chatMessages = document.getElementById('chat-messages');
    if (welcomeScreen && chatMessages) {
      if (this.messages.length === 0) {
        welcomeScreen.classList.remove('hidden');
        chatMessages.classList.add('hidden');
      } else {
        welcomeScreen.classList.add('hidden');
        chatMessages.classList.remove('hidden');
      }
    }
    this.scrollToBottom();
  }

  async handleSendMessage(textToSend: string, isEdit = false, originalIndex: number | null = null) {
    if (!textToSend.trim() || this.loading) return;

    const userMessage = {
      text: textToSend,
      user: true,
      timestamp: new Date().toISOString(),
      edited: isEdit,
    };

    let newMessages;
    if (isEdit && originalIndex !== null) {
      newMessages = [...this.messages.slice(0, originalIndex), userMessage];
    } else {
      newMessages = [...this.messages, userMessage];
    }

    this.messages = newMessages;
    this.updateUI();

    // Initialize a new conversation if none exists
    if (!this.currentConversationId && newMessages.length > 0) {
      this.currentConversationId = Date.now();
      localStorage.setItem('plantCurrentConversationId', this.currentConversationId.toString());
    }

    try {
      this.loading = true;
      this.updateUI();

      const timestamp = new Date().toLocaleString();
      const conversationContext = newMessages
        .filter((msg) => msg.user)
        .map((msg) => `User: ${msg.text}`)
        .join('\n');

      const prompt = isEdit
        ? `You are a smart plant care assistant. You only answer questions related to plants, gardening, farming, or plant care.

                Conversation context:
                ${conversationContext}

                The user edited their previous message to: "${textToSend}".

                Please answer ONLY if the message is related to plants. If it's unrelated, politely tell the user you can only assist with plant-related topics.`
        : `You are a smart plant care assistant. You only answer questions related to plants, gardening, farming, or plant care.

                Current conversation:
                ${conversationContext}

                New user question: ${textToSend}

                Please answer ONLY if the message is related to plants. If it's unrelated, politely inform the user that you specialize only in plants.`;

      const botResponse = await this.generateBotResponse(prompt);

      const botMessage = {
        text: botResponse,
        user: false,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...newMessages, botMessage];
      this.messages = updatedMessages;
      this.updateUI();
      this.debounceUpdateConversationHistory(updatedMessages, timestamp);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        user: false,
        timestamp: new Date().toISOString(),
      };
      this.messages = [...newMessages, errorMessage];
      this.updateUI();
      this.debounceUpdateConversationHistory(newMessages, new Date().toLocaleString());
    } finally {
      this.loading = false;
      this.updateUI();
    }
  }

  generateBotResponse(promptText: string): Promise<string> {
    return this.http
      .post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBra4g07_XXgKVQHZv0002fsze-UhurSuY`,
        {
          contents: [{ parts: [{ text: promptText }] }],
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .pipe(
        map((response: any) =>
          response?.candidates?.[0]?.content?.parts?.[0]?.text ||
          'I couldn’t generate a response. Please try again.'
        ),
        catchError((error: any) => {
          console.error('API Error:', error);
          return throwError(() => error);
        })
      )
      .toPromise();
  }

  debounceUpdateConversationHistory(messages: any[], timestamp: string) {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    this.updateTimeout = setTimeout(() => {
      this.updateConversationHistory(messages, timestamp);
    }, 100); // 100ms debounce
  }

  updateConversationHistory(messages: any[], timestamp: string) {
    if (messages.length === 0 || !this.currentConversationId) return;

    localStorage.setItem('plantCurrentChat', JSON.stringify(messages));

    const currentConvIndex = this.conversationHistory.findIndex(
      (conv) => conv.id === this.currentConversationId
    );

    const conversationData = {
      id: this.currentConversationId,
      title: `Plant: ${messages[0]?.text.slice(0, 30)}${messages[0]?.text.length > 30 ? '...' : ''}`,
      messages: messages,
      timestamp: currentConvIndex >= 0 ? this.conversationHistory[currentConvIndex].timestamp : timestamp,
      lastMessage: timestamp,
    };

    if (currentConvIndex >= 0) {
      // Update existing conversation
      this.conversationHistory[currentConvIndex] = conversationData;
    } else {
      // Add new conversation, limit history to 50 entries
      this.conversationHistory = [conversationData, ...this.conversationHistory.slice(0, 49)];
    }

    localStorage.setItem('plantChatHistory', JSON.stringify(this.conversationHistory));
  }

  loadConversation(conversation: any) {
    if (typeof conversation.id !== 'number') {
      console.error('Invalid conversation ID:', conversation.id);
      return;
    }

    this.messages = conversation.messages || [];
    this.currentConversationId = conversation.id;
    localStorage.setItem('plantCurrentChat', JSON.stringify(this.messages));
    if (this.currentConversationId !== null) {
      localStorage.setItem('plantCurrentConversationId', this.currentConversationId.toString());
    }
    this.showHistory = false;
    this.updateSidebarVisibility();
    this.updateUI();
  }

  deleteConversation(id: number) {
    const isCurrentConversation = this.currentConversationId === id;

    this.conversationHistory = this.conversationHistory.filter((conv) => conv.id !== id);
    localStorage.setItem('plantChatHistory', JSON.stringify(this.conversationHistory));

    if (isCurrentConversation) {
      this.messages = [];
      this.currentConversationId = null;
      localStorage.removeItem('plantCurrentChat');
      localStorage.removeItem('plantCurrentConversationId');
    }

    this.updateUI();
  }

  clearAllConversations() {
    if (!confirm('Are you sure you want to delete ALL conversation history?')) return;

    this.conversationHistory = [];
    this.messages = [];
    this.currentConversationId = null;
    localStorage.removeItem('plantChatHistory');
    localStorage.removeItem('plantCurrentChat');
    localStorage.removeItem('plantCurrentConversationId');
    this.showHistory = false;
    this.updateSidebarVisibility();
    this.updateUI();
    this.messageInput.setValue('');
    this.updateInputState();
  }

  startNewConversation() {
    this.messages = [];
    this.currentConversationId = null;
    localStorage.removeItem('plantCurrentChat');
    localStorage.removeItem('plantCurrentConversationId');
    this.showHistory = false;
    this.updateSidebarVisibility();
    this.updateUI();
    this.messageInput.setValue('');
    this.updateInputState();
  }

  startEditing(index: number, text: string) {
    this.editingMessageId = index;
    this.editText = text;
    this.updateUI();
  }

  cancelEditing() {
    this.editingMessageId = null;
    this.editText = '';
    this.updateUI();
  }

  async saveEdit(index: number) {
    if (!this.editText.trim()) return;

    this.messages[index].text = this.editText;
    this.messages[index].edited = true;
    this.messages = this.messages.slice(0, index + 1);
    this.editingMessageId = null;

    await this.handleSendMessage(this.editText, true, index);
    this.updateUI();
  }

  scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  parseMarkdown(text: string): string {
    return marked.parse(text, { async: false }) as string;
  }
}