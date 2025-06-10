import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';


const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [markingAllRead, setmarkingAllRead] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const token = localStorage.getItem('userToken'); // Get the token from localStorage
    const dropdownRef = useRef(null); // Ref for the dropdown
    const navigate = useNavigate();


    // Axios instance with base URL and headers
    const api = axios.create({
        baseURL: 'https://careview.runasp.net/api',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    // Fetch notifications from the API
    const fetchNotifications = async () => {
        try {
            const response = await api.get('/Notifications');
            setNotifications(response.data);

            console.log(notifications);

        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Mark a notification as read
    const markAsRead = async (id) => {
        try {
            const response = await api.put(`/Notifications/MarkAsRead/${id}`);

            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification.notificationId === id ? { ...notification, status: 0 } : notification
                )
            );

        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };




    // Fetch notifications on component mount
    useEffect(() => {
        fetchNotifications();
    }, []);

    // Handle click outside to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);



    return (
        <div className="relative z-50" ref={dropdownRef}>
            {/* Notification Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-full hover:bg-blueblack focus:outline-none relative transition-all"
            >
                <div className="bg-primary hover:bg-primary-dark p-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ">
                    <span className="text-xl text-third"><Icon icon="solar:bell-bold" width="28" height="28" /></span>
                </div>
                {notifications.filter((notification) => !notification.read).length > 0 && (
                    <span className="absolute flex justify-center items-center top-4 right-4 bg-red-500 aspect-square text-white text-xs rounded-full min-h-4">
                        {notifications.filter((notification) => notification.status === 1).length}
                    </span>
                )}
                {isOpen && (
                    <div className="absolute top-14 right-2 -translate-y-1 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-white"></div>
                )}
            </button>

            {/* Notification Dropdown */}
            <div
                className={`absolute z-50 top-18 right-0 bg-white dark:bg-dark2 border-gray-200 rounded-lg shadow-lg w-60 md:w-80 ${isOpen ? 'h-96 border' : 'h-0'
                    } flex flex-col-reverse overflow-hidden border-t-0 transition-all`}
            >
                <div className="overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex justify-center items-center h-full capitalize text-black dark:text-secondary">
                            No notifications found
                        </div>
                    ) : (
                        notifications.map((notification) =>
                        (
                            <div
                                key={notification.id}
                                onClick={() => {
                                    markAsRead(notification.id);
                                }}
                                className={`p-4 cursor-pointer border-b border-gray-200 ${notification.read === 0
                                    ? 'bg-blue-100 hover:bg-blue-100 dark:hover:bg-white dark:hover:bg-opacity-5 dark:bg-dark1'
                                    : 'bg-white dark:hover:bg-white dark:hover:bg-opacity-10 dark:bg-dark2 hover:bg-gray-50'
                                    } flex flex-col justify-between text-start`}
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-secondary">
                                        {notification.status === 1 && (
                                            <div className="h-2 w-2 bg-red-500 inline-block me-2 rounded-full"></div>
                                        )}
                                        {notification.message}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center space-x-2">
                                    <small className="text-xs text-gray-500">
                                        {new Date(notification.deliveredAt).toLocaleString()}
                                    </small>
                                    <div className="flex justify-end gap-2">
                                        {notification.status === 1 && (
                                            <button
                                                onClick={(e) => {
                                                    markAsRead(notification.notificationId);
                                                    e.stopPropagation();
                                                }}
                                                className="text-xs text-blue-500 hover:text-blue-700"
                                            >
                                                <Icon icon="mdi:eye" width="24" height="24" />
                                            </button>
                                        )}


                                    </div>
                                </div>
                            </div>
                        )
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;