-- Ativa a segurança ao nível de linha obrigatória
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Política: O utente só pode ler os seus próprios agendamentos filtrados pelo seu email autenticado
CREATE POLICY "Permitir leitura estrita ao próprio utilizador" ON appointments
  FOR SELECT USING (auth.jwt() ->> 'email' = email);

-- Política: Permissão total de escrita para o gateway de pagamentos via Service Role
CREATE POLICY "Permitir inserção via API de Checkout" ON appointments
  FOR INSERT WITH CHECK (true);
