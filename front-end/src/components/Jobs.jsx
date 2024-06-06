import React from 'react';
import { FaBuilding } from 'react-icons/fa';
import { CiCalendar } from 'react-icons/ci';
import { formatDistanceToNow, parseISO, subHours } from 'date-fns';
import { GoDotFill } from "react-icons/go";

const Jobs = ({ job }) => {
    // Parse jobDate using parseISO to ensure it's in UTC
    const jobDate = parseISO(job.jobDate);
    // Adjust for the 5-hour difference
    const adjustedJobDate = subHours(jobDate, 5);
    // Calculate the time difference from now
    const timeAgo = formatDistanceToNow(adjustedJobDate, { addSuffix: true, includeSeconds: true });


    // Function to extract and truncate content, skipping headings
    const extractAndTruncateContent = (htmlString, maxLength) => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = htmlString;
        const childNodes = tempElement.childNodes;
        let content = '';

        for (let i = 0; i < childNodes.length; i++) {
            const node = childNodes[i];
            // Skip if it's a heading tag
            if (node.nodeName.toLowerCase().startsWith('h')) {
                continue;
            }
            // Concatenate text content if it's not empty
            if (node.textContent.trim()) {
                content += node.textContent.trim() + ' ';
            }
            // Break loop if content exceeds maxLength
            if (content.length >= maxLength) {
                break;
            }
        }

        // Truncate content to maxLength
        return content.length > maxLength ? `${content.slice(0, maxLength)}...` : content;
    };

    // Extract and truncate the content, skipping headings
    const truncatedContent = extractAndTruncateContent(job.jobDetail, 150);

    return (
        <div className="job-box">
            <FaBuilding size={72} color="#B7B7B7" />
            <div className="job-description">
                <h3>{job.jobTitle}</h3>
                <span>
                    <CiCalendar /> {timeAgo} <GoDotFill size={14} /> {job.jobCategory}
                </span>
                <p>{truncatedContent}</p>
            </div>
        </div>
    );
};

export default Jobs;
