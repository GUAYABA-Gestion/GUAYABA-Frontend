import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function FuncionalidadesCarousel() {
  return (
<div className="w-full bg-[#E8F4E8] py-2"> {/* Sección Verde con padding */}
  <div className="flex justify-center"> {/* Centrar el título */}
    <h3 className="text-2xl font-bold text-[#034f00] mb-8">Funcionalidades:</h3>
  </div>
  <div className="max-w-7xl mx-auto px-6">
    <Swiper
      modules={[Pagination, Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      autoplay={{ delay: 3000 }}
      pagination={{ clickable: true }}
      className="w-full"  // Se asegura que el carrusel ocupe todo el ancho
    >
      {/* Slide 1 */}
      <SwiperSlide>
        <div
          className="w-full h-[400px] md:h-[450px] bg-cover bg-center"
          style={{ backgroundImage: "url('/images/usuarios.png')" }}
        >
          <div className="w-full h-full flex items-center justify-center bg-opacity-80 bg-[#E8F4E8]">
            <div className="text-center max-w-xl text-gray-800">
              <h4 className="text-2xl font-bold mb-2">Gestión de Usuarios</h4>
              <p>Administra los distintos usuarios de tu entidad educativa de forma eficiente. Permitimos Login con cuentas institucionales de Gmail, además de la creación de usuarios de manera manual para casos adicionales.</p>
            </div>
          </div>
        </div>
      </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div
              className="w-full h-[400px] md:h-[450px] bg-cover bg-center"
              style={{ backgroundImage: "url('/images/usuarios.png')" }}
            >
              <div className="w-full h-full flex items-center justify-center bg-opacity-80 bg-[#E8F4E8]">
                <div className="text-center max-w-xl text-gray-800">
                  <h4 className="text-2xl font-bold mb-2">Reportes en Tiempo Real</h4>
                  <p>Obtén informes detallados sobre el uso de la infraestructura universitaria.</p>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide>
            <div
              className="w-full h-[400px] md:h-[450px] bg-cover bg-center"
              style={{ backgroundImage: "url('/images/auditoria.png')" }}
            >
              <div className="w-full h-full flex items-center justify-center bg-opacity-80 bg-[#E8F4E8]">
                <div className="text-center max-w-xl text-gray-800">
                  <h4 className="text-2xl font-bold mb-2">Tabla de Auditoría</h4>
                  <p>Realiza un seguimiento extenso y completo del sistema al revisar en tiempo real todo cambio hecho por cualquier usuario con permisos.</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}
