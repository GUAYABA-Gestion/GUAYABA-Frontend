import Link from "next/link";
const Tabs = () => {
    const tabs = ["Persona", "Vivienda", "Propiedad Vivienda", "Negocio", "Municipio"];
  
    return (
      <div className="hero">
        <div className="flex-1 pt-36 flex justify-center w-full">
          <div className="w-full max-w-[1440px]">
            <h1 className="hero__title text-center">
              Implementación de la BD de Lab0
            </h1>
            {/* Tabs */}
            <div className="flex justify-center space-x-4 my-6">
            {tabs.map((tab, idx) => {
              const route =
                tab === "Propiedad Vivienda"
                  ? "/propiedades"
                  : `/${tab.toLowerCase().replace(" ", "_")}`;
              return (
                <Link key={idx} href={route}>
                  <button className="px-6 py-2 rounded-full font-medium bg-emerald-600 text-black">
                    {tab}
                  </button>
                </Link>
              );
            })}
          </div>
          </div>
        </div>
      </div>
    );
  };

  export default Tabs