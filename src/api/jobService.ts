import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Job } from '../types';

const API_URL = 'https://empllo.com/api/v1';

export const fetchJobs = async (): Promise<Job[]> => {
  try {
    const response = await axios.get(API_URL);
    
    const rawData = response.data && Array.isArray(response.data.jobs) ? response.data.jobs : [];

    return rawData.map((job: any) => ({
      id: uuidv4(), 
      title: job.title || 'Untitled Role',
      company: job.companyName || 'Unknown Company', 
      
      // Fetch logo or generate a professional fallback using the company name
      companyLogo: job.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyName || 'Job')}&background=0052CC&color=fff&size=128`,
      
      salary: formatSalary(job.minSalary, job.maxSalary, job.currency),
      location: Array.isArray(job.locations) && job.locations.length > 0 
        ? job.locations.join(', ') 
        : 'Remote',
      description: job.description || '',
    }));
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

const formatSalary = (min: number | null, max: number | null, currency: string) => {
  if (!min && !max) return 'Negotiable';
  const curr = currency || '$';
  if (min && max) return `${curr}${min} - ${curr}${max}`;
  if (min) return `From ${curr}${min}`;
  if (max) return `Up to ${curr}${max}`;
  return 'Negotiable';
};