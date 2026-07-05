/**
 * MultiStepBudgetForm — Formulário de orçamento multi-step com:
 *   - Validação em tempo real via zod
 *   - Persistência automática em localStorage (draft)
 *   - Micro-interações de sucesso/erro (fade-in, toast)
 *   - Submissão via edge function `send-contact-email`
 *
 * Uso: <MultiStepBudgetForm serviceSlug="psicoterapia" onSuccess={...} />
 */
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

const stepSchemas = [
  z.object({
    name: z.string().trim().min(2, "Informe o seu nome").max(100),
    email: z.string().trim().email("Email inválido").max(255),
  }),
  z.object({
    phone: z
      .string()
      .trim()
      .regex(/^\+?\d[\d\s-]{6,}$/i, "Telefone inválido")
      .max(30),
    modalidade: z.union(
      [z.literal("presencial"), z.literal("online"), z.literal("hibrido")],
      { message: "Escolha uma modalidade" },
    ),
  }),
  z.object({
    message: z
      .string()
      .trim()
      .min(10, "Descreva brevemente a sua necessidade (mín. 10 caracteres)")
      .max(1000),
  }),
];

interface Draft {
  name: string;
  email: string;
  phone: string;
  modalidade: "" | "presencial" | "online" | "hibrido";
  message: string;
}

const EMPTY_DRAFT: Draft = {
  name: "", email: "", phone: "", modalidade: "", message: "",
};

interface Props {
  /** Slug do serviço (usado no email + storage key). */
  serviceSlug: string;
  serviceLabel: string;
  onSuccess?: () => void;
}

export const MultiStepBudgetForm: React.FC<Props> = ({
  serviceSlug, serviceLabel, onSuccess,
}) => {
  const storageKey = `tikvah:budget-draft:${serviceSlug}`;
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Draft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Restore draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setData({ ...EMPTY_DRAFT, ...JSON.parse(raw) });
    } catch { /* ignore */ }
  }, [storageKey]);

  // Persist draft on change
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch { /* ignore */ }
  }, [data, storageKey]);

  const update = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  /** Valida o step atual e devolve verdadeiro se estiver correto. */
  const validateStep = (): boolean => {
    const schema = stepSchemas[step];
    const result = schema.safeParse(data);
    if (result.success) { setErrors({}); return true; }
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      fieldErrors[issue.path[0] as string] = issue.message;
    }
    setErrors(fieldErrors);
    return false;
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(2, s + 1)); };
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: `Orçamento — ${serviceLabel}`,
          message:
            `Modalidade: ${data.modalidade}\nServiço: ${serviceLabel}\n\n${data.message}`,
        },
      });
      if (error) throw error;
      localStorage.removeItem(storageKey);
      setDone(true);
      toast({ title: "Pedido enviado", description: "Entraremos em contacto em até 48h úteis." });
      onSuccess?.();
    } catch (err) {
      toast({
        title: "Erro ao enviar",
        description: err instanceof Error ? err.message : "Tente novamente ou envie por WhatsApp.",
        variant: "destructive",
      });
    } finally { setSubmitting(false); }
  };

  if (done) {
    return (
      <div className="text-center py-12 animate-fade-in" role="status">
        <CheckCircle2 className="w-14 h-14 text-teal-600 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">Pedido enviado com sucesso</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          Recebemos o seu pedido de orçamento. A nossa equipa responderá em até 48h úteis.
        </p>
      </div>
    );
  }

  const progress = ((step + 1) / 3) * 100;

  return (
    <form
      className="animate-fade-in"
      onSubmit={(e) => { e.preventDefault(); step === 2 ? submit() : next(); }}
      noValidate
      aria-label={`Orçamento para ${serviceLabel}`}
    >
      <div className="mb-6">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>Passo {step + 1} de 3</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} aria-label={`Progresso do formulário: ${Math.round(progress)}%`} />
      </div>

      {step === 0 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <Label htmlFor="bf-name">Nome completo</Label>
            <Input id="bf-name" value={data.name}
              onChange={(e) => update("name", e.target.value)}
              aria-invalid={!!errors.name} aria-describedby={errors.name ? "bf-name-err" : undefined}
              autoComplete="name" required />
            {errors.name && <p id="bf-name-err" className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="bf-email">Email</Label>
            <Input id="bf-email" type="email" value={data.email}
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={!!errors.email} aria-describedby={errors.email ? "bf-email-err" : undefined}
              autoComplete="email" required />
            {errors.email && <p id="bf-email-err" className="text-sm text-red-600 mt-1">{errors.email}</p>}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <Label htmlFor="bf-phone">Telefone / WhatsApp</Label>
            <Input id="bf-phone" value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "bf-phone-err" : undefined}
              autoComplete="tel" placeholder="+258 84 000 0000" required />
            {errors.phone && <p id="bf-phone-err" className="text-sm text-red-600 mt-1">{errors.phone}</p>}
          </div>
          <fieldset>
            <legend className="text-sm font-medium text-slate-700 mb-2">Modalidade preferida</legend>
            <div className="grid grid-cols-3 gap-2">
              {(["presencial", "online", "hibrido"] as const).map((m) => (
                <label key={m}
                  className={
                    "cursor-pointer rounded-lg border p-3 text-center text-sm capitalize transition-colors " +
                    (data.modalidade === m
                      ? "border-teal-600 bg-teal-50 text-teal-700 font-semibold"
                      : "border-slate-200 hover:border-slate-400")
                  }>
                  <input type="radio" name="modalidade" value={m} className="sr-only"
                    checked={data.modalidade === m}
                    onChange={() => update("modalidade", m)} />
                  {m}
                </label>
              ))}
            </div>
            {errors.modalidade && <p className="text-sm text-red-600 mt-2">{errors.modalidade}</p>}
          </fieldset>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <Label htmlFor="bf-message">Conte-nos mais sobre a sua necessidade</Label>
          <Textarea id="bf-message" rows={5} value={data.message}
            onChange={(e) => update("message", e.target.value)}
            aria-invalid={!!errors.message} aria-describedby={errors.message ? "bf-msg-err" : undefined}
            maxLength={1000} required />
          <div className="flex justify-between text-xs mt-1">
            <span className={errors.message ? "text-red-600" : "text-slate-500"}>
              {errors.message ?? " "}
            </span>
            <span className="text-slate-400">{data.message.length}/1000</span>
          </div>
        </div>
      )}

      <div className="flex justify-between gap-3 mt-6">
        <Button type="button" variant="outline" onClick={prev} disabled={step === 0 || submitting}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
        </Button>
        {step < 2 ? (
          <Button type="submit" data-track-click={`budget-next-${step}`}
            className="bg-gradient-to-r from-teal-600 to-blue-600">
            Continuar <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button type="submit" disabled={submitting} data-track-click="budget-submit"
            className="bg-gradient-to-r from-teal-600 to-blue-600">
            {submitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> A enviar…</>) : "Enviar pedido"}
          </Button>
        )}
      </div>
    </form>
  );
};
