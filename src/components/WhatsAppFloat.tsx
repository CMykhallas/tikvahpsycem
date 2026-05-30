import { useState } from "react";
import { MessageCircle, X, Calendar, Building2, HeadphonesIcon, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export const WhatsAppFloat = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const whatsappNumber = "258827592980";
  
  const departments = [
    {
      id: "agendamentos",
      name: "Agendamentos",
      icon: Calendar,
      message: "Olá! Gostaria de agendar uma consulta. Podem me ajudar com os horários disponíveis?",
      color: "text-blue-600"
    },
    {
      id: "corporativo",
      name: "Suporte Corporativo",
      icon: Building2,
      message: "Olá! Represento uma empresa e gostaria de saber mais sobre os serviços corporativos da Tikvah.",
      color: "text-purple-600"
    },
    {
      id: "suporte",
      name: "Suporte Geral",
      icon: HeadphonesIcon,
      message: "Olá! Preciso de informações sobre os serviços da Tikvah Psychological Center.",
      color: "text-green-600"
    },
    {
      id: "grupos",
      name: "Terapia de Grupo",
      icon: Users,
      message: "Olá! Gostaria de saber mais sobre as opções de terapia de grupo disponíveis.",
      color: "text-orange-600"
    }
  ];
  
  const openWhatsApp = (message: string) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed bottom-8 left-8 z-50">
      {/* Menu Options */}
      {isMenuOpen && (
        <Card className="mb-4 animate-slide-up shadow-floating backdrop-institutional">
          <CardContent className="p-4 space-y-2">
            <div className="text-sm font-semibold text-primary mb-3">
              Escolha o departamento:
            </div>
            {departments.map((dept) => (
              <Button
                key={dept.id}
                variant="ghost"
                className="w-full justify-start space-x-3 p-3 hover-institutional"
                onClick={() => openWhatsApp(dept.message)}
              >
                <dept.icon className={`w-5 h-5 ${dept.color}`} />
                <span className="text-sm">{dept.name}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main WhatsApp Button */}
      <Button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="w-14 h-14 rounded-full bg-gradient-success hover:shadow-accent shadow-floating hover:scale-110 transition-all duration-300 animate-pulse-slow"
        size="icon"
        aria-label="Menu WhatsApp"
      >
        {isMenuOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </Button>
    </div>
  );
};