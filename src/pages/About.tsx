
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import consultationRoom from "@/assets/consultation-room-luxury.jpg";
import psicologoProfissional from "@/assets/psicologo-profissional-mozambique.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SEOHead
        title="Sobre a Tikvah — Centro de Psicologia em Maputo"
        description="Conheça a Tikvah Psychological Center & Multiservice: história, missão e equipa multidisciplinar dedicada à saúde mental em Maputo."
        canonicalUrl="https://tikvahpsycem.lovable.app/about"
      />
      <Navbar />

      
      {/* Hero Section with Image */}
      <section className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat h-[400px]"
          style={{ backgroundImage: `url(${consultationRoom})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 to-blue-900/70 h-[400px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sobre a <span className="text-teal-300">Tikvah</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Constituída em 2019 como sucessora da OPM, somos afiliados à Plp-Alleluia
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-20">
        <div className="prose prose-lg max-w-none text-slate-700">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Nossa História</h2>
            <p className="mb-4">
              A Tikvah Psychological Center & Multiservice foi constituída em 2019 como sucessora da 
              Organização de Psicologia de Moçambique (OPM), mantendo nossa afiliação com a Plp-Alleluia 
              e consolidando nossa presença em Maputo.
            </p>
            <p className="mb-4">
              Localizada na Cidade de Maputo, onde a nossa organização representa uma evolução natural no campo da psicologia e desenvolvimento humano em Moçambique.
            </p>
          </div>

          {/* Professional Image Section */}
          <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg">
            <img 
              src={psicologoProfissional} 
              alt="Psicólogo profissional em Maputo, Moçambique"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-900/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold">Profissionais Qualificados</h3>
              <p className="text-white/90 text-sm">Equipe multidisciplinar dedicada ao seu bem-estar</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Nossa Abordagem</h2>
            <p className="mb-4">
              Somos pioneiros na integração de psicologia, filosofia, sociologia e valores cristãos 
              em Moçambique, oferecendo uma metodologia híbrida proprietária que combina conhecimento 
              científico com valores humanos fundamentais.
            </p>
            <p>
              Nossa equipe multidisciplinar inclui Psicólogos Clínicos, Organizacionais, Educacionais, 
              Psicanalistas, Terapeutas e Consultores especializados em diversas áreas como Agropecuária, 
              TI e Gestão Financeira.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
