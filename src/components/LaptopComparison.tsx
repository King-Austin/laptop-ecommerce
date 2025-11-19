import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/data/products';

interface LaptopComparisonProps {
    laptops: Product[];
    onRemoveLaptop: (laptopId: string) => void;
    onAddToCart: (laptop: Product) => void;
    onAddToWishlist: (laptop: Product) => void;
}

const LaptopComparison: React.FC<LaptopComparisonProps> = ({
    laptops,
    onRemoveLaptop,
    onAddToCart,
    onAddToWishlist,
}) => {
    if (laptops.length === 0) {
        return (
            <Card className="p-8 text-center">
                <p className="text-muted-foreground">Select laptops to compare their specifications</p>
            </Card>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const comparisonRows = [
        { label: 'Price', key: 'price', type: 'price' },
        { label: 'Brand', key: 'brand', type: 'text' },
        { label: 'Category', key: 'category', type: 'text' },
        { label: 'Rating', key: 'rating', type: 'rating' },
        { label: 'In Stock', key: 'inStock', type: 'boolean' },
        { label: 'Processor', key: 'specs.processor', type: 'spec' },
        { label: 'RAM', key: 'specs.ram', type: 'spec' },
        { label: 'Storage', key: 'specs.storage', type: 'spec' },
        { label: 'Graphics', key: 'specs.gpu', type: 'spec' },
        { label: 'Display', key: 'specs.display', type: 'spec' },
        { label: 'Screen Size', key: 'specs.screenSize', type: 'spec' },
        { label: 'Battery', key: 'specs.battery', type: 'spec' },
        { label: 'Weight', key: 'weight', type: 'text' },
        { label: 'Warranty', key: 'warranty', type: 'text' },
    ];

    const getValue = (laptop: Product, key: string) => {
        const keys = key.split('.');
        let value: any = laptop;

        for (const k of keys) {
            value = value?.[k];
        }

        return value;
    };

    const renderValue = (laptop: Product, row: any) => {
        const value = getValue(laptop, row.key);

        switch (row.type) {
            case 'price':
                return (
                    <div>
                        <div className="font-semibold text-lg">{formatPrice(value)}</div>
                        {laptop.originalPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                                {formatPrice(laptop.originalPrice)}
                            </div>
                        )}
                    </div>
                );
            case 'rating':
                return (
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{value}</span>
                        <span className="text-sm text-muted-foreground">({laptop.reviews})</span>
                    </div>
                );
            case 'boolean':
                return (
                    <Badge variant={value ? 'default' : 'secondary'}>
                        {value ? 'Yes' : 'No'}
                    </Badge>
                );
            case 'text':
            case 'spec':
                return value ? (
                    <span className="capitalize">{value}</span>
                ) : (
                    <span className="text-muted-foreground">N/A</span>
                );
            default:
                return value || <span className="text-muted-foreground">N/A</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Compare Laptops</h2>
                <p className="text-muted-foreground">{laptops.length} of 4 laptops selected</p>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-full">
                    {/* Header with laptop images and basic info */}
                    <div className="grid grid-cols-1 gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${laptops.length}, 1fr)` }}>
                        <div className=""></div>
                        {laptops.map((laptop) => (
                            <Card key={laptop.id} className="relative">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-2 right-2 z-10"
                                    onClick={() => onRemoveLaptop(laptop.id)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                                <CardHeader className="pb-2">
                                    <img
                                        src={laptop.image}
                                        alt={laptop.name}
                                        className="w-full h-32 object-cover rounded-md mb-2"
                                    />
                                    <CardTitle className="text-sm line-clamp-2">{laptop.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-2">
                                        <Button
                                            onClick={() => onAddToCart(laptop)}
                                            className="w-full"
                                            size="sm"
                                            disabled={!laptop.inStock}
                                        >
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            Add to Cart
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => onAddToWishlist(laptop)}
                                            className="w-full"
                                            size="sm"
                                        >
                                            <Heart className="w-4 h-4 mr-2" />
                                            Wishlist
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Comparison table */}
                    <Card>
                        <CardContent className="p-0">
                            {comparisonRows.map((row, index) => (
                                <div key={row.key}>
                                    <div
                                        className="grid gap-4 p-4"
                                        style={{ gridTemplateColumns: `200px repeat(${laptops.length}, 1fr)` }}
                                    >
                                        <div className="font-medium text-sm">{row.label}</div>
                                        {laptops.map((laptop) => (
                                            <div key={laptop.id} className="text-sm">
                                                {renderValue(laptop, row)}
                                            </div>
                                        ))}
                                    </div>
                                    {index < comparisonRows.length - 1 && <Separator />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {laptops.length < 4 && (
                <Card className="p-6 text-center border-dashed">
                    <p className="text-muted-foreground mb-2">
                        Add up to {4 - laptops.length} more laptop{4 - laptops.length !== 1 ? 's' : ''} to compare
                    </p>
                    <Button variant="outline" size="sm">
                        Browse Laptops
                    </Button>
                </Card>
            )}
        </div>
    );
};

export default LaptopComparison;