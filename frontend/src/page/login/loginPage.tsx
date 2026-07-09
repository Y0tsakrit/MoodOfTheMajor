import React from 'react'

function LoginPage() {
  return (
    <div className='flex justify-center items-center bg-gray-100 shadow-md p-8 min-h-screen'>
        <div className='flex flex-col justify-center items-center bg-white shadow-md p-8 border rounded-lg w-[35%]'>
            <form className='flex flex-col justify-center items-center w-full'>
                <h1 className='mb-6 font-bold text-3xl'>Login</h1>
                <input type="text" placeholder='Username' className='mb-4 p-2 border border-gray-300 rounded-md w-full' />
                <input type="password" placeholder='Password' className='mb-4 p-2 border border-gray-300 rounded-md w-full' />
                <button type="submit" className='bg-blue-500 hover:bg-blue-600 p-2 rounded-md w-full text-white'>Login</button>
            </form>
            <p className='mt-4 text-gray-500 text-sm'>Don't have an account? <a href="/register" className='text-blue-500 hover:underline'>Register</a></p>
        </div>
    </div>
  )
}

export default LoginPage