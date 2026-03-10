import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="container flex flex-col items-center justify-center gap-4 py-8">
      <h1 className="text-4xl font-bold">Having Issues?</h1>
      <h1 className="text-2xl font-semibold">Contact Us</h1>
      <ContactForm />
    </div>
  );
}
