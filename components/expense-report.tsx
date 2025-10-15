import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Car, Utensils, Tv, Lightbulb, Heart, GraduationCap, Package, Download, FileJson, FileSpreadsheet } from "lucide-react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts"

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

  // Preparar datos para gráficos
  const pieChartData = categoryTotals.map(({ category, total }) => ({
    name: category,
    value: parseFloat(total.toFixed(2)),
  }))

  const barChartData = categoryTotals.map(({ category, total, count }) => ({
    category,
    total: parseFloat(total.toFixed(2)),
    count,
  }))

  // Datos por día (últimos 7 días)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date
  })

  const dailyExpenses = last7Days.map((date) => {
    const dayStart = new Date(date).setHours(0, 0, 0, 0)
    const dayEnd = new Date(date).setHours(23, 59, 59, 999)
    const dayTotal = expenses
      .filter((exp) => exp.timestamp >= dayStart && exp.timestamp <= dayEnd)
      .reduce((sum, exp) => sum + exp.amount, 0)
    
    return {
      date: date.toLocaleDateString("es-PE", { day: "2-digit", month: "short" }),
      total: parseFloat(dayTotal.toFixed(2)),
    }
  })

  const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#ef4444", "#6366f1", "#6b7280"]

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Función para exportar a CSV
  const exportToCSV = () => {
    const headers = ["Fecha", "Descripción", "Categoría", "Monto"]
    const rows = expenses.map((exp) => [
      new Date(exp.timestamp).toLocaleString("es-PE"),
      exp.description,
      exp.category,
      `S/ ${exp.amount.toFixed(2)}`,
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `gastos_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Función para exportar a JSON
  const exportToJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      total: total,
      totalExpenses: expenses.length,
      categories: categoryTotals,
      expenses: expenses.map((exp) => ({
        date: new Date(exp.timestamp).toISOString(),
        description: exp.description,
        category: exp.category,
        amount: exp.amount,
      })),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `gastos_${new Date().toISOString().split("T")[0]}.json`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
    <ScrollArea className="h-full">
      <div className="p-6 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold text-foreground">Reporte de Gastos</h2>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline" size="sm" className="gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              CSV
            </Button>
            <Button onClick={exportToJSON} variant="outline" size="sm" className="gap-2">
              <FileJson className="w-4 h-4" />
              JSON
            </Button>
          </div>
        </div>

        <Card className="p-6 bg-primary text-primary-foreground mb-4">
          <p className="text-sm opacity-90 mb-1">Total Gastado</p>
          <p className="text-4xl font-bold">S/ {total.toFixed(2)}</p>
          <p className="text-xs opacity-75 mt-2">{expenses.length} gastos registrados</p>
        </Card>

        {/* Resumen por categorías */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
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

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Gráfico de Pastel - Distribución por Categoría */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-4">Distribución por Categoría</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `S/ ${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Gráfico de Barras - Gastos por Categoría */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-4">Gastos por Categoría</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `S/ ${value}`} />
                <Bar dataKey="total" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Gráfico de Líneas - Tendencia Últimos 7 Días */}
          <Card className="p-4 md:col-span-2">
            <h3 className="text-sm font-semibold mb-4">Tendencia de Gastos (Últimos 7 Días)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `S/ ${value}`} />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2} name="Total Gastado" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Todos los gastos</h3>
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
        </div>
      </div>
    </ScrollArea>
  )
}
