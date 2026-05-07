import {
  FolderLock,
  PrinterIcon,
  Clock,
  FileText,
  Bell,
  HardDrive,
} from "lucide-react";

const features = [
  {
    icon: FolderLock,
    title: "Private Folder",
    description:
      "Your documents stay completely private and safe. Only you can see and manage them.",
  },
  {
    icon: PrinterIcon,
    title: "Print Queue",
    description:
      "Move documents to the print queue with one click. Admins handle the rest.",
  },
  {
    icon: Clock,
    title: "Auto-Delete",
    description:
      "Documents in the print queue auto-delete after 24 hours for your privacy and security.",
  },
  {
    icon: FileText,
    title: "File Support",
    description:
      "Upload PDF, DOCX, JPG, and PNG files. All common document formats supported.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description:
      "Get notified instantly when your document has been printed and is ready for pickup.",
  },
  {
    icon: HardDrive,
    title: "Document Storage",
    description:
      "Save your documents safely in your private folder. Never lose an important file again.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-24">
      <div className="mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="font-bold text-slate-900 text-3xl md:text-4xl">
            Everything You Need
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Ucomp is built to make document printing and storage simple,
            private, and stress-free.
          </p>
        </div>

        {/* Features Grid */}
        <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-slate-50 hover:shadow-md p-6 border rounded-2xl transition-shadow"
              >
                <div className="flex justify-center items-center bg-slate-900 mb-4 rounded-xl w-12 h-12">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900 text-lg">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
