
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileText, Lock, Users, Eye, Mail } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { getWebPage } from "@/lib/seo/jsonld";

const PRIVACY_LAST_UPDATED = "2024-01-15";

const PoliticaPrivacidade = () => {
  const structuredData = getWebPage({
    name: "Política de Privacidade — Tikvah Psychological Center",
    description:
      "Política de Privacidade da Tikvah Psycem: como recolhemos, tratamos e protegemos os seus dados pessoais.",
    path: "/politica-de-privacidade",
    dateModified: PRIVACY_LAST_UPDATED,
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Política de Privacidade - Tikvah Psychological Center & Multiservice"
        description="Política de Privacidade da Tikvah Psycem. Conheça como protegemos e tratamos os seus dados pessoais em conformidade com as melhores práticas de segurança."
        keywords="política de privacidade, proteção de dados, GDPR, segurança de dados, Tikvah, privacidade"
        canonicalUrl="https://tikvahpsycem.lovable.app/politica-de-privacidade"
        structuredData={structuredData}
      />

      <Navbar />
      <BreadcrumbNavigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Política de <span className="text-gradient-primary">Privacidade</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A Tikvah Psychological Center & Multiservice está comprometida com a proteção dos seus dados pessoais e a transparência no seu tratamento.
          </p>
          <div className="mt-6 text-sm text-muted-foreground">
            <p>Última atualização: Janeiro de 2024</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Introdução */}
          <Card className="mb-8 hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <FileText className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-foreground">1. Introdução e Propósito</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A Tikvah Psychological Center & Multiservice - Tikvah Psycem (doravante "Tikvah"), valoriza a confiança dos seus clientes e parceiros. A presente Política de Privacidade foi elaborada para demonstrar o nosso compromisso com a proteção dos dados pessoais recolhidos e para informar de forma clara e transparente sobre como processamos, usamos e protegemos as suas informações.
              </p>
            </CardContent>
          </Card>

          {/* Recolha de Dados */}
          <Card className="mb-8 hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Users className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-foreground">2. Recolha e Tipos de Dados Pessoais</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A Tikvah recolhe dados pessoais estritamente necessários para a prestação dos nossos serviços e para a gestão do nosso negócio. Os dados são obtidos diretamente dos utilizadores através de formulários de contacto no nosso website, interação nas redes sociais, submissão de formulários em plataformas de publicidade (ex: Google Ads), e comunicações telefónicas ou por correio eletrónico.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Os tipos de dados que podemos recolher incluem:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li><strong>Informação de Identificação:</strong> Nome, e-mail, número de telefone.</li>
                <li><strong>Informação Profissional:</strong> Nome da empresa, cargo, e-mail profissional, e tipo de serviço procurado.</li>
                <li><strong>Dados de Interação:</strong> Informações sobre o uso do nosso website, páginas visitadas e interações com os nossos anúncios.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Finalidade */}
          <Card className="mb-8 hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Eye className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-foreground">3. Finalidade da Recolha de Dados</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Os dados recolhidos pela Tikvah são utilizados exclusivamente para as seguintes finalidades:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
                <li><strong>Comunicação:</strong> Contactar utilizadores que manifestaram interesse nos nossos serviços ou que solicitaram informações.</li>
                <li><strong>Prestação de Serviços:</strong> Utilizar os dados para a gestão e execução dos serviços contratados (ex: agendamento de consultas, envio de materiais de formação, gestão de projetos).</li>
                <li><strong>Marketing e Análise:</strong> Otimizar as nossas campanhas de marketing e entender o comportamento dos nossos utilizadores para melhorar a qualidade dos nossos serviços.</li>
                <li><strong>Conformidade Legal:</strong> Cumprir com as obrigações legais e regulamentares aplicáveis.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Partilha de Dados */}
          <Card className="mb-8 hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Users className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-foreground">4. Partilha de Dados com Terceiros</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A Tikvah não vende, aluga ou cede os seus dados pessoais a terceiros. As suas informações podem ser partilhadas com parceiros e plataformas de tecnologia (ex: Google Ads para gestão de leads, Google Analytics para análise de tráfego) exclusivamente para as finalidades descritas nesta política. Todos os nossos parceiros são avaliados e comprometidos com a proteção de dados.
              </p>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card className="mb-8 hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Lock className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-foreground">5. Segurança dos Dados</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Empregamos medidas técnicas e organizacionais rigorosas para proteger os seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição. A segurança dos seus dados é a nossa prioridade.
              </p>
            </CardContent>
          </Card>

          {/* Direitos do Titular */}
          <Card className="mb-8 hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-foreground">6. Direitos do Titular dos Dados</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Como titular dos dados, você tem o direito de:
              </p>
              <ul className="list-disc ml-6 space-y-2 text-muted-foreground mb-4">
                <li>Aceder às suas informações pessoais.</li>
                <li>Retificar dados incorretos ou desatualizados.</li>
                <li>Solicitar a eliminação dos seus dados quando estes já não forem necessários para as finalidades da sua recolha.</li>
                <li>Opor-se ao processamento dos seus dados em determinadas circunstâncias.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Para exercer os seus direitos, por favor, entre em contacto connosco através do e-mail indicado abaixo.
              </p>
            </CardContent>
          </Card>

          {/* Alterações */}
          <Card className="mb-8 hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <FileText className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-foreground">7. Alterações à Política de Privacidade</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Esta política pode ser atualizada periodicamente. Aconselhamos a sua revisão regular para se manter informado sobre como protegemos as suas informações.
              </p>
            </CardContent>
          </Card>

          {/* Contactos */}
          <Card className="mb-8 hover:shadow-lg transition-shadow border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <Mail className="w-6 h-6 text-primary mr-3" />
                <h2 className="text-2xl font-bold text-foreground">8. Contactos</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Para qualquer questão ou preocupação sobre a nossa Política de Privacidade ou sobre o processamento dos seus dados pessoais, por favor, contacte-nos através do e-mail:
              </p>
              <div className="bg-primary/5 rounded-lg p-4">
                <a 
                  href="mailto:suporte.oficina.psicologo@proton.me" 
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  suporte.oficina.psicologo@proton.me
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Data de Atualização */}
          <div className="text-center text-sm text-muted-foreground mt-8 p-4 bg-secondary/20 rounded-lg">
            <p><strong>Tikvah Psychological Center & Multiservice</strong></p>
            <p>Esta Política de Privacidade foi atualizada pela última vez em Janeiro de 2024.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PoliticaPrivacidade;
