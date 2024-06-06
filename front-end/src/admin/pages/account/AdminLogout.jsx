import { useAdminAuthContext } from '../../../hooks/useAdminAuthContext'

export const useLogout = () => {
    const { dispatch } = useAdminAuthContext()

    const logout = () => {
        // remove user from storage
        localStorage.removeItem('ojiiz_admin')

        // dispatch logout action
        dispatch({ type: 'LOGOUT' })
    }

    return { logout }
}