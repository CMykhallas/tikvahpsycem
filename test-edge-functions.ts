/**
 * TESTE COMPLETO - EDGE FUNCTIONS
 * Valida: send-contact-email e create-checkout
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: any;
}

const results: TestResult[] = [];

// ============ TESTE 1: FORMULÁRIO DE CONTACTO ============

async function testContactForm() {
  console.log("\n📧 TESTE 1: Formulário de Contacto");
  console.log("=".repeat(50));

  try {
    // Gerar token de segurança (timestamp em base64)
    const submissionToken = btoa(Date.now().toString());

    const contactPayload = {
      name: "João Silva",
      email: "joao.silva@example.com",
      phone: "+258 82 892 6020",
      subject: "Consulta sobre Terapia Individual",
      message: "Gostaria de agendar uma sessão de terapia individual. Qual é a disponibilidade?",
      submission_token: submissionToken,
    };

    console.log("📤 Enviando formulário de contacto...");
    console.log("Dados:", JSON.stringify(contactPayload, null, 2));

    const { data, error } = await supabase.functions.invoke("send-contact-email", {
      body: contactPayload,
    });

    if (error) {
      throw new Error(`Erro na função: ${error.message}`);
    }

    if (data?.error) {
      throw new Error(`Erro na resposta: ${data.error}`);
    }

    console.log("✅ Resposta recebida:", JSON.stringify(data, null, 2));

    results.push({
      name: "Formulário de Contacto - Submissão Válida",
      passed: data?.success === true,
      details: data,
    });

    // Teste 1.2: Validação de Email Inválido
    console.log("\n🔍 Teste 1.2: Email Inválido");
    const invalidEmailPayload = {
      name: "Test User",
      email: "invalid-email",
      subject: "Test",
      message: "Test message",
      submission_token: submissionToken,
    };

    const { data: invalidData, error: invalidError } = await supabase.functions.invoke(
      "send-contact-email",
      { body: invalidEmailPayload }
    );

    results.push({
      name: "Formulário de Contacto - Email Inválido (Deve Rejeitar)",
      passed: invalidData?.error !== undefined || invalidError !== null,
      details: invalidData || invalidError,
    });

    // Teste 1.3: Honeypot (Bot Detection)
    console.log("\n🤖 Teste 1.3: Honeypot (Bot Detection)");
    const honeypotPayload = {
      name: "Bot User",
      email: "bot@example.com",
      subject: "Test",
      message: "Test",
      website_url: "https://spam.com", // Honeypot field
      submission_token: submissionToken,
    };

    const { data: honeypotData } = await supabase.functions.invoke("send-contact-email", {
      body: honeypotPayload,
    });

    results.push({
      name: "Formulário de Contacto - Honeypot (Deve Bloquear)",
      passed: honeypotData?.error !== undefined,
      details: honeypotData,
    });

    // Teste 1.4: Spam Detection
    console.log("\n🚫 Teste 1.4: Detecção de Spam");
    const spamPayload = {
      name: "Spammer",
      email: "spam@example.com",
      subject: "Free money and viagra",
      message: "Click here for free money and casino poker betting",
      submission_token: submissionToken,
    };

    const { data: spamData } = await supabase.functions.invoke("send-contact-email", {
      body: spamPayload,
    });

    results.push({
      name: "Formulário de Contacto - Spam Detection (Deve Bloquear)",
      passed: spamData?.error !== undefined,
      details: spamData,
    });

    // Teste 1.5: Token Expirado
    console.log("\n⏰ Teste 1.5: Token Expirado");
    const expiredToken = btoa((Date.now() - 100000000).toString()); // Token muito antigo

    const { data: expiredData } = await supabase.functions.invoke("send-contact-email", {
      body: {
        name: "Test User",
        email: "test@example.com",
        subject: "Test",
        message: "Test",
        submission_token: expiredToken,
      },
    });

    results.push({
      name: "Formulário de Contacto - Token Expirado (Deve Rejeitar)",
      passed: expiredData?.error !== undefined,
      details: expiredData,
    });
  } catch (error: any) {
    results.push({
      name: "Formulário de Contacto - Erro Geral",
      passed: false,
      error: error.message,
    });
  }
}

// ============ TESTE 2: CHECKOUT ============

async function testCheckout() {
  console.log("\n💳 TESTE 2: Checkout Online");
  console.log("=".repeat(50));

  try {
    // Teste 2.1: Checkout Válido
    console.log("📤 Enviando requisição de checkout...");

    const checkoutPayload = {
      serviceType: "individual",
      appointmentData: {
        client_name: "Maria Santos",
        email: "maria.santos@example.com",
        phone: "+258 82 892 6020",
        preferred_date: "2025-02-15",
        message: "Gostaria de agendar uma sessão de terapia individual.",
      },
    };

    console.log("Dados:", JSON.stringify(checkoutPayload, null, 2));

    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: checkoutPayload,
    });

    if (error) {
      throw new Error(`Erro na função: ${error.message}`);
    }

    if (data?.error) {
      throw new Error(`Erro na resposta: ${data.error}`);
    }

    console.log("✅ Resposta recebida:", JSON.stringify(data, null, 2));

    results.push({
      name: "Checkout - Sessão Válida",
      passed: data?.url !== undefined || data?.sessionId !== undefined,
      details: { hasUrl: !!data?.url, hasSessionId: !!data?.sessionId },
    });

    // Teste 2.2: Tipo de Serviço Inválido
    console.log("\n🔍 Teste 2.2: Tipo de Serviço Inválido");
    const invalidServicePayload = {
      serviceType: "invalid_service",
      appointmentData: {
        client_name: "Test User",
        email: "test@example.com",
        phone: "+258 82 892 6020",
        preferred_date: "2025-02-15",
      },
    };

    const { data: invalidServiceData } = await supabase.functions.invoke("create-checkout", {
      body: invalidServicePayload,
    });

    results.push({
      name: "Checkout - Tipo de Serviço Inválido (Deve Rejeitar)",
      passed: invalidServiceData?.error !== undefined,
      details: invalidServiceData,
    });

    // Teste 2.3: Email Inválido
    console.log("\n🔍 Teste 2.3: Email Inválido");
    const invalidEmailCheckoutPayload = {
      serviceType: "individual",
      appointmentData: {
        client_name: "Test User",
        email: "invalid-email",
        phone: "+258 82 892 6020",
        preferred_date: "2025-02-15",
      },
    };

    const { data: invalidEmailCheckoutData } = await supabase.functions.invoke("create-checkout", {
      body: invalidEmailCheckoutPayload,
    });

    results.push({
      name: "Checkout - Email Inválido (Deve Rejeitar)",
      passed: invalidEmailCheckoutData?.error !== undefined,
      details: invalidEmailCheckoutData,
    });

    // Teste 2.4: Telefone Inválido
    console.log("\n🔍 Teste 2.4: Telefone Inválido");
    const invalidPhonePayload = {
      serviceType: "individual",
      appointmentData: {
        client_name: "Test User",
        email: "test@example.com",
        phone: "123", // Muito curto
        preferred_date: "2025-02-15",
      },
    };

    const { data: invalidPhoneData } = await supabase.functions.invoke("create-checkout", {
      body: invalidPhonePayload,
    });

    results.push({
      name: "Checkout - Telefone Inválido (Deve Rejeitar)",
      passed: invalidPhoneData?.error !== undefined,
      details: invalidPhoneData,
    });

    // Teste 2.5: Campos Obrigatórios Ausentes
    console.log("\n🔍 Teste 2.5: Campos Obrigatórios Ausentes");
    const missingFieldsPayload = {
      serviceType: "individual",
      appointmentData: {
        client_name: "Test User",
        // email ausente
        phone: "+258 82 892 6020",
        preferred_date: "2025-02-15",
      },
    };

    const { data: missingFieldsData } = await supabase.functions.invoke("create-checkout", {
      body: missingFieldsPayload,
    });

    results.push({
      name: "Checkout - Campos Obrigatórios Ausentes (Deve Rejeitar)",
      passed: missingFieldsData?.error !== undefined,
      details: missingFieldsData,
    });

    // Teste 2.6: Todos os Tipos de Serviço
    console.log("\n🔍 Teste 2.6: Validar Todos os Tipos de Serviço");
    const serviceTypes = ["individual", "casal", "familiar", "consultoria"];

    for (const serviceType of serviceTypes) {
      const payload = {
        serviceType,
        appointmentData: {
          client_name: "Test User",
          email: `test-${serviceType}@example.com`,
          phone: "+258 82 892 6020",
          preferred_date: "2025-02-15",
        },
      };

      const { data: serviceData } = await supabase.functions.invoke("create-checkout", {
        body: payload,
      });

      results.push({
        name: `Checkout - Serviço "${serviceType}"`,
        passed: serviceData?.url !== undefined || serviceData?.sessionId !== undefined,
        details: { serviceType, hasUrl: !!serviceData?.url },
      });
    }
  } catch (error: any) {
    results.push({
      name: "Checkout - Erro Geral",
      passed: false,
      error: error.message,
    });
  }
}

// ============ RELATÓRIO FINAL ============

async function generateReport() {
  console.log("\n\n" + "=".repeat(70));
  console.log("📊 RELATÓRIO FINAL DE TESTES");
  console.log("=".repeat(70));

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;

  console.log(`\n✅ Testes Passados: ${passed}/${total}`);
  console.log(`❌ Testes Falhados: ${failed}/${total}`);
  console.log(`📈 Taxa de Sucesso: ${((passed / total) * 100).toFixed(2)}%\n`);

  console.log("Detalhes dos Testes:");
  console.log("-".repeat(70));

  results.forEach((result, index) => {
    const status = result.passed ? "✅" : "❌";
    console.log(`\n${index + 1}. ${status} ${result.name}`);
    if (result.error) {
      console.log(`   Erro: ${result.error}`);
    }
    if (result.details) {
      console.log(`   Detalhes: ${JSON.stringify(result.details, null, 2)}`);
    }
  });

  console.log("\n" + "=".repeat(70));
  console.log("✨ Testes Concluídos!");
  console.log("=".repeat(70));

  // Retornar status de saída
  process.exit(failed > 0 ? 1 : 0);
}

// ============ EXECUÇÃO ============

async function runAllTests() {
  try {
    await testContactForm();
    await testCheckout();
    await generateReport();
  } catch (error) {
    console.error("Erro fatal durante os testes:", error);
    process.exit(1);
  }
}

runAllTests();
