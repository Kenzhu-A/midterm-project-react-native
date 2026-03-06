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
  MainTabs: { screen?: keyof TabParamList };
  ApplicationForm: { job: Job; fromSavedJobs?: boolean }; // Added fromSavedJobs
};

export type TabParamList = {
  JobFinder: undefined;
  SavedJobs: undefined;
};