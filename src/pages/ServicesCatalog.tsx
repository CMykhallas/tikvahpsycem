"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  tikvahServicesEcosystem,
  tikvahEcosystemDescription,
  tikvahModel360Text,
  ServiceDetail,
  ModalidadeTipo,
} from "@/data/tikvah-services-cms";

type ClienteTipo =
  | "empresas"
  | "individualidades"
  | "familia"
  | "casal"
  | "ong"
  | "associacoes";

const formatMZN = (value: number | null | undefined) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return value.toLocaleString("pt-MZ", {
    style: "currency",
    currency: "MZN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const clienteLabel: Record<ClienteTipo, string> = {
  empresas: "Empresas",
  individualidades: "Individualidades",
  familia: "Família",
  casal: "Casal",
  ong: "ONG",
  associacoes: "Associações",
};

export default function ServicesPage() {
  const initialCategoryId = tikvahServicesEcosystem[0]?.id ?? "";
  const [activeCategory, setActiveCategory] = useState<string>(initialCategoryId);
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  const [checkoutModalidade, setCheckoutModalidade] = useState<ModalidadeTipo>("online");
  const [checkoutCliente, setCheckoutCliente] = useState<ClienteTipo>("individualidades");
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const currentCategory = useMemo(
    () => tikvahServicesEcosystem.find((cat) => cat.id === activeCategory) ?? tikvahServicesEcosystem[0],
    [activeCategory]
  );

  const availableModalidades = useMemo(() => {
    if (!selectedService) return [];
    return selectedService.modalidadesPermitidas.filter(
      (mod) => typeof selectedService.precosPorModalidade?.[mod] === "number"
    );
  }, [selectedService]);

  const availableClientes = useMemo(() => {
    if (!selectedService) return [];
    const keys: ClienteTipo[] = [
      "empresas",
      "individualidades",
      "familia",
      "casal",
      "ong",
      "associacoes",
    ];
    return keys.filter((key) => typeof selectedService.precosPorCliente?.[key] === "number");
  }, [selectedService]);

  const getPriceByModalidade = (service: ServiceDetail, modalidade: ModalidadeTipo) => {
    const value = service.precosPorModalidade?.[modalidade];
    return typeof value === "number" ? value : null;
  };

  const getPriceByCliente = (service: ServiceDetail, cliente: ClienteTipo) => {
    const value = service.precosPorCliente?.[cliente];
    return typeof value === "number" ? value : null;
  };

  const resolveFinalPrice = (service: ServiceDetail) => {
    const clientePrice = getPriceByCliente(service, checkoutCliente);
    const modalidadePrice = getPriceByModalidade(service, checkoutModalidade);
    return clientePrice ?? modalidadePrice ?? service.precoComIvaMZN ?? service.precoBaseMZN;
  };

  const handleCheckout = async (service: ServiceDetail) => {
    setLoadingCheckout(true);

    try {
      const finalPrice = resolveFinalPrice(service);

      console.log("Checkout iniciado", {
        serviceId: service.id,
        serviceTitle: service.title,
        modalidade: checkoutModalidade,
        cliente: checkoutCliente,
        priceMZN: finalPrice,
      });

      // Integração futura com Supabase ou gateway:
      // const response = await fetch("/api/create-checkout", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     serviceId: service.id,
      //     serviceTitle: service.title,
      //     modalidade: checkoutModalidade,
      //     cliente: checkoutCliente,
      //     priceMZN: finalPrice,
      //   }),
      // });
      // const data = await response.json();
      // if (data?.url) window.location.href = data.url;
    } catch (err) {
      console.error("Erro no processamento do checkout:", err);
    } finally {
      setLoadingCheckout(false);
    }
  };

  if (!tikvahServicesEcosystem.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        Nenhum serviço disponível.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-teal-600 text-sm font-semibold uppercase tracking-wider">
            Portfólio Corporativo e Clínico
          </span>
          <h1 className="mt-2 text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Soluções e Serviços Tikvah
          </h1>
          <p className="mt-4 max-w-4xl mx-auto text-lg text-slate-600 leading-relaxed">
            {tikvahEcosystemDescription}
          </p>
        </div>

        <div className="border-b border-slate-200 mb-10">
          <nav className="flex flex-wrap -mb-px gap-2" aria-label="Categorias de Serviços">
            {tikvahServicesEcosystem.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setSelectedService(null);
                }}
                className={`py-3 px-6 font-medium text-sm border-b-2 transition-all rounded-t-lg ${
                  activeCategory === category.id
                    ? "border-teal-600 text-teal-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {category.title}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {currentCategory?.items.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => {
                setSelectedService(service);
                const defaultModalidade = service.modalidadesPermitidas.find(
                  (mod) => typeof service.precosPorModalidade?.[mod] === "number"
                );
                if (defaultModalidade) setCheckoutModalidade(defaultModalidade);
                setCheckoutCliente(
                  (["individualidades", "empresas", "familia", "casal", "ong", "associacoes"] as ClienteTipo[])
                    .find((key) => typeof service.precosPorCliente?.[key] === "number") ?? "individualidades"
                );
              }}
              className="group bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-teal-500 transition-all cursor-pointer text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4 gap-4">
                  <h3 className="font-bold text-xl text-slate-900 group-hover:text-teal-700 transition-colors">
                    {service.title}
                  </h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {service.summary}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-teal-600">
                  Mais detalhes →
                </span>
                <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded text-sm">
                  {formatMZN(service.precoComIvaMZN)}
                </span>
              </div>
            </button>
          ))}
        </div>

        {selectedService && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative border border-slate-100">
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl font-semibold p-2"
                aria-label="Fechar janela"
              >
                &times;
              </button>

              <div className="flex flex-col gap-2 mb-6">
                <h2 className="text-2xl font-bold text-slate-950">{selectedService.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block bg-teal-50 text-teal-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    Preço base: {formatMZN(selectedService.precoBaseMZN)}
                  </span>
                  <span className="inline-block bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full">
                    IVA incluído: {formatMZN(selectedService.precoComIvaMZN)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-1">
                      Descrição do Serviço
                    </h4>
                    <p>{selectedService.descriptionFull}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-1">
                      Diferencial Estratégico
                    </h4>
                    <p>{selectedService.diferencial}</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-1">
                      Competitividade de Mercado
                    </h4>
                    <p>{selectedService.competitividade}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-3">
                      Modalidades Disponíveis
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {availableModalidades.map((mod) => (
                        <button
                          key={mod}
                          onClick={() => setCheckoutModalidade(mod)}
                          className={`px-4 py-2 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${
                            checkoutModalidade === mod
                              ? "bg-teal-600 text-white border-teal-600"
                              : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          {mod}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-3">
                      Tipo de Cliente
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {availableClientes.map((cliente) => (
                        <button
                          key={cliente}
                          onClick={() => setCheckoutCliente(cliente)}
                          className={`px-4 py-2 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-all ${
                            checkoutCliente === cliente
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                          }`}
                        >
                          {clienteLabel[cliente]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-4">
                      Preço por Modalidade
                    </h4>
                    <div className="space-y-3">
                      {availableModalidades.map((mod) => (
                        <div key={mod} className="flex justify-between text-sm">
                          <span className="capitalize text-slate-700">{mod}</span>
                          <span className="font-semibold text-slate-900">
                            {formatMZN(getPriceByModalidade(selectedService, mod))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider mb-4">
                      Preço por Tipo de Cliente
                    </h4>
                    <div className="space-y-3">
                      {availableClientes.map((cliente) => (
                        <div key={cliente} className="flex justify-between text-sm">
                          <span className="text-slate-700">{clienteLabel[cliente]}</span>
                          <span className="font-semibold text-slate-900">
                            {formatMZN(getPriceByCliente(selectedService, cliente))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-teal-50 border border-teal-100 p-5 rounded-2xl">
                    <p className="text-sm text-teal-900 leading-relaxed">
                      Todos os preços apresentados incluem IVA de 16% e foram normalizados para manter
                      coerência com o posicionamento premium-realista da Tikvah em Maputo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setSelectedService(null)}
                  className="flex-1 py-3 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                >
                  Voltar ao Catálogo
                </button>
                <button
                  onClick={() => handleCheckout(selectedService)}
                  disabled={loadingCheckout}
                  className="flex-1 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-md shadow-teal-600/20 disabled:opacity-50"
                >
                  {loadingCheckout ? "A processar..." : "Agendar e Pagar"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl shadow-xl p-8 sm:p-12 text-white border border-slate-800">
          <div className="max-w-4xl">
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
              Integração Sistémica
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl mt-2 mb-4 tracking-tight">
              Modelo de Intervenção 360°
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              {tikvahModel360Text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
