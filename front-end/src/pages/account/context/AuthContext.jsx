/* This code is creating an authentication context using React's `createContext` function and a reducer
function called `authReducer`. It also defines a `AuthContextProvider` component that uses
`useReducer` and `useEffect` hooks to manage the state of the authentication context. The
`AuthContextProvider` component provides the authentication state and a `dispatch` function to its
children using the `AuthContext.Provider` component. */
import { createContext, useReducer, useEffect } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ojiiz_user: action.payload }
        case 'LOGOUT':
            return { ojiiz_user: null }
        default:
            return state
    }
}

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    })

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('ojiiz_user'))

        if (user) {
            dispatch({ type: 'LOGIN', payload: user })
        }
    }, [])

    // console.log('AuthContext state:', state)

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    )

}