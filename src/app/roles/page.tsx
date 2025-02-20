"use client";
import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { useRol } from "../../../context/RolContext";
import UserTable from "./components/UserTable";
import UserDetailsModal from "./components/UserDetailsModal";
import AddUserModal from "./components/AddUserModal";
import { User, Sede } from "../../types/api";
import { Header } from "../../../components";
import {
  fetchUsers,
  fetchSedes,
  updateUser,
  deleteUserManual,
} from "../api/auth/UserActions";

const AdminDashboard = () => {
  const { rolSimulado } = useRol();
  const [users, setUsers] = useState<User[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [filters, setFilters] = useState({
    sede: "",
    rol: "",
    correo: "",
    es_manual: "",
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false); // Estado para el modal
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await fetchUsers();
        const sedesData = await fetchSedes();
        setUsers(usersData);
        setSedes(sedesData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () =>
      setItemsPerPage(window.innerWidth < 768 ? 5 : 10);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEditField = (field: keyof User, value: string) => {
    editedUser && setEditedUser({ ...editedUser, [field]: value });
  };

  const handleSaveChanges = async () => {
    if (!editedUser) return;

    if (editedUser.telefono && !/^\d{10}$/.test(editedUser.telefono)) {
      alert("El teléfono debe tener 10 dígitos");
      return;
    }

    try {
      const updatedUser = await updateUser(editedUser);

      setUsers(
        users.map((user) =>
          user.id_persona === updatedUser.id_persona ? updatedUser : user
        )
      );

      setSelectedUser(updatedUser);
      setEditedUser(updatedUser);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setEditMode(false);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDeleteUser = async (id_persona: number) => {
    try {
      await deleteUserManual(id_persona);
      setUsers(users.filter((user) => user.id_persona !== id_persona));
      setSelectedUser(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleUsersAdded = (newUsers: User[]) => {
    setUsers([...users, ...newUsers]); // Agregar nuevos usuarios a la lista
  };

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
    setCurrentPage(1); // Reset pagination to the first page
  };

  const getRolCompleto = (rol: string) => {
    switch (rol) {
      case "user":
        return "Usuario";
      case "admin":
        return "Administrador";
      case "maint":
        return "Mantenimiento";
      case "coord":
        return "Coordinador";
      default:
        return rol;
    }
  };

  const getSedeNombre = (id_sede: number | undefined) => {
    const sede = sedes.find((s) => s.id_sede === id_sede);
    return sede ? sede.nombre : "Sin sede";
  };

  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Usuarios");

    worksheet.columns = [
      { header: "Nombre", key: "nombre", width: 20 },
      { header: "Correo", key: "correo", width: 30 },
      { header: "Teléfono", key: "telefono", width: 15 },
      { header: "Rol", key: "rol", width: 20 },
      { header: "Detalles", key: "detalles", width: 30 },
      { header: "Sede", key: "sede", width: 30 },
      { header: "Es Manual", key: "es_manual", width: 10 },
    ];

    const filteredUsers = users.filter((user) => {
      return (
        (filters.sede === "" || user.id_sede?.toString() === filters.sede) &&
        (filters.rol === "" || user.rol === filters.rol) &&
        (filters.correo === "" || user.correo.includes(filters.correo)) &&
        (filters.es_manual === "" ||
          user.es_manual === (filters.es_manual === "true"))
      );
    });

    filteredUsers.forEach((user) => {
      worksheet.addRow({
        nombre: user.nombre,
        correo: user.correo,
        telefono: user.telefono,
        rol: getRolCompleto(user.rol),
        detalles: user.detalles,
        sede: getSedeNombre(user.id_sede),
        es_manual: user.es_manual ? "Sí" : "No",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const date = new Date().toISOString().split("T")[0];
    const filtersString = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}-${value}`)
      .join("_");

    const fileName = `usuarios_${filtersString}_${date}.xlsx`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading || rolSimulado === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (rolSimulado !== "admin") {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="flex mt-4 items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-black">Acceso Restringido</h2>
            <p className="text-gray-600">
              Esta vista solo está disponible para administradores.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <div className="mt-4 p-4">
          <h1 className="text-2xl font-bold text-[#034f00]">
            Gestión de Roles
          </h1>

          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap space-y-4 md:space-y-0 md:space-x-4">
              <input
                type="text"
                placeholder="Filtrar por correo"
                value={filters.correo}
                onChange={(e) => handleFilterChange("correo", e.target.value)}
                className="p-2 border rounded text-black min-w-[200px]"
              />
              <select
                value={filters.rol}
                onChange={(e) => handleFilterChange("rol", e.target.value)}
                className="p-2 border rounded text-black min-w-[200px]"
              >
                <option value="">Todos los roles</option>
                <option value="admin">Administrador</option>
                <option value="coord">Coordinador</option>
                <option value="maint">Mantenimiento</option>
                <option value="user">Usuario</option>
              </select>
              <select
                value={filters.sede}
                onChange={(e) => handleFilterChange("sede", e.target.value)}
                className="p-2 border rounded text-black min-w-[200px]"
              >
                <option value="">Todas las sedes</option>
                {sedes.map((sede) => (
                  <option key={sede.id_sede} value={sede.id_sede}>
                    {sede.nombre}
                  </option>
                ))}
              </select>
              <select
                value={filters.es_manual}
                onChange={(e) =>
                  handleFilterChange("es_manual", e.target.value)
                }
                className="p-2 border rounded text-black min-w-[200px]"
              >
                <option value="">Todos</option>
                <option value="true">Añadidos manualmente</option>
                <option value="false">Registrados en el sistema</option>
              </select>
              <button
                onClick={() => {
                  setFilters({ sede: "", rol: "", correo: "", es_manual: "" });
                  setCurrentPage(1); // Reset pagination to the first page
                }}
                className="bg-[#80BA7F] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#51835f] transition duration-300 min-w-[200px]"
              >
                Reiniciar Filtros
              </button>
            </div>
          </div>

          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-600 transition duration-300"
            >
              + Añadir Usuarios
            </button>

            <button
              onClick={handleDownloadExcel}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
              Descargar tabla con filtros aplicados
            </button>
          </div>
          {/* Tabla */}
          <div className="mt-6 overflow-x-auto">
            <div className="min-w-full">
              <UserTable
                users={users}
                sedes={sedes}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                filters={filters}
                onPageChange={setCurrentPage}
                onUserClick={(user) => {
                  setSelectedUser(user);
                  setEditedUser(user);
                  setEditMode(false);
                }}
                onFilterChange={handleFilterChange}
                resetFilters={() => {
                  setFilters({ sede: "", rol: "", correo: "", es_manual: "" });
                  setCurrentPage(1); // Reset pagination to the first page
                }}
              />
            </div>
          </div>
          {showSuccess && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
              ¡Usuarios añadidos correctamente!
            </div>
          )}
        </div>
      </div>

      <UserDetailsModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onSave={handleSaveChanges}
        onDelete={handleDeleteUser}
        editMode={editMode}
        setEditMode={setEditMode}
        editedUser={editedUser}
        handleEditField={handleEditField}
        sedes={sedes}
        showSuccess={showSuccess}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)} // No mostrar mensaje de éxito al cancelar
        sedes={sedes}
        onUsersAdded={handleUsersAdded}
        showSuccessMessage={showSuccessMessage} // Pass the new prop
      />
    </>
  );
};

export default AdminDashboard;