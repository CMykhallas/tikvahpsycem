
import { Card, CardContent } from "@/components/ui/card";

export const About = () => {
  const values = [
    {
      title: "Integridade Ética",
      description: "Compromisso inabalável com princípios éticos em todas as nossas interações e práticas profissionais."
    },
    {
      title: "Desenvolvimento Humano Integral",
      description: "Foco no crescimento completo da pessoa, integrando aspectos psicológicos, sociais e espirituais."
    },
    {
      title: "Excelência",
      description: "Busca constante pela qualidade superior em todos os nossos serviços e processos."
    },
    {
      title: "Respeito Irrestrito",
      description: "Valorização da dignidade e individualidade de cada pessoa que atendemos."
    },
    {
      title: "Impacto Social",
      description: "Compromisso com a transformação positiva da comunidade e sociedade moçambicana."
    },
    {
      title: "Integração de Saberes",
      description: "Combinação única de conhecimentos psicológicos, filosóficos, sociológicos e valores cristãos."
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Sobre a <span className="text-teal-600">Tikvah</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Sucessora da OPM, a Tikvah foi constituída em 2019 com afiliação à Plp-Alleluia, 
            localizada na Cidade de Maputo, onde a nossa organização representa uma evolução natural no campo da psicologia e desenvolvimento humano em Moçambique.
          </p>
        </div>

        {/* Mission and Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Nossa Missão</h3>
              <p className="text-slate-700 leading-relaxed">
                Empoderar indivíduos, famílias e organizações para o autoconhecimento, crescimento pessoal 
                e transformação sustentável através de uma metodologia híbrida proprietária que integra 
                psicologia, filosofia, sociologia e valores cristãos.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Nossa Visão</h3>
              <p className="text-slate-700 leading-relaxed">
                Ser o centro de referência em desenvolvimento humano integral em Moçambique, 
                promovendo transformação sustentável através da integração pioneira de saberes 
                e do acolhimento humanizado.
              </p>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-slate-800 mb-12">Nossos Valores</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50">
                <CardContent className="p-6">
                  <h4 className="text-xl font-semibold text-slate-800 mb-3 group-hover:text-teal-600 transition-colors">
                    {value.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Differentials */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-3xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-6">Nossos Diferenciais</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h4 className="text-xl font-semibold mb-3">Metodologia Híbrida Proprietária</h4>
              <p className="text-teal-100">
                Abordagem única que combina conhecimentos científicos com valores humanos fundamentais.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-3">Capital Humano Estratégico</h4>
              <p className="text-blue-100">
                Equipe multidisciplinar especializada em diversas áreas do desenvolvimento humano.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
