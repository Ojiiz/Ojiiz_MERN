import { useContext, useState } from 'react'
import { AuthContext } from './AuthContext'
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useContext(AuthContext)
    const API_URL = process.env.REACT_APP_BASE_API_URL;

    const navigate = useNavigate();


    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`${API_URL}/api/ojiiz/user-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        const json = await response.json()
        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if (response.ok) {

            // save the user to local storage
            localStorage.setItem('ojiiz_user', JSON.stringify(json))

            // update the auth context
            dispatch({ type: 'LOGIN', payload: json })

            // update loading state
            setIsLoading(false)
            navigate('/');
        }
    }

    return { login, isLoading, error }
}