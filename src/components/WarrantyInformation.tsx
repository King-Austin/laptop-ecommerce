import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    Shield,
    Clock,
    Wrench,
    Phone,
    Mail,
    MapPin,
    CheckCircle,
    AlertTriangle,
    FileText,
    Calendar
} from 'lucide-react';
import { Product } from '@/data/products';

interface WarrantyInfoProps {
    product: Product;
}

const WarrantyInformation: React.FC<WarrantyInfoProps> = ({ product }) => {
    const warranty = product.warranty || '1 Year Manufacturer Warranty';

    const warrantyDetails = {
        '1 Year Manufacturer Warranty': {
            duration: '1 Year',
            type: 'Manufacturer',
            coverage: [
                'Hardware defects and malfunctions',
                'Manufacturing faults',
                'Component failures',
                'Power supply issues'
            ],
            exclusions: [
                'Physical damage (drops, spills)',
                'Unauthorized modifications',
                'Normal wear and tear',
                'Software issues'
            ],
            claimProcess: [
                'Contact manufacturer support',
                'Provide proof of purchase',
                'Describe the issue',
                'Ship to authorized service center'
            ],
            responseTime: '24-48 hours',
            repairTime: '7-14 business days'
        },
        '2 Year Manufacturer Warranty': {
            duration: '2 Years',
            type: 'Manufacturer',
            coverage: [
                'All 1-year coverage',
                'Extended hardware protection',
                'Battery degradation (up to 70% capacity)',
                'Display pixel defects'
            ],
            exclusions: [
                'Physical damage (drops, spills)',
                'Unauthorized modifications',
                'Normal wear and tear',
                'Software issues'
            ],
            claimProcess: [
                'Contact manufacturer support',
                'Provide proof of purchase',
                'Describe the issue',
                'On-site service available'
            ],
            responseTime: '24 hours',
            repairTime: '5-10 business days'
        },
        '3 Year Premium Warranty': {
            duration: '3 Years',
            type: 'Premium',
            coverage: [
                'All 2-year coverage',
                'Accidental damage protection',
                'Liquid spill protection',
                'Extended battery coverage',
                'Priority support'
            ],
            exclusions: [
                'Intentional damage',
                'Unauthorized modifications',
                'Extreme usage conditions'
            ],
            claimProcess: [
                '24/7 priority support line',
                'On-site service within 24 hours',
                'Loaner device provided',
                'Express repair service'
            ],
            responseTime: '4 hours',
            repairTime: '2-5 business days'
        }
    };

    const currentWarranty = warrantyDetails[warranty as keyof typeof warrantyDetails] ||
        warrantyDetails['1 Year Manufacturer Warranty'];

    const serviceCenters = [
        { city: 'Lagos', address: '123 Tech Street, Victoria Island', phone: '+234-1-234-5678' },
        { city: 'Abuja', address: '456 Innovation Way, Wuse II', phone: '+234-9-876-5432' },
        { city: 'Port Harcourt', address: '789 Digital Avenue, GRA Phase 2', phone: '+234-84-345-6789' },
        { city: 'Kano', address: '321 Computer Road, Sabon Gari', phone: '+234-64-567-8901' }
    ];

    return (
        <div className="space-y-6">
            {/* Warranty Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        Warranty Coverage
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                    {currentWarranty.duration}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    {currentWarranty.type} Warranty
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4" />
                                <span>Response Time: {currentWarranty.responseTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Wrench className="w-4 h-4" />
                                <span>Repair Time: {currentWarranty.repairTime}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium">What's Covered</h4>
                            <ul className="space-y-1">
                                {currentWarranty.coverage.map((item, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Warranty Exclusions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        Warranty Exclusions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2">
                        {currentWarranty.exclusions.map((exclusion, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                {exclusion}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm text-orange-800">
                            <strong>Important:</strong> Warranty does not cover damage from misuse, accidents,
                            or unauthorized repairs. Always use genuine parts and accessories.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Claim Process */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        How to Claim Warranty
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {currentWarranty.claimProcess.map((step, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                                    {index + 1}
                                </div>
                                <p className="text-sm">{step}</p>
                            </div>
                        ))}

                        <Separator />

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <h4 className="font-medium mb-2">Contact Support</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4" />
                                        <span>1-800-LAPTOP (24/7)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="w-4 h-4" />
                                        <span>warranty@techstore.ng</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">Required Documents</h4>
                                <ul className="text-sm space-y-1">
                                    <li>• Original purchase receipt</li>
                                    <li>• Warranty card (if provided)</li>
                                    <li>• Serial number</li>
                                    <li>• Detailed problem description</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Service Centers */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-600" />
                        Authorized Service Centers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 md:grid-cols-2">
                        {serviceCenters.map((center, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                                <h4 className="font-medium">{center.city}</h4>
                                <p className="text-sm text-muted-foreground mb-2">{center.address}</p>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4" />
                                    <span>{center.phone}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Free Pickup:</strong> Available for warranty claims in Lagos and Abuja.
                            Contact support for scheduling.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Extended Warranty Option */}
            <Card className="border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        Extend Your Protection
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Don't let your investment go unprotected. Extend your warranty for complete peace of mind.
                        </p>
                        <div className="grid gap-3 md:grid-cols-3">
                            <div className="p-3 border rounded-lg text-center">
                                <div className="font-medium">+1 Year</div>
                                <div className="text-lg font-bold text-green-600">₦25,000</div>
                                <div className="text-xs text-muted-foreground">Total protection</div>
                            </div>
                            <div className="p-3 border rounded-lg text-center">
                                <div className="font-medium">+2 Years</div>
                                <div className="text-lg font-bold text-green-600">₦45,000</div>
                                <div className="text-xs text-muted-foreground">Accidental damage</div>
                            </div>
                            <div className="p-3 border rounded-lg text-center bg-green-50">
                                <div className="font-medium">Complete Care</div>
                                <div className="text-lg font-bold text-green-600">₦75,000</div>
                                <div className="text-xs text-muted-foreground">3 years + accidents</div>
                            </div>
                        </div>
                        <Button className="w-full" variant="outline">
                            Add Extended Warranty
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default WarrantyInformation;