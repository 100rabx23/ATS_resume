import { Request, Response } from 'express';
import { fetchRelevantJobs } from '../services/jobApiService';
import Resume from '../models/resumeModel';

export const getJobsForResume = async (req: Request, res: Response) => {
    try {
        const resume = await Resume.findById(req.params.resumeId);

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        
        if (resume.user.toString() !== req.user?._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const jobTitle = resume.experience[0]?.role || '';
        const jobs = await fetchRelevantJobs(resume.skills, jobTitle);

        res.json(jobs);

    } catch (error: any) {
        res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
    }
};