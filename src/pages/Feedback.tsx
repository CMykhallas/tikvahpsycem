
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAccepted) {
      alert("Por favor, aceite a Política de Privacidade para continuar.");
      return;
    }
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Seu <span className="text-teal-600">Feedback</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Sua opinião é muito importante para nós. Compartilhe sua experiência e nos ajude a melhorar nossos serviços.
          </p>
        </div>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome Completo
                  </label>
                  <Input 
                    type="text" 
                    required 
                    className="w-full"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <Input 
                    type="email" 
                    required 
                    className="w-full"
                    placeholder="seu.email@exemplo.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Serviço Utilizado
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="psicoterapia">Psicoterapia</SelectItem>
                    <SelectItem value="consultoria">Consultoria</SelectItem>
                    <SelectItem value="cursos">Cursos</SelectItem>
                    <SelectItem value="workshops">Workshops</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-4">
                  Avaliação Geral
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoveredRating || rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="ml-4 text-slate-600">
                    {rating > 0 && (
                      <>
                        {rating === 1 && "Muito Insatisfeito"}
                        {rating === 2 && "Insatisfeito"}
                        {rating === 3 && "Neutro"}
                        {rating === 4 && "Satisfeito"}
                        {rating === 5 && "Muito Satisfeito"}
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  O que mais gostou?
                </label>
                <Textarea 
                  rows={3}
                  className="w-full"
                  placeholder="Conte-nos o que mais apreciou em nosso atendimento..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sugestões de Melhoria
                </label>
                <Textarea 
                  rows={3}
                  className="w-full"
                  placeholder="Como podemos melhorar nossos serviços?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Comentários Adicionais
                </label>
                <Textarea 
                  rows={4}
                  className="w-full"
                  placeholder="Outros comentários que gostaria de compartilhar..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="consent" 
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="consent" className="text-sm text-slate-600">
                  Autorizo o uso deste depoimento em materiais promocionais da Tikvah (opcional)
                </label>
              </div>

              {/* Privacy Policy Checkbox */}
              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                <input 
                  type="checkbox" 
                  id="privacy-consent-feedback" 
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 mt-1"
                  required
                />
                <label htmlFor="privacy-consent-feedback" className="text-sm text-slate-600 leading-relaxed">
                  Aceito a{" "}
                  <Link 
                    to="/politica-de-privacidade" 
                    target="_blank"
                    className="text-teal-600 hover:text-teal-700 underline font-medium"
                  >
                    Política de Privacidade
                  </Link>
                  {" "}e autorizo o processamento dos meus dados pessoais para fins de melhoria dos serviços. *
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                disabled={!privacyAccepted}
              >
                Enviar Feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            Obrigado pela sua confiança!
          </h3>
          <p className="text-slate-600">
            Seu feedback nos ajuda a aprimorar continuamente nossos serviços e atendimento.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Feedback;
