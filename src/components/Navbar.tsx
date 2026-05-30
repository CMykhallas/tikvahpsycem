
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: "Início", href: "/" },
    { 
      name: "Sobre", 
      href: "/about",
      submenu: [
        { name: "Nossa História", href: "/about" },
        { name: "Equipe", href: "/team" },
        { name: "Valores", href: "/values" },
        { name: "Missão e Visão", href: "/mission" },
        { name: "Nossa Abordagem", href: "/approach" },
        { name: "Administração", href: "/administration" }
      ]
    },
    {
      name: "Serviços",
      href: "/services",
      submenu: [
        { name: "Psicoterapia", href: "/services/psicoterapia" },
        { name: "Consultoria", href: "/services/consultoria" },
        { name: "Cursos", href: "/services/cursos" },
        { name: "Workshops", href: "/services/workshops" }
      ]
    },
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/faq" },
    { name: "Depoimentos", href: "/testimonials" },
    { name: "Carreira", href: "/career" },
    {
      name: "Contato",
      href: "/contact",
      submenu: [
        { name: "Contato", href: "/contact" },
        { name: "Feedback", href: "/feedback" },
        { name: "Localização", href: "/location" }
      ]
    }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg border border-teal-200/30 shadow-sm">
              <img 
                src="/tikvah-logo.jpg" 
                alt="Tikvah Psychological Center & Multiservice Logo" 
                className="w-8 h-8 object-cover rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-800">Tikvah</span>
              <span className="text-xs text-slate-600">Psychological Center</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-teal-600 bg-teal-50"
                      : "text-slate-700 hover:text-teal-600 hover:bg-slate-50"
                  }`}
                >
                  {item.name}
                </Link>
                {item.submenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-600"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center">
            <Link to="/appointment">
              <Button className="btn-primary-gradient">
                Agendar Consulta
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive(item.href)
                        ? "text-teal-600 bg-teal-50"
                        : "text-slate-700 hover:text-teal-600 hover:bg-slate-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.submenu && (
                    <div className="ml-4 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-3 py-2 text-sm text-slate-600 hover:text-teal-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-slate-200">
                <Link to="/appointment" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full btn-primary-gradient">
                    Agendar Consulta
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
