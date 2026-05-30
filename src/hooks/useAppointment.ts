
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateFormInput, rateLimiter, securityLog, csrfToken } from "@/utils/security";
import { validateFormDataAdvanced, getClientIP, securityMonitor } from "@/utils/securityEnhancements";

export const useAppointment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const submitAppointment = async (formData: {
    client_name: string;
    email: string;
    phone: string;
    service_type: string;
    preferred_date: string;
    message?: string;
  }) => {
    setIsLoading(true);
    
    try {
      // Enhanced rate limiting with IP tracking
      const clientIP = getClientIP();
      if (rateLimiter.check(`appointment_${clientIP}`, 3, 600000)) {
        securityLog.logFailedAttempt('rate_limit', { 
          ip: clientIP, 
          form: 'appointment',
          timestamp: Date.now()
        });
        toast.error("Too many appointment requests. Please wait before submitting again.");
        return { success: false };
      }

      // Enhanced input validation with sanitization
      const validation = validateFormDataAdvanced({
        name: formData.client_name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });

      if (!validation.isValid) {
        securityMonitor.trackSuspiciousActivity('Invalid appointment form input', { 
          errors: validation.errors,
          ip: clientIP
        });
        toast.error(validation.errors.join(', '));
        return { success: false };
      }

      // Use sanitized data and rebuild formData
      const sanitizedFormData = {
        client_name: validation.sanitizedData.name,
        email: validation.sanitizedData.email,
        phone: validation.sanitizedData.phone,
        service_type: formData.service_type,
        preferred_date: formData.preferred_date,
        message: validation.sanitizedData.message
      };

      // Enhanced date validation
      const appointmentDate = new Date(sanitizedFormData.preferred_date);
      const now = new Date();
      const maxFutureDate = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year from now

      if (appointmentDate <= now) {
        toast.error("Por favor, selecione uma data futura para o agendamento.");
        return { success: false };
      }

      if (appointmentDate > maxFutureDate) {
        securityMonitor.trackSuspiciousActivity('Appointment scheduled too far in future', {
          requestedDate: appointmentDate.toISOString(),
          ip: clientIP
        });
        toast.error("Data muito distante. Por favor, selecione uma data dentro do próximo ano.");
        return { success: false };
      }

      // Validate service type - must match create-checkout SERVICE_PRICES
      const allowedServices = [
        'individual',
        'casal', 
        'familiar',
        'consultoria'
      ];

      if (!allowedServices.includes(sanitizedFormData.service_type)) {
        securityMonitor.trackSuspiciousActivity('Invalid service type in appointment', {
          serviceType: sanitizedFormData.service_type,
          ip: clientIP
        }, 'high');
        toast.error("Tipo de serviço inválido.");
        return { success: false };
      }

      // Generate and validate CSRF token
      let token = csrfToken.get();
      if (!token) {
        token = csrfToken.generate();
      }

      const { error } = await supabase
        .from("appointments")
        .insert([{
          ...sanitizedFormData,
          preferred_date: appointmentDate.toISOString()
        }]);

      if (error) throw error;

      // Send email confirmation
      await supabase.functions.invoke('send-appointment-email', {
        body: sanitizedFormData
      });

      // Log successful appointment
      securityMonitor.trackSuspiciousActivity('Appointment scheduled successfully', {
        serviceType: sanitizedFormData.service_type,
        ip: clientIP,
        timestamp: Date.now()
      }, 'low');

      toast.success("Agendamento realizado com sucesso! Receberá confirmação por email brevemente.");
      return { success: true };
    } catch (error) {
      console.error("Erro ao agendar:", error);
      securityLog.logFailedAttempt('form_submission', { 
        error: error.message, 
        form: 'appointment',
        ip: getClientIP(),
        timestamp: Date.now()
      });
      toast.error("Erro ao realizar agendamento. Tente novamente.");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { submitAppointment, isLoading };
};
