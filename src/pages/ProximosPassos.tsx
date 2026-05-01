import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Mail, Phone, FileText, Shield, ArrowLeft, Calendar } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

const steps = [
  {
    icon: CheckCircle2,
    title: "Pedido recebido",
    when: "Imediato",
    desc: "Atribuímos um número de protocolo único e registamos o pedido no nosso sistema seguro (ISO 27001).",
    color: "#00A859",
  },
  {
    icon: Mail,
    title: "Notificação à equipa",
    when: "Em segundos",
    desc: "A área responsável (Clínica, Executiva ou Formação) recebe o seu pedido por email com prioridade definida.",
    color: "#1e3a8a",
  },
  {
    icon: FileText,
    title: "Análise técnica",
    when: "Até 4 horas úteis",
    desc: "Um especialista da área avalia o pedido, modalidade e público para preparar uma proposta personalizada.",
    color: "#f59e0b",
  },
  {
    icon: Phone,
    title: "Primeiro contacto",
    when: "Em até 24 horas",
    desc: "Recebe contacto telefónico ou por email para validar detalhes, esclarecer dúvidas e agendar uma chamada de descoberta (gratuita).",
    color: "#10b981",
  },
  {
    icon: Calendar,
    title: "Proposta formal",
    when: "Em 48 a 72 horas",
    desc: "Enviamos proposta escrita com âmbito, cronograma, investimento e modalidade de pagamento (M-Pesa, transferência ou cartão).",
    color: "#8b5cf6",
  },
  {
    icon: Shield,
    title: "Confidencialidade total",
    when: "Sempre",
    desc: "Todos os dados são encriptados. Seguimos o Código Deontológico e a legislação moçambicana de proteção de dados.",
    color: "#ef4444",
  },
];

export default function ProximosPassos() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SEOHead
        title="Próximos Passos da Sua Proposta | Tikvah Psycem"
        description="Saiba o que acontece após enviar o seu pedido: análise em 4h, contacto em 24h, proposta formal em 72h. Tikvah Psycem, Maputo."
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar a serviços
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tracking-wider uppercase mb-4">
            ✓ Pedido confirmado
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Próximos passos
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Veja exatamente o que a nossa equipa vai fazer e quando esperar cada contacto.
            Transparência total, sem surpresas.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-300 via-blue-300 to-purple-300 hidden md:block" />

          <div className="space-y-5">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative flex gap-5 bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center relative z-10"
                    style={{ backgroundColor: `${s.color}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: s.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-3 mb-1">
                      <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ backgroundColor: `${s.color}15`, color: s.color }}
                      >
                        <Clock className="w-3 h-3 inline mr-1" />
                        {s.when}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-br from-slate-900 to-blue-900 text-white rounded-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-3">Precisa de algo urgente?</h2>
          <p className="text-blue-100 mb-6 text-sm">
            Para emergências ou pedidos prioritários, contacte-nos diretamente:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://wa.me/258840000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Phone className="w-4 h-4" /> WhatsApp
            </a>
            <a
              href="mailto:suporte.oficina.psicologo@proton.me"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Mail className="w-4 h-4" /> Email direto
            </a>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              Ver outros serviços
            </Link>
          </div>
        </motion.div>

        <p className="text-center text-xs text-slate-500 mt-8">
          Guarde o seu número de protocolo para referência futura · Tikvah Psycem, Maputo
        </p>
      </div>
    </div>
  );
}
