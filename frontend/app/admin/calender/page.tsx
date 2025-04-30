'use client';

import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from '@/utils/axios';
import { useAuth } from '@/utils/auth';
import { useRouter } from 'next/navigation';


interface Appointment {
  _id: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
}

const localizer = momentLocalizer(moment);

const AdminCalendarPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/');
      return;
    }

    const fetchAppointments = async () => {
      const res = await axios.get('/appointments/all');
      const eventData = res.data.map((appt: Appointment) => {
        const startDateTime = moment(`${appt.bookingDate} ${appt.bookingTime}`, 'YYYY-MM-DD hh:mm A').toDate();
        const endDateTime = moment(startDateTime).add(1, 'hours').toDate();

        return {
          id: appt._id,
          title: `${appt.serviceName} (${appt.status})`,
          start: startDateTime,
          end: endDateTime,
          allDay: false,
        };
      });

      setEvents(eventData);
    };

    fetchAppointments();
  }, [user, router]);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Booking Calendar 📅</h1>
      <div className="bg-white p-4 rounded-xl shadow-md">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
        />
      </div>
    </div>
  );
};

export default AdminCalendarPage;
