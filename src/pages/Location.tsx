
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Car, Bus, Clock, Phone } from "lucide-react";

const Location = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Nossa <span className="text-teal-600">Localização</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Visite-nos em Maputo. Estamos localizados em uma área de fácil acesso.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Google Maps Embed */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-slate-100 relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3586.8403358895757!2d32.583558876247785!3d-25.973276254610415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ee69b000e45d00d%3A0x9eb6624ea918f1d2!2sTikvah%20Psychological%20Center%20%26%20Multiservice!5e0!3m2!1spt-PT!2smz!4v1764919501093!5m2!1spt-PT!2smz" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, minHeight: '280px' }}
                  allowFullScreen
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização Tikvah Psychological Center"
                  className="rounded-lg absolute inset-0"
                />
                {/* Fallback quando iframe não carrega */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-slate-400 p-4">
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-xs opacity-50">Carregando mapa...</p>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-lg font-semibold text-slate-800">
                  Tikvah Psychological Center & Multiservice
                </h3>
                <p className="text-slate-600 text-sm">
                  Avenida 24 de Julho N. 797, 1º andar<br />
                  Bairro Polana Cimento "A", Maputo
                </p>
                <a 
                  href="https://maps.app.goo.gl/zwqqoWuoYorvb7py6" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  <MapPin className="w-4 h-4" />
                  Abrir no Google Maps
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          <div className="space-y-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 text-teal-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-800">Endereço Completo</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Avenida 24 de Julho N. 797, 1º andar<br />
                  Bairro Polana Cimento "A"<br />
                  Cidade de Maputo - Maputo<br />
                  CEP: 1092<br />
                  Moçambique
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Car className="w-6 h-6 text-teal-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-800">Como Chegar de Carro</h3>
                </div>
                <ul className="text-slate-600 space-y-2">
                  <li>• Estacionamento disponível no local</li>
                  <li>• Fácil acesso pela Avenida 24 de Julho</li>
                  <li>• Localização central no Bairro Polana Cimento</li>
                  <li>• Área segura e bem iluminada</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Bus className="w-6 h-6 text-teal-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-800">Transporte Público</h3>
                </div>
                <ul className="text-slate-600 space-y-2">
                  <li>• Várias linhas de chapas passam pela região</li>
                  <li>• Ponto de táxi próximo</li>
                  <li>• Acesso fácil por transporte público</li>
                  <li>• Conexões para diversas partes da cidade</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-teal-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-800">Horário de Funcionamento</h3>
                </div>
                <div className="text-slate-600 space-y-1">
                  <p><strong>Segunda a Sexta:</strong> 8:00 - 17:00</p>
                  <p><strong>Sábado:</strong> 8:00 - 12:00</p>
                  <p><strong>Domingo:</strong> Fechado</p>
                  <p className="text-sm text-slate-500 mt-2">
                    * Atendimentos fora do horário mediante agendamento
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Phone className="w-6 h-6 text-teal-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-800">Contato Direto</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-slate-600">
                    <strong>Telefone:</strong> +258 82 892 6020 (Chamadas/SMS)
                  </p>
                  <p className="text-slate-600">
                    <strong>WhatsApp:</strong> +258 82 759 2980
                  </p>
                  <a 
                    href="https://wa.me/258827592980" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    WhatsApp: +258 82 759 2980
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            Precisando de Orientações?
          </h3>
          <p className="text-slate-600 mb-6">
            Se tiver dificuldades para encontrar nossa localização, entre em contato conosco. 
            Teremos prazer em ajudá-lo com as orientações.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+258828926020" className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              Ligar Agora
            </a>
            <a href="mailto:suporte.oficina.psicologo@proton.me" className="inline-flex items-center justify-center px-6 py-3 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors">
              Enviar Email
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Location;
