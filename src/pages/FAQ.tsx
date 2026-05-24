
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
    // Using mock data until database types are updated
    const mockFAQs: FAQ[] = [
      {
        id: "1",
        question: "Como posso agendar uma consulta?",
        answer: "Você pode agendar através do nosso sistema online, por telefone (+258 82 892 6020) ou WhatsApp (+258 82 759 2980). Basta preencher o formulário com seus dados e preferências de horário.",
        category: "Agendamento"
      },
      {
        id: "2",
        question: "Quais são as formas de pagamento aceitas?",
        answer: "Aceitamos cartão de débito, M-Pesa e E-mola para sua conveniência. O pagamento pode ser feito no momento do agendamento ou presencialmente.",
        category: "Pagamento"
      },
      {
        id: "3",
        question: "Oferecem atendimento online?",
        answer: "Sim, oferecemos atendimento online, híbrido e presencial para atender suas necessidades. Você pode escolher a modalidade que melhor se adapta à sua situação.",
        category: "Atendimento"
      },
      {
        id: "4",
        question: "Qual é a duração de uma sessão de psicoterapia?",
        answer: "As sessões de psicoterapia individual têm duração de 60 minutos. Terapias de casal e familiar podem durar 90 minutos.",
        category: "Atendimento"
      },
      {
        id: "5",
        question: "Vocês atendem crianças e adolescentes?",
        answer: "Sim, temos profissionais especializados no atendimento de crianças e adolescentes, com abordagens adequadas para cada faixa etária.",
        category: "Atendimento"
      },
      {
        id: "6",
        question: "Como funciona o processo de consultoria organizacional?",
        answer: "Iniciamos com uma avaliação diagnóstica da organização, seguida pela elaboração de um plano de intervenção personalizado e implementação das estratégias acordadas.",
        category: "Consultoria"
      },
      {
        id: "7",
        question: "Os cursos oferecem certificado?",
        answer: "Sim, todos os nossos cursos e workshops oferecem certificado de participação reconhecido pela Tikvah Psychological Center.",
        category: "Cursos"
      },
      {
        id: "8",
        question: "Posso cancelar ou remarcar uma consulta?",
        answer: "Sim, cancelamentos e reagendamentos podem ser feitos com até 24 horas de antecedência através dos nossos canais de contato.",
        category: "Agendamento"
      }
    ];

    setFaqs(mockFAQs);
    setLoading(false);
  }, []);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const categories = ["all", ...Array.from(new Set(faqs.map(faq => faq.category)))];
  
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SEOHead
        title="FAQ — Perguntas Frequentes | Tikvah"
        description="Respostas às dúvidas mais comuns sobre consultas, pagamentos, atendimento online e serviços da Tikvah Psychological Center em Maputo."
        canonicalUrl="https://tikvahpsycem.lovable.app/faq"
      />
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Perguntas <span className="text-teal-600">Frequentes</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre nossos serviços
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Pesquisar perguntas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "Todas" : category}
              </Badge>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <Card key={faq.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset"
                    onClick={() => toggleItem(faq.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-800 pr-4">
                        {faq.question}
                      </h3>
                      {openItems.includes(faq.id) ? (
                        <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                  
                  {openItems.includes(faq.id) && (
                    <div className="px-6 pb-6">
                      <div className="pt-4 border-t border-slate-200">
                        <p className="text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Nenhuma pergunta encontrada
            </h3>
            <p className="text-slate-600">
              Tente pesquisar com outros termos ou entre em contato conosco.
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-white rounded-xl shadow-lg text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Não encontrou sua resposta?
          </h3>
          <p className="text-slate-600 mb-6">
            Nossa equipe está sempre disponível para esclarecer suas dúvidas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/258827592980" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              WhatsApp: +258 82 759 2980
            </a>
            <a 
              href="mailto:suporte.oficina.psicologo@proton.me"
              className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Email: suporte.oficina.psicologo@proton.me
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
