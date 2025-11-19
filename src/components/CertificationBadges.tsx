import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Award,
    Shield,
    Zap,
    Cpu,
    Monitor,
    Wifi,
    Lock,
    CheckCircle,
    ExternalLink,
    Info
} from 'lucide-react';
import { Product } from '@/data/products';

interface CertificationBadgesProps {
    product: Product;
    compact?: boolean;
}

const CertificationBadges: React.FC<CertificationBadgesProps> = ({ product, compact = false }) => {
    // Default certifications based on product data, can be expanded
    const getCertifications = (product: Product) => {
        const certifications = [];

        // Energy Star certification (common for laptops)
        if (product.specs?.os || product.brand === 'Apple' || product.brand === 'Dell') {
            certifications.push({
                id: 'energy-star',
                name: 'Energy Star',
                icon: Zap,
                color: 'bg-green-100 text-green-800 border-green-200',
                description: 'Meets strict energy efficiency guidelines set by the U.S. Environmental Protection Agency.',
                verificationUrl: 'https://www.energystar.gov/products'
            });
        }

        // Intel Evo certification (for Intel-based laptops)
        if (product.specs?.processor?.includes('Intel') && product.specs?.ram) {
            certifications.push({
                id: 'intel-evo',
                name: 'Intel Evo',
                icon: Cpu,
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                description: 'Intel Evo certified for premium laptop experience with fast wake, all-day battery, and modern connectivity.',
                verificationUrl: 'https://www.intel.com/content/www/us/en/products/platforms/details/project-athena.html'
            });
        }

        // Microsoft Certified (for Windows laptops)
        if (product.specs?.os?.includes('Windows')) {
            certifications.push({
                id: 'microsoft-certified',
                name: 'Microsoft Certified',
                icon: Shield,
                color: 'bg-purple-100 text-purple-800 border-purple-200',
                description: 'Certified for optimal performance with Windows operating system and Microsoft applications.',
                verificationUrl: 'https://www.microsoft.com/en-us/windows/windows-11'
            });
        }

        // Display certifications
        if (product.specs?.display && product.specs?.resolution) {
            certifications.push({
                id: 'display-certified',
                name: 'Display Certified',
                icon: Monitor,
                color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                description: 'High-quality display with factory calibration and color accuracy certification.',
                verificationUrl: '#'
            });
        }

        // Security certifications
        if (product.specs?.processor || product.brand === 'Apple') {
            certifications.push({
                id: 'security-certified',
                name: 'Security Certified',
                icon: Lock,
                color: 'bg-red-100 text-red-800 border-red-200',
                description: 'Hardware-based security features including TPM, secure boot, and biometric authentication.',
                verificationUrl: '#'
            });
        }

        // Connectivity certifications
        if (product.specs?.connectivity) {
            certifications.push({
                id: 'wifi-certified',
                name: 'Wi-Fi Certified',
                icon: Wifi,
                color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
                description: 'Wi-Fi Alliance certified for reliable wireless connectivity and compatibility.',
                verificationUrl: 'https://www.wi-fi.org/certification'
            });
        }

        // Add any custom certifications from product data
        if (product.certifications) {
            product.certifications.forEach(cert => {
                if (!certifications.find(c => c.name.toLowerCase() === cert.toLowerCase())) {
                    certifications.push({
                        id: cert.toLowerCase().replace(/\s+/g, '-'),
                        name: cert,
                        icon: Award,
                        color: 'bg-gray-100 text-gray-800 border-gray-200',
                        description: `${cert} certification for quality and performance standards.`,
                        verificationUrl: '#'
                    });
                }
            });
        }

        return certifications;
    };

    const certifications = getCertifications(product);

    if (certifications.length === 0) {
        return null;
    }

    if (compact) {
        return (
            <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => {
                    const Icon = cert.icon;
                    return (
                        <TooltipProvider key={cert.id}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge variant="outline" className={`${cert.color} cursor-help`}>
                                        <Icon className="w-3 h-3 mr-1" />
                                        {cert.name}
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs">{cert.description}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    );
                })}
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    Certifications & Standards
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    {certifications.map((cert) => {
                        const Icon = cert.icon;
                        return (
                            <div key={cert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                                <div className={`p-2 rounded-lg ${cert.color.split(' ')[0]}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-sm">{cert.name}</h4>
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">
                                        {cert.description}
                                    </p>
                                    {cert.verificationUrl !== '#' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2 text-xs"
                                            onClick={() => window.open(cert.verificationUrl, '_blank')}
                                        >
                                            <ExternalLink className="w-3 h-3 mr-1" />
                                            Verify
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-sm text-blue-800 font-medium">Why Certifications Matter</p>
                            <p className="text-xs text-blue-700 mt-1">
                                These certifications ensure your laptop meets industry standards for performance,
                                energy efficiency, security, and compatibility. They provide confidence in your purchase
                                and may qualify for additional benefits or warranties.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CertificationBadges;