
export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  image?: string;
}

export interface ChecklistItem {
  id: string;
  point: string;
  reference: string;
  type: 'DOC' | 'VIS' | 'FUN' | 'Campo' | 'MED/DOC' | 'VIS/DOC' | 'VIS/FUN' | 'Doc' | 'Doc/Campo';
  criteria: string;
  status?: 'cumple' | 'no-cumple' | 'pendiente';
}
