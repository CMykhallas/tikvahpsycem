
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useContactForm } from "@/hooks/useContactForm";

export const Contact = () => {
  const { submitContact, isLoading } = useContactForm();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitContact(formData);
    if (result.success) {
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Entre em <span className="text-gradient-primary">Contacto</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Estamos aqui para apoiá-lo. Entre em contacto connosco para mais informações ou para agendar uma consulta.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulário de Contacto */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="hover-elegant">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3 text-primary" />
                  Envie-nos uma Mensagem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
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
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
                  >
                    {isLoading ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Informações de Contacto */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <Card className="hover-elegant">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">Informações de Contacto</h3>
                
                <div className="space-y-6">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Localização</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Bairro Polana Cimento A<br />
                        Avenida 24 de Julho Número 797, 1º Andar<br />
                        Cidade de Maputo - Maputo, CEP: 1092
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Email</h4>
                      <p className="text-muted-foreground">suporte.oficina.psicologo@proton.me</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Telefone</h4>
                      <p className="text-muted-foreground">+258 82 892 6020 (Chamadas/SMS)</p>
                      <p className="text-muted-foreground">+258 82 759 2980 (WhatsApp)</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Horário de Funcionamento</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Segunda a Sexta: 08:00 - 18:00<br />
                        Sábado: 08:00 - 13:00<br />
                        Domingo: Fechado
                      </p>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* Mapa */}
            <Card className="hover-elegant">
              <CardContent className="p-0">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3582.4751!2d32.5859629!3d-25.9732918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1ee69ba6f067473d%3A0x94e17a17666a1589!2s2HGP%2BMF5%2C%20Maputo!5e0!3m2!1spt!2smz!4v1676543210987!5m2!1spt!2smz"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização Tikvah Psychological Center"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
