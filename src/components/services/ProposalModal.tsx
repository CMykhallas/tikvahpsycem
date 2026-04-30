import { useState, useEffect } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

const schema = z.object({
  full_name: z.string().trim().min(2, "Nome muito curto").max(150),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().min(6, "Telefone inválido").max(30),
  modality: z.enum(["Presencial", "Online", "Híbrido", "Indiferente"]),
  audience: z.enum(["PME", "ONG", "Estudantes", "Público", "Profissional Liberal", "Outro"]),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
});

type FormState = z.infer<typeof schema>;

const initialForm: FormState = {
  full_name: "",
  email: "",
  phone: "",
  modality: "Indiferente",
  audience: "Público",
  message: "",
};

export const ProposalModal = ({ open, onOpenChange, service }: Props) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      // reset after close animation
      const t = setTimeout(() => { setSuccess(false); setForm(initialForm); }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Verifique os campos");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("service_proposals" as any).insert({
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
      });

      if (error) throw error;
      setSuccess(true);
      toast.success("Pedido enviado! Responderemos em até 24h.");
    } catch (err: any) {
      console.error("Proposal error:", err);
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-8 text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ delay: 0.1, type: "spring" }}
                className="mx-auto w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#00A85920" }}
              >
                <CheckCircle2 className="w-12 h-12" style={{ color: "#00A859" }} />
              </motion.div>
              <h3 className="text-2xl font-bold">Pedido recebido!</h3>
              <p className="text-muted-foreground">
                Recebemos o seu pedido para <strong>{service?.title}</strong>. A nossa equipa entrará em contacto em até <strong>24 horas</strong>.
              </p>
              <Button onClick={() => onOpenChange(false)} className="mt-4">Fechar</Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
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

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome completo *</Label>
                  <Input id="full_name" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+258 ..." required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
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
                  <div className="space-y-2">
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

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem (opcional)</Label>
                  <Textarea id="message" rows={3} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Conte-nos brevemente o seu objectivo..." />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full text-white transition-transform active:scale-95"
                  style={{ backgroundColor: "#00A859" }}
                >
                  {submitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> A enviar...</>) : (<><Send className="w-4 h-4 mr-2" /> Enviar Pedido</>)}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Resposta garantida em 24h · Sem compromisso
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
