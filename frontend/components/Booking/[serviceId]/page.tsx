import BookingForm from './BookingForm';

const BookingPage = ({ params }: { params: { serviceId: string } }) => {
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Book Your Appointment</h2>
      <BookingForm serviceId={params.serviceId} />
    </div>
  );
};

export default BookingPage;
