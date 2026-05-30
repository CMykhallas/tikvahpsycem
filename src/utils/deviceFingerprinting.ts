/**
 * ELITE THREAT INTELLIGENCE
 * Canvas Fingerprinting + Device ID Tracking
 * Identifica o mesmo invasor mesmo que mude de IP/VPN
 */

// =========================================
// CANVAS FINGERPRINTING
// =========================================

export class CanvasFingerprinter {
  /**
   * Gera um fingerprint único baseado em Canvas 2D
   * É quase impossível falsificar sem acesso ao GPU do host
   */
  static generateCanvasFingerprint(): string {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      
      if (!ctx) return 'canvas_unavailable';

      // Configurar canvas
      canvas.width = 280;
      canvas.height = 60;

      // Background
      ctx.fillStyle = 'rgb(200, 200, 200)';
      ctx.fillRect(0, 0, 280, 60);

      // Desenho complexo
      ctx.fillStyle = 'rgb(102, 204, 0)';
      ctx.beginPath();
      ctx.arc(60, 30, 20, 0, Math.PI * 2, true);
      ctx.fill();

      // Texto especial
      ctx.fillStyle = 'rgb(255, 0, 0)';
      ctx.font = 'italic 17px "Arial"';
      ctx.rotate(0.4);
      ctx.fillText('Canvas Fingerprint 🔒', 50, 35);
      ctx.rotate(-0.4);

      // WebGL fingerprint
      const canvas2 = document.createElement('canvas');
      const gl = canvas2.getContext('webgl') || canvas2.getContext('experimental-webgl');
      let glFingerprint = '';

      if (gl) {
        const _debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
        if (_debugInfo) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          glFingerprint = (gl as WebGLRenderingContext).getParameter((_debugInfo as any).UNMASKED_RENDERER_WEBGL);
        }
      }

      // Combinar tudo
      const canvasData = canvas.toDataURL();
      const hash = this.hashString(canvasData + glFingerprint);
      
      return hash;
    } catch (error) {
      console.error('Canvas fingerprinting error:', error);
      return 'fingerprint_error';
    }
  }

  /**
   * Hash rápido para fingerprint
   */
  private static hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }
}

// =========================================
// DEVICE FINGERPRINTING
// =========================================

export interface DeviceFingerprint {
  canvasId: string;
  webglId: string;
  hardwareId: string;
  screenFingerprint: string;
  fontFingerprint: string;
  audioFingerprint: string;
  combinedHash: string;
  confidence: number; // 0-100
}

export class DeviceFingerprinter {
  /**
   * Gera fingerprint completo do dispositivo
   */
  static async generateDeviceFingerprint(): Promise<DeviceFingerprint> {
    const canvas = CanvasFingerprinter.generateCanvasFingerprint();
    const webgl = this.getWebGLFingerprint();
    const hardware = await this.getHardwareFingerprint();
    const screen = this.getScreenFingerprint();
    const fonts = this.getFontFingerprint();
    const audio = this.getAudioFingerprint();

    const components = [canvas, webgl, hardware, screen, fonts, audio].join('|');
    const combinedHash = this.hash(components);

    return {
      canvasId: canvas,
      webglId: webgl,
      hardwareId: hardware,
      screenFingerprint: screen,
      fontFingerprint: fonts,
      audioFingerprint: audio,
      combinedHash,
      confidence: 95 // Alto - muito difícil falsificar
    };
  }

