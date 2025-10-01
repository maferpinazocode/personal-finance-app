import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Expense {
  id: string
  amount: number
  description: string
  timestamp: number
}

interface ExpenseReportProps {
  expenses: Expense[]
}

export function ExpenseReport({ expenses }: ExpenseReportProps) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Aún no tienes gastos registrados.</p>
          <p className="text-sm text-muted-foreground mt-2">Comienza a chatear para agregar tus gastos.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">Reporte de Gastos</h2>
        <Card className="p-6 bg-primary text-primary-foreground">
          <p className="text-sm opacity-90 mb-1">Total Gastado</p>
          <p className="text-4xl font-bold">S/ {total.toFixed(2)}</p>
        </Card>
      </div>

      <div className="flex-1 overflow-hidden">
        <h3 className="text-lg font-semibold text-foreground mb-3">Todos los gastos ({expenses.length})</h3>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-3">
            {expenses.map((expense) => (
              <Card key={expense.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-foreground capitalize">{expense.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(expense.timestamp)}</p>
                  </div>
                  <p className="text-lg font-bold text-foreground ml-4">S/ {expense.amount.toFixed(2)}</p>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
