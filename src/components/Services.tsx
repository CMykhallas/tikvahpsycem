import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TikvahEcosystem } from "@/components/TikvahEcosystem";

export const Services = () => {
  return (
    <section id="services" aria-labelledby="services-section-title">
      <h2 id="services-section-title" className="sr-only">
        Nossos Serviços
      </h2>

      <TikvahEcosystem compact />

      {/* Call to Action */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 pb-16 md:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-border">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
              Pronto para transformar a sua organização ou a sua vida?
            </h3>
            <p className="text-base md:text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Conheça todo o ecossistema de serviços, peça uma proposta formal
              ou agende uma consulta inicial com a nossa equipa multidisciplinar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/services">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-4 rounded-full text-base md:text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Conhecer todos os serviços
                </Button>
              </Link>
              <Link to="/appointment">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 rounded-full text-base md:text-lg font-semibold"
                >
                  Agendar consulta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
