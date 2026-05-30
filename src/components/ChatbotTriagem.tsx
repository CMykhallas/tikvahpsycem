import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, MessageSquare, User, Building } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  buttons?: { text: string; action: string }[];
}

export const ChatbotTriagem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: "Olá! Sou a assistente virtual da Tikvah. Como posso ajudá-lo hoje?",
        timestamp: new Date(),
        buttons: [
          { text: "🧠 Apoio Individual", action: "individual" },
          { text: "🏢 Serviços Corporativos", action: "corporate" },
          { text: "📚 Cursos e Formação", action: "courses" },
          { text: "💬 Falar com Especialista", action: "specialist" }
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const handleButtonClick = (action: string) => {
    let botResponse: Message;
    
    switch (action) {
      case "individual":
        botResponse = {
          id: Date.now().toString(),
          type: 'bot',
          content: "Ótima escolha! Oferecemos diversos serviços de apoio individual. Qual área é do seu interesse?",
          timestamp: new Date(),
          buttons: [
            { text: "Psicoterapia Individual", action: "psychotherapy" },
            { text: "Terapia de Casal", action: "couple_therapy" },
            { text: "Apoio em Crises", action: "crisis_support" },
            { text: "Coaching Pessoal", action: "personal_coaching" }
          ]
        };
        break;
      
      case "corporate":
        botResponse = {
          id: Date.now().toString(),
          type: 'bot',
          content: "Excelente! Temos soluções especializadas para empresas. Que tipo de apoio procura?",
          timestamp: new Date(),
          buttons: [
            { text: "Consultoria Organizacional", action: "org_consulting" },
            { text: "Workshops Corporativos", action: "corporate_workshops" },
            { text: "Formação de Equipas", action: "team_training" },
            { text: "Gestão de Conflitos", action: "conflict_management" }
          ]
        };
        break;
      
      case "courses":
        botResponse = {
          id: Date.now().toString(),
          type: 'bot',
          content: "Temos uma academia com cursos de excelência! Qual área lhe interessa?",
          timestamp: new Date(),
          buttons: [
            { text: "Inteligência Emocional", action: "emotional_intelligence" },
            { text: "Mindfulness", action: "mindfulness" },
            { text: "Primeiros Socorros Psicológicos", action: "psychological_first_aid" },
            { text: "Desenvolvimento Pessoal", action: "personal_development" }
          ]
        };
        break;
      
      case "specialist":
        botResponse = {
          id: Date.now().toString(),
          type: 'bot',
          content: "Perfeito! Vou direcioná-lo para um dos nossos especialistas. Prefere ser contactado via:",
          timestamp: new Date(),
          buttons: [
            { text: "📱 WhatsApp", action: "whatsapp_contact" },
            { text: "📧 Email", action: "email_contact" },
            { text: "📅 Agendar Consulta", action: "book_appointment" }
          ]
        };
        break;
      
      case "whatsapp_contact":
        botResponse = {
          id: Date.now().toString(),
          type: 'bot',
          content: "Perfeito! Clique no botão flutuante do WhatsApp (canto inferior esquerdo) e escolha o departamento adequado. Nossa equipa estará pronta para atendê-lo!",
          timestamp: new Date()
        };
        break;
      
      case "email_contact":
        botResponse = {
          id: Date.now().toString(),
          type: 'bot',
          content: "Pode contactar-nos diretamente através da nossa página de contacto, onde encontrará todas as informações necessárias!",
          timestamp: new Date(),
          buttons: [
            { text: "🔗 Ir para Contactos", action: "go_to_contact" }
          ]
        };
        break;
      
      case "book_appointment":
        botResponse = {
          id: Date.now().toString(),
          type: 'bot',
          content: "Excelente escolha! Pode agendar a sua consulta diretamente através do nosso sistema online.",
          timestamp: new Date(),
          buttons: [
            { text: "📅 Agendar Agora", action: "go_to_appointment" }
          ]
        };
        break;
      
      case "go_to_contact":
        window.location.href = "/contact";
        return;
      
      case "go_to_appointment":
        window.location.href = "/appointment";
        return;
      
      default:
        botResponse = {
          id: Date.now().toString(),
          type: 'bot',
          content: `Obrigada pelo seu interesse em ${action.replace(/_/g, ' ')}! Para informações mais detalhadas, recomendo que agende uma consulta ou contacte a nossa equipa diretamente.`,
          timestamp: new Date(),
          buttons: [
            { text: "📅 Agendar Consulta", action: "go_to_appointment" },
            { text: "💬 Contactar Equipa", action: "whatsapp_contact" }
          ]
        };
    }
    
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "Obrigada pela sua mensagem! Para melhor atendê-lo, recomendo que use as opções do menu ou contacte diretamente a nossa equipa através do WhatsApp.",
        timestamp: new Date(),
        buttons: [
          { text: "💬 WhatsApp", action: "whatsapp_contact" },
          { text: "📅 Agendar", action: "go_to_appointment" }
        ]
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-gradient-primary hover:shadow-primary shadow-floating hover:scale-110 transition-all duration-300"
          size="icon"
          aria-label="Assistente Virtual"
        >
          <Bot className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-8 right-8 z-50 w-96 h-[500px] shadow-floating animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-primary text-white rounded-t-lg p-4">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <CardTitle className="text-sm font-heading">Assistente Tikvah</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 h-6 w-6"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-[calc(500px-4rem)]">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-gradient-primary text-white' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      <div className="flex items-start space-x-2">
                        {message.type === 'bot' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                        {message.type === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                        <div className="flex-1">
                          <p className="text-sm">{message.content}</p>
                          {message.buttons && (
                            <div className="mt-3 space-y-2">
                              {message.buttons.map((button, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-xs h-8 hover-elegant"
                                  onClick={() => handleButtonClick(button.action)}
                                >
                                  {button.text}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-secondary text-secondary-foreground rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            <div className="p-4 border-t border-border">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  size="icon"
                  className="bg-gradient-primary hover:shadow-primary"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};