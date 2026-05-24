
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, Clock, BookOpen, Target, Heart } from "lucide-react";

const ACTTerapiaContextos = () => {
  const url = "https://tikvahpsycem.lovable.app/blog/act-terapia-contextos-africanos";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "ACT: Terapia de Aceitação e Compromisso em Contextos Africanos",
    description: "Aplicação da Acceptance and Commitment Therapy (ACT) em contextos africanos, com adaptação cultural e integração com valores comunitários tradicionais.",
    author: { "@type": "Organization", name: "Tikvah Psychological Center" },
    publisher: {
      "@type": "Organization",
      name: "Tikvah Psychological Center & Multiservice",
      logo: { "@type": "ImageObject", url: "https://tikvahpsycem.lovable.app/tikvah-logo.jpg" },
    },
    datePublished: "2024-08-19",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "pt-MZ",
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SEOHead
        title="ACT em Contextos Africanos | Blog Tikvah"
        description="Aplicação da Terapia de Aceitação e Compromisso (ACT) em contextos africanos, com foco na adaptação cultural e valores comunitários."
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
              <Target className="w-4 h-4 mr-2" />
              ACT & Contextualismo
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
              ACT: Terapia de Aceitação e Compromisso em Contextos Africanos
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Explorando a aplicação da Acceptance and Commitment Therapy (ACT) em contextos 
              africanos, com foco na adaptação cultural e integração com valores comunitários tradicionais.
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
              16 min de leitura
            </div>
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-accent" />
              Terapias Contextuais
            </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <Card className="mb-8 border-l-4 border-accent">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                <Heart className="w-6 h-6 mr-3 text-accent" />
                Fundamentos da ACT em Contextos Africanos
              </h2>
              <p className="text-slate-600 leading-relaxed">
                A Terapia de Aceitação e Compromisso (ACT) oferece uma abordagem única que 
                se alinha naturalmente com filosofias africanas tradicionais, enfatizando 
                flexibilidade psicológica, valores comunitários e aceitação de experiências 
                difíceis como parte da condição humana.
              </p>
            </CardContent>
          </Card>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Introdução à ACT</h2>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              Desenvolvida por Steven Hayes, a ACT baseia-se na Teoria dos Quadros Relacionais 
              e no contextualismo funcional, focando não na eliminação de sintomas, mas no 
              desenvolvimento da flexibilidade psicológica - a capacidade de estar presente 
              com experiências internas e externas e agir de acordo com valores pessoais.
            </p>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              Esta abordagem ressoa profundamente com filosofias africanas tradicionais que 
              valorizam a aceitação de ciclos naturais da vida, a importância da comunidade 
              e a integração harmoniosa entre desafios e crescimento pessoal.
            </p>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Os Seis Processos Centrais da ACT</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 text-sm mb-1">1. Flexibilidade Psicológica</h4>
                      <p className="text-blue-700 text-xs">Capacidade de adaptar-se às circunstâncias mutáveis</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 text-sm mb-1">2. Aceitação</h4>
                      <p className="text-green-700 text-xs">Abraçar experiências internas sem luta</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800 text-sm mb-1">3. Fusão Cognitiva</h4>
                      <p className="text-purple-700 text-xs">Distanciamento saudável de pensamentos</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-800 text-sm mb-1">4. Presente</h4>
                      <p className="text-orange-700 text-xs">Atenção plena ao momento atual</p>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-lg">
                      <h4 className="font-semibold text-teal-800 text-sm mb-1">5. Valores</h4>
                      <p className="text-teal-700 text-xs">Clarificação de direções vitais significativas</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-800 text-sm mb-1">6. Ação Comprometida</h4>
                      <p className="text-red-700 text-xs">Comportamento alinhado com valores</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Adaptações Culturais em Contextos Africanos</h2>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              A aplicação da ACT em contextos africanos, particularmente em Moçambique, 
              requer adaptações sensíveis que honrem as cosmologias locais e integrem 
              valores comunitários tradicionalmente enfatizados.
            </p>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">1. Ubuntu e Flexibilidade Relacional</h3>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    O conceito Ubuntu ("Eu sou porque nós somos") expande a flexibilidade psicológica 
                    para incluir dimensões relacionais e comunitárias, onde o bem-estar individual 
                    está intrinsecamente ligado ao bem-estar coletivo.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-800 mb-2">Aplicações Práticas:</h4>
                    <ul className="text-slate-600 text-sm space-y-1">
                      <li>• Exercícios de valores que incluem responsabilidade comunitária</li>
                      <li>• Práticas de aceitação que honram conexões ancestrais</li>
                      <li>• Ações comprometidas que beneficiam tanto o indivíduo quanto a comunidade</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">2. Metáforas Culturalmente Relevantes</h3>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    A ACT tradicionalmente utiliza metáforas para facilitar a compreensão. 
                    Em contextos africanos, estas devem ser adaptadas para elementos culturalmente 
                    significativos e familiares.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-800 mb-2">Metáforas Adaptadas:</h4>
                    <ul className="text-slate-600 text-sm space-y-1">
                      <li>• <strong>Baobá e Tempestade:</strong> Flexibilidade como árvore que dobra mas não quebra</li>
                      <li>• <strong>Rio e Pedras:</strong> Pensamentos como pedras no rio da consciência</li>
                      <li>• <strong>Tambor Ancestral:</strong> Valores como ritmo que guia a dança da vida</li>
                      <li>• <strong>Círculo de Fogo:</strong> Comunidade como proteção e fonte de força</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent></CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Integração com Práticas Tradicionais</h2>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              A ACT pode ser enriquecida através da integração com práticas tradicionais 
              africanas que já incorporam princípios similares de aceitação, mindfulness 
              e ação orientada por valores comunitários.
            </p>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Práticas Tradicionais Complementares</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                    <h4 className="font-semibold text-amber-800 mb-2">Círculos de Palavra (Indaba)</h4>
                    <p className="text-amber-700 text-sm mb-2">
                      Práticas tradicionais de partilha em círculo que facilitam a des-fusão 
                      cognitiva e o contacto com valores comunitários.
                    </p>
                    <p className="text-amber-600 text-xs font-medium">
                      Integração ACT: Exercícios de valores e ação comprometida em contexto grupal
                    </p>
                  </div>
                  
                  <div className="p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-400">
                    <h4 className="font-semibold text-emerald-800 mb-2">Dança e Movimento Ritual</h4>
                    <p className="text-emerald-700 text-sm mb-2">
                      Expressão corporal tradicional que facilita o contacto com o presente 
                      e a aceitação de estados emocionais diversos.
                    </p>
                    <p className="text-emerald-600 text-xs font-medium">
                      Integração ACT: Exercícios de mindfulness corporal e aceitação experiencial
                    </p>
                  </div>
                  
                  <div className="p-4 bg-violet-50 rounded-lg border-l-4 border-violet-400">
                    <h4 className="font-semibold text-violet-800 mb-2">Contos e Provérbios</h4>
                    <p className="text-violet-700 text-sm mb-2">
                      Narrativas tradicionais que transmitem sabedoria sobre flexibilidade 
                      psicológica e navegação de desafios vitais.
                    </p>
                    <p className="text-violet-600 text-xs font-medium">
                      Integração ACT: Metáforas terapêuticas e exercícios de clarificação de valores
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Protocolo ACT Culturalmente Adaptado</h2>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              A Tikvah Psycem desenvolveu um protocolo de 12 sessões que integra 
              princípios da ACT com elementos culturais moçambicanos, demonstrando 
              eficácia significativa em estudos piloto.
            </p>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Estrutura do Protocolo</h3>
                
                <div className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-3 border border-slate-200 rounded-lg">
                      <h4 className="font-semibold text-slate-800 text-sm mb-1">Sessões 1-3: Diagnóstico Cultural</h4>
                      <p className="text-slate-600 text-xs">Avaliação de recursos culturais e estabelecimento de aliança terapêutica</p>
                    </div>
                    <div className="p-3 border border-slate-200 rounded-lg">
                      <h4 className="font-semibold text-slate-800 text-sm mb-1">Sessões 4-6: Aceitação Ubuntu</h4>
                      <p className="text-slate-600 text-xs">Desenvolvimento de aceitação individual e comunitária</p>
                    </div>
                    <div className="p-3 border border-slate-200 rounded-lg">
                      <h4 className="font-semibold text-slate-800 text-sm mb-1">Sessões 7-9: Valores Ancestrais</h4>
                      <p className="text-slate-600 text-xs">Clarificação de valores pessoais e comunitários</p>
                    </div>
                    <div className="p-3 border border-slate-200 rounded-lg">
                      <h4 className="font-semibold text-slate-800 text-sm mb-1">Sessões 10-12: Ação Ritual</h4>
                      <p className="text-slate-600 text-xs">Implementação de ações comprometidas com suporte comunitário</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Resultados de Estudos Locais</h2>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              Estudos conduzidos pela Tikvah Psycem com 95 participantes (2023-2024) 
              demonstraram eficácia significativa do protocolo ACT culturalmente adaptado 
              em diversas medidas de bem-estar psicológico.
            </p>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Medidas de Resultado</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">78%</div>
                    <div className="text-sm text-slate-700">Aumento Flexibilidade Psicológica</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">71%</div>
                    <div className="text-sm text-slate-700">Redução Evitamento Experiencial</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-2">85%</div>
                    <div className="text-sm text-slate-700">Melhoria Funcionamento Social</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-800">Indicadores Qualitativos Significativos:</h4>
                  <ul className="text-slate-700 space-y-2">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Maior conectividade com valores culturais e ancestrais
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Redução de conflitos entre modernidade e tradição
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Aumento da participação comunitária ativa
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Melhoria na capacidade de lidar com adversidades
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Formação e Implementação</h2>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              A implementação bem-sucedida da ACT em contextos africanos requer formação 
              especializada que combina competência técnica com sensibilidade cultural 
              profunda e compreensão das dinâmicas sociais locais.
            </p>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-3">Competências Essenciais para Terapeutas</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">Competências Técnicas</h4>
                      <ul className="text-slate-700 space-y-1 text-sm">
                        <li>• Domínio dos seis processos ACT</li>
                        <li>• Habilidades de formulação funcional</li>
                        <li>• Técnicas de des-fusão cognitiva</li>
                        <li>• Exercícios de aceitação experiencial</li>
                        <li>• Clarificação e ativação de valores</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">Competências Culturais</h4>
                      <ul className="text-slate-700 space-y-1 text-sm">
                        <li>• Conhecimento de cosmologias locais</li>
                        <li>• Sensibilidade às hierarquias tradicionais</li>
                        <li>• Competência em línguas locais</li>
                        <li>• Compreensão de dinâmicas familiares extensas</li>
                        <li>• Respeito por práticas espirituais ancestrais</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Casos Clínicos Ilustrativos</h2>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              Os seguintes casos (identidades alteradas) ilustram a aplicação prática 
              da ACT culturalmente adaptada em diferentes contextos moçambicanos.
            </p>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Caso 1: Maria, 34 anos - Conflito Cultural</h3>
                  <div className="bg-slate-50 p-4 rounded-lg mb-4">
                    <p className="text-slate-700 text-sm leading-relaxed">
                      <strong>Apresentação:</strong> Professora universitária com ansiedade severa relacionada 
                      a conflitos entre expectativas familiares tradicionais e aspirações profissionais modernas.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-slate-800 mb-1">Intervenção ACT Adaptada:</h4>
                      <ul className="text-slate-700 text-sm space-y-1">
                        <li>• Exploração de valores Ubuntu integrando desenvolvimento pessoal e responsabilidade familiar</li>
                        <li>• Exercícios de des-fusão com narrativas culturais rígidas sobre papéis femininos</li>
                        <li>• Aceitação de tensões como parte natural da evolução cultural</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-1">Resultado:</h4>
                      <p className="text-green-700 text-sm">
                        Desenvolvimento de flexibilidade para honrar tanto valores ancestrais quanto aspirações modernas, 
                        resultando em 70% de redução da ansiedade e maior satisfação com escolhas de vida.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Caso 2: João, 28 anos - Trauma e Deslocamento</h3>
                  <div className="bg-slate-50 p-4 rounded-lg mb-4">
                    <p className="text-slate-700 text-sm leading-relaxed">
                      <strong>Apresentação:</strong> Jovem deslocado por conflitos rurais com PTSD, 
                      desconexão cultural e dificuldades de adaptação urbana.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-slate-800 mb-1">Intervenção ACT Adaptada:</h4>
                      <ul className="text-slate-700 text-sm space-y-1">
                        <li>• Aceitação radical de perdas utilizando metáforas de ciclos naturais</li>
                        <li>• Reconexão com valores ancestrais através de rituais adaptativos</li>
                        <li>• Ações comprometidas para reconstruir comunidade em novo contexto</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-1">Resultado:</h4>
                      <p className="text-blue-700 text-sm">
                        Redução significativa de sintomas traumáticos, reconstrução de identidade cultural 
                        adaptativa e estabelecimento de nova rede de apoio comunitário.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Direções Futuras</h2>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              O futuro da ACT em contextos africanos aponta para desenvolvimentos promissores 
              em investigação, formação e implementação em larga escala.
            </p>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Prioridades de Desenvolvimento</h3>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-blue-400 bg-blue-50">
                    <h4 className="font-semibold text-blue-800 mb-2">Investigação</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Estudos randomizados controlados em múltiplos contextos africanos</li>
                      <li>• Desenvolvimento de medidas culturalmente validadas</li>
                      <li>• Investigação de mecanismos de mudança específicos</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border-l-4 border-green-400 bg-green-50">
                    <h4 className="font-semibold text-green-800 mb-2">Formação</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Programas de certificação em ACT culturalmente adaptada</li>
                      <li>• Supervisão especializada para terapeutas locais</li>
                      <li>• Materiais de treino em línguas locais</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border-l-4 border-purple-400 bg-purple-50">
                    <h4 className="font-semibold text-purple-800 mb-2">Implementação</h4>
                    <ul className="text-purple-700 text-sm space-y-1">
                      <li>• Integração em sistemas de saúde pública</li>
                      <li>• Programas comunitários de prevenção</li>
                      <li>• Adaptações para diferentes grupos etários e contextos</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Conclusão</h2>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              A aplicação da ACT em contextos africanos representa uma convergência natural 
              entre ciência psicológica contemporânea e sabedoria ancestral africana. 
              A ênfase da ACT na flexibilidade psicológica, valores e ação comprometida 
              ressoa profundamente com filosofias Ubuntu e práticas comunitárias tradicionais.
            </p>
            
            <p className="text-slate-700 leading-relaxed mb-6">
              Os resultados promissores obtidos em Moçambique sugerem que, quando culturalmente 
              adaptada e implementada com sensibilidade, a ACT pode oferecer uma abordagem 
              terapêutica poderosa que honra tanto a rigor científico quanto a riqueza 
              cultural africana.
            </p>
            
            <p className="text-slate-700 leading-relaxed">
              O futuro desta integração depende do comprometimento contínuo com a investigação 
              culturalmente sensível, formação especializada e colaboração respeitosa entre 
              conhecimentos científicos ocidentais e sabedoria tradicional africana.
            </p>
          </section>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ACTTerapiaContextos;
