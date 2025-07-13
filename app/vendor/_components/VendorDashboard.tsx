
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Helper function to format price in rupees
function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(price);
}

// Custom BarChart component
function BarChart({ data }: { data: { name: string; value: number }[] }) {
  const maxValue = Math.max(...data.map((item) => item.value));
  return (
    <div className="flex flex-col space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center">
          <div className="w-24 text-sm truncate">{item.name}</div>
          <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <div className="w-16 text-right text-sm">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

// Custom LineChart component
function LineChart({ data }: { data: { date: string; value: number }[] }) {
  const maxValue = Math.max(...data.map((item) => item.value));
  const minValue = Math.min(...data.map((item) => item.value));
  const range = maxValue - minValue || 1;

  const points = data
    .map((item, index) => {
      const x = (index / (data.length - 1)) * 300;
      const y = 150 - ((item.value - minValue) / range) * 140;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width="320" height="180" viewBox="0 0 320 180">
      <polyline fill="none" stroke="blue" strokeWidth="2" points={points} />
      {data.map((item, index) => {
        const x = (index / (data.length - 1)) * 300;
        const y = 150 - ((item.value - minValue) / range) * 140;
        return (
          <g key={index}>
            <circle cx={x} cy={y} r="4" fill="blue" />
            <text x={x} y="170" textAnchor="middle" fontSize="10">
              {item.date}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default async function AdminDashboard() {
  // Mock orderDetails data
  const orderDetails = Array.from({ length: 20 }, (_, i) => ({
    order_id: Math.floor(i / 2) + 1,
    total: Math.floor(Math.random() * 5000) + 500,
    created_at: new Date(
      Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30
    ).toISOString(),
    product_name: [
      "Paracetamol",
      "Cough Syrup",
      "Vitamin C",
      "Zinc Tablet",
      "Skin Cream",
    ][Math.floor(Math.random() * 5)],
    quantity: Math.floor(Math.random() * 5) + 1,
  }));

  const totalRevenue = orderDetails.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  const totalOrders = new Set(orderDetails.map((order) => order.order_id)).size;

  const averageOrderValue = totalRevenue / totalOrders;

  const revenueByDate = orderDetails.reduce((acc, order) => {
    const date = new Date(order.created_at).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + Number(order.total);
    return acc;
  }, {} as Record<string, number>);

  const revenueChartData = Object.entries(revenueByDate).map(
    ([date, value]) => ({
      date,
      value: Number(value),
    })
  );

  const productSales = orderDetails.reduce((acc, order) => {
    acc[order.product_name] =
      (acc[order.product_name] || 0) + Number(order.quantity);
    return acc;
  }, {} as Record<string, number>);

  const topProducts = Object.entries(productSales)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 5)
    .map(([name, value]) => ({ name, value: Number(value) }));

  return (
    <div className="space-y-4 pt-28 pl-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(totalRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(averageOrderValue)}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <LineChart data={revenueChartData} />
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <BarChart data={topProducts} />
        </CardContent>
      </Card>
    </div>
  );
}
