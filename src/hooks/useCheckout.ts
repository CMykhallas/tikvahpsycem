import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AppointmentData {
  client_name: string;
  email: string;
  phone: string;
  service_type: string;
  preferred_date: string;
  message?: string;
}

export const useCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createCheckoutSession = async (
    serviceType: string, 
    appointmentData: AppointmentData
  ) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          serviceType,
          appointmentData
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return { success: false };
      }

      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success("Redirecionando para o pagamento...");
        return { success: true, data };
      }
      
      toast.error("Erro ao gerar link de pagamento.");
      return { success: false };
    } catch (error: any) {
      console.error("Erro ao criar sessão de checkout:", error);
      
      if (error.message?.includes('Price validation failed')) {
        toast.error("Erro de validação de preço. Por favor, recarregue a página.");
      } else if (error.message?.includes('Rate limit')) {
        toast.error("Muitas tentativas. Por favor, aguarde alguns minutos.");
      } else {
        toast.error(error.message || "Erro ao processar pagamento. Tente novamente.");
      }
      
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { createCheckoutSession, isLoading };
};
