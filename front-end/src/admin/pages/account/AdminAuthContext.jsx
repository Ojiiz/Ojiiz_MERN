
import { createContext, useReducer, useEffect } from 'react'

export const AdminAuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ojiiz_admin: action.payload }
        case 'LOGOUT':
            return { ojiiz_admin: null }
        default:
            return state
    }
}

export const AdminAuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('ojiiz_admin'))

        if (user) {
            dispatch({ type: 'LOGIN', payload: user })
        }
    }, [])

    // console.log('AuthContext state:', state)

    return (
        <AdminAuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AdminAuthContext.Provider>
    )

}