import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config();

export const fetchRelevantJobs = async (skills: string[], title: string) => {
    const query = `${title} ${skills.slice(0, 5).join(' ')}`;
    
    const options = {
        method: 'GET',
        url: `https://${process.env.RAPIDAPI_HOST}/search`,
        params: {
            query: query,
            page: '1',
            num_pages: '1',
            country: 'US'
        },
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
            'X-RapidAPI-Host': process.env.RAPIDAPI_HOST!
        }
    };

    try {
        const response = await axios.request(options);
        return response.data.data; // The actual jobs array
    } catch (error) {
        console.error('Error fetching jobs from RapidAPI:', error);
        throw new Error('Failed to fetch job listings.');
    }
};