-- Criar tabela de produtos/serviços com preços e descontos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  discount_percentage INTEGER DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  price_after_discount DECIMAL(10,2) GENERATED ALWAYS AS (price * (1 - discount_percentage::DECIMAL / 100)) STORED,
  currency TEXT DEFAULT 'MZN' NOT NULL,
  duration_minutes INTEGER,
  location TEXT DEFAULT 'Maputo' NOT NULL,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 999,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Criar tabela de carrinho de compras
CREATE TABLE IF NOT EXISTS public.cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, product_id),
  UNIQUE(session_id, product_id)
);

-- Atualizar tabela orders para incluir método de pagamento
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'stripe',
ADD COLUMN IF NOT EXISTS mpesa_reference TEXT,
ADD COLUMN IF NOT EXISTS bank_transfer_reference TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS products JSONB DEFAULT '[]'::jsonb;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON public.cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_session_id ON public.cart(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON public.orders(payment_method);

-- Habilitar RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

-- RLS Policies para products (público pode ver, admin pode gerenciar)
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies para cart
CREATE POLICY "Users can view their own cart"
  ON public.cart FOR SELECT
  USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can insert into their own cart"
  ON public.cart FOR INSERT
  WITH CHECK (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can update their own cart"
  ON public.cart FOR UPDATE
  USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can delete from their own cart"
  ON public.cart FOR DELETE
  USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Edge functions can manage cart"
  ON public.cart FOR ALL
  USING (true);

-- Trigger para atualizar updated_at em products
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir produtos/serviços da Tikvah com preços realistas para Maputo
INSERT INTO public.products (name, slug, description, long_description, category, price, discount_percentage, duration_minutes, location, featured) VALUES

-- Psicoterapia Individual
('Consulta Psicológica Individual', 'consulta-psicologica-individual', 
'Atendimento personalizado para questões emocionais, ansiedade, depressão e desenvolvimento pessoal.',
'## Transforme Sua Vida com Apoio Profissional

Você merece viver com mais equilíbrio emocional e bem-estar. Nossa **Consulta Psicológica Individual** oferece um espaço seguro e confidencial onde você pode:

✅ **Superar ansiedade e depressão** com técnicas comprovadas
✅ **Desenvolver autoconhecimento** e inteligência emocional
✅ **Resolver conflitos internos** que impedem seu crescimento
✅ **Melhorar relacionamentos** pessoais e profissionais

### Por que escolher a Tikvah?
- 🎓 Psicólogos certificados com experiência internacional
- 📍 Localização central em Maputo e Matola
- 🕐 Horários flexíveis (segunda a sábado)
- 💳 Múltiplas formas de pagamento (M-Pesa, cartão, transferência)

**Primeira consulta com 20% de desconto!**',
'Psicoterapia', 1500.00, 20, 60, 'Maputo e Matola', true),

-- Terapia de Casal
('Terapia de Casal', 'terapia-casal',
'Fortaleça seu relacionamento, melhore a comunicação e resolva conflitos com orientação especializada.',
'## Reconstrua a Conexão no Seu Relacionamento

Relacionamentos exigem trabalho e dedicação. Nossa **Terapia de Casal** ajuda você e seu parceiro(a) a:

✅ **Melhorar a comunicação** e resolver conflitos de forma saudável
✅ **Reconstruir confiança** após crises ou traições
✅ **Reacender a intimidade** emocional e física
✅ **Criar objetivos comuns** para o futuro

### O que você receberá:
- 🎯 Avaliação completa da dinâmica do casal
- 🛠️ Técnicas práticas de comunicação não-violenta
- 💬 Mediação imparcial e profissional
- 📊 Plano de ação personalizado

**Investimento:** 2200 MZN por sessão (90 minutos)
**Pacote 4 sessões:** 7500 MZN (economia de 1300 MZN)',
'Psicoterapia', 2200.00, 15, 90, 'Maputo e Matola', true),

-- Psicologia Infantil
('Psicologia Infantil e Adolescente', 'psicologia-infantil-adolescente',
'Apoio especializado para crianças e adolescentes com dificuldades emocionais, escolares ou comportamentais.',
'## Cuide do Futuro Emocional do Seu Filho

Crianças e adolescentes enfrentam desafios únicos. Nossa **Psicologia Infantil** oferece:

✅ **Apoio escolar** para dificuldades de aprendizagem e concentração
✅ **Gestão de ansiedade** e medos infantis
✅ **Desenvolvimento social** e habilidades de relacionamento
✅ **Orientação parental** para fortalecer vínculos familiares

### Especialidades:
- 🎨 Terapia lúdica (brincadeiras terapêuticas)
- 📚 Avaliação psicopedagógica
- 🎭 Técnicas de arte-terapia
- 👨‍👩‍👧 Sessões com os pais incluídas

**Ambiente acolhedor e adaptado para crianças!**',
'Psicoterapia', 1400.00, 10, 60, 'Maputo e Matola', false),

-- Avaliação Psicológica
('Avaliação Psicológica Completa', 'avaliacao-psicologica-completa',
'Avaliação detalhada com testes psicológicos para fins clínicos, jurídicos ou profissionais.',
'## Avaliação Profissional Reconhecida

Precisa de uma **Avaliação Psicológica Completa** para:
- 📋 Processos jurídicos (guarda de menores, perícias)
- 💼 Admissão em empresas ou concursos
- 🎓 Ingresso em programas acadêmicos
- 🏥 Diagnóstico clínico detalhado

### O que está incluído:
✅ **Entrevista clínica** estruturada (2 horas)
✅ **Aplicação de testes** padronizados e validados
✅ **Relatório completo** com laudo técnico
✅ **Sessão de devolutiva** para explicar resultados

### Diferenciais:
- 🏆 Reconhecimento nacional e internacional
- 📄 Laudo aceito em tribunais e instituições
- ⚡ Entrega em 7 dias úteis
- 🔒 Total confidencialidade

**Parcelamento disponível em até 3x sem juros!**',
'Avaliação', 3500.00, 0, 180, 'Maputo', true),

-- Consultoria Empresarial
('Consultoria Organizacional', 'consultoria-organizacional',
'Desenvolva sua equipe com avaliação de clima organizacional, seleção de pessoal e treinamentos.',
'## Potencialize o Desempenho da Sua Empresa

Transforme sua organização com nossa **Consultoria Organizacional**:

✅ **Avaliação de clima** e satisfação dos colaboradores
✅ **Recrutamento e seleção** com perfis psicológicos
✅ **Treinamentos corporativos** personalizados
✅ **Gestão de conflitos** e mediação

### Serviços incluídos:
- 📊 Diagnóstico organizacional completo
- 🎯 Plano de ação estratégico
- 👥 Workshops para líderes e equipes
- 📈 Acompanhamento de resultados (3 meses)

### Ideal para:
- Empresas com 10+ colaboradores
- Organizações em crescimento
- Equipes com baixa produtividade
- Ambientes com alto turnover

**Solicite proposta personalizada!**',
'Consultoria', 8000.00, 10, 240, 'Maputo e Matola', false),

-- Curso de Gestão de Stress
('Curso: Gestão de Stress e Burnout', 'curso-gestao-stress-burnout',
'Aprenda técnicas comprovadas para gerenciar stress, prevenir burnout e melhorar qualidade de vida.',
'## Recupere Seu Equilíbrio em 4 Semanas

O **stress crônico** está afetando sua saúde, produtividade e relacionamentos? 

### O que você vai aprender:
✅ **Identificar fontes** de stress na vida pessoal e profissional
✅ **Técnicas de relaxamento** (respiração, meditação, mindfulness)
✅ **Gestão de tempo** e prioridades
✅ **Prevenção de burnout** no trabalho

### Formato do curso:
- 📅 **4 encontros** semanais de 2 horas
- 👥 **Grupos pequenos** (máximo 12 pessoas)
- 📚 **Material didático** incluso
- 🎓 **Certificado** de conclusão

### Próximas turmas:
- **Março 2024:** Sábados 9h-11h
- **Abril 2024:** Terças 18h-20h

**Inscrições abertas! Vagas limitadas.**',
'Cursos', 2500.00, 25, 480, 'Maputo', true),

-- Workshop de Comunicação
('Workshop: Comunicação Não-Violenta', 'workshop-comunicacao-nao-violenta',
'Domine a arte da comunicação empática e resolva conflitos de forma construtiva.',
'## Transforme Seus Relacionamentos em 1 Dia

Aprenda a **Comunicação Não-Violenta (CNV)** - método usado por diplomatas, líderes e terapeutas mundialmente.

### O que você vai dominar:
✅ **Expressar necessidades** sem agressividade
✅ **Escutar ativamente** com empatia
✅ **Resolver conflitos** sem vencedores ou perdedores
✅ **Criar conexões** autênticas

### Formato:
- ⏰ **8 horas intensivas** (9h-18h)
- 🎭 **Dinâmicas práticas** e role-play
- 🥐 **Coffee breaks** inclusos
- 📖 **E-book** de referência

### Ideal para:
- Casais e famílias
- Líderes e gestores
- Profissionais de saúde e educação
- Qualquer pessoa que deseja comunicar melhor

**Data:** 15 de Março | **Local:** Centro de Maputo',
'Workshops', 1800.00, 30, 480, 'Maputo', true),

-- Terapia Online
('Consulta Online (Videochamada)', 'consulta-online-videochamada',
'Atendimento psicológico remoto com a mesma qualidade das consultas presenciais.',
'## Psicologia no Conforto da Sua Casa

Nossa **Consulta Online** oferece:

✅ **Mesma eficácia** que atendimento presencial
✅ **Flexibilidade** de horários (inclusive noite e fins de semana)
✅ **Economia** de tempo e deslocamento
✅ **Privacidade** total

### Como funciona:
1. 📅 Agende pelo WhatsApp ou site
2. 💳 Pague antecipadamente (M-Pesa, cartão)
3. 📧 Receba link da videochamada
4. 🎥 Conecte-se no horário marcado

### Requisitos técnicos:
- Internet estável (4G ou Wi-Fi)
- Celular, tablet ou computador
- Ambiente privado e silencioso
- Fones de ouvido (recomendado)

**Atendemos moçambicanos em qualquer parte do mundo!**',
'Psicoterapia', 1200.00, 15, 60, 'Online', false),

-- Pacote de 4 Sessões
('Pacote 4 Sessões Individuais', 'pacote-4-sessoes-individuais',
'Economize 500 MZN adquirindo pacote de 4 consultas psicológicas individuais.',
'## Comprometa-se com Seu Bem-Estar

A terapia funciona melhor com **continuidade**. Nosso **Pacote de 4 Sessões** oferece:

✅ **Economia de 500 MZN** vs. sessões avulsas
✅ **Acompanhamento contínuo** do seu progresso
✅ **Flexibilidade de agendamento** (válido por 60 dias)
✅ **Prioridade** no agendamento

### Investimento:
- **Preço normal:** 4 x 1500 = 6000 MZN
- **Preço do pacote:** 5500 MZN
- **Você economiza:** 500 MZN (8%)

### Ideal para:
- Quem deseja mudanças duradouras
- Processos terapêuticos estruturados
- Melhor custo-benefício

**Válido por 60 dias a partir da primeira sessão.**',
'Pacotes', 5500.00, 0, 240, 'Maputo e Matola', true);

-- Confirmar inserção
SELECT COUNT(*) as total_produtos FROM public.products;