
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Phone, Mail, MessageCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAppointment } from "@/hooks/useAppointment";
import { ServicesGrid } from "@/components/ServicesGrid";

const Appointment = () => {
  const { submitAppointment, isLoading } = useAppointment();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    client_name: "",
    email: "",
    phone: "",
    service_type: "",
    preferred_date: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica no frontend
    if (!formData.client_name || !formData.email || !formData.phone || !formData.service_type || !formData.preferred_date) {
      const { toast } = await import("sonner");
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    // Criar checkout Stripe com os dados do agendamento
    setIsProcessing(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { toast } = await import("sonner");
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          serviceType: formData.service_type,
          appointmentData: formData
        }
      });

      if (error) {
        console.error('Erro da função:', error);
        toast.error(error.message || "Erro ao criar checkout. Tente novamente.");
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.url) {
        toast.success("Redirecionando para pagamento seguro...");
        window.open(data.url, '_blank');
      } else {
        toast.error("Erro ao gerar link de pagamento. Tente novamente.");
      }
    } catch (error: any) {
      console.error('Erro ao criar checkout:', error);
      const { toast } = await import("sonner");
      toast.error(error.message || "Erro ao processar. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-primary to-accent py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Agendar <span className="text-white/90">Consulta</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/90 max-w-3xl mx-auto"
          >
            Dê o primeiro passo em direção ao seu bem-estar. Agende uma consulta com nossos especialistas.
          </motion.p>
        </div>
      </motion.section>

      {/* Formulário de Agendamento */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulário */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="hover-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <Calendar className="w-6 h-6 mr-3 text-primary" />
                    Dados do Agendamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="client_name" className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Nome Completo *
                        </Label>
                        <Input
                          id="client_name"
                          value={formData.client_name}
                          onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                          required
                          className="transition-all focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="transition-all focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          Telefone *
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          className="transition-all focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="service_type">Tipo de Serviço *</Label>
                        <Select
                          value={formData.service_type}
                          onValueChange={(value) => setFormData({ ...formData, service_type: value })}
                          required
                        >
                          <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Selecione o serviço" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Terapia Individual - $10 USD</SelectItem>
                            <SelectItem value="casal">Terapia de Casal - $15 USD</SelectItem>
                            <SelectItem value="familiar">Terapia Familiar - $22 USD</SelectItem>
                            <SelectItem value="consultoria">Consultoria Organizacional - 35,000 MZN</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="preferred_date" className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Data e Hora Preferida *
                      </Label>
                      <Input
                        id="preferred_date"
                        type="datetime-local"
                        value={formData.preferred_date}
                        onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                        required
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Observações
                      </Label>
                      <Textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Descreva brevemente o motivo da consulta ou outras observações..."
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isProcessing || isLoading}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Criando sessão de pagamento...
                        </>
                      ) : (
                        "Prosseguir para Pagamento"
                      )}
                    </Button>
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      Você será redirecionado para o checkout seguro do Stripe
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Informações */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <Card className="hover-elegant">
                <CardHeader>
                  <CardTitle>Informações Importantes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-muted-foreground">
                      Confirmação será enviada por email dentro de 24 horas
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-muted-foreground">
                      Cancelamentos devem ser feitos com 24 horas de antecedência
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-muted-foreground">
                      Primeira consulta tem duração de 60-90 minutos
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p className="text-muted-foreground">
                      Atendimento presencial e online disponível
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elegant">
                <CardHeader>
                  <CardTitle>Horários de Atendimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Segunda a Sexta</span>
                      <span className="font-medium">08:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sábado</span>
                      <span className="font-medium">08:00 - 13:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Domingo</span>
                      <span className="font-medium">Fechado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Serviços Disponíveis */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Nossos <span className="text-gradient-primary">Serviços</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore nossa gama completa de serviços psicológicos especializados
            </p>
          </motion.div>

          <ServicesGrid />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Appointment;
