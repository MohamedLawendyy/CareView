import React, { useEffect, useState } from 'react'
import DoctorCard from './DoctorCard'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Doctors() {
    const [doctors, setDoctors] = useState(null)
    const userToken = localStorage.getItem("userToken")

    async function getDoctors() {
        try {
            const response = await axios.get('https://careview.runasp.net/api/Account/doctors', {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });
            setDoctors(response.data);
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Failed to fetch doctors');
        }
    }

    useEffect(() => {
        getDoctors()
    }, [])

    return (
        <div className="flex flex-col p-5">
            <h1 className='text-2xl text-center font-bold mb-6'>Doctors to appointment</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {doctors && doctors.map((doctor) => (
                    <div key={doctor.id} className="w-full">
                        <DoctorCard doctor={doctor} userToken={userToken} />
                    </div>
                ))}
            </div>
        </div>
    )
}