import React from 'react'
import { Link } from 'react-router-dom';

const FeatureJobs = ({ latestJobs, userData, handleJobClick }) => {

    return (
        <div className="more-job-section">
            {latestJobs && latestJobs.length > 0 && (
                <>
                    <h2>Newest Jobs for You</h2>
                    <p>Get the fastest application so that your name is above other applications</p>
                    <div className="more-job-row">
                        {latestJobs.map(job => (
                            <div className="more-job" key={job._id}>
                                <h3>{truncateText(job.jobTitle, 50)}</h3>
                                <p>{extractAndTruncateContent(job.jobDetail, 100)}</p>
                                {userData && userData.totalCredit - userData.usedCredit <= 0 ? (
                                    <div onClick={() => handleJobClick()}>
                                        <button>See More</button>
                                    </div>
                                ) : (
                                    <Link to={`/jobs-detail/${job._id}`}>
                                        <button>See More</button>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );

}
const truncateText = (content, maxLength) => {
    return content.length > maxLength ? `${content.slice(0, maxLength)}...` : content;
};

// Function to extract and truncate content, skipping headings
const extractAndTruncateContent = (htmlString, maxLength) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlString;
    const childNodes = tempElement.childNodes;
    let content = '';

    for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i];
        if (node.nodeName.toLowerCase().startsWith('h')) {
            continue;
        }
        if (node.textContent.trim()) {
            content += node.textContent.trim() + ' ';
        }
        if (content.length >= maxLength) {
            break;
        }
    }
    return content.length > maxLength ? `${content.slice(0, maxLength)}...` : content;
};
export default FeatureJobs
