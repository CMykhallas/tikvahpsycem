import { useState, useEffect } from 'react';

export const ContactForm = () => {
  // Timestamp para validar tempo de preenchimento
  const [formStartTime] = useState(Date.now());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website_url: '', // Este é o HONEYPOT (campo que humanos não veem)
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      // Enviamos o tempo de início criptografado ou em base64 para dificultar
      submission_token: btoa(formStartTime.toString()), 
    };

    // Envio para a Edge Function
    const response = await fetch('https://[PROJECT_ID].supabase.co/functions/v1/send-contact-email', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos Visíveis */}
      <input 
        type="text" 
        onChange={(e) => setFormData({...formData, name: e.target.value})} 
        placeholder="Nome" 
        required 
      />

      {/* HONEYPOT AVANÇADO: Escondido via CSS robusto */}
      <div style={{ position: 'absolute', opacity: 0, zIndex: -1, height: 0, overflow: 'hidden' }}>
        <label>Se você é humano, deixe este campo vazio:</label>
        <input 
          type="text" 
          name="website_url" 
          value={formData.website_url}
          onChange={(e) => setFormData({...formData, website_url: e.target.value})}
          tabIndex={-1} 
          autoComplete="off"
        />
      </div>

      <textarea onChange={(e) => setFormData({...formData, message: e.target.value})} required />
      <button type="submit">Enviar Mensagem</button>
    </form>
  );
};