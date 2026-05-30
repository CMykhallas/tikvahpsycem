export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <span className="inline-block text-teal-600 text-sm font-semibold uppercase tracking-wider">
          Segurança e divulgação responsável
        </span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight">
          Como reportar uma vulnerabilidade
        </h1>

        <p className="mt-6 text-lg text-slate-600 leading-relaxed">
          A Tikvah valoriza a segurança dos seus utilizadores e incentiva a divulgação ética de vulnerabilidades encontradas no site.
          Se identificar um problema de segurança, envie a descrição de forma responsável para o contacto oficial indicado abaixo.
        </p>

        <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Contacto oficial</h2>
          <p className="mt-3 text-slate-700">
            Email:{" "}
            <a
              href="mailto:suporte.oficina.psicologo@proton.me"
              className="text-teal-700 font-medium hover:underline"
            >
              suporte.oficina.psicologo@proton.me
            </a>
          </p>

          <div className="mt-6 space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>Inclua, sempre que possível, o URL afetado, descrição técnica, passos para reproduzir e impacto observado.</p>
            <p>Evite publicar dados sensíveis, capturas com informação de utentes ou detalhes operacionais desnecessários em canais públicos.</p>
            <p>Após validação, a equipa poderá responder com orientações adicionais ou confirmar a receção do relatório.</p>
          </div>
        </div>

        <div className="mt-8 bg-teal-50 border border-teal-100 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-teal-900">Boas práticas</h2>
          <ul className="mt-4 space-y-2 text-sm text-teal-900/90 list-disc pl-5">
            <li>Descreva o problema com precisão.</li>
            <li>Evite exploração ativa além do necessário para demonstrar a falha.</li>
            <li>Não aceda nem extraia dados de terceiros.</li>
            <li>Permita tempo razoável para análise e correção.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}