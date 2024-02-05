import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useStore } from '../../context/store'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useStore((state) => state.login)
  const user = useStore((state) => state.user)
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:4000/api/user/login', {email, password})
      login(response.data)
      navigate('/home')
    } catch (error) {
      console.log(error);
      setError(error.response.data.error)
    }
  }

  useEffect(()=>{
    if (user) {
      navigate('/home')
    }
    if (error) {
      setTimeout(() => {
        setError(() => setError(''))
      }, 3000);
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
            <p className='text-lg mb-4'>SignIn / Login</p>
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
                type='text'
                value={email}
                placeholder='email'
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='mb-6'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='password'
              >
                Password
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='password'
                type='password'
                value={password}
                placeholder='********'
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && ( <p className='text-red-500 italic'>{error}</p>) }

            <div className='flex items-center justify-between'>
              <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                type='submit'
              >
                Sign In
              </button>
              
            </div>
            <span className='flex gap-2 mt-2'>Don't have an account?<Link to="/signup" className='text-blue-500 underline underline-offset-2'>Singup</Link></span>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Login
