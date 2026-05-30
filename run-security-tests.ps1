# ============================================
# SCRIPT DE TESTES - CHECKOUT, PAGAMENTOS E SEGURANÇA (PowerShell)
# ============================================
# 
# Uso: .\run-security-tests.ps1 -Mode <html|cli|all|debug>
#
# Exemplos:
#   .\run-security-tests.ps1 -Mode html   # Abrir testes web
#   .\run-security-tests.ps1 -Mode cli    # Testes automatizados
#   .\run-security-tests.ps1 -Mode all    # Todos os testes
#   .\run-security-tests.ps1 -Mode debug  # Modo debug

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('html', 'cli', 'all', 'debug', 'help')]
    [string]$Mode = 'help'
)

# Definir localização
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectHome = $ScriptDir

# Definir cores
$Colors = @{
    Success = 'Green'
    Error = 'Red'
    Warning = 'Yellow'
    Info = 'Cyan'
    Header = 'Magenta'
}

# Funções auxiliares
function Write-Header {
    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Colors.Header
    Write-Host "  🛡️  SUITE DE TESTES - CHECKOUT, PAGAMENTOS E SEGURANÇA" -ForegroundColor $Colors.Header
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Colors.Header
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor $Colors.Success
}

function Show-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor $Colors.Error
}

function Show-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor $Colors.Warning
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor $Colors.Info
}

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host $Title -ForegroundColor $Colors.Header
    Write-Host ""
}

# Verificar requisitos
function Test-Requirements {
    Write-Host ""
    Print-Info "Verificando requisitos..."
    
    $missing = 0
    
    # Verificar Deno
    $denoExists = Get-Command deno -ErrorAction SilentlyContinue
    if ($denoExists) {
        $denoVersion = & deno --version 2>&1 | Select-Object -First 1
        Write-Success "Deno encontrado: $denoVersion"
    } else {
        Show-Warning "Deno não instalado (opcional para testes CLI)"
    }
    
    # Verificar Node.js
    $nodeExists = Get-Command node -ErrorAction SilentlyContinue
    if ($nodeExists) {
        $nodeVersion = & node --version
        Write-Success "Node.js encontrado: $nodeVersion"
    } else {
        Write-Info "Node.js não encontrado (opcional)"
    }
    
    # Verificar arquivos de teste
    if (Test-Path "$ProjectHome\test-checkout-payments-security.ts") {
        Write-Success "Arquivo TS de testes encontrado"
    } else {
        Show-Error "Arquivo test-checkout-payments-security.ts não encontrado"
        $missing++
    }
    
    if (Test-Path "$ProjectHome\test-checkout-payments-security.html") {
        Write-Success "Arquivo HTML de testes encontrado"
    } else {
        Show-Error "Arquivo test-checkout-payments-security.html não encontrado"
        $missing++
    }
    
    if ($missing -gt 0) {
        Show-Error "Faltam $missing arquivo(s)"
        return $false
    }
    
    return $true
}

# Executar testes HTML
function Invoke-HtmlTests {
    Print-Header
    Print-Info "Abrindo testes interativos no navegador..."
    Write-Host ""
    
    $testFile = "$ProjectHome\test-checkout-payments-security.html"
    
    if (Test-Path $testFile) {
        Write-Success "Abrindo: $testFile"
        
        # Converter para caminho absoluto
        $absolutePath = (Get-Item $testFile).FullName
        
        # Abrir no navegador padrão
        & cmd /c start $absolutePath
        
        Write-Host ""
        Write-Info "Interface dos testes será carregada em seu navegador padrão"
        Write-Info "Resultado: Interface web com 20 testes predefinidos"
        Write-Host ""
    } else {
        Show-Error "Arquivo de testes HTML não encontrado: $testFile"
        return $false
    }
    
    return $true
}

# Executar testes CLI
function Invoke-CliTests {
    Print-Header
    Print-Info "Executando testes via CLI..."
    Write-Host ""
    
    # Verificar Deno
    $denoExists = Get-Command deno -ErrorAction SilentlyContinue
    if (-not $denoExists) {
        Show-Error "Deno não está instalado"
        Write-Info "Instale Deno em https://deno.land"
        return $false
    }
    
    # Preparar variáveis de ambiente
    $env:SUPABASE_URL = $env:SUPABASE_URL -or "http://localhost:54321"
    $env:SUPABASE_ANON_KEY = $env:SUPABASE_ANON_KEY -or "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MCwiZXhwIjoxODAwfQ.J3FZaeBe_-EqgJ21S_jL84kxbE3StVdvgzl5gKgbHv8"
    
    Write-Info "Supabase URL: $($env:SUPABASE_URL)"
    Write-Host ""
    
    # Executar testes
    Write-Info "Iniciando execução de testes..."
    Write-Host ""
    
    try {
        & deno run --allow-net --allow-env "$ProjectHome\test-checkout-payments-security.ts"
        
        Write-Success "Testes completados com sucesso!"
        return $true
    } catch {
        Show-Error "Erro durante execução dos testes: $_"
        return $false
    }
}

