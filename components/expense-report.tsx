import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, Car, Utensils, Tv, Lightbulb, Heart, GraduationCap, Package } from "lucide-react"

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  timestamp: number
}

interface ExpenseReportProps {
  expenses: Expense[]
}

const categoryIcons: Record<string, any> = {
  Transporte: Car,
  Alimentación: Utensils,
  Entretenimiento: Tv,
  Servicios: Lightbulb,
  Compras: ShoppingCart,
  Salud: Heart,
  Educación: GraduationCap,
  Otros: Package,
}

const categoryColors: Record<string, string> = {
  Transporte: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Alimentación: "bg-green-500/10 text-green-600 dark:text-green-400",
  Entretenimiento: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  Servicios: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  Compras: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  Salud: "bg-red-500/10 text-red-600 dark:text-red-400",
  Educación: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  Otros: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
}

export function ExpenseReport({ expenses }: ExpenseReportProps) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Agrupar gastos por categoría
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || "Otros"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(expense)
    return acc
  }, {} as Record<string, Expense[]>)

  const categoryTotals = Object.entries(expensesByCategory).map(([category, categoryExpenses]) => ({
    category,
    total: categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    count: categoryExpenses.length,
    percentage: ((categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0) / total) * 100).toFixed(1),
  }))

  // Ordenar por total descendente
  categoryTotals.sort((a, b) => b.total - a.total)

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
        <h2 className="text-3xl font-bold text-foreground mb-4">Reporte de Gastos</h2>
        <Card className="p-6 bg-primary text-primary-foreground mb-4">
          <p className="text-sm opacity-90 mb-1">Total Gastado</p>
          <p className="text-4xl font-bold">S/ {total.toFixed(2)}</p>
          <p className="text-xs opacity-75 mt-2">{expenses.length} gastos registrados</p>
        </Card>

        {/* Resumen por categorías */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {categoryTotals.map(({ category, total: catTotal, count, percentage }) => {
            const Icon = categoryIcons[category] || Package
            const colorClass = categoryColors[category] || categoryColors.Otros
            return (
              <Card key={category} className={`p-4 ${colorClass}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" />
                  <p className="text-xs font-medium">{category}</p>
                </div>
                <p className="text-lg font-bold">S/ {catTotal.toFixed(2)}</p>
                <p className="text-xs opacity-75">{count} gastos • {percentage}%</p>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <h3 className="text-lg font-semibold text-foreground mb-3">Todos los gastos</h3>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-3">
            {expenses
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((expense) => {
                const Icon = categoryIcons[expense.category] || Package
                const colorClass = categoryColors[expense.category] || categoryColors.Otros
                return (
                  <Card key={expense.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground capitalize">{expense.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${colorClass}`}>
                            {expense.category}
                          </span>
                          <span className="text-xs text-muted-foreground">{formatDate(expense.timestamp)}</span>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-foreground">S/ {expense.amount.toFixed(2)}</p>
                    </div>
                  </Card>
                )
              })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
