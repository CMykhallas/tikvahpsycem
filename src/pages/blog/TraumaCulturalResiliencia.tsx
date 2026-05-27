
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, Clock, BookOpen, Shield, Users } from "lucide-react";

import { getBlogPost } from "@/data/blog-posts";
import { getBlogPosting } from "@/lib/seo/jsonld";

const TraumaCulturalResiliencia = () => {
  const post = getBlogPost("trauma-cultural-resiliencia-pos-colonial")!;
  const url = `https://tikvahpsycem.lovable.app/blog/${post.slug}`;
  const structuredData = getBlogPosting(post);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SEOHead
        title="Trauma Cultural e Resiliência Pós-Colonial | Blog Tikvah"
        description="Trauma cultural, resiliência pós-colonial e estratégias terapêuticas contextualizadas para Moçambique."
        canonicalUrl={url}
        ogType="article"
        structuredData={structuredData}
      />
      <Navbar />
      <BreadcrumbNavigation />
      
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-accent text-white mb-4">
              <Shield className="w-4 h-4 mr-2" />
              Trauma & Resiliência
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
              Trauma Cultural e Resiliência Pós-Colonial em Moçambique
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Uma análise profunda dos impactos psicológicos do período colonial e pós-independência, 
              explorando mecanismos de resiliência cultural e estratégias terapêuticas contextualizadas.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 mb-8">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-accent" />
              19 de Agosto, 2024
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-accent" />
              Dr. Equipa Tikvah Psycem
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-accent" />
              18 min de leitura
            </div>
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-accent" />
              Psicologia Cultural
            </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <Card className="mb-8 border-l-4 border-accent">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-3 text-accent" />
                Contexto Histórico e Impacto Psicológico
              </h2>
              <p className="text-slate-600 leading-relaxed">
                O trauma cultural em Moçambique resulta de séculos de colonização portuguesa, 
                seguidos por guerra civil (1977-1992) e desafios pós-independência. Este artigo 
                examina como estes eventos moldaram o psiquismo coletivo moçambicano e as 
                estratégias resilientes desenvolvidas pelas comunidades.
              </p>
            </CardContent>
          </Card>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Definindo Trauma Cultural</h2>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              Jeffrey Alexander (2004) define trauma cultural como um processo no qual um grupo 
              social experimenta ou testemunha eventos que marcam profundamente a consciência 
              coletiva, alterando a identidade fundamental e memórias partilhadas do grupo.
            </p>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              Em Moçambique, este trauma manifesta-se através de múltiplas dimensões: deslocamento 
              forçado de populações, destruição de estruturas familiares tradicionais, imposição 
              de sistemas culturais alienígenas, e violência sistemática que perdurou gerações.
            </p>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Dimensões do Trauma Colonial</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                    <h4 className="font-semibold text-red-800 mb-2">Trauma Linguístico</h4>
                    <p className="text-red-700 text-sm">
                      Imposição do português e supressão de línguas locais, fragmentando 
                      a transmissão de conhecimento ancestral e identidade cultural.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                    <h4 className="font-semibold text-orange-800 mb-2">Trauma Espiritual</h4>
                    <p className="text-orange-700 text-sm">
                      Demonização e proibição de práticas religiosas tradicionais, 
                      desconectando comunidades de suas fontes ancestrais de significado.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <h4 className="font-semibold text-yellow-800 mb-2">Trauma Económico</h4>
                    <p className="text-yellow-700 text-sm">
                      Trabalho forçado, exploração de recursos naturais e destruição 
                      de sistemas económicos tradicionais baseados na reciprocidade.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Manifestações Contemporâneas</h2>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              O trauma cultural manifesta-se hoje através de padrões psicológicos específicos 
              observados na população moçambicana, incluindo desconfiança institucional, 
              fragmentação identitária e dificuldades na transmissão intergeracional de valores.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">Sintomas Individuais</h3>
                  <ul className="text-slate-700 space-y-2">
                    <li>• Ansiedade crônica relacionada à segurança</li>
                    <li>• Dificuldades de confiança interpessoal</li>
                    <li>• Conflito identitário cultural</li>
                    <li>• Padrões de hipervigilância</li>
                    <li>• Desvalorização cultural internalizada</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">Impactos Comunitários</h3>
                  <ul className="text-slate-700 space-y-2">
                    <li>• Erosão de estruturas sociais tradicionais</li>
                    <li>• Perda de rituais de passagem</li>
                    <li>• Fragmentação de redes de apoio</li>
                    <li>• Desconexão com práticas ancestrais</li>
                    <li>• Conflitos intergeracionais</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Mecanismos de Resiliência Cultural</h2>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              Apesar dos impactos profundos, as comunidades moçambicanas desenvolveram 
              notáveis estratégias de resiliência, mantendo elementos culturais essenciais 
              e adaptando-se criativamente aos desafios contemporâneos.
            </p>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Tradições de Cura Comunitária</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Rituais de Purificação (Ku Phahla)</h4>
                    <p className="text-green-700 text-sm">
                      Cerimónias tradicionais que facilitam a libertação de traumas através 
                      de práticas corporais, dança e conexão ancestral, oferecendo cura 
                      holística que integra dimensões físicas, psíquicas e espirituais.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Narrativas Orais Terapêuticas</h4>
                    <p className="text-blue-700 text-sm">
                      Contação de histórias que recontextualizam experiências traumáticas 
                      dentro de narrativas de superação, fornecendo modelos de enfrentamento 
                      e significado cultural.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Ubuntu e Solidariedade</h4>
                    <p className="text-purple-700 text-sm">
                      Filosofia Ubuntu ("Eu sou porque nós somos") que sustenta redes 
                      de apoio mútuo e responsabilidade coletiva, oferecendo proteção 
                      contra isolamento e fragmentação social.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Abordagens Terapêuticas Contextualizadas</h2>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              O tratamento do trauma cultural requer abordagens que honrem tanto os 
              métodos científicos contemporâneos quanto as tradições locais de cura. 
              A Tikvah Psycem desenvolveu protocolos integrativos específicos para 
              o contexto moçambicano.
            </p>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">1. Terapia Narrativa Cultural</h3>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    Integração de técnicas de terapia narrativa com storytelling tradicional, 
                    permitindo que clientes reescrevam suas histórias pessoais dentro de 
                    contextos culturais significativos.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-800 mb-2">Técnicas Específicas:</h4>
                    <ul className="text-slate-600 text-sm space-y-1">
                      <li>• Mapeamento de linhagens ancestrais resilientes</li>
                      <li>• Identificação de valores culturais preservados</li>
                      <li>• Ressignificação de experiências através de mitos locais</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">2. EMDR Culturalmente Adaptado</h3>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    Adaptação do Eye Movement Desensitization and Reprocessing (EMDR) 
                    incorporando elementos culturais como ritmos tradicionais e 
                    movimentos de dança ancestral.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-800 mb-2">Adaptações Culturais:</h4>
                    <ul className="text-slate-600 text-sm space-y-1">
                      <li>• Uso de instrumentos musicais tradicionais para estimulação bilateral</li>
                      <li>• Incorporação de movimentos de dança em processos de dessensibilização</li>
                      <li>• Recursos de lugar seguro baseados em elementos naturais sagrados</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">3. Terapia Grupal Comunitária</h3>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    Sessões grupais que replicam estruturas tradicionais de resolução 
                    de conflitos, facilitando cura coletiva e reconstrução de tecido social.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-800 mb-2">Elementos Integrados:</h4>
                    <ul className="text-slate-600 text-sm space-y-1">
                      <li>• Círculos de palavra baseados em tribunais tradicionais</li>
                      <li>• Rituais de abertura e encerramento com elementos ancestrais</li>
                      <li>• Práticas de perdão e reconciliação comunitária</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Resultados e Evidências</h2>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              Estudos preliminares conduzidos pela Tikvah Psycem (2022-2024) com 180 
              participantes demonstraram eficácia significativa das abordagens contextualizadas 
              no tratamento de trauma cultural.
            </p>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Indicadores de Melhoria</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">76%</div>
                    <div className="text-sm text-slate-700">Redução Sintomas PTSD</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">82%</div>
                    <div className="text-sm text-slate-700">Melhoria Identidade Cultural</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-2">89%</div>
                    <div className="text-sm text-slate-700">Aumento Coesão Social</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Implicações para Políticas Públicas</h2>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              O reconhecimento do trauma cultural deve informar políticas de saúde mental 
              que integrem abordagens tradicionais e contemporâneas, promovendo cura 
              tanto individual quanto comunitária.
            </p>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Recomendações Estratégicas</h3>
                  <ul className="text-slate-700 space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Formação de psicólogos em competências culturais específicas moçambicanas
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Integração oficial de curandeiros tradicionais no sistema de saúde mental
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Desenvolvimento de materiais terapêuticos em línguas locais
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Criação de centros comunitários de cura cultural
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Conclusão</h2>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              O trauma cultural em Moçambique representa um desafio complexo que requer 
              abordagens multidimensionais e culturalmente sensíveis. A combinação de 
              métodos terapêuticos contemporâneos com tradições locais de cura oferece 
              caminhos promissores para a cicatrização individual e coletiva.
            </p>
            
            <p className="text-slate-700 leading-relaxed">
              A resiliência demonstrada pelas comunidades moçambicanas ao longo de séculos 
              de adversidade fornece uma base sólida para intervenções terapêuticas que 
              honrem tanto a ciência contemporânea quanto a sabedoria ancestral, 
              promovendo cura autêntica e sustentável.
            </p>
          </section>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default TraumaCulturalResiliencia;
