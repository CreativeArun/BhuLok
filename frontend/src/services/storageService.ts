import type { Job } from '../types/job';

const ACTIVE_JOB_KEY_PREFIX = 'bhulok_active_job_';
const CACHED_JOBS_KEY = 'bhulok_cached_jobs';

export const storageService = {
  setActiveJobId(projectId: string, jobId: string): void {
    try {
      localStorage.setItem(`${ACTIVE_JOB_KEY_PREFIX}${projectId}`, jobId);
    } catch {
      // storage unavailable
    }
  },

  getActiveJobId(projectId: string): string | null {
    try {
      return localStorage.getItem(`${ACTIVE_JOB_KEY_PREFIX}${projectId}`);
    } catch {
      return null;
    }
  },

  cacheJob(job: Job): void {
    try {
      const existing = this.getCachedJobs();
      existing[job.jobId] = job;
      if (job.projectId) {
        existing[`project_${job.projectId}`] = job;
      }
      localStorage.setItem(CACHED_JOBS_KEY, JSON.stringify(existing));
    } catch {
      // ignore
    }
  },

  getCachedJobs(): Record<string, Job> {
    try {
      const raw = localStorage.getItem(CACHED_JOBS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  getCachedJobForProject(projectId: string): Job | null {
    const cached = this.getCachedJobs();
    if (cached[`project_${projectId}`]) {
      return cached[`project_${projectId}`];
    }
    const activeId = this.getActiveJobId(projectId);
    if (activeId && cached[activeId]) {
      return cached[activeId];
    }
    return null;
  },
};

export default storageService;
