import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const ConsultoriaMenuBar = () => {
  const consultoriaMenuItems = [
    {
      category: "Contabilidade",
      items: [
        { name: "Relatórios Financeiros", href: "#" },
        { name: "Planejamento Tributário", href: "#" },
        { name: "Contabilidade Forense", href: "#" }
      ]
    },
    {
      category: "Auditoria",
      items: [
        { name: "Auditoria Interna", href: "#" },
        { name: "Auditoria de Conformidade", href: "#" },
        { name: "Gestão de Risco", href: "#" }
      ]
    },
    {
      category: "Tributação",
      items: [
        { name: "Imposto de Renda Corporativo", href: "#" },
        { name: "Imposto Internacional", href: "#" },
        { name: "IVA e Impostos sobre Vendas", href: "#" }
      ]
    },
    {
      category: "Consultoria Científica",
      items: [
        { name: "Design de Pesquisa", href: "#" },
        { name: "Análise de Dados", href: "#" },
        { name: "Apoio à Publicação", href: "#" }
      ]
    },
    {
      category: "Consultoria Técnica",
      items: [
        { name: "Consultoria em Engenharia", href: "#" },
        { name: "Garantia de Qualidade", href: "#" },
        { name: "Consultoria de Conformidade", href: "#" }
      ]
    },
    {
      category: "Consultoria Empresarial",
      items: [
        { name: "Gestão Empresarial", href: "#" },
        { name: "Recursos Humanos", href: "#" },
        { name: "Desenvolvimento Organizacional", href: "#" },
        { name: "Estratégia Corporativa", href: "#" },
        { name: "Operações", href: "#" },
        { name: "Jurisprudência", href: "#" }
      ]
    },
    {
      category: "Outras Consultorias",
      items: [
        { name: "Consultoria Ambiental", href: "#" },
        { name: "Consultoria de Risco", href: "#" },
        { name: "Consultoria em Sustentabilidade", href: "#" }
      ]
    },
    {
      category: "Consultoria em TI",
      items: [
        { name: "Infraestrutura", href: "#" },
        { name: "Cibersegurança", href: "#" },
        { name: "Serviços em Nuvem", href: "#" }
      ]
    },
    {
      category: "Consultoria em Computação",
      items: [
        { name: "Desenvolvimento de Software", href: "#" },
        { name: "Integração de Sistemas", href: "#" },
        { name: "Suporte de TI", href: "#" }
      ]
    },
    {
      category: "Treinamento & Desenvolvimento",
      items: [
        { name: "Desenvolvimento Profissional", href: "#" },
        { name: "Habilidades Interpessoais", href: "#" },
        { name: "Habilidades Técnicas", href: "#" }
      ]
    },
    {
      category: "Cursos & Programas",
      items: [
        { name: "Cursos Online", href: "#" },
        { name: "Cursos Presenciais", href: "#" },
        { name: "Estágios", href: "#" }
      ]
    },
    {
      category: "Desenvolvimento Pessoal",
      items: [
        { name: "Coaching Executivo", href: "#" },
        { name: "Coaching de Carreira", href: "#" },
        { name: "Coaching de Vida", href: "#" },
        { name: "Mentoria Profissional", href: "#" }
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🧭</span>
              <h2 className="text-xl font-bold">Consultoria: Navegando na Complexidade para Soluções Estratégicas</h2>
              <span className="text-2xl">📈</span>
            </div>
            <Link to="/services/consultoria">
              <Button className="bg-white text-teal-600 hover:bg-gray-100">
                Ver Serviço Completo →
              </Button>
            </Link>
          </div>
          
          <p className="text-teal-50 mb-4 text-sm italic">
            A Consultoria é um serviço especializado que fornece expertise, conhecimento e insights externos para auxiliar indivíduos, 
            organizações ou governos a resolver problemas, melhorar o desempenho e alcançar objetivos específicos.
          </p>

          {/* Grid de categorias */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {consultoriaMenuItems.map((category) => (
              <div key={category.category} className="bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-colors">
                <h3 className="font-semibold text-white mb-2 flex items-center space-x-1">
                  <ChevronDown className="w-4 h-4" />
                  <span>{category.category}</span>
                </h3>
                <ul className="space-y-1">
                  {category.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-teal-100 hover:text-white text-sm transition-colors hover:font-medium"
                      >
                        • {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-4 bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <p className="text-teal-50 mb-3">
              <strong>Transforme Seus Desafios em Oportunidades!</strong> A equipe da Tikvah está pronta para oferecer 
              a Consultoria que você precisa para alcançar seus objetivos mais ambiciosos.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <a href="mailto:suporte.oficina.psicologo@proton.me" className="text-teal-100 hover:text-white underline">
                📧 suporte.oficina.psicologo@proton.me
              </a>
              <a href="https://wa.me/258827592980" target="_blank" rel="noopener noreferrer" className="text-teal-100 hover:text-white underline">
                📱 WhatsApp: +258 82 759 2980
              </a>
              <a href="tel:+258827785043" className="text-teal-100 hover:text-white underline">
                📞 +258 82 778 5043
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
