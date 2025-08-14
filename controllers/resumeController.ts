import { Request, Response } from 'express';
import Resume from '../models/resumeModel';
import { parsePdf } from '../services/pdfParserService';
import { analyzeResumeWithAI } from '../services/geminiService'; // <-- UPDATED IMPORT
import { fetchRelevantJobs } from '../services/jobApiService';

export const uploadResume = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated.' });
    }

    try {
        // 1. Parse PDF to text
        const extractedText = await parsePdf(req.file.path);
        if (!extractedText) {
            return res.status(500).json({ message: 'Could not extract text from PDF.' });
        }

        // 2. Analyze with AI
        const analysis = await analyzeResumeWithAI(extractedText);

        // 3. Save to database
        const resume = new Resume({
            user: req.user._id,
            fileName: req.file.filename,
            filePath: req.file.path,
            originalName: req.file.originalname,
            extractedText,
            atsScore: analysis.atsScore,
            skills: analysis.skills,
            experience: analysis.experience,
            qualifications: analysis.qualifications,
            analysis: {
                summary: analysis.summary,
                strengths: analysis.strengths,
                improvements: analysis.improvements,
            }
        });
        await resume.save();

        // 4. Respond to client
        res.status(201).json({
            message: 'Resume uploaded and analyzed successfully.',
            resumeId: resume._id,
        });

    } catch (error: any) {
        console.error('Upload process failed:', error);
        res.status(500).json({ message: 'An error occurred during the resume analysis process.', error: error.message });
    }
};

export const getResumeResults = async (req: Request, res: Response) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Check if the user owns the resume
        if (resume.user.toString() !== req.user?._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this resume' });
        }

        res.json(resume);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserResumes = async (req: Request, res: Response) => {
    try {
        const resumes = await Resume.find({ user: req.user?._id }).sort({ createdAt: -1 });
        res.json(resumes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};