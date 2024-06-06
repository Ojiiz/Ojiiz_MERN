/**
 * This function returns the authentication context from the AuthContextProvider using the useContext
 * hook in React.
 * @returns The `useAuthContext` custom hook is returning the `context` object obtained from the
 * `useContext` hook, which contains the values and functions provided by the `AuthContext` context
 * provider. If the `context` object is not defined, the hook throws an error message indicating that
 * it must be used inside an `AuthContextProvider`.
 */
import { AuthContext } from "../pages/account/context/AuthContext"
import { useContext } from "react"

export const useAuthContext = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw Error('useAuthContext must be used inside an AuthContextProvider')
    }

    return context
}