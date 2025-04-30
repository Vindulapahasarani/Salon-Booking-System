import ServiceCard from "@/components/Services/ServiceCard";

async function fetchServices() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
    cache: "no-store",
  });
  const services = await res.json();
  return services;
}

export default async function ServicesPage() {
  const services = await fetchServices();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service: any) => (
          <ServiceCard
            key={service._id}
            name={service.name}
            description={service.description}
            price={service.price}
            imageUrl={service.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
