"use client";

import React, { useState, useEffect } from "react";
import { useSupabaseData } from "@/lib/useSupabaseData";
import { useToast } from "@/lib/ToastContext";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";

interface Transaction {
  id: string;
  student_id: string;
  amount: number;
  type: "payment" | "charge" | "scholarship" | "refund";
  description: string;
  date: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  payment_method?: string;
  reference_number?: string;
  category: string;
}

interface FinancialSummary {
  id: string;
  student_id: string;
  total_charges: number;
  total_payments: number;
  total_scholarships: number;
  total_refunds: number;
  balance_due: number;
  next_payment_date?: string;
  next_payment_amount?: number;
  payment_plan?: string;
  academic_year: string;
  semester: string;
}

/**
 * FinancialDashboard Component
 *
 * Displays student financial information:
 * - Account summary
 * - Transaction history
 * - Payment options
 * - Financial aid information
 *
 * @param studentId - The ID of the student to display financial data for
 */
export default function FinancialDashboard({
  studentId,
}: {
  studentId: string;
}) {
  const [activeTab, setActiveTab] = useState<
    "summary" | "transactions" | "payment"
  >("summary");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null);
  const { showToast } = useToast();

  // Fetch financial summary data
  const {
    data: summaryData,
    loading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useSupabaseData<FinancialSummary>({
    table: "financial_summaries",
    match: { student_id: studentId },
    limit: 1,
  });

  // Fetch transaction history
  const {
    data: transactionsData,
    loading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useSupabaseData<Transaction>({
    table: "financial_transactions",
    match: { student_id: studentId },
    order: { column: "date", ascending: false },
  });

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle payment submission with optimistic UI updates
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !paymentAmount ||
      isNaN(parseFloat(paymentAmount)) ||
      parseFloat(paymentAmount) <= 0
    ) {
      alert("Please enter a valid payment amount");
      return;
    }

    setIsSubmitting(true);

    // Get the payment amount as a number
    const amount = parseFloat(paymentAmount);

    // Create optimistic transaction data
    const tempTransactionId = `temp-${Date.now()}`;
    const paymentDate = new Date().toISOString();

    // Create optimistic transaction
    const optimisticTransaction: Transaction = {
      id: tempTransactionId,
      student_id: studentId,
      amount: amount,
      type: "payment",
      description: `Payment via ${paymentMethod}`,
      date: paymentDate,
      status: "pending",
      payment_method: paymentMethod,
      reference_number: `REF-${Date.now().toString().slice(-8)}`,
      category: "Tuition Payment",
    };

    // Create optimistic summary update
    let optimisticSummary: FinancialSummary | null = null;
    if (summaryData && summaryData[0]) {
      optimisticSummary = {
        ...summaryData[0],
        total_payments: summaryData[0].total_payments + amount,
        balance_due: summaryData[0].balance_due - amount,
      };
    }

    // Apply optimistic updates locally
    if (transactionsData) {
      // Add the new transaction to the UI immediately
      const updatedTransactions = [optimisticTransaction, ...transactionsData];

      // In a real app with proper state management, we would:
      // 1. Update the local state with the optimistic changes
      // 2. Show a toast notification to inform the user
      showToast("Payment processing - transaction added", "info");

      // For demonstration purposes, we'll also show a success toast
      // when the optimistic update is applied
      if (optimisticSummary) {
        showToast(
          `Balance updated: ${formatCurrency(optimisticSummary.balance_due)}`,
          "success"
        );
      }
    }

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, this would call an API to process the payment
      // For demo purposes, we'll just simulate a successful payment

      // Mock successful payment
      setPaymentSuccess(true);

      // Show success toast
      showToast("Payment processed successfully!", "success");

      // Reset form
      setPaymentAmount("");

      // Refetch data to show updated balances
      // In a real app with proper state management, we would:
      // 1. Update the local state with the optimistic changes immediately
      // 2. Make the API call to process the payment
      // 3. On success, confirm the changes or update with server response
      // 4. On failure, revert the optimistic changes
      refetchSummary();
      refetchTransactions();

      // Reset success message after 5 seconds
      setTimeout(() => {
        setPaymentSuccess(null);
      }, 5000);
    } catch (error) {
      setPaymentSuccess(false);
      console.error("Payment error:", error);

      // Show error toast
      showToast("Payment processing failed. Please try again.", "error");

      // In a real app, we would revert the optimistic updates here
      refetchSummary();
      refetchTransactions();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get status color class
  const getStatusColorClass = (status: string): string => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  // Get transaction type color class
  const getTypeColorClass = (type: string): string => {
    switch (type) {
      case "payment":
        return "text-green-600 dark:text-green-400";
      case "charge":
        return "text-red-600 dark:text-red-400";
      case "scholarship":
        return "text-blue-600 dark:text-blue-400";
      case "refund":
        return "text-purple-600 dark:text-purple-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  // Get transaction amount with sign
  const getAmountWithSign = (transaction: Transaction): string => {
    const amount = transaction.amount;
    if (
      transaction.type === "payment" ||
      transaction.type === "scholarship" ||
      transaction.type === "refund"
    ) {
      return formatCurrency(amount);
    } else {
      return `-${formatCurrency(amount)}`;
    }
  };

  // Handle loading and error states
  if (summaryLoading)
    return <Loading size="medium" message="Loading financial data..." />;
  if (summaryError)
    return (
      <ErrorMessage message={`Error loading financial data: ${summaryError}`} />
    );

  // Get financial summary
  const summary = summaryData && summaryData[0];

  return (
    <div className="financial-dashboard">
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button
              type="button"
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "summary"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("summary")}
            >
              Account Summary
            </button>
            <button
              type="button"
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "transactions"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              Transaction History
            </button>
            <button
              type="button"
              className={`py-4 px-6 font-medium text-sm ${
                activeTab === "payment"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("payment")}
            >
              Make a Payment
            </button>
          </nav>
        </div>
      </div>

      {/* Account Summary Tab */}
      {activeTab === "summary" && summary && (
        <div className="account-summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4">Current Balance</h3>
              <div className="text-3xl font-bold mb-2">
                {formatCurrency(summary.balance_due)}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {summary.academic_year} - {summary.semester}
              </p>
              {summary.next_payment_date && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-md">
                  <p className="text-sm">
                    <span className="font-medium">Next Payment Due:</span>{" "}
                    {formatDate(summary.next_payment_date)}
                  </p>
                  {summary.next_payment_amount && (
                    <p className="text-sm">
                      <span className="font-medium">Amount:</span>{" "}
                      {formatCurrency(summary.next_payment_amount)}
                    </p>
                  )}
                </div>
              )}
              <button
                type="button"
                className="mt-4 btn btn-primary"
                onClick={() => setActiveTab("payment")}
              >
                Make a Payment
              </button>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4">Account Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Charges:</span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    {formatCurrency(summary.total_charges)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Payments:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(summary.total_payments)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Scholarships & Aid:</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {formatCurrency(summary.total_scholarships)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Refunds:</span>
                  <span className="font-medium text-purple-600 dark:text-purple-400">
                    {formatCurrency(summary.total_refunds)}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Balance Due:</span>
                  <span
                    className={
                      summary.balance_due > 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }
                  >
                    {formatCurrency(summary.balance_due)}
                  </span>
                </div>
              </div>
              {summary.payment_plan && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-md">
                  <p className="text-sm">
                    <span className="font-medium">Payment Plan:</span>{" "}
                    {summary.payment_plan}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Tab */}
      {activeTab === "transactions" && (
        <div className="transaction-history">
          <h3 className="text-xl font-bold mb-4">Transaction History</h3>

          {transactionsLoading ? (
            <Loading size="medium" message="Loading transactions..." />
          ) : transactionsError ? (
            <ErrorMessage
              message={`Error loading transactions: ${transactionsError}`}
            />
          ) : !transactionsData || transactionsData.length === 0 ? (
            <div className="card p-4">
              <p>No transaction history available.</p>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table
                  id="transactions-table"
                  className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                >
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {transactionsData.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {transaction.description}
                          {transaction.reference_number && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Ref: {transaction.reference_number}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {transaction.category}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getTypeColorClass(
                            transaction.type
                          )}`}
                        >
                          {getAmountWithSign(transaction)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusColorClass(
                              transaction.status
                            )}`}
                          >
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Make a Payment Tab */}
      {activeTab === "payment" && summary && (
        <div className="payment-form">
          <div className="max-w-lg mx-auto">
            <h3 className="text-xl font-bold mb-4">Make a Payment</h3>

            <div className="card p-6 mb-6">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Current Balance:</span>
                <span className="font-bold">
                  {formatCurrency(summary.balance_due)}
                </span>
              </div>

              {paymentSuccess === true && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md">
                  Payment processed successfully! Your account will be updated
                  shortly.
                </div>
              )}

              {paymentSuccess === false && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md">
                  Payment processing failed. Please try again or contact
                  support.
                </div>
              )}

              <form onSubmit={handlePaymentSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="payment-amount"
                    className="block text-sm font-medium mb-1"
                  >
                    Payment Amount ($)
                  </label>
                  <input
                    type="number"
                    id="payment-amount"
                    className="form-input w-full rounded-md"
                    placeholder="Enter amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="payment-method"
                    className="block text-sm font-medium mb-1"
                  >
                    Payment Method
                  </label>
                  <select
                    id="payment-method"
                    className="form-select w-full rounded-md"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSubmitting}
                  aria-label="Submit payment"
                >
                  {isSubmitting ? (
                    <>
                      <i
                        className="fas fa-circle-notch fa-spin mr-2"
                        aria-hidden="true"
                      ></i>
                      Processing...
                    </>
                  ) : (
                    "Submit Payment"
                  )}
                </button>
              </form>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p className="mb-2">
                <i className="fas fa-info-circle mr-1"></i>
                Payments typically process within 1-2 business days.
              </p>
              <p>
                <i className="fas fa-lock mr-1"></i>
                All payment information is encrypted and secure.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
