"use client";
import { useAuth } from "@/lib/AuthContext";
import { useSupabaseData } from "@/lib/useSupabaseData";
import Loading from "@/app/components/Loading";
import ErrorMessage from "@/app/components/ErrorMessage";
import Button from "@/app/components/Button";
import Card from "@/app/components/Card";
import styles from "./student-finances.module.css";

interface StudentFinance {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: string;
}

export default function StudentFinancesPage() {
  const { user } = useAuth();
  const {
    data: finances,
    loading,
    error,
  } = useSupabaseData<StudentFinance>({
    table: "student_finances",
    match: { user_id: user?.id },
  });

  if (loading) {
    return <Loading size="large" message="Loading financial data..." />;
  }
  if (error) {
    return <ErrorMessage message={`Error loading finances: ${error}`} />;
  }
  if (!finances || finances.length === 0) {
    return <ErrorMessage message="No financial data found." />;
  }

  return (
    <div className={styles["student-finances"]}>
      <h1>Student Finances</h1>
      <table className={styles["data-table"]}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {finances.map((item: StudentFinance) => (
            <tr key={item.id}>
              <td data-label="Date">{item.date}</td>
              <td data-label="Description">{item.description}</td>
              <td data-label="Amount">₱{item.amount?.toLocaleString()}</td>
              <td data-label="Status">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Card title="Current Balance" className={styles["balance-section"]}>
        <p>
          ₱
          {finances.reduce((sum: number, item: StudentFinance) => sum + (item.amount || 0), 0).toLocaleString()}
        </p>
      </Card>
      <Button>Make a Payment</Button>
    </div>
  );
} 