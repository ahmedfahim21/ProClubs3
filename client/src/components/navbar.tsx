"use client";
import React, { useState, useEffect } from 'react';
import { CalendarDays, Clock } from 'lucide-react';

export default function Navbar() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 30000);

        return () => clearInterval(timer);
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };



    const CalendarPopover = () => {
        if (!showCalendar) return null;

        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === today.getDate();
            days.push(
                <div
                    key={day}
                    className={`p-2 text-center text-sm rounded-md cursor-pointer hover:bg-gray-700 transition-colors ${isToday ? 'bg-cyan-500 text-white font-bold' : 'text-gray-300'
                        }`}
                >
                    {day}
                </div>
            );
        }

        return (
            <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-2xl shadow-cyan-500/20 z-50 min-w-80">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                        {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-2 text-center text-xs font-medium text-gray-400">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="text-sm text-gray-400">Today</div>
                    <div className="text-cyan-400 font-medium">{formatDate(today)}</div>
                </div>
            </div>
        );
    };

    return (
        <nav className="bg-gray-900 border-b border-cyan-500 px-6 py-3.5">
            <div className="max-w-7xl mx-auto flex items-center justify-end">
                <div className="flex items-center space-x-6">
                    <div className="hidden md:flex items-center space-x-4 text-gray-300">
                        <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-cyan-500" />
                            <span className="text-sm font-mono">{formatTime(currentDateTime)}</span>
                        </div>
                        <div className="text-sm">
                            {formatDate(currentDateTime)}
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowCalendar(!showCalendar)}
                            className={`p-2 rounded-lg transition-all duration-200 ${showCalendar
                                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-cyan-400'
                                }`}
                            title="Open Calendar"
                        >
                            <CalendarDays className="w-5 h-5" />
                        </button>

                        <CalendarPopover />
                    </div>

                    {/* Mobile Date Time - shown on smaller screens */}
                    <div className="md:hidden flex items-center text-cyan-400">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm font-mono">{formatTime(currentDateTime)}</span>
                    </div>
                </div>
            </div>

            {/* Click outside to close calendar */}
            {showCalendar && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowCalendar(false)}
                ></div>
            )}
        </nav>
    );
};