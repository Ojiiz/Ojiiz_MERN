import React from 'react'
import { useAdminAuthContext } from '../../hooks/useAdminAuthContext'
import profile from '../../assets/profile.png'
import { Link } from 'react-router-dom';

const AdminTopBar = () => {
    const { ojiiz_admin } = useAdminAuthContext();

    return (
        <div className='top-bar'>
            <Link to={"/admin-profile"}>
                <div className="profile">
                    <p>{ojiiz_admin && ojiiz_admin.email}</p>
                    <img src={profile} alt="" />
                </div>
            </Link>

        </div>
    )
}

export default AdminTopBar
