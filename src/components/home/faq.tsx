import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I upload a document?",
    answer:
      "After signing in, go to your Private Folder and use the upload area to drag and drop or select your files. We support PDF, DOCX, JPG, and PNG formats.",
  },
  {
    question: "Is my document private?",
    answer:
      "Yes. Documents in your Private Folder are only accessible by you. They are never visible to admins or other users unless you move them to the Print Queue yourself.",
  },
  {
    question: "How long does a document stay in the print queue?",
    answer:
      "Documents in the Print Queue auto-delete after 24 hours. If your document is printed, the 24-hour timer resets from the time of printing. You will be notified before expiry.",
  },
  {
    question: "What file types are supported?",
    answer:
      "Ucomp currently supports PDF, DOCX, JPG, and PNG files. We plan to support more file types in the future.",
  },
  {
    question: "Can I print multiple copies?",
    answer:
      "Yes. When an admin prints your document, they can specify the number of copies. You will be notified with the exact number of copies printed.",
  },
  {
    question: "What happens after my document is printed?",
    answer:
      "You will receive an in-app notification letting you know your document has been printed. The document stays in your queue for 24 hours after printing, giving you time to request more copies. It then auto-deletes for your privacy.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-slate-50 py-24">
      <div className="mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="font-bold text-slate-900 text-3xl md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">
            Got questions? We have answers. If you can not find what you are
            looking for, feel free to contact us.
          </p>
        </div>

        {/* Accordion */}
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white px-6 border rounded-xl"
              >
                <AccordionTrigger className="py-5 font-medium text-slate-900 text-sm text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-slate-500 text-sm leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
