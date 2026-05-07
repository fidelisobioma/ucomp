import {
  PrinterIcon,
  Copy,
  Camera,
  Aperture,
  FileText,
  ScanLine,
  HardDrive,
} from "lucide-react";

const services = [
  {
    icon: PrinterIcon,
    title: "Printing",
    description:
      "Black & white and colour printing for all your documents, assignments, and reports.",
  },
  {
    icon: Copy,
    title: "Photocopying",
    description:
      "Fast and accurate document duplication for any volume of copies you need.",
  },
  {
    icon: Camera,
    title: "Passport Photos",
    description:
      "Professional ID and passport photography meeting all official requirements.",
  },
  {
    icon: Aperture,
    title: "Studio Photography",
    description:
      "Professional studio photography sessions for portraits, events, and more.",
  },
  {
    icon: FileText,
    title: "Typing",
    description:
      "Fast and accurate document typing services for all your typing needs.",
  },
  {
    icon: ScanLine,
    title: "Scanning",
    description:
      "High quality document scanning to digitize and preserve your important papers.",
  },
  {
    icon: HardDrive,
    title: "File Transfer",
    description:
      "USB and email file transfer services for quick and easy file sharing.",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-slate-50 py-24">
      <div className="mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="font-bold text-slate-900 text-3xl md:text-4xl">
            Our Services
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            From printing to studio photography, Ucomp offers a full range of
            professional services to meet your needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="flex gap-4 bg-white hover:shadow-md p-6 border rounded-2xl transition-shadow"
              >
                <div className="flex justify-center items-center bg-slate-100 rounded-xl w-12 h-12 shrink-0">
                  <Icon className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-slate-900 text-base">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
