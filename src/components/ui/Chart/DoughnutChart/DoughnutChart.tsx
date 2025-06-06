import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

// Props
interface DoughnutChartProps {
  datasetIdKey: string;
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      hoverOffset?: number;
    }[];
  };
  options?: ChartOptions<"doughnut">;
  height?: number; // optional control
}

// Component
const DoughnutChart = ({
  datasetIdKey,
  data,
  options,
  height,
}: DoughnutChartProps) => {
  return (
    <Doughnut
      datasetIdKey={datasetIdKey}
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        ...options, // allow overrides
      }}
      height={height}
      width={height}
    />
  );
};

export default DoughnutChart;
