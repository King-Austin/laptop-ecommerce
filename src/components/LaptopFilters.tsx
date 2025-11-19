import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { SlidersHorizontal, X } from 'lucide-react';

interface FilterOptions {
    brands: string[];
    categories: string[];
    priceRange: [number, number];
    processors: string[];
    ram: string[];
    storage: string[];
    gpu: string[];
    screenSize: string[];
    condition: string[];
    inStock: boolean;
}

interface LaptopFiltersProps {
    filters: FilterOptions;
    onFiltersChange: (filters: FilterOptions) => void;
    onClearFilters: () => void;
    totalProducts: number;
    filteredProducts: number;
}

const LaptopFilters: React.FC<LaptopFiltersProps> = ({
    filters,
    onFiltersChange,
    onClearFilters,
    totalProducts,
    filteredProducts,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const updateFilter = (key: keyof FilterOptions, value: any) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const toggleArrayFilter = (key: keyof FilterOptions, value: string) => {
        const currentArray = filters[key] as string[];
        const newArray = currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value];
        updateFilter(key, newArray);
    };

    const activeFiltersCount =
        filters.categories.length +
        filters.ram.length +
        filters.storage.length +
        (filters.inStock ? 1 : 0);

    // Ultra-minimal filter options
    const FilterContent = () => (
        <div className="space-y-3 py-2">
            {/* Categories - Most Important */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                    {['Gaming', 'Business', 'MacBook', 'Budget'].map((cat) => {
                        const value = cat.toLowerCase();
                        const isActive = filters.categories.includes(value);
                        return (
                            <button
                                key={cat}
                                onClick={() => toggleArrayFilter('categories', value)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isActive
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'bg-secondary hover:bg-secondary/80'
                                    }`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* RAM - Quick Pills */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    RAM
                </label>
                <div className="flex gap-1.5">
                    {['8GB', '16GB', '32GB'].map((ram) => {
                        const isActive = filters.ram.includes(ram);
                        return (
                            <button
                                key={ram}
                                onClick={() => toggleArrayFilter('ram', ram)}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary hover:bg-secondary/80'
                                    }`}
                            >
                                {ram}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Storage - Quick Pills */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Storage
                </label>
                <div className="flex gap-1.5">
                    {['256GB', '512GB', '1TB'].map((storage) => {
                        const isActive = filters.storage.includes(storage);
                        return (
                            <button
                                key={storage}
                                onClick={() => toggleArrayFilter('storage', storage)}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary hover:bg-secondary/80'
                                    }`}
                            >
                                {storage}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* In Stock Toggle */}
            <button
                onClick={() => updateFilter('inStock', !filters.inStock)}
                className={`w-full py-2.5 rounded-lg text-xs font-medium transition-all ${filters.inStock
                        ? 'bg-green-500 text-white'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
            >
                {filters.inStock ? '✓ In Stock Only' : 'Show All Products'}
            </button>
        </div>
    );

    return (
        <>
            {/* Mobile: Compact Filter Bar */}
            <div className="lg:hidden sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b mb-4 -mx-4 px-4 py-2">
                <div className="flex items-center gap-2">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1">
                                <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
                                <span className="text-xs">Filters</span>
                                {activeFiltersCount > 0 && (
                                    <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">
                                        {activeFiltersCount}
                                    </Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
                            <SheetHeader className="border-b pb-3">
                                <div className="flex items-center justify-between">
                                    <SheetTitle className="text-base">Filter Laptops</SheetTitle>
                                    {activeFiltersCount > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                onClearFilters();
                                                setIsOpen(false);
                                            }}
                                            className="text-xs h-7 px-2"
                                        >
                                            Clear All
                                        </Button>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground text-left">
                                    Showing {filteredProducts} of {totalProducts} laptops
                                </p>
                            </SheetHeader>
                            <div className="overflow-y-auto h-[calc(85vh-100px)] px-1">
                                <FilterContent />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
                                <SheetClose asChild>
                                    <Button className="w-full" size="sm">
                                        View {filteredProducts} Laptops
                                    </Button>
                                </SheetClose>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {filteredProducts} laptops
                    </span>
                </div>
            </div>

            {/* Desktop: Minimal Sidebar */}
            <Card className="hidden lg:block w-full sticky top-4">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold">Filters</h3>
                        {activeFiltersCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClearFilters}
                                className="text-xs h-6 px-2"
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                        {filteredProducts} of {totalProducts} laptops
                    </p>
                    <FilterContent />
                </CardContent>
            </Card>
        </>
    );
}; export default LaptopFilters;