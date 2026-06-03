import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, Clock, Brain, Shield, Smartphone, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { getBlogPost } from "@/data/blog-posts";
import { getBlogPosting } from "@/lib/seo/jsonld";

const RedesSociaisOportunidadesConflitos = () => {
  const post = getBlogPost("redes-sociais-oportunidades-ou-conflitos")!;
  const url = `https://tikvahpsycem.lovable.app/blog/${post.slug}`;
  const structuredData = getBlogPosting(post);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <SEOHead
        title="Redes Sociais: Oportunidades ou Conflitos? | Blog Tikvah"
        description="Análise dual — psicanálise e cibersegurança — sobre o tempo nas redes sociais e o seu impacto na saúde psicológica."
        canonicalUrl={url}
        ogType="article"
        structuredData={structuredData}
      />
      <Navbar />
      <BreadcrumbNavigation />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-teal-600 to-blue-600 text-white mb-4">
            <Smartphone className="w-4 h-4 mr-2" />
            Saúde Digital & Cibersegurança
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Redes Sociais: ferramenta de oportunidades ou fonte de conflitos?
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Uma leitura cruzada entre a clínica psicanalítica e a engenharia sénior de
            cibersegurança sobre o tempo que passamos nas plataformas e o que isso faz à nossa
            mente.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 mt-8">
            <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />03 de Junho, 2026</div>
            <div className="flex items-center"><User className="w-4 h-4 mr-2" />Equipa Clínica & Segurança Tikvah</div>
            <div className="flex items-center"><Clock className="w-4 h-4 mr-2" />12 min de leitura</div>
          </div>
        </motion.header>

        <div className="prose prose-lg max-w-none">
          <Card className="mb-8 border-l-4 border-teal-500">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-3 flex items-center">
                <Brain className="w-6 h-6 mr-3 text-teal-600" />
                Introdução
              </h2>
              <p className="text-slate-700 leading-relaxed">
                As redes sociais tornaram-se simultaneamente espaço de oportunidade — relação,
                visibilidade, oportunidade de negócio — e palco de conflito íntimo e coletivo. A
                Tikvah propõe analisar este fenómeno em duas camadas complementares: a escuta
                psicanalítica do sujeito e a análise técnica da arquitetura que o sustenta.
              </p>
            </CardContent>
          </Card>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">1. O tempo que passamos nas redes sociais</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Dados internacionais (DataReportal, 2025) apontam para uma média global superior a
              2h20 diárias em plataformas sociais; em África Subsariana o valor é ainda mais
              elevado entre jovens urbanos. Em Maputo observamos, na prática clínica, uma faixa
              entre 3h e 5h de utilização ativa por dia entre adolescentes e jovens adultos.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Esse tempo não é neutro: substitui sono, ócio criativo, conversa presencial e
              atividade física. A literatura recente (Twenge, 2024; Haidt, 2024) associa o uso
              intensivo a aumento de sintomas ansiosos e depressivos, especialmente em raparigas
              adolescentes.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              2. Redes sociais e saúde psicológica — leitura psicanalítica
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Enquanto psicanalistas, lemos a rede social como um <em>outro</em> permanentemente
              disponível, que devolve ao sujeito uma imagem fragmentada e idealizada de si. O
              scroll infinito reativa a lógica pulsional do prazer imediato e desorganiza a
              capacidade de espera, fundamental para a constituição do desejo.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              O <em>like</em> funciona como um significante de reconhecimento que substitui o
              olhar parental e o reconhecimento simbólico do grupo. Quando esse retorno falha
              (silêncio, exclusão, comparação), emergem afetos de vergonha, vazio e
              desvalorização — frequentemente trazidos à consulta como ansiedade social,
              insónia, irritabilidade e queda do rendimento escolar ou profissional.
            </p>
            <p className="text-slate-700 leading-relaxed">
              No casal e na família, a rede social entra como terceiro intrusivo: ciúmes, leitura
              de mensagens, suspeita e infidelidades digitais aparecem como motivos crescentes
              de consulta conjugal na Tikvah.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              3. Análise de um engenheiro sénior de cibersegurança
            </h2>
            <Card className="mb-6 border-l-4 border-blue-600">
              <CardContent className="p-6 flex gap-4">
                <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-slate-700 leading-relaxed mb-3">
                    Do ponto de vista de engenharia, as plataformas são sistemas de
                    <strong> otimização de engagement</strong> alimentados por modelos de
                    recomendação que maximizam tempo de sessão. A superfície de ataque
                    psicológica é desenhada: notificações push, variabilidade de recompensa,
                    autoplay, scroll infinito e <em>dark patterns</em> de retenção.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    Em paralelo, a superfície técnica expõe o utilizador a engenharia social,
                    phishing direcionado, sextortion, deepfakes e fuga de PII. O custo
                    psicológico de um incidente (chantagem por imagem íntima, doxxing,
                    impersonação) é hoje uma das urgências clínicas mais frequentes em
                    Maputo.
                  </p>
                </div>
              </CardContent>
            </Card>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Riscos cibernéticos com impacto psíquico direto</h3>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li><strong>Phishing e roubo de conta</strong> — perda de identidade digital e sensação de invasão.</li>
              <li><strong>Sextortion e revenge porn</strong> — trauma agudo, ideação suicida.</li>
              <li><strong>Deepfakes</strong> — desorganização da prova de realidade.</li>
              <li><strong>Microtargeting político</strong> — polarização, conflito familiar e comunitário.</li>
              <li><strong>Vigilância íntima</strong> (stalkerware) — violência doméstica digital.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3 text-amber-500" />
              4. Recomendações integradas Tikvah
            </h2>
            <ol className="list-decimal pl-6 text-slate-700 space-y-3">
              <li>Auditoria pessoal de tempo de ecrã (limite ≤ 90 min/dia para uso recreativo).</li>
              <li>Higiene de notificações: desativar push fora do horário laboral.</li>
              <li>MFA, gestor de senhas e revisão trimestral de sessões ativas.</li>
              <li>Espaços de palavra: terapia individual, familiar ou de casal quando o conflito digital se cronifica.</li>
              <li>Educação digital nas escolas e organizações (workshops Tikvah).</li>
            </ol>
          </section>

          <section className="mb-4">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Conclusão</h2>
            <p className="text-slate-700 leading-relaxed">
              As redes sociais não são, em si, boas nem más — são uma infraestrutura que
              amplifica o que o sujeito e a sociedade trazem. Conjugar escuta clínica e
              literacia em cibersegurança é, hoje, condição de saúde mental. A Tikvah propõe
              esta leitura 360° a indivíduos, famílias e organizações em Maputo.
            </p>
          </section>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default RedesSociaisOportunidadesConflitos;
