import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function MyDignoses() {


    const [appointments, setappointments] = useState([])
    const [loading, setloading] = useState(false)
    const [error, seterror] = useState(null)

    async function getAppointments() {
        try {
            setloading(true)
            const response = await axios.get('https://careview.runasp.net/api/Appointment/GetAppointmentsForUser')
            console.log(response);
            setappointments(response)
            seterror(false)
        } catch (error) {
            toast.error(error.response.data.message || 'Something went wrong')
            seterror(true)
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        getAppointments()
    }, [])



    if (loading) {
        return <div className="flex items-center justify-center h-screen">loading...</div>
    }
    if (error) {
        return <div className="flex items-center justify-center h-screen">error...</div>
    }
    return <>
        <div className="flex flex-col p-5">
            <h1 className='text-2xl text-center font-bold'>Doctors to appoint</h1>
            {appointments.map((appointment) => {
                return (
                    <div className="p-5">
                        {/* appointment card design */}
                    </div>
                )
            })}
        </div>

    </>
}
