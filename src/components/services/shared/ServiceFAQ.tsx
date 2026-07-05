/**
 * ServiceFAQ — Accordion acessível de perguntas frequentes.
 * Fornece o schema FAQPage (JSON-LD) via `getFAQPage` — ver ServicePageTemplate.
 */
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import type { ServiceFAQ as FAQ } from "@/config/services";

export const ServiceFAQ: React.FC<{ faqs: FAQ[] }> = ({ faqs }) => (
  <section aria-labelledby="faq-heading" className="mb-16 max-w-3xl mx-auto">
    <h2 id="faq-heading" className="text-3xl font-bold text-center text-slate-800 mb-8">
      Perguntas Frequentes
    </h2>
    <Accordion type="single" collapsible className="bg-white rounded-xl shadow-sm border border-slate-200 px-6">
      {faqs.map((f, i) => (
        <AccordionItem key={i} value={`faq-${i}`}>
          <AccordionTrigger className="text-left text-slate-800 font-semibold">
            {f.question}
          </AccordionTrigger>
          <AccordionContent className="text-slate-600">{f.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
);
