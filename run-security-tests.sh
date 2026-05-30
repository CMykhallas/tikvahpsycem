#!/bin/bash
# ============================================
# SCRIPT DE TESTES - CHECKOUT, PAGAMENTOS E SEGURANÇA
# ============================================
# 
# Uso: ./run-security-tests.sh [opção]
#
# Opções:
#   html      - Abrir testes interativos no navegador
#   cli       - Executar testes via CLI (Deno)
#   all       - Executar todos os testes
#   debug     - Modo debug com logs detalhados
#   help      - Mostrar esta mensagem

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_HOME="$SCRIPT_DIR"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções auxiliares
print_header() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  🛡️  SUITE DE TESTES - CHECKOUT, PAGAMENTOS E SEGURANÇA${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar requisitos
check_requirements() {
    local missing=0
    
    print_info "Verificando requisitos..."
    
    # Verificar Deno
    if ! command -v deno &> /dev/null; then
        print_warning "Deno não instalado"
        missing=$((missing + 1))
    else
        print_success "Deno encontrado: $(deno --version)"
    fi
    
    # Verificar se arquivos de teste existem
    if [ ! -f "$PROJECT_HOME/test-checkout-payments-security.ts" ]; then
        print_error "Arquivo test-checkout-payments-security.ts não encontrado"
        missing=$((missing + 1))
    else
        print_success "Arquivo TS de testes encontrado"
    fi
    
    if [ ! -f "$PROJECT_HOME/test-checkout-payments-security.html" ]; then
        print_error "Arquivo test-checkout-payments-security.html não encontrado"
        missing=$((missing + 1))
    else
        print_success "Arquivo HTML de testes encontrado"
    fi
    
    if [ $missing -gt 0 ]; then
        print_error "Faltam $missing requisito(s)"
        return 1
    fi
    
    return 0
}

# Executar testes HTML
run_html_tests() {
    print_header
    print_info "Abrindo testes interativos no navegador..."
    echo ""
    
    local test_file="$PROJECT_HOME/test-checkout-payments-security.html"
    
    if [ -f "$test_file" ]; then
        print_success "Abrindo: $test_file"
        
        # Tentar diferentes formas de abrir dependendo do SO
        if command -v xdg-open &> /dev/null; then
            # Linux
            xdg-open "$test_file"
        elif command -v open &> /dev/null; then
            # macOS
            open "$test_file"
        elif command -v start &> /dev/null; then
            # Windows (PowerShell)
            start "$test_file"
        else
            print_warning "Não foi possível abrir automaticamente"
            print_info "Abra manualmente: $test_file"
        fi
        
        echo ""
        print_info "Interface dos testes será carregada em seu navegador padrão"
        echo ""
    else
        print_error "Arquivo de testes HTML não encontrado: $test_file"
        return 1
    fi
}

# Executar testes CLI
run_cli_tests() {
    print_header
    print_info "Executando testes via CLI (Deno)..."
    echo ""
    
    # Verificar se Deno está instalado
    if ! command -v deno &> /dev/null; then
        print_error "Deno não está instalado"
        print_info "Instale Deno em https://deno.land"
        return 1
    fi
    
    # Preparar variáveis de ambiente
    export SUPABASE_URL=${SUPABASE_URL:-"http://localhost:54321"}
    export SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY:-"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MCwiZXhwIjoxODAwfQ.J3FZaeBe_-EqgJ21S_jL84kxbE3StVdvgzl5gKgbHv8"}
    
    print_info "Supabase URL: $SUPABASE_URL"
    echo ""
    
    # Executar testes
    if deno run --allow-net --allow-env "$PROJECT_HOME/test-checkout-payments-security.ts"; then
        print_success "Testes completados com sucesso!"
        return 0
    else
        print_error "Alguns testes falharam"
        return 1
    fi
}

# Executar todos os testes
run_all_tests() {
    print_header
    print_info "Executando suíte completa de testes..."
    echo ""
    
    # Executar testes CLI
    print_info "Etapa 1: Testes automatizados via CLI..."
    echo ""
    
    if run_cli_tests; then
        print_success "Testes CLI concluídos"
    else
        print_warning "Testes CLI tiveram problemas"
    fi
    
    echo ""
    print_info "Etapa 2: Abrindo interface interativa..."
    echo ""
    
    run_html_tests
}

# Modo debug
run_debug_mode() {
    print_header
    print_info "Modo DEBUG - Testes com logs detalhados"
    echo ""
    
    export DEBUG=1
    export SUPABASE_URL=${SUPABASE_URL:-"http://localhost:54321"}
    export SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY:-"test-key"}
    
    print_info "Executando com logs detalhados..."
    echo ""
    
    deno run --allow-net --allow-env --allow-read "$PROJECT_HOME/test-checkout-payments-security.ts"
}

# Exibir ajuda
show_help() {
    cat << EOF
${BLUE}════════════════════════════════════════════════════════════${NC}
  🛡️  SCRIPT DE TESTES - CHECKOUT, PAGAMENTOS E SEGURANÇA
${BLUE}════════════════════════════════════════════════════════════${NC}

${GREEN}OPÇÕES:${NC}

  html      Abrir testes interativos no navegador
  cli       Executar testes via CLI (Deno)
  all       Executar todos os testes (CLI + HTML)
  debug     Modo debug com logs detalhados
  help      Mostrar esta mensagem

${GREEN}EXEMPLOS:${NC}

  # Abrir interface web
  ./run-security-tests.sh html

  # Executar testes automatizados
  ./run-security-tests.sh cli

  # Executar tudo
  ./run-security-tests.sh all

  # Testes com debug
  ./run-security-tests.sh debug

${GREEN}REQUISITOS:${NC}

  • Deno (https://deno.land)
  • Supabase rodando localmente (opcional)
  • Navegador moderno para testes HTML

${GREEN}VARIÁVEIS DE AMBIENTE:${NC}

  SUPABASE_URL       (padrão: http://localhost:54321)
  SUPABASE_ANON_KEY  (padrão: test-key)

${BLUE}════════════════════════════════════════════════════════════${NC}
EOF
}

# Main
main() {
    local option="${1:-help}"
    
    # Validar opção
    case "$option" in
        html)
            check_requirements && run_html_tests
            ;;
        cli)
            check_requirements && run_cli_tests
            ;;
        all)
            check_requirements && run_all_tests
            ;;
        debug)
            check_requirements && run_debug_mode
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Opção desconhecida: $option"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Executar
main "$@"
