import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

export default function DoctorCard({ doctor }) {

    const [selectedAppointmentTime, setselectedAppointmentTime] = useState(null)


    function handleAppointmentTimeSelect(time) {
        setselectedAppointmentTime(time)
    }

    function bookAppointment() {
        console.log(selectedAppointmentTime)
    }

    async function createAppointment() {
        try {
            const response = await axios.post('https://careview.runasp.net/api/Appointment/CreateAppointments', {
                doctorId: doctor.id,
                time: selectedAppointmentTime
            })
        } catch (error) {
            toast.error(error.response.data.message || 'Something went wrong')

        }
    }



    return <>
        <div className="flex flex-col bg-white rounded-xl shadow-lg p-5">
            <div className="">
                {/* <img src={} alt="" /> */}
            </div>

            <h1>{doctor.firstName + ' ' + doctor.lastName}</h1>
            <h2>{doctor.bio}</h2>
            <select onChange={(e) => handleAppointmentTimeSelect(e.target.value)} name='available-times' id='available-times' >
                {doctor.availableTimes.map((time) =>
                    <option value={time}>{time}</option>)}
            </select>

            <button onClick={createAppointment} className='bg-secondary text-white p-1 rounded-lg mt-3'>Book</button>



        </div>

    </>
}
