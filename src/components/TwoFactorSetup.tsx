import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { logger } from "@/lib/logger";

interface TwoFactorSetupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type SetupStep = 'start' | 'generate' | 'verify' | 'backup' | 'complete';

export const TwoFactorSetup = ({
  isOpen,
  onClose,
  onSuccess,
}: TwoFactorSetupProps) => {
  const [step, setStep] = useState<SetupStep>('start');
  const [secret, setSecret] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [codesViewed, setCodesViewed] = useState(false);

  const handleGenerateSecret = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        'totp-setup'
      );

      if (invokeError) throw invokeError;

      setSecret(data.secret);
      setQrCode(data.qrCode);
      setBackupCodes(data.backupCodes);
      setStep('generate');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao gerar TOTP';
      setError(errorMsg);
      logger.error('Error generating TOTP:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || !/^\d{6}$/.test(verificationCode)) {
      setError('Por favor insira um código válido de 6 dígitos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        'totp-verify',
        {
          body: {
            secret,
            token: verificationCode,
            backupCodes,
          },
        }
      );

      if (invokeError) throw invokeError;

      setStep('backup');
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Código inválido ou erro no servidor';
      setError(errorMsg);
      logger.error('Error verifying TOTP:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBackupCodes = () => {
    const content = `Códigos de Backup - Tikvah 2FA\n================================\n\nData: ${new Date().toLocaleDateString('pt-BR')}\n\n${backupCodes
      .map((code, i) => `${i + 1}. ${code}`)
      .join(
        '\n'
      )}\n\n⚠️ IMPORTANTE:\n- Guarde estes códigos em local SEGURO\n- Cada código pode ser usado UMA VEZ\n- Se perder seu autenticador, precisará destes códigos\n- Não compartilhe com ninguém`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tikvah-backup-codes-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleComplete = () => {
    setStep('complete');
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Autenticação de Dois Fatores</DialogTitle>
          <DialogDescription>
            Proteja sua conta com um autenticador seguro
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* STEP 1: Start */}
          {step === 'start' && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  2FA adiciona uma camada de segurança. Você precisará de um autenticador
                  (Google Authenticator, Authy, Microsoft Authenticator, etc.)
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleGenerateSecret}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Preparando...' : 'Iniciar Configuração'}
              </Button>
            </div>
          )}

          {/* STEP 2: Generate Secret */}
          {step === 'generate' && qrCode && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">1. Escaneie o código QR</p>
                <div className="flex justify-center bg-white p-4 rounded">
                  <img
                    src={qrCode}
                    alt="QR Code para autenticador"
                    className="w-48 h-48"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  2. Ou insira este código manualmente:
                </p>
                <div className="flex gap-2">
                  <code className="flex-1 p-2 bg-gray-100 rounded font-mono text-sm break-all">
                    {secret}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(secret);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">
                  3. Insira o código de 6 dígitos do seu autenticador
                </p>
                <Input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/\D/g, ''))
                  }
                  disabled={loading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleVerifyCode}
                disabled={loading || verificationCode.length !== 6}
                className="w-full"
              >
                {loading ? 'Verificando...' : 'Verificar Código'}
              </Button>

              <Button
                onClick={() => setStep('start')}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                Voltar
              </Button>
            </div>
          )}

          {/* STEP 3: Backup Codes */}
          {step === 'backup' && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  📝 Salve estes 10 códigos! Use-os se perder o autenticador.
                  Cada código funciona uma única vez.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-50 p-4 rounded border border-gray-200 max-h-48 overflow-y-auto">
                <div className="font-mono text-sm space-y-1">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{`${String(index + 1).padStart(2, '0')}.`}</span>
                      <span className="ml-4">{code}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleDownloadBackupCodes}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(backupCodes.join('\n'));
                  }}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="viewed-codes"
                  checked={codesViewed}
                  onChange={(e) => setCodesViewed(e.target.checked)}
                  className="mt-1"
                />
                <label htmlFor="viewed-codes" className="text-sm">
                  ✓ Confirmei que salvei os códigos em local seguro
                </label>
              </div>

              <Button
                onClick={handleComplete}
                disabled={!codesViewed}
                className="w-full"
              >
                Completar Configuração
              </Button>
            </div>
          )}

          {/* STEP 4: Complete */}
          {step === 'complete' && (
            <div className="text-center space-y-4 py-8">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
              <div>
                <h3 className="font-semibold text-green-600">
                  ✓ 2FA Ativado com Sucesso!
                </h3>
                <p className="text-sm text-gray-600">
                  Sua conta agora está protegida por autenticação de dois fatores
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorSetup;
