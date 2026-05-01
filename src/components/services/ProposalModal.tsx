import { useState, useEffect, useMemo } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, Send, Sparkles, Copy, Mail, Clock, Phone, AlertCircle, FileDown, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { generateProposalPDF } from "@/utils/proposalPDF";

interface ServiceLite {
  slug: string;
  title: string;
  area_code?: string | null;
  area_name?: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceLite | null;
}

const fieldSchemas = {
  full_name: z.string().trim().min(2, "Mínimo 2 caracteres").max(150, "Máximo 150 caracteres"),
  email: z.string().trim().email("Email inválido (ex: nome@dominio.com)").max(255),
  phone: z.string().trim().min(6, "Mínimo 6 dígitos").max(30, "Máximo 30 caracteres")
    .regex(/^[+()\d\s-]+$/, "Use apenas dígitos, espaços, +, -, ()"),
  modality: z.enum(["Presencial", "Online", "Híbrido", "Indiferente"]),
  audience: z.enum(["PME", "ONG", "Estudantes", "Público", "Profissional Liberal", "Outro"]),
  message: z.string().trim().max(5000, "Máximo 5000 caracteres").optional().or(z.literal("")),
};

const fullSchema = z.object(fieldSchemas);
type FormState = z.infer<typeof fullSchema>;

const initialForm: FormState = {
  full_name: "", email: "", phone: "",
  modality: "Indiferente", audience: "Público", message: "",
};

const generateProtocol = () => {
  const ts = Date.now().toString(36).toUpperCase().slice(-4);
  const rnd = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `TKV-${ts}${rnd}`;
};

