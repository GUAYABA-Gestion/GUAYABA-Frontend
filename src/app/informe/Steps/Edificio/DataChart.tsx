import React from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Registra los componentes necesarios
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define tipos para los datos
interface MetricData {
  categoria: string;
  propiedad: string;
  cert_uso_suelo: string;
  suma_area_terreno: number;
  suma_area_construida: number;
  total_edificios: number;
  [key: string]: any;
}

interface DataChartProps {
  data: MetricData[];
}

// Colores fijos para cada propiedad (evita que cambien al aplicar filtros)
const PROPERTY_COLORS: Record<string, string> = {
  "NO OPERACIONAL": "#FF5733", // Rojo vibrante
  "PROPIO": "#28A745",         // Verde vibrante
  "ARRENDADO": "#17A2B8",      // Azul vibrante
};

// Colores fijos para categorías
const CATEGORY_COLORS: Record<string, string> = {
  "CAT": "#FFC107",            // Amarillo vibrante
  "OTRO": "#20C997",           // Verde menta
  "PRINCIPAL": "#007BFF",      // Azul fuerte
  "SEDE Y CAT": "#FD7E14",     // Naranja vibrante
  "SEDE": "#DC3545",           // Rojo fuerte
};

// Colores fijos para certificados
const CERTIFICATE_COLORS: Record<string, string> = {
  "DISPONIBLE": "#28A745",     // Verde vibrante
  "NO DISPONIBLE": "#DC3545",  // Rojo fuerte
};

const DataCharts: React.FC<DataChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="p-4 text-center text-gray-500 bg-gray-100 rounded">No hay datos para mostrar</div>;
  }

  // 1. Gráfica de Barras Apiladas por Categoría y Propiedad (Área Construida)
  const prepareStackedBarData = () => {
    const categories = Array.from(new Set(data.map(item => item.categoria)));
    const properties = Array.from(new Set(data.map(item => item.propiedad)));

    const datasets = properties.map(propiedad => {
      return {
        label: propiedad,
        data: categories.map(categoria => {
          const item = data.find(d => d.categoria === categoria && d.propiedad === propiedad);
          return item ? item.suma_area_construida : 0;
        }),
        backgroundColor: PROPERTY_COLORS[propiedad] || "#858796",
        borderColor: PROPERTY_COLORS[propiedad] || "#858796",
        borderWidth: 1,
      };
    });

    return {
      labels: categories,
      datasets,
    };
  };

  // 2. Gráfica de Conteo por Categoría
  const prepareCategoryCountData = () => {
    const categories = Array.from(new Set(data.map(item => item.categoria)));
    const counts = categories.map(categoria => 
      data.filter(d => d.categoria === categoria).reduce((sum, item) => sum + Number(item.total_edificios), 0)
    );

    return {
      labels: categories,
      datasets: [{
        label: "Total de Edificios",
        data: counts,
        backgroundColor: categories.map(cat => CATEGORY_COLORS[cat] || "#858796"),
        borderColor: categories.map(cat => CATEGORY_COLORS[cat] || "#858796"),
        borderWidth: 1,
      }]
    };
  };

  // 3. Gráfica de Conteo por Propiedad
  const preparePropertyCountData = () => {
    const properties = Array.from(new Set(data.map(item => item.propiedad)));
    const counts = properties.map(propiedad => 
      data.filter(d => d.propiedad === propiedad).reduce((sum, item) => sum + Number(item.total_edificios), 0)
    );

    return {
      labels: properties,
      datasets: [{
        label: "Total de Edificios",
        data: counts,
        backgroundColor: properties.map(prop => PROPERTY_COLORS[prop] || "#858796"),
        borderColor: properties.map(prop => PROPERTY_COLORS[prop] || "#858796"),
        borderWidth: 1,
      }]
    };
  };

  // 4. Gráfica de Conteo por Certificado de Uso de Suelo
  const prepareCertificateCountData = () => {
    const certificates = Array.from(new Set(data.map(item => item.cert_uso_suelo)));
    const counts = certificates.map(cert => 
      data.filter(d => d.cert_uso_suelo === cert).reduce((sum, item) => sum + Number(item.total_edificios), 0)
    );

    return {
      labels: certificates,
      datasets: [{
        label: "Total de Edificios",
        data: counts,
        backgroundColor: certificates.map(cert => CERTIFICATE_COLORS[cert] || "#858796"),
        borderColor: certificates.map(cert => CERTIFICATE_COLORS[cert] || "#858796"),
        borderWidth: 1,
      }]
    };
  };

  // Opciones comunes para gráficas de conteo
  const countChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.raw.toLocaleString()} edificios`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Cantidad de Edificios",
        },
      },
    },
  };

  // Opciones para gráfica apilada
  const stackedOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Área Construida por Categoría y Propiedad (m²)",
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw.toLocaleString()} m²`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Categorías",
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Metros cuadrados (m²)",
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Gráfica de Barras Apiladas */}
      <div className="w-full h-[400px] bg-white p-4 rounded shadow">
        <Bar 
          data={prepareStackedBarData()} 
          options={stackedOptions} 
        />
      </div>

      {/* Tres gráficas de conteo en grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gráfica de Conteo por Categoría */}
        <div className="h-[350px] bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2 text-center">Distribución por Categoría</h3>
          <Bar 
            data={prepareCategoryCountData()} 
            options={{
              ...countChartOptions,
              plugins: {
                ...countChartOptions.plugins,
                title: {
                  display: true,
                  text: "Edificios por Categoría",
                },
              },
            }} 
          />
        </div>

        {/* Gráfica de Conteo por Propiedad */}
        <div className="h-[350px] bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2 text-center">Distribución por Propiedad</h3>
          <Bar 
            data={preparePropertyCountData()} 
            options={{
              ...countChartOptions,
              plugins: {
                ...countChartOptions.plugins,
                title: {
                  display: true,
                  text: "Edificios por Propiedad",
                },
              },
            }} 
          />
        </div>

        {/* Gráfica de Conteo por Certificado */}
        <div className="h-[350px] bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2 text-center">Distribución por Certificado</h3>
          <Bar 
            data={prepareCertificateCountData()} 
            options={{
              ...countChartOptions,
              plugins: {
                ...countChartOptions.plugins,
                title: {
                  display: true,
                  text: "Edificios por Certificado",
                },
              },
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default DataCharts;