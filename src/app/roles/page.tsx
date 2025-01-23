"use client";

import { useRol } from "../../../context/RolContext";

const AdminDashboard = () => {
  const { rolSimulado } = useRol();

  if (rolSimulado !== "admin") {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold">Acceso Restringido</h2>
        <p className="text-gray-600">
          Esta vista solo está disponible para administradores.
        </p>
      </div>
    );
  }

  // Datos simulados. Reemplázalos con una consulta real a la base de datos.
  const stats = {
    totalPersonas: 100,
    desglosePorSede: {
      sede1: 40,
      sede2: 35,
      sede3: 25,
    },
    personasConUsuario: 80,
    roles: {
      admin: 5,
      coordinador: 15,
      mantenimiento: 10,
      estudiante: 70,
    },
  };

  const personas = [
    {
      id_persona: 1,
      nombre: "Juan Pérez",
      correo: "juan.perez@example.com",
      telefono: "3001234567",
      detalles: "Empleado con 5 años de experiencia.",
      rol: "Admin",
      sede: "Sede 1",
      usuario: "Sí",
    },
    {
      id_persona: 2,
      nombre: "Ana Gómez",
      correo: "ana.gomez@example.com",
      telefono: "3107654321",
      detalles: "Coordinadora del área académica.",
      rol: "Coordinador",
      sede: "Sede 2",
      usuario: "No",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Gestión de Roles</h1>

      {/* Estadísticas */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Estadísticas Generales</h2>
        <p className="text-gray-700">Total de Personas: {stats.totalPersonas}</p>
        <p className="text-gray-700">
          Personas por Sede:
          {Object.entries(stats.desglosePorSede).map(([sede, cantidad]) => (
            <span key={sede}>
              {" "}
              {sede}: {cantidad}
            </span>
          ))}
        </p>
        <p className="text-gray-700">Personas con Usuario: {stats.personasConUsuario}</p>
        <p className="text-gray-700">
          Roles:
          {Object.entries(stats.roles).map(([rol, cantidad]) => (
            <span key={rol}>
              {" "}
              {rol}: {cantidad}
            </span>
          ))}
        </p>
      </div>

      {/* Tabla de Personas */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Lista de Personas</h2>
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Nombre</th>
              <th className="border border-gray-300 p-2">Correo</th>
              <th className="border border-gray-300 p-2">Teléfono</th>
              <th className="border border-gray-300 p-2">Detalles</th>
              <th className="border border-gray-300 p-2">Rol</th>
              <th className="border border-gray-300 p-2">Sede</th>
              <th className="border border-gray-300 p-2">Usuario</th>
              <th className="border border-gray-300 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personas.map((persona) => (
              <tr key={persona.id_persona} data-id={persona.id_persona}>
                <td className="border border-gray-300 p-2">{persona.nombre}</td>
                <td className="border border-gray-300 p-2">{persona.correo}</td>
                <td className="border border-gray-300 p-2">{persona.telefono}</td>
                <td className="border border-gray-300 p-2">{persona.detalles}</td>
                <td className="border border-gray-300 p-2">{persona.rol}</td>
                <td className="border border-gray-300 p-2">{persona.sede}</td>
                <td className="border border-gray-300 p-2">{persona.usuario}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => console.log(`Editar ${persona.id_persona}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => console.log(`Eliminar ${persona.id_persona}`)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón para añadir persona */}
      <button
        onClick={() => console.log("Ir a añadir persona")}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Añadir Persona
      </button>
    </div>
  );
};

export default AdminDashboard;
