export interface DiseaseResponse {
  plant_name: string;
  disease_name: string;
  treatment_steps: TreatmentStep[];
}
interface TreatmentStep {
  step: string;
  advice: string;
}

