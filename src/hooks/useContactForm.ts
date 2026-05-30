
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { validateFormInput, rateLimiter, securityLog, csrfToken } from "@/utils/security";
import { validateFormDataAdvanced, getClientIP, securityMonitor } from "@/utils/securityEnhancements";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface ContactInsertData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status?: string;
}

export const useContactForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const submitContact = async (formData: ContactFormData) => {
    setIsLoading(true);
    
    try {
      // Enhanced rate limiting with IP tracking
      const clientIP = getClientIP();
      if (rateLimiter.check(`contact_${clientIP}`, 5, 300000)) {
        securityLog.logFailedAttempt('rate_limit', { 
          ip: clientIP, 
          form: 'contact',
          timestamp: Date.now()
        });
        toast.error("Too many requests. Please wait before submitting again.");
        return { success: false };
      }

      // Enhanced input validation with sanitization
      const validation = validateFormDataAdvanced(formData);
      if (!validation.isValid) {
        securityMonitor.trackSuspiciousActivity('Invalid contact form input', { 
          errors: validation.errors,
          ip: clientIP
        });
        toast.error(validation.errors.join(', '));
        return { success: false };
      }

      // Use sanitized data and ensure proper typing
      const sanitizedData = validation.sanitizedData as ContactFormData;
      
      // Prepare data for database insertion
      const insertData: ContactInsertData = {
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        subject: sanitizedData.subject,
        message: sanitizedData.message,
        status: 'pending'
      };

      // Generate and validate CSRF token
      let token = csrfToken.get();
      if (!token) {
        token = csrfToken.generate();
      }

      // Additional security checks
      if (insertData.message && insertData.message.length > 2000) {
        securityMonitor.trackSuspiciousActivity('Oversized message in contact form', {
          messageLength: insertData.message.length,
          ip: clientIP
        });
        toast.error("Message is too long. Please shorten your message.");
        return { success: false };
      }

      // Check for spam patterns
      const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'click here'];
      const messageText = (insertData.message + ' ' + insertData.subject).toLowerCase();
      const hasSpamKeywords = spamKeywords.some(keyword => messageText.includes(keyword));
      
      if (hasSpamKeywords) {
        securityMonitor.trackSuspiciousActivity('Potential spam detected in contact form', {
          hasSpamKeywords: true,
          ip: clientIP
        }, 'high');
        toast.error("Your message appears to contain spam content. Please revise and try again.");
        return { success: false };
      }

      const { error } = await supabase
        .from("contacts")
        .insert(insertData);

      if (error) throw error;

      // Send email via edge function
      await supabase.functions.invoke('send-contact-email', {
        body: insertData
      });

      // Log successful submission
      securityMonitor.trackSuspiciousActivity('Contact form submitted successfully', {
        ip: clientIP,
        timestamp: Date.now()
      }, 'low');

      toast.success("Mensagem enviada com sucesso! Receberá confirmação por email brevemente.");
      return { success: true };
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      securityLog.logFailedAttempt('form_submission', { 
        error: error.message, 
        form: 'contact',
        ip: getClientIP(),
        timestamp: Date.now()
      });
      toast.error("Erro ao enviar mensagem. Tente novamente.");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { submitContact, isLoading };
};
