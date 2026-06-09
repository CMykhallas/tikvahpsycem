import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[CRITICAL UI ERROR CAUGHT]:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="p-6 my-4 border border-red-200 bg-red-50 rounded-xl text-center"
        >
          <h4 className="font-bold text-red-800">Ocorreu uma anomalia visual neste painel</h4>
          <p className="text-xs text-red-600 mt-1">A Tikvah preservou a estabilidade do site. Pode prosseguir com o seu agendamento.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
