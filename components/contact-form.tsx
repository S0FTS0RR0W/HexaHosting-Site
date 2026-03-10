"use client";

import {
  AlertCircle,
  CheckCircle,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import Form from "next/form";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate form submission delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      {isSubmitted ? (
        <div className="space-y-4 rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
          <div className="flex items-center gap-3">
            <CheckCircle className="size-6 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
              Message Sent!
            </h3>
          </div>
          <p className="text-sm text-green-800 dark:text-green-200">
            Thank you for reaching out. I&apos;ll get back to you as soon as
            possible.
          </p>
        </div>
      ) : (
        <Form
          action="/api/contact"
          method="POST"
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
        >
          {/* Name Field */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-50"
            >
              <User className="size-4" />
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full rounded-md border px-4 py-2 transition-colors placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:placeholder:text-neutral-400 ${
                errors.name
                  ? "border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-950/30 focus-visible:ring-red-500"
                  : "border-neutral-200 bg-white focus-visible:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900"
              }`}
            />
            {errors.name && (
              <p className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="size-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-50"
            >
              <Mail className="size-4" />
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`w-full rounded-md border px-4 py-2 transition-colors placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:placeholder:text-neutral-400 ${
                errors.email
                  ? "border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-950/30 focus-visible:ring-red-500"
                  : "border-neutral-200 bg-white focus-visible:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900"
              }`}
            />
            {errors.email && (
              <p className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="size-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Subject Field */}
          <div className="space-y-2">
            <label
              htmlFor="subject"
              className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-50"
            >
              <MessageSquare className="size-4" />
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              placeholder="How can we help?"
              className={`w-full rounded-md border px-4 py-2 transition-colors placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:placeholder:text-neutral-400 ${
                errors.subject
                  ? "border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-950/30 focus-visible:ring-red-500"
                  : "border-neutral-200 bg-white focus-visible:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900"
              }`}
            />
            {errors.subject && (
              <p className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="size-3" />
                {errors.subject}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-sm font-medium text-neutral-900 dark:text-neutral-50"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us more about your inquiry..."
              rows={5}
              className={`w-full resize-none rounded-md border px-4 py-2 transition-colors placeholder:text-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:placeholder:text-neutral-400 ${
                errors.message
                  ? "border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-950/30 focus-visible:ring-red-500"
                  : "border-neutral-200 bg-white focus-visible:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900"
              }`}
            />
            {errors.message && (
              <p className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="size-3" />
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </Form>
      )}
    </div>
  );
}
