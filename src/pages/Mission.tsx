
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Target, Compass } from "lucide-react";

const Mission = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Missão e <span className="text-teal-600">Visão</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Nosso propósito e direcionamento estratégico
          </p>
        </div>

        <div className="space-y-8">
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Missão</h2>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed">
                Empoderar indivíduos, famílias e organizações para o autoconhecimento e transformação 
                sustentável através de serviços integrados de psicologia, desenvolvimento humano e 
                consultoria especializada, fundamentados em valores éticos e abordagem científica.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Visão</h2>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed">
                Ser a organização de referência em Moçambique e na região na integração de 
                psicologia, desenvolvimento humano e consultoria, reconhecida pela excelência, 
                inovação e impacto transformador na sociedade.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-4">
                  <Compass className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">Propósito</h2>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed">
                Facilitar processos de crescimento pessoal, familiar e organizacional através de 
                uma abordagem holística que integra conhecimento científico, valores humanos e 
                práticas inovadoras, contribuindo para uma sociedade mais saudável e desenvolvida.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Mission;
