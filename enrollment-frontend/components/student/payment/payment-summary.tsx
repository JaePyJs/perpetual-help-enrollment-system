"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function PaymentSummary() {
  const faqs = [
    {
      question: "When is my payment due?",
      answer:
        "Your payment is due on June 15, 2023. Late payments will incur a 5% penalty fee on the outstanding balance.",
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept credit/debit cards (Visa, Mastercard, JCB), bank transfers, and e-wallets (GCash, PayMaya).",
    },
    {
      question: "Can I pay in installments?",
      answer:
        "Yes, we offer semestral, quarterly, and monthly payment plans. Please visit the Registrar's Office to set up an installment plan.",
    },
    {
      question: "How do I get a receipt for my payment?",
      answer:
        "Receipts are automatically generated and emailed to your school email address. You can also download them from the Payment History section.",
    },
    {
      question: "What if I'm eligible for a scholarship or financial aid?",
      answer:
        "If you're eligible for a scholarship or financial aid, please submit the required documentation to the Financial Aid Office. Once approved, your account will be updated accordingly.",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>Frequently asked questions about payments</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
