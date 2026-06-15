import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { Order, Product } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, ShoppingBag, Users, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';

export default function Analytics() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const oSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(100)));
        const pSnap = await getDocs(collection(db, 'products'));
        
        setOrders(oSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[]);
        setProducts(pSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = orders.length > 0 ? totalSales / orders.length : 0;

  // Process data for charts
  const salesByDate = orders.reduce((acc: any, o) => {
    const date = new Date(o.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + o.total;
    return acc;
  }, {});

  const salesData = Object.entries(salesByDate).map(([date, amount]) => ({ date, amount })).reverse();

  const categoryData = products.reduce((acc: any, p) => {
    acc[p.categoryName] = (acc[p.categoryName] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) return <div className="p-20 text-center text-slate-400">Gleaning insights from data...</div>;

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Gross Revenue', value: `৳${totalSales.toLocaleString()}`, icon: TrendingUp, color: 'text-green-400' },
          { label: 'Avg Order Value', value: `৳${avgOrderValue.toFixed(2)}`, icon: CreditCard, color: 'text-blue-400' },
          { label: 'Total Orders', value: orders.length.toString(), icon: ShoppingBag, color: 'text-purple-400' },
          { label: 'Product Range', value: products.length.toString(), icon: Users, color: 'text-orange-400' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-800 p-8 rounded-3xl border border-slate-700"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-opacity-10 ${stat.color} bg-current`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{stat.label}</p>
            <p className="text-3xl font-display font-bold text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 space-y-8">
          <h3 className="text-xl font-display font-bold text-white">Sales Performance</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#16a34a' }}
                />
                <Line type="monotone" dataKey="amount" stroke="#16a34a" strokeWidth={3} dot={{ r: 4, fill: '#16a34a' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 space-y-8">
          <h3 className="text-xl font-display font-bold text-white">Inventory Mix</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {pieData.map((d, i) => (
               <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] text-slate-400 font-bold uppercase truncate">{d.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
