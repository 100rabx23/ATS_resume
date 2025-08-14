import pdf from 'pdf-parse';
import fs from 'fs';

export const parsePdf = async (filePath: string): Promise<string> => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        return data.text;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error('Failed to parse PDF file.');
    }
};