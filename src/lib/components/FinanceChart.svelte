<script lang="ts">
  import { Bar } from 'svelte-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
  import type { ChartData, ChartOptions } from 'chart.js';

  export let income: number;
  export let expenses: number;

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

  const data: ChartData<'bar'> = {
    labels: ['Resumen'],
    datasets: [
      {
        label: 'Ingresos',
        data: [income],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
      {
        label: 'Gastos',
        data: [expenses],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
</script>

<div class="h-full">
  <Bar {data} {options} />
</div> 