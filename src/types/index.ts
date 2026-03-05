export interface Job {
  id: string; 
  title: string;
  company: string;
  companyLogo: string; 
  location: string;
  salary: string;
  description: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  ApplicationForm: { job: Job };
};

export type TabParamList = {
  JobFinder: undefined;
  SavedJobs: undefined;
};