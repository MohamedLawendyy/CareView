import React, { useEffect, useState } from 'react'
import DoctorCard from './DoctorCard'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Doctors() {

    const [doctors, setdoctors] = useState([])

    let userToken = localStorage.getItem("userToken")
    async function getDoctors() {
        try {
            const response = await axios.get('https://careview.runasp.net/api/Account/doctors', {
                headers: {
                    'Authorization': `Bearer ${userToken}` // 👈 Add the token here
                }
            });
            console.log(response)
            setdoctors(response.data); // Make sure to use `response.data`
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Failed to fetch doctors');
        }
        finally {
            // staticDoctors()
        }
    }

    useEffect(() => {
        getDoctors()
    }, [])



    function staticDoctors() {
        setdoctors([
            {
                "specializtion": "string",
                "bio": "string",
                "availableTimes": [
                    "10:00 AM",
                    "12:00 PM",
                    "02:00 PM",
                    "04:00 PM",
                    "06:00 PM"
                ],
                "appointments": [
                    {
                        "id": 1,
                        "date": "2023-10-15",
                        "time": "10:00 AM",
                        "customerName": "John Doe",
                        "service": "Haircut"
                    },
                    {
                        "id": 2,
                        "date": "2023-10-16",
                        "time": "02:00 PM",
                        "customerName": "Jane Smith",
                        "service": "Manicure"
                    }
                ],
                "reviews": [],
                "firstName": "string",
                "lastName": "string",
                "address": null,
                "id": "aa3ab656-40ee-4025-b1a0-e56ab86e22e4",
                "userName": "user2",
                "normalizedUserName": "USER2",
                "email": "user2@example.com",
                "normalizedEmail": "USER2@EXAMPLE.COM",
                "emailConfirmed": false,
                "passwordHash": "AQAAAAIAAYagAAAAEN/6oE3WbM3sDbCqwuHrwRZJAI3Nj1JJNM9ylKIydqKvJPnsZZIG8EKhwVhg/VS4Hw==",
                "securityStamp": "SXOYVWNFZQVW4P3EX5WFYGOCM6WKOXEN",
                "concurrencyStamp": "06093aa3-6f18-4f25-a898-93e5b2eee551",
                "phoneNumber": "stringstrin",
                "phoneNumberConfirmed": false,
                "twoFactorEnabled": false,
                "lockoutEnd": null,
                "lockoutEnabled": true,
                "accessFailedCount": 0
            },
            {
                "specializtion": "string",
                "bio": "string",
                "availableTimes": [],
                "appointments": [],
                "reviews": [],
                "firstName": "string",
                "lastName": "string",
                "address": null,
                "id": "aa3ab656-40ee-4025-b1a0-e56ab86e22e4",
                "userName": "user2",
                "normalizedUserName": "USER2",
                "email": "user2@example.com",
                "normalizedEmail": "USER2@EXAMPLE.COM",
                "emailConfirmed": false,
                "passwordHash": "AQAAAAIAAYagAAAAEN/6oE3WbM3sDbCqwuHrwRZJAI3Nj1JJNM9ylKIydqKvJPnsZZIG8EKhwVhg/VS4Hw==",
                "securityStamp": "SXOYVWNFZQVW4P3EX5WFYGOCM6WKOXEN",
                "concurrencyStamp": "06093aa3-6f18-4f25-a898-93e5b2eee551",
                "phoneNumber": "stringstrin",
                "phoneNumberConfirmed": false,
                "twoFactorEnabled": false,
                "lockoutEnd": null,
                "lockoutEnabled": true,
                "accessFailedCount": 0
            }, {
                "specializtion": "string",
                "bio": "string",
                "availableTimes": [],
                "appointments": [],
                "reviews": [],
                "firstName": "string",
                "lastName": "string",
                "address": null,
                "id": "aa3ab656-40ee-4025-b1a0-e56ab86e22e4",
                "userName": "user2",
                "normalizedUserName": "USER2",
                "email": "user2@example.com",
                "normalizedEmail": "USER2@EXAMPLE.COM",
                "emailConfirmed": false,
                "passwordHash": "AQAAAAIAAYagAAAAEN/6oE3WbM3sDbCqwuHrwRZJAI3Nj1JJNM9ylKIydqKvJPnsZZIG8EKhwVhg/VS4Hw==",
                "securityStamp": "SXOYVWNFZQVW4P3EX5WFYGOCM6WKOXEN",
                "concurrencyStamp": "06093aa3-6f18-4f25-a898-93e5b2eee551",
                "phoneNumber": "stringstrin",
                "phoneNumberConfirmed": false,
                "twoFactorEnabled": false,
                "lockoutEnd": null,
                "lockoutEnabled": true,
                "accessFailedCount": 0
            },
            {
                "specializtion": "string",
                "bio": "string",
                "availableTimes": [],
                "appointments": [],
                "reviews": [],
                "firstName": "string",
                "lastName": "string",
                "address": null,
                "id": "aa3ab656-40ee-4025-b1a0-e56ab86e22e4",
                "userName": "user2",
                "normalizedUserName": "USER2",
                "email": "user2@example.com",
                "normalizedEmail": "USER2@EXAMPLE.COM",
                "emailConfirmed": false,
                "passwordHash": "AQAAAAIAAYagAAAAEN/6oE3WbM3sDbCqwuHrwRZJAI3Nj1JJNM9ylKIydqKvJPnsZZIG8EKhwVhg/VS4Hw==",
                "securityStamp": "SXOYVWNFZQVW4P3EX5WFYGOCM6WKOXEN",
                "concurrencyStamp": "06093aa3-6f18-4f25-a898-93e5b2eee551",
                "phoneNumber": "stringstrin",
                "phoneNumberConfirmed": false,
                "twoFactorEnabled": false,
                "lockoutEnd": null,
                "lockoutEnabled": true,
                "accessFailedCount": 0
            }
        ]
        )
    }


    return <>
        <div className="flex flex-col p-5">
            <h1 className='text-2xl text-center font-bold'>Doctors to appointment</h1>
            <div className="flex flex-wrap">
                {doctors.map((doctor) => {
                    return <div key={doctor.id} className="w-1/3 p-4"><DoctorCard doctor={doctor} /></div>
                })}
            </div>
        </div>
    </>
}
