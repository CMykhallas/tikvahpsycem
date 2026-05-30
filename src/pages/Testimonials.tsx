
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  client_name: string;
  service_type: string;
  rating: number;
  testimonial: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data until database types are updated
    const mockTestimonials: Testimonial[] = [
      {
        id: "1",
        client_name: "Ana M.",
        service_type: "Psicoterapia Individual",
        rating: 5,
        testimonial: "O atendimento da Tikvah mudou minha vida. A abordagem profissional e humana me ajudou a superar momentos muito difíceis. Recomendo de coração."
      },
      {
        id: "2",
        client_name: "João S.",
        service_type: "Consultoria Organizacional",
        rating: 5,
        testimonial: "Excelente trabalho de consultoria. A equipe da Tikvah ajudou nossa empresa a reestruturar processos e melhorar significativamente o ambiente de trabalho."
      },
      {
        id: "3",
        client_name: "Maria F.",
        service_type: "Terapia de Casal",
        rating: 5,
        testimonial: "Salvaram nosso casamento! O processo terapêutico nos ajudou a nos reconectarmos e encontrar novos caminhos para nossa relação."
      },
      {
        id: "4",
        client_name: "Pedro L.",
        service_type: "Workshop de Mindfulness",
        rating: 4,
        testimonial: "Workshop muito bem estruturado. Aprendi técnicas valiosas que uso no meu dia a dia para gerir o stress e ansiedade."
      },
      {
        id: "5",
        client_name: "Carla R.",
        service_type: "Curso de Inteligência Emocional",
        rating: 5,
        testimonial: "Curso transformador! Desenvolvi habilidades que melhoraram tanto minha vida pessoal quanto profissional. Facilitadores excelentes."
      },
      {
        id: "6",
        client_name: "António M.",
        service_type: "Coaching Executivo",
        rating: 5,
        testimonial: "O coaching executivo me ajudou a desenvolver uma liderança mais eficaz. Resultados visíveis na minha equipe e nos nossos projetos."
      }
    ];
    
    setTestimonials(mockTestimonials);
    setLoading(false);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Quote className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            <span className="text-teal-600">Depoimentos</span> dos Nossos Clientes
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Histórias reais de transformação e crescimento através dos nossos serviços
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-slate-200 rounded mb-4"></div>
                  <div className="h-20 bg-slate-200 rounded mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Quote className="w-8 h-8 text-teal-600 opacity-20 mr-2" />
                    <div className="flex">{renderStars(testimonial.rating)}</div>
                  </div>
                  
                  <p className="text-slate-700 mb-6 leading-relaxed italic">
                    "{testimonial.testimonial}"
                  </p>
                  
                  <div className="border-t pt-4">
                    <p className="font-semibold text-slate-800">{testimonial.client_name}</p>
                    <p className="text-sm text-teal-600">{testimonial.service_type}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Compartilhe Sua Experiência
          </h3>
          <p className="text-slate-600 mb-6">
            Sua opinião é importante para nós e pode inspirar outras pessoas. 
            Compartilhe como nossos serviços fizeram a diferença na sua vida.
          </p>
          <a href="/feedback" className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition-colors">
            Deixar Depoimento
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Testimonials;
