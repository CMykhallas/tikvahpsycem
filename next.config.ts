import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Mantém a verificação ativa para barrar códigos inseguros no pipeline
  eslint: {
    ignoreDuringBuilds: false, 
  },
  // Configurações adicionais de otimização de imagens para produção
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
