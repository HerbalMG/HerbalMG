import React from 'react'
import ProfileForm from '../components/ProfileForm'

const UserProfile = () => {
  return (
    <div className="min-h-screen">
      <header className=" text-black p-4 text-center text-4xl font-bold">
        My Account
      </header>
      <main>
        <ProfileForm />
      </main>
    </div>
  )
}

export default UserProfile