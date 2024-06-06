import React from 'react'

const SkeletonPageLoader = () => {
    return (
        <div className="job-pages-skeleton-container">
            <div className="job-pages-skeleton job-pages-skeleton-header"></div>
            {[...Array(10)].map((_, index) => (
                <div key={index} className="skeleton-job-box">
                    <div className="skeleton-icon"></div>
                    <div className="skeleton-job-description">
                        <div className="skeleton-page-title"></div>
                        <div className="skeleton-page-info"></div>
                        <div className="skeleton-page-text"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SkeletonPageLoader