# Executar todos os testes
function Invoke-AllTests {
    Print-Header
    Print-Info "Executando suíte completa de testes..."
    Write-Host ""
    
    # Etapa 1: Testes CLI
    Write-Section "Etapa 1: Testes automatizados (CLI)"
    
    if (Invoke-CliTests) {
        Write-Success "Testes CLI concluídos com sucesso"
    } else {
        Show-Warning "Testes CLI não puderam ser executados"
    }
    
    # Etapa 2: Interface web
    Write-Section "Etapa 2: Abrindo interface interativa"
    
    Invoke-HtmlTests
}

# Modo debug
function Invoke-DebugMode {
    Print-Header
    Print-Info "Modo DEBUG - Testes com logs detalhados"
    Write-Host ""
    
    # Preparar ambiente
    $env:DEBUG = "1"
    $env:SUPABASE_URL = $env:SUPABASE_URL -or "http://localhost:54321"
    $env:SUPABASE_ANON_KEY = $env:SUPABASE_ANON_KEY -or "test-key"
    
    Print-Info "Variáveis de debug ativadas"
    Print-Info "SUPABASE_URL: $($env:SUPABASE_URL)"
    Print-Info "DEBUG: $($env:DEBUG)"
    Write-Host ""
    
    # Verificar Deno
    $denoExists = Get-Command deno -ErrorAction SilentlyContinue
    if (-not $denoExists) {
        Print-Error "Deno não está instalado"
        return $false
    }
    
    Print-Info "Executando com logs detalhados..."
    Write-Host ""
    
    try {
        & deno run --allow-net --allow-env --allow-read "$ProjectHome\test-checkout-payments-security.ts"
        return $true
    } catch {
        Print-Error "Erro: $_"
        return $false
    }
}

# Exibir ajuda
function Show-Help {
    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Colors.Header
    Write-Host "  🛡️  SCRIPT DE TESTES - CHECKOUT, PAGAMENTOS E SEGURANÇA" -ForegroundColor $Colors.Header
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Colors.Header
    Write-Host ""
    
    Write-Host "OPÇÕES:" -ForegroundColor $Colors.Success
    Write-Host ""
    Write-Host "  html      Abrir testes interativos no navegador" -ForegroundColor $Colors.Info
    Write-Host "  cli       Executar testes via CLI (Deno)" -ForegroundColor $Colors.Info
    Write-Host "  all       Executar todos os testes (CLI + HTML)" -ForegroundColor $Colors.Info
    Write-Host "  debug     Modo debug com logs detalhados" -ForegroundColor $Colors.Info
    Write-Host "  help      Mostrar esta mensagem" -ForegroundColor $Colors.Info
    Write-Host ""
    
    Write-Host "EXEMPLOS:" -ForegroundColor $Colors.Success
    Write-Host ""
    Write-Host "  # Abrir interface web" -ForegroundColor $Colors.Info
    Write-Host "  `$> .\run-security-tests.ps1 -Mode html" -ForegroundColor $Colors.Warning
    Write-Host ""
    Write-Host "  # Executar testes automatizados" -ForegroundColor $Colors.Info
    Write-Host "  `$> .\run-security-tests.ps1 -Mode cli" -ForegroundColor $Colors.Warning
    Write-Host ""
    Write-Host "  # Executar tudo" -ForegroundColor $Colors.Info
    Write-Host "  `$> .\run-security-tests.ps1 -Mode all" -ForegroundColor $Colors.Warning
    Write-Host ""
    Write-Host "  # Testes com debug" -ForegroundColor $Colors.Info
    Write-Host "  `$> .\run-security-tests.ps1 -Mode debug" -ForegroundColor $Colors.Warning
    Write-Host ""
    
    Write-Host "REQUISITOS:" -ForegroundColor $Colors.Success
    Write-Host ""
    Write-Host "  • PowerShell 5.0+" -ForegroundColor $Colors.Info
    Write-Host "  • Deno (opcional, para testes CLI)" -ForegroundColor $Colors.Info
    Write-Host "  • Navegador moderno para testes HTML" -ForegroundColor $Colors.Info
    Write-Host "  • Supabase (opcional, para testes de integração)" -ForegroundColor $Colors.Info
    Write-Host ""
    
    Write-Host "VARIÁVEIS DE AMBIENTE:" -ForegroundColor $Colors.Success
    Write-Host ""
    Write-Host "  SUPABASE_URL       (padrão: http://localhost:54321)" -ForegroundColor $Colors.Info
    Write-Host "  SUPABASE_ANON_KEY  (padrão: test key)" -ForegroundColor $Colors.Info
    Write-Host ""
    Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Colors.Header
    Write-Host ""
}

# Main
function Main {
    switch ($Mode) {
        'html' {
            if (Test-Requirements) {
                Invoke-HtmlTests
            }
        }
        'cli' {
            if (Test-Requirements) {
                Invoke-CliTests
            }
        }
        'all' {
            if (Test-Requirements) {
                Invoke-AllTests
            }
        }
        'debug' {
            if (Test-Requirements) {
                Invoke-DebugMode
            }
        }
        'help' {
            Show-Help
        }
        default {
            Show-Error "Opção desconhecida: $Mode"
            Write-Host ""
            Show-Help
            exit 1
        }
    }
}

# Executar
Main
