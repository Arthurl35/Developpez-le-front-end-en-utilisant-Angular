export class CountryData {
  id!: number;
  name!: string;
  numParticipations!: number;
  totalMedals!: number;
  totalAthletes!: number;
  chartData!: ChartData[]; // Tableau d'années
}

export interface ChartData {
  year: number;
  medalsCount: number;
  athleteCount: number;
}