  /**
   * Extrai informações de GPU via WebGL
   */
  private static getWebGLFingerprint(): string {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
      
      if (!gl) return 'no_webgl';

      const _debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const vendor = gl.getParameter(gl.VENDOR);
      const renderer = gl.getParameter(gl.RENDERER);
      const version = gl.getParameter(gl.VERSION);

      const fingerprint = `${vendor}|${renderer}|${version}`;
      return this.hash(fingerprint);
    } catch {
      return 'webgl_error';
    }
  }

  /**
   * Extrai informações de hardware (CPU cores, RAM, etc.)
   */
  private static async getHardwareFingerprint(): Promise<string> {
    try {
      const cores = navigator.hardwareConcurrency || 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const _memory = ((navigator as any).deviceMemory as undefined | number) || 0;
      const maxTouchPoints = navigator.maxTouchPoints || 0;
      const vendor = navigator.vendor;
      const platform = navigator.platform;

      const fingerprint = `${cores}|${_memory}|${maxTouchPoints}|${vendor}|${platform}`;
      return this.hash(fingerprint);
    } catch {
      return 'hardware_error';
    }
  }

  /**
   * Fingerprint de resolução de tela
   */
  private static getScreenFingerprint(): string {
    try {
      const {
        width,
        height,
        colorDepth,
        pixelDepth
      } = window.screen;
      const devicePixelRatio = window.devicePixelRatio || 1;

      const fingerprint = `${width}x${height}|${colorDepth}|${pixelDepth}|${devicePixelRatio}`;
      return this.hash(fingerprint);
    } catch {
      return 'screen_error';
    }
  }

  /**
   * Detecta fontes instaladas no sistema
   */
  private static getFontFingerprint(): string {
    try {
      const baseFonts = ['monospace', 'sans-serif', 'serif'];
      const testFonts = [
        'Arial',
        'Verdana',
        'Helvetica',
        'Times New Roman',
        'Courier New',
        'Georgia',
        'Palatino',
        'Garamond',
        'Bookman',
        'Comic Sans MS',
        'Trebuchet MS',
        'Impact',
        'Lucida Sans',
        'Tahoma',
        'Lucida Console',
        'Segoe UI'
      ];

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      
      if (!ctx) return 'canvas_unavailable';

      const detectedFonts: string[] = [];

      for (const font of testFonts) {
        for (const base of baseFonts) {
          ctx.font = `12px "${font}", ${base}`;
          const metrics1 = ctx.measureText('mmmmmmmmmmlli');
          
          ctx.font = `12px "${base}"`;
          const metrics2 = ctx.measureText('mmmmmmmmmmlli');

          if (metrics1.width !== metrics2.width) {
            detectedFonts.push(font);
            break;
          }
        }
      }

      return this.hash(detectedFonts.join('|'));
    } catch {
      return 'font_error';
    }
  }

  /**
   * Fingerprint baseado em AudioContext
   */
  private static getAudioFingerprint(): string {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextType = ((window as any).AudioContext || (window as any).webkitAudioContext) as typeof AudioContext | undefined;
      
      if (!AudioContextType) return 'no_audio_context';

      const context = new AudioContextType();
      
      // Criar oscilador
      const osc = context.createOscillator();
      const analyser = context.createAnalyser();
      osc.connect(analyser);
      analyser.connect(context.destination);

      // Extrair fingerprint da implementação
      const fingerprint = [
        context.sampleRate,
        context.state,
        analyser.fftSize,
        analyser.frequencyBinCount
      ].join('|');

      context.close();
      return this.hash(fingerprint);
    } catch {
      return 'audio_error';
    }
  }

  /**
   * Hash simples
   */
  private static hash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

// =========================================
// DEVICE TRACKING MANAGER
// =========================================

export class DeviceTrackingManager {
  private static readonly STORAGE_KEY = 'device_id';

  /**
   * Obter ou criar Device ID permanente
   */
  static async getOrCreateDeviceId(): Promise<string> {
    // Tentar recuperar do localStorage
    let deviceId = localStorage.getItem(this.STORAGE_KEY);
    
    if (!deviceId) {
      // Gerar novo
      const fingerprint = await DeviceFingerprinter.generateDeviceFingerprint();
      deviceId = `dev_${fingerprint.combinedHash}_${Date.now()}`;
      localStorage.setItem(this.STORAGE_KEY, deviceId);
    }

    return deviceId;
  }

  /**
   * Enviar fingerprint para servidor
   */
  static async reportFingerprint(userId?: string): Promise<void> {
    try {
      const fingerprint = await DeviceFingerprinter.generateDeviceFingerprint();
      const deviceId = await this.getOrCreateDeviceId();
      
      const ip = await this.getClientIP();

      await fetch('/api/threat-intelligence/device-fingerprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          fingerprint,
          userId,
          ip,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to report device fingerprint:', error);
    }
  }

  /**
   * Obter IP do cliente
   */
  private static async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const { ip } = await response.json();
      return ip;
    } catch {
      return 'unknown';
    }
  }

  /**
   * Verificar se dispositivo já foi visto antes
   */
  static async isNewDevice(userId: string): Promise<boolean> {
    try {
      const deviceId = await this.getOrCreateDeviceId();
      const response = await fetch(`/api/threat-intelligence/device-check?deviceId=${deviceId}&userId=${userId}`);
      const { isNew } = await response.json();
      return isNew;
    } catch {
      return false;
    }
  }
}

export default {
  CanvasFingerprinter,
  DeviceFingerprinter,
  DeviceTrackingManager
};
