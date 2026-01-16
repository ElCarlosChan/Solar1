
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Image as ImageIcon, 
  CheckCircle2, 
  FileText, 
  Camera, 
  AlertTriangle,
  Trash2
} from 'lucide-react';
import { ChatMessage, ChecklistItem } from './types';
import { CHECKLIST_DOC, CHECKLIST_CAMPO, COLORS } from './constants';
import { getGeminiResponse } from './geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy SolarCheck AI. Puedo ayudarte a verificar instalaciones fotovoltaicas según la NOM-001-SEDE-2012. ¿Qué deseas revisar hoy? Puedes subir una foto o pedirme que analice un punto del proyecto.',
      timestamp: Date.now(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'checklist'>('chat');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      image: selectedImage || undefined,
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(currentInput || "Analiza esta imagen para cumplimiento con la NOM-001-SEDE-2012", currentImage?.split(',')[1]);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.',
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 py-4 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 tracking-tight">SolarCheck AI</h1>
            <p className="text-xs text-slate-500 font-medium">NOM-001-SEDE-2012</p>
          </div>
        </div>
        
        <nav className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'chat' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Chat
          </button>
          <button 
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'checklist' ? 'bg-white shadow-sm text-green-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Checklist
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 max-w-5xl mx-auto w-full">
        {activeTab === 'chat' ? (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 ${
                  msg.role === 'user' 
                    ? 'bg-blue-50 text-slate-800 rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm'
                }`}>
                  {msg.image && (
                    <img src={msg.image} alt="Usuario" className="w-full max-h-64 object-cover rounded-lg mb-3" />
                  )}
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-xs font-medium text-slate-400">Analizando normativa...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="space-y-8 pb-20">
            <section>
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="text-blue-500 w-5 h-5" /> Verificación de Proyecto (Documental)
              </h2>
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-600">ID</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">Punto a verificar</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">Ref. NOM</th>
                      <th className="px-4 py-3 font-semibold text-slate-600 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {CHECKLIST_DOC.map(item => (
                      <ChecklistRow key={item.id} item={item} />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Camera className="text-green-500 w-5 h-5" /> Verificación de Campo (Inspección)
              </h2>
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-600">ID</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">Punto a verificar</th>
                      <th className="px-4 py-3 font-semibold text-slate-600">Ref. NOM</th>
                      <th className="px-4 py-3 font-semibold text-slate-600 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {CHECKLIST_CAMPO.map(item => (
                      <ChecklistRow key={item.id} item={item} />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Input Area */}
      {activeTab === 'chat' && (
        <div className="bg-white border-t border-slate-100 p-4 sticky bottom-0">
          <div className="max-w-5xl mx-auto">
            {selectedImage && (
              <div className="mb-3 flex items-center gap-3 bg-blue-50 p-2 rounded-xl border border-blue-100">
                <img src={selectedImage} alt="Preview" className="w-12 h-12 rounded object-cover" />
                <span className="text-xs font-medium text-blue-700 flex-1">Imagen lista para analizar</span>
                <button onClick={() => setSelectedImage(null)} className="p-1 hover:bg-blue-200 rounded-full">
                  <Trash2 className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            )}
            
            <form onSubmit={handleSend} className="flex gap-2">
              <div className="flex-1 bg-slate-100 rounded-2xl flex items-center px-4 py-1.5 border border-transparent focus-within:border-blue-300 transition-all">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu duda normativa o sube una imagen..."
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2"
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-500"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
              </div>
              <button 
                type="submit" 
                disabled={(!input.trim() && !selectedImage) || isLoading}
                className={`p-3 rounded-2xl flex items-center justify-center transition-all ${
                  (!input.trim() && !selectedImage) || isLoading 
                    ? 'bg-slate-200 text-slate-400' 
                    : 'bg-blue-500 text-white shadow-lg shadow-blue-200 hover:scale-105'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface ChecklistRowProps {
  item: ChecklistItem;
}

const ChecklistRow: React.FC<ChecklistRowProps> = ({ item }) => {
  const [status, setStatus] = useState<'cumple' | 'no-cumple' | 'pendiente'>('pendiente');

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-4 font-mono text-xs font-bold text-slate-400">{item.id}</td>
      <td className="px-4 py-4">
        <div className="font-medium text-slate-800">{item.point}</div>
        <div className="text-xs text-slate-500 mt-0.5">{item.criteria}</div>
      </td>
      <td className="px-4 py-4 text-xs font-semibold text-blue-600">{item.reference}</td>
      <td className="px-4 py-4">
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={() => setStatus(status === 'cumple' ? 'pendiente' : 'cumple')}
            className={`p-1 rounded-md transition-all ${status === 'cumple' ? 'bg-green-100' : 'hover:bg-slate-100'}`}
          >
            <CheckCircle2 className={`w-5 h-5 ${status === 'cumple' ? 'text-green-600' : 'text-slate-300'}`} />
          </button>
          <button 
            onClick={() => setStatus(status === 'no-cumple' ? 'pendiente' : 'no-cumple')}
            className={`p-1 rounded-md transition-all ${status === 'no-cumple' ? 'bg-red-100' : 'hover:bg-slate-100'}`}
          >
            <AlertTriangle className={`w-5 h-5 ${status === 'no-cumple' ? 'text-red-600' : 'text-slate-300'}`} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default App;