export const ProposalModal = ({ open, onOpenChange, service }: Props) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setSuccess(false); setForm(initialForm); setTouched({}); setProtocol(null);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const errors = useMemo(() => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    (Object.keys(fieldSchemas) as Array<keyof FormState>).forEach((k) => {
      const result = (fieldSchemas[k] as z.ZodTypeAny).safeParse(form[k]);
      if (!result.success) errs[k] = result.error.issues[0]?.message;
    });
    return errs;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));
  const blur = (k: keyof FormState) => setTouched((t) => ({ ...t, [k]: true }));
  const showErr = (k: keyof FormState) => touched[k] && errors[k];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    setTouched({ full_name: true, email: true, phone: true, message: true, modality: true, audience: true });

    const parsed = fullSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Verifique os campos");
      return;
    }

    setSubmitting(true);
    try {
      const newProtocol = generateProtocol();
      const { data, error } = await supabase
        .from("service_proposals" as any)
        .insert({
          service_slug: service.slug,
          service_title: service.title,
          area_code: service.area_code || null,
          area_name: service.area_name || null,
          full_name: parsed.data.full_name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          modality: parsed.data.modality,
          audience: parsed.data.audience,
          message: parsed.data.message || null,
          status: "pending",
          metadata: { protocol: newProtocol, source: "web_modal" },
        })
        .select("id")
        .single();

      if (error) throw error;

      setProtocol(newProtocol);
      setSuccess(true);
      toast.success(`Pedido ${newProtocol} recebido!`);

      // Notificar equipa (não-bloqueante)
      const proposalId = (data as any)?.id;
      if (proposalId) {
        supabase.functions.invoke("notify-proposal", { body: { proposal_id: proposalId } })
          .catch((err) => console.warn("Notify warn:", err));
      }
    } catch (err: any) {
      console.error("Proposal error:", err);
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyProtocol = async () => {
    if (!protocol) return;
    try {
      await navigator.clipboard.writeText(protocol);
      toast.success("Protocolo copiado!");
    } catch { toast.error("Não foi possível copiar"); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {success && protocol ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-4 space-y-5"
            >
              <div className="text-center space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="mx-auto w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#00A85920" }}
                >
                  <CheckCircle2 className="w-12 h-12" style={{ color: "#00A859" }} />
                </motion.div>
                <h3 className="text-2xl font-bold">Pedido confirmado!</h3>
                <p className="text-sm text-muted-foreground px-4">
                  Recebemos o seu pedido para <strong className="text-foreground">{service?.title}</strong>.
                </p>
              </div>

              {/* Protocolo */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="rounded-lg border-2 border-dashed p-4 text-center"
                style={{ borderColor: "#00A859", backgroundColor: "#00A8590a" }}
              >
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Número de Protocolo</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-2xl font-bold tracking-wider" style={{ color: "#00A859" }}>{protocol}</code>
                  <Button size="icon" variant="ghost" onClick={copyProtocol} className="h-8 w-8">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Guarde este número para acompanhamento</p>
              </motion.div>

              {/* Próximos passos */}
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <p className="text-sm font-semibold">O que acontece a seguir:</p>
                <div className="space-y-2.5">
                  {[
                    { icon: Mail, t: "Confirmação por email", d: "Enviámos os detalhes para o seu email." },
                    { icon: Clock, t: "Análise em até 24h", d: "A nossa equipa prepara uma proposta personalizada." },
                    { icon: Phone, t: "Contacto direto", d: "Entraremos em contacto pelo telefone fornecido." },
                  ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <motion.div
                        key={s.t}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-start gap-3 p-2.5 rounded-md bg-muted/40"
                      >
                        <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium leading-tight">{s.t}</p>
                          <p className="text-xs text-muted-foreground">{s.d}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              <Button onClick={() => onOpenChange(false)} className="w-full">Fechar</Button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="w-5 h-5" style={{ color: "#00A859" }} />
                  Proposta Formal — 60 segundos
                </DialogTitle>
                <DialogDescription>
                  {service ? (
                    <>Pedido para <strong className="text-foreground">{service.title}</strong>{service.area_name && ` · ${service.area_name}`}</>
                  ) : "Preencha o formulário"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4" noValidate>
                <FieldWrap label="Nome completo *" error={showErr("full_name") ? errors.full_name : undefined}>
                  <Input
                    value={form.full_name}
                    onChange={(e) => update("full_name", e.target.value)}
                    onBlur={() => blur("full_name")}
                    aria-invalid={!!showErr("full_name")}
                    autoComplete="name"
                  />
                </FieldWrap>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FieldWrap label="Email *" error={showErr("email") ? errors.email : undefined}>
                    <Input
                      type="email" value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      onBlur={() => blur("email")}
                      aria-invalid={!!showErr("email")}
                      autoComplete="email"
                    />
                  </FieldWrap>
                  <FieldWrap label="Telefone *" error={showErr("phone") ? errors.phone : undefined}>
                    <Input
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      onBlur={() => blur("phone")}
                      aria-invalid={!!showErr("phone")}
                      placeholder="+258 ..."
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </FieldWrap>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Modalidade *</Label>
                    <Select value={form.modality} onValueChange={(v) => update("modality", v as FormState["modality"])}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Presencial">Presencial</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
                        <SelectItem value="Híbrido">Híbrido</SelectItem>
                        <SelectItem value="Indiferente">Indiferente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Público *</Label>
                    <Select value={form.audience} onValueChange={(v) => update("audience", v as FormState["audience"])}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PME">PME</SelectItem>
                        <SelectItem value="ONG">ONG</SelectItem>
                        <SelectItem value="Estudantes">Estudantes</SelectItem>
                        <SelectItem value="Público">Público Geral</SelectItem>
                        <SelectItem value="Profissional Liberal">Profissional Liberal</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <FieldWrap
                  label={`Mensagem (opcional) — ${form.message?.length || 0}/5000`}
                  error={showErr("message") ? errors.message : undefined}
                >
                  <Textarea
                    rows={3} value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    onBlur={() => blur("message")}
                    placeholder="Conte-nos brevemente o seu objectivo..."
                  />
                </FieldWrap>

                <Button
                  type="submit"
                  disabled={submitting || !isValid}
                  className="w-full text-white transition-transform active:scale-95 disabled:opacity-60"
                  style={{ backgroundColor: isValid ? "#00A859" : "#94a3b8" }}
                >
                  {submitting
                    ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> A enviar...</>)
                    : (<><Send className="w-4 h-4 mr-2" /> Enviar Pedido</>)}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Resposta garantida em 24h · Sem compromisso · Receberá um nº de protocolo
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

const FieldWrap = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className={error ? "text-destructive" : ""}>{label}</Label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-xs text-destructive flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" /> {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);
