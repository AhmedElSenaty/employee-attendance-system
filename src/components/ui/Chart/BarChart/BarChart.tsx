import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register required components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Props
interface BarChartProps {
  datasetIdKey: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor?: string | string[] ;
      borderWidth?: number;
      hoverOffset?: number;
    }[];
  };
  options?: ChartOptions<"bar">;
  height?: number; // optional control
}

// Component
const BarChart = ({
  datasetIdKey,
  data,
  options,
  height = 300, // Default height
}: BarChartProps) => {
  return (
    <Bar
      datasetIdKey={datasetIdKey}
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        ...options, // allow overrides
      }}
      height={height}
    />
  );
};

export default BarChart;
