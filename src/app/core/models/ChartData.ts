export interface CountryData {
  id: number;
  name: string;
  numParticipations: number;
  totalMedals: number;
  totalAthletes: number;
  chartData: ChartData[];
}
export interface ChartData {
  year: number;
  medalsCount: number;
  athleteCount: number;
}
export interface PieChartData {
  id: number;
  name: string;
  value: number;
}
export interface LineChartData {
  name: string;
  series: Array<object>;
}
