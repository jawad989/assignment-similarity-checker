import React, { useEffect, useState } from "react"
import axios from "axios"
import { useStore } from "../../context/store"
import { Link, useNavigate } from "react-router-dom"

const SignUp = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const login = useStore((state) => state.login)
  const user = useStore((state) => state.user)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    if (confirmPassword !== password) {
      setError("Passwords do not match!")
      return
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/signup",
        { email, password }
      )
      login(response.data)
      navigate("/home")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("")
      }, 3000)
    }
    if (user) {
      navigate("/home")
    }
  }, [error])

  return (
    <div className='flex'>
      <div className='bg-charcoal flex flex-1 h-screen items-end justify-start p-20'>
        <h1 className='text-5xl text-white font-bold'>
          Assignment Similarity <br /> Checker
        </h1>
      </div>

      <div className='flex-1 items-center justify-center flex'>
        <div className='w-full max-w-md'>
          <form className='bg-white px-8 pt-6 pb-8 mb-4' onSubmit={onSubmit}>
            <p className='text-lg mb-4'>SignUp / Register</p>
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='email'
              >
                Email
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='email'
                type='email'
                value={email}
                placeholder='email'
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='password'
              >
                Password
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                id='password'
                name='password'
                type='password'
                value={password}
                placeholder='********'
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='confirmPassword'
              >
                Confirm Password
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                value={confirmPassword}
                placeholder='********'
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className='text-red-500'>{error}</div>}

            <div className='flex items-center justify-between'>
              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>
                Sign Up
              </button>
            </div>
            <span className='flex gap-2 mt-2'>
              Already have an account?
              <Link
                to='/'
                className='text-blue-500 underline underline-offset-2'
              >
                Login
              </Link>
            </span>
          </form>
        </div>
      </div>
    </div>
  )
}
export default SignUp
