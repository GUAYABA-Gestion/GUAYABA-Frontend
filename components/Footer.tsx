const Footer = () => {
    return (
      <footer className="bg-[#80BA7F] text-gray-800">
        {/* Contenedor principal */}
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sección 1: Información */}
          <div>
            <h3 className="text-lg font-bold mb-4">Guayaba</h3>
            <p className="text-sm mb-4">
              Mejorando la gestión de tus espacios.
            </p>
          </div>

          {/* Sección 2: Información legal */}
          <div>
            <h3 className="text-lg font-bold mb-4">Información Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">Términos y Condiciones</a>
              </li>
              <li>
                <a href="/privacy" className="hover:underline">Política de Privacidad</a>
              </li>
              <li>
                <a href="/policy" className="hover:underline">Política de Tratamiento de Datos</a>
              </li>
            </ul>
          </div>          
  
          {/* Sección 2: Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-bold mb-4">Navegación Rápida</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">Edificios</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Espacios</a>
              </li>
              <li>
                <a href="#" className="hover:underline">Eventos</a>
              </li>
            </ul>
          </div>
  

        </div>
  
        {/* Aviso de copyright */}
        <div className="bg-green-100 border-t border-green-200 text-sm text-center py-4">
          <p>
            © 2025 Guayaba. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  