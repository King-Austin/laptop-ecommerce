import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    TrendingUp,
    Users,
    ShoppingCart,
    DollarSign,
    Eye,
    Heart,
    Package,
    ArrowUp,
    ArrowDown
} from 'lucide-react';

interface AnalyticsData {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    conversionRate: number;
    topCategories: Array<{
        name: string;
        sales: number;
        percentage: number;
    }>;
    topBrands: Array<{
        name: string;
        sales: number;
        units: number;
    }>;
    recentTrends: Array<{
        metric: string;
        change: number;
        isPositive: boolean;
    }>;
}

const LaptopAnalyticsDashboard: React.FC = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalSales: 45000000,
        totalOrders: 287,
        averageOrderValue: 1567000,
        conversionRate: 3.2,
        topCategories: [
            { name: 'Gaming Laptops', sales: 15000000, percentage: 33.3 },
            { name: 'Business Laptops', sales: 12000000, percentage: 26.7 },
            { name: 'Ultrabooks', sales: 10000000, percentage: 22.2 },
            { name: 'MacBooks', sales: 8000000, percentage: 17.8 }
        ],
        topBrands: [
            { name: 'Dell', sales: 12000000, units: 45 },
            { name: 'ASUS', sales: 10500000, units: 38 },
            { name: 'Apple', sales: 9000000, units: 25 },
            { name: 'HP', sales: 8500000, units: 52 }
        ],
        recentTrends: [
            { metric: 'Sales Revenue', change: 12.5, isPositive: true },
            { metric: 'Conversion Rate', change: -2.1, isPositive: false },
            { metric: 'Average Order Value', change: 8.3, isPositive: true },
            { metric: 'Customer Satisfaction', change: 4.7, isPositive: true }
        ]
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const metricCards = [
        {
            title: 'Total Sales',
            value: formatCurrency(analytics.totalSales),
            icon: DollarSign,
            trend: '+12.5%',
            trendPositive: true
        },
        {
            title: 'Orders',
            value: analytics.totalOrders.toString(),
            icon: ShoppingCart,
            trend: '+8.2%',
            trendPositive: true
        },
        {
            title: 'Avg Order Value',
            value: formatCurrency(analytics.averageOrderValue),
            icon: TrendingUp,
            trend: '+8.3%',
            trendPositive: true
        },
        {
            title: 'Conversion Rate',
            value: `${analytics.conversionRate}%`,
            icon: Users,
            trend: '-2.1%',
            trendPositive: false
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Laptop Sales Analytics</h1>
                <Badge variant="secondary">Last 30 Days</Badge>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metricCards.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {metric.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metric.value}</div>
                                <p className={`text-xs flex items-center gap-1 ${metric.trendPositive ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {metric.trendPositive ? (
                                        <ArrowUp className="h-3 w-3" />
                                    ) : (
                                        <ArrowDown className="h-3 w-3" />
                                    )}
                                    {metric.trend} from last month
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Top Categories */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Selling Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.topCategories.map((category, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">{category.name}</span>
                                        <div className="text-right">
                                            <div className="text-sm font-bold">{formatCurrency(category.sales)}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {category.percentage}%
                                            </div>
                                        </div>
                                    </div>
                                    <Progress value={category.percentage} className="h-2" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Brands */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Brands</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.topBrands.map((brand, index) => (
                                <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                                    <div>
                                        <div className="font-medium">{brand.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {brand.units} units sold
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold">{formatCurrency(brand.sales)}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {formatCurrency(brand.sales / brand.units)} avg/unit
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Trends */}
            <Card>
                <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {analytics.recentTrends.map((trend, index) => (
                            <div key={index} className="text-center p-4 rounded-lg bg-muted/30">
                                <div className="text-sm font-medium mb-2">{trend.metric}</div>
                                <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {trend.isPositive ? (
                                        <ArrowUp className="h-5 w-5" />
                                    ) : (
                                        <ArrowDown className="h-5 w-5" />
                                    )}
                                    {Math.abs(trend.change)}%
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
                <CardHeader>
                    <CardTitle>AI-Powered Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                            <div className="font-medium text-blue-900">Stock Alert</div>
                            <div className="text-sm text-blue-700">
                                Gaming laptops are selling 40% faster than usual. Consider increasing inventory for ASUS ROG and MSI models.
                            </div>
                        </div>
                        <div className="p-3 rounded-lg bg-green-50 border-l-4 border-green-500">
                            <div className="font-medium text-green-900">Pricing Opportunity</div>
                            <div className="text-sm text-green-700">
                                Business laptops have 15% higher margins this month. Consider promotional campaigns for HP and Dell models.
                            </div>
                        </div>
                        <div className="p-3 rounded-lg bg-orange-50 border-l-4 border-orange-500">
                            <div className="font-medium text-orange-900">Customer Retention</div>
                            <div className="text-sm text-orange-700">
                                Conversion rate dropped 2.1%. Implement exit-intent popups and abandoned cart recovery campaigns.
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LaptopAnalyticsDashboard;