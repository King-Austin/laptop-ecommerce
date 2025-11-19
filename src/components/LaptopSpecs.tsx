import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Cpu,
    HardDrive,
    Monitor,
    Battery,
    Zap,
    Palette,
    Weight,
    Wifi,
    Usb,
    Camera,
    Volume2,
    Thermometer
} from 'lucide-react';
import { Product } from '@/data/products';

interface LaptopSpecsProps {
    laptop: Product;
}

const LaptopSpecs: React.FC<LaptopSpecsProps> = ({ laptop }) => {
    const specs = laptop.specs || {};

    const getPerformanceScore = () => {
        // Simple scoring algorithm based on specs
        let score = 0;

        if (specs.processor?.includes('i9') || specs.processor?.includes('Ryzen 9') || specs.processor?.includes('M3')) score += 25;
        else if (specs.processor?.includes('i7') || specs.processor?.includes('Ryzen 7') || specs.processor?.includes('M2')) score += 20;
        else if (specs.processor?.includes('i5') || specs.processor?.includes('Ryzen 5') || specs.processor?.includes('M1')) score += 15;
        else score += 10;

        if (specs.ram?.includes('32GB') || specs.ram?.includes('64GB')) score += 25;
        else if (specs.ram?.includes('16GB')) score += 20;
        else if (specs.ram?.includes('8GB')) score += 15;
        else score += 10;

        if (specs.gpu?.includes('RTX 4080') || specs.gpu?.includes('RTX 4070')) score += 25;
        else if (specs.gpu?.includes('RTX 4060') || specs.gpu?.includes('RTX 3060')) score += 20;
        else if (specs.gpu?.includes('RTX') || specs.gpu?.includes('GTX')) score += 15;
        else score += 10;

        if (specs.storageType === 'SSD') score += 25;
        else if (specs.storageType === 'Hybrid') score += 15;
        else score += 10;

        return Math.min(score, 100);
    };

    const performanceScore = getPerformanceScore();

    const specItems = [
        {
            icon: Cpu,
            label: 'Processor',
            value: specs.processor,
            detail: specs.processorGeneration
        },
        {
            icon: HardDrive,
            label: 'Memory',
            value: specs.ram,
            detail: specs.maxRam ? `Expandable to ${specs.maxRam}` : undefined
        },
        {
            icon: HardDrive,
            label: 'Storage',
            value: specs.storage,
            detail: specs.storageType
        },
        {
            icon: Zap,
            label: 'Graphics',
            value: specs.gpu,
            detail: specs.gpuMemory
        },
        {
            icon: Monitor,
            label: 'Display',
            value: specs.display,
            detail: `${specs.screenSize || ''} ${specs.resolution || ''}`.trim()
        },
        {
            icon: Monitor,
            label: 'Display Tech',
            value: specs.displayType,
            detail: specs.refreshRate
        },
        {
            icon: Battery,
            label: 'Battery',
            value: specs.battery,
            detail: specs.batteryLife
        },
        {
            icon: Weight,
            label: 'Weight',
            value: laptop.weight,
            detail: laptop.dimensions
        }
    ];

    const additionalSpecs = [
        { icon: Palette, label: 'OS', value: specs.os },
        { icon: Wifi, label: 'Connectivity', value: specs.connectivity?.join(', ') },
        { icon: Usb, label: 'Ports', value: specs.ports?.join(', ') },
        { icon: Camera, label: 'Webcam', value: specs.webcam },
        { icon: Volume2, label: 'Audio', value: specs.audio },
        { icon: Thermometer, label: 'Cooling', value: specs.coolingSystem }
    ].filter(spec => spec.value);

    return (
        <div className="space-y-6">
            {/* Performance Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Performance Score
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Overall Performance</span>
                            <span className="text-sm font-bold">{performanceScore}/100</span>
                        </div>
                        <Progress value={performanceScore} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                            {performanceScore >= 80 ? 'Excellent for demanding tasks' :
                                performanceScore >= 60 ? 'Good for most applications' :
                                    performanceScore >= 40 ? 'Suitable for everyday use' :
                                        'Basic performance'}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Key Specifications */}
            <Card>
                <CardHeader>
                    <CardTitle>Key Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {specItems.map((spec, index) => {
                            const Icon = spec.icon;
                            return spec.value ? (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                                    <Icon className="w-5 h-5 mt-0.5 text-primary" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm">{spec.label}</div>
                                        <div className="text-sm text-foreground">{spec.value}</div>
                                        {spec.detail && (
                                            <div className="text-xs text-muted-foreground">{spec.detail}</div>
                                        )}
                                    </div>
                                </div>
                            ) : null;
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Additional Features */}
            {additionalSpecs.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Additional Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3">
                            {additionalSpecs.map((spec, index) => {
                                const Icon = spec.icon;
                                return (
                                    <div key={index} className="flex items-center gap-3 py-2">
                                        <Icon className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-medium min-w-[80px]">{spec.label}:</span>
                                        <span className="text-sm text-muted-foreground flex-1">{spec.value}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Product Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3">
                        <div className="flex justify-between">
                            <span className="font-medium">Condition</span>
                            <Badge variant={laptop.condition === 'new' ? 'default' : 'secondary'}>
                                {laptop.condition || 'New'}
                            </Badge>
                        </div>

                        {laptop.warranty && (
                            <div className="flex justify-between">
                                <span className="font-medium">Warranty</span>
                                <span className="text-sm">{laptop.warranty}</span>
                            </div>
                        )}

                        {laptop.releaseYear && (
                            <div className="flex justify-between">
                                <span className="font-medium">Release Year</span>
                                <span className="text-sm">{laptop.releaseYear}</span>
                            </div>
                        )}

                        {laptop.colors && laptop.colors.length > 0 && (
                            <div className="flex justify-between">
                                <span className="font-medium">Available Colors</span>
                                <div className="flex gap-1">
                                    {laptop.colors.map((color, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {color}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {laptop.certifications && laptop.certifications.length > 0 && (
                            <div className="space-y-2">
                                <span className="font-medium">Certifications</span>
                                <div className="flex flex-wrap gap-1">
                                    {laptop.certifications.map((cert, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {cert}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LaptopSpecs;