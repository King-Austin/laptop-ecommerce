import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    RotateCcw,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    Phone,
    Mail,
    MapPin,
    AlertTriangle,
    FileText,
    Calendar,
    Shield
} from 'lucide-react';

interface ReturnPolicyProps {
    product?: {
        category?: string;
        price?: number;
    };
}

const ReturnPolicy: React.FC<ReturnPolicyProps> = ({ product }) => {
    const isLaptop = product?.category?.includes('laptop') || product?.category?.includes('ultrabook') ||
        product?.category?.includes('macbook') || product?.category?.includes('business');

    const returnPolicy = {
        standardReturn: {
            period: isLaptop ? '7 days' : '30 days',
            conditions: [
                'Product in original packaging',
                'All accessories and manuals included',
                'No signs of use or damage',
                'Original receipt required'
            ],
            exclusions: [
                'Opened software',
                'Personalized items',
                'Items on sale (final sale)',
                'Damaged or used products'
            ]
        },
        extendedReturn: {
            period: '30 days',
            conditions: [
                'Same as standard return',
                'Product must be resalable',
                'Return shipping label provided'
            ],
            exclusions: [
                'Items over ₦500,000',
                'Custom configurations',
                'Bulk purchases'
            ]
        },
        defectiveReturn: {
            period: '1 year',
            conditions: [
                'Product shows manufacturing defect',
                'Report within 7 days of receipt',
                'Provide photos/videos of defect',
                'Manufacturer authorization required'
            ],
            exclusions: [
                'Accidental damage',
                'Wear and tear',
                'Software issues'
            ]
        }
    };

    const returnProcess = [
        {
            step: 1,
            title: 'Contact Support',
            description: 'Call our support team or start return online',
            time: 'Within return period',
            icon: Phone
        },
        {
            step: 2,
            title: 'Get Approval',
            description: 'Receive return authorization and shipping label',
            time: '24-48 hours',
            icon: CheckCircle
        },
        {
            step: 3,
            title: 'Package Item',
            description: 'Securely package in original box with all accessories',
            time: '1-2 days',
            icon: Truck
        },
        {
            step: 4,
            title: 'Ship Back',
            description: 'Send using provided prepaid shipping label',
            time: '2-5 business days',
            icon: Truck
        },
        {
            step: 5,
            title: 'Refund Processed',
            description: 'Refund issued to original payment method',
            time: '3-5 business days',
            icon: RotateCcw
        }
    ];

    const refundMethods = [
        {
            method: 'Credit/Debit Card',
            time: '3-5 business days',
            description: 'Refund to original card'
        },
        {
            method: 'Bank Transfer',
            time: '1-2 business days',
            description: 'Direct bank transfer'
        },
        {
            method: 'Store Credit',
            time: 'Immediate',
            description: 'Credit for future purchases'
        },
        {
            method: 'Cash',
            time: 'Same day',
            description: 'Cash refund at store location'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Return Policy Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RotateCcw className="w-5 h-5 text-blue-600" />
                        Return Policy
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="default" className="bg-blue-100 text-blue-800">
                                {returnPolicy.standardReturn.period} Return Window
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                {isLaptop ? 'Electronics' : 'General'} items
                            </span>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            We want you to be completely satisfied with your purchase. If you're not happy with your
                            {isLaptop ? ' laptop' : ' item'}, you can return it within the specified period.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Return Types */}
            <div className="grid gap-4 md:grid-cols-3">
                {/* Standard Return */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Standard Return
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="text-2xl font-bold text-blue-600">
                                {returnPolicy.standardReturn.period}
                            </div>

                            <div>
                                <h4 className="font-medium text-sm mb-2">Conditions:</h4>
                                <ul className="space-y-1">
                                    {returnPolicy.standardReturn.conditions.map((condition, index) => (
                                        <li key={index} className="flex items-center gap-2 text-xs">
                                            <CheckCircle className="w-3 h-3 text-green-500" />
                                            {condition}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-medium text-sm mb-2">Exclusions:</h4>
                                <ul className="space-y-1">
                                    {returnPolicy.standardReturn.exclusions.map((exclusion, index) => (
                                        <li key={index} className="flex items-center gap-2 text-xs">
                                            <XCircle className="w-3 h-3 text-red-500" />
                                            {exclusion}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Extended Return */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Extended Return
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="text-2xl font-bold text-green-600">
                                {returnPolicy.extendedReturn.period}
                            </div>

                            <div>
                                <h4 className="font-medium text-sm mb-2">Conditions:</h4>
                                <ul className="space-y-1">
                                    {returnPolicy.extendedReturn.conditions.map((condition, index) => (
                                        <li key={index} className="flex items-center gap-2 text-xs">
                                            <CheckCircle className="w-3 h-3 text-green-500" />
                                            {condition}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-medium text-sm mb-2">Exclusions:</h4>
                                <ul className="space-y-1">
                                    {returnPolicy.extendedReturn.exclusions.map((exclusion, index) => (
                                        <li key={index} className="flex items-center gap-2 text-xs">
                                            <XCircle className="w-3 h-3 text-red-500" />
                                            {exclusion}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Defective Return */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Defective Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="text-2xl font-bold text-purple-600">
                                {returnPolicy.defectiveReturn.period}
                            </div>

                            <div>
                                <h4 className="font-medium text-sm mb-2">Conditions:</h4>
                                <ul className="space-y-1">
                                    {returnPolicy.defectiveReturn.conditions.map((condition, index) => (
                                        <li key={index} className="flex items-center gap-2 text-xs">
                                            <CheckCircle className="w-3 h-3 text-green-500" />
                                            {condition}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-medium text-sm mb-2">Exclusions:</h4>
                                <ul className="space-y-1">
                                    {returnPolicy.defectiveReturn.exclusions.map((exclusion, index) => (
                                        <li key={index} className="flex items-center gap-2 text-xs">
                                            <XCircle className="w-3 h-3 text-red-500" />
                                            {exclusion}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Return Process */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-green-600" />
                        How to Return an Item
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {returnProcess.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.step} className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium">
                                            {step.step}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Icon className="w-4 h-4 text-green-600" />
                                            <h4 className="font-medium text-sm">{step.title}</h4>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            {step.description}
                                        </p>
                                        <p className="text-xs text-blue-600">
                                            Estimated time: {step.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Refund Methods */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RotateCcw className="w-5 h-5 text-purple-600" />
                        Refund Methods & Timeline
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 md:grid-cols-2">
                        {refundMethods.map((refund, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-sm">{refund.method}</h4>
                                    <Badge variant="outline" className="text-xs">
                                        {refund.time}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {refund.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Refunds are processed after we receive and inspect the returned item.
                            Original shipping costs are not refunded unless the item is defective.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-red-600" />
                        Need Help with Returns?
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-medium text-sm mb-2">Customer Support</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4" />
                                        <span>1-800-RETURNS (24/7)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="w-4 h-4" />
                                        <span>returns@techstore.ng</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-sm mb-2">Return Centers</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4" />
                                        <span>Lagos: 123 Return Street</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="w-4 h-4" />
                                        <span>Abuja: 456 Exchange Way</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button className="w-full" variant="outline">
                                Start Return Online
                            </Button>
                            <Button className="w-full" variant="outline">
                                Track Return Status
                            </Button>
                            <Button className="w-full" variant="outline">
                                Return FAQ
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Important Notice */}
            <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-orange-900 mb-1">Important Return Information</h4>
                            <ul className="text-sm text-orange-800 space-y-1">
                                <li>• Returns must be initiated within the return window</li>
                                <li>• Items must be in original condition with all packaging</li>
                                <li>• {isLaptop ? 'Laptops' : 'Electronic items'} have a shorter return period due to hygiene and security</li>
                                <li>• Return shipping costs may apply for non-defective items</li>
                                <li>• All returns are subject to inspection upon receipt</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReturnPolicy;