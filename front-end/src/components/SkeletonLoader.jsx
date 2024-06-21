// SkeletonLoader.jsx

import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = () => {
    return (
        <div className="job-detail skeleton">
            <div className="skeleton-title"></div>
            <div className="job-detail-row">
                <div className="job-overview">
                    <div className="skeleton-title"></div>
                    <div className="overview-row">
                        <div className="job-overview-detail">
                            <div className="skeleton-icon"></div>
                            <span className="skeleton-text"></span>
                            <p className="skeleton-text"></p>
                        </div>
                        <div className="vertical-line"></div>
                        <div className="job-overview-detail">
                            <div className="skeleton-icon"></div>
                            <span className="skeleton-text"></span>
                            <p className="skeleton-text"></p>
                        </div>
                    </div>
                </div>
                <div className="more-detail">
                    <div className="row">
                        <div className="save-btn skeleton-icon"></div>
                        <div className='detail-btn skeleton-text'></div>
                    </div>
                    <i className="skeleton-text"></i>
                </div>
            </div>
            <div className="job-desc">
                <div className="job-desc-text">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                </div>
                <div className="hidden">
                    <div className="job-hidden">
                        <p className="skeleton-text"></p>
                        <div className="skeleton-title"></div>
                        <ul>
                            <li className="skeleton-text"></li>
                            <li className="skeleton-text"></li>
                            <li className="skeleton-text"></li>
                            <li className="skeleton-text"></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="more-job-section">
                <div className="skeleton-title"></div>
                <p className="skeleton-text"></p>
                <div className="more-job-row">
                    <div className="more-job">
                        <p className="skeleton-text"></p>
                        <button className="skeleton-text"></button>
                    </div>
                    <div className="more-job">
                        <p className="skeleton-text"></p>
                        <button className="skeleton-text"></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoader;
