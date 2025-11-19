import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Lock,
    Fingerprint,
    Eye,
    Shield,
    Key,
    HardDrive,
    Wifi,
    Cpu,
    Monitor,
    Smartphone,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';
import { Product } from '@/data/products';

interface SecurityFeaturesProps {
    product: Product;
}

const SecurityFeatures: React.FC<SecurityFeaturesProps> = ({ product }) => {
    const specs = product.specs || {};

    // Determine security features based on product specs and brand
    const getSecurityFeatures = () => {
        const features = [];

        // TPM (Trusted Platform Module)
        if (specs.processor?.includes('Intel') || specs.processor?.includes('AMD') || product.brand === 'Apple') {
            features.push({
                id: 'tpm',
                name: 'TPM 2.0 Security Chip',
                icon: Shield,
                level: 'High',
                description: 'Hardware-based security chip for encryption keys and secure boot',
                benefits: ['Secure boot', 'BitLocker encryption', 'Device authentication']
            });
        }

        // Biometric authentication
        if (product.brand === 'Apple' || specs.processor?.includes('Intel') || specs.processor?.includes('AMD')) {
            features.push({
                id: 'biometric',
                name: 'Biometric Authentication',
                icon: Fingerprint,
                level: 'High',
                description: 'Fingerprint reader and/or facial recognition for secure login',
                benefits: ['Password-free login', 'Multi-factor authentication', 'Secure unlock']
            });
        }

        // Hardware encryption
        if (specs.storage?.includes('SSD') || specs.storage?.includes('NVMe')) {
            features.push({
                id: 'encryption',
                name: 'Hardware Encryption',
                icon: Lock,
                level: 'High',
                description: 'AES-256 encryption for data protection at the hardware level',
                benefits: ['Data protection', 'Secure deletion', 'Compliance ready']
            });
        }

        // Secure boot
        features.push({
            id: 'secure-boot',
            name: 'Secure Boot',
            icon: Key,
            level: 'Medium',
            description: 'Prevents unauthorized operating systems and malware from loading',
            benefits: ['Boot protection', 'Malware prevention', 'System integrity']
        });

        // Physical security slot
        features.push({
            id: 'physical-security',
            name: 'Physical Security Slot',
            icon: Lock,
            level: 'Medium',
            description: 'Kensington lock compatible slot for physical security',
            benefits: ['Theft prevention', 'Cable lock support', 'Asset protection']
        });

        // Webcam privacy
        if (specs.webcam) {
            features.push({
                id: 'privacy-shutter',
                name: 'Privacy Shutter',
                icon: Eye,
                level: 'Medium',
                description: 'Physical webcam cover for privacy protection',
                benefits: ['Visual privacy', 'Hacking prevention', 'Peace of mind']
            });
        }

        // Firewall and network security
        features.push({
            id: 'network-security',
            name: 'Network Security',
            icon: Wifi,
            level: 'Medium',
            description: 'Built-in firewall and network protection features',
            benefits: ['Network filtering', 'Intrusion prevention', 'Safe browsing']
        });

        return features;
    };

    const securityFeatures = getSecurityFeatures();

    const getSecurityScore = () => {
        let score = 0;
        const features = securityFeatures;

        features.forEach(feature => {
            if (feature.level === 'High') score += 25;
            else if (feature.level === 'Medium') score += 15;
            else score += 10;
        });

        return Math.min(score, 100);
    };

    const securityScore = getSecurityScore();

    const getSecurityLevel = (score: number) => {
        if (score >= 80) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
        if (score >= 60) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
        if (score >= 40) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
        return { level: 'Basic', color: 'text-red-600', bg: 'bg-red-100' };
    };

    const securityLevel = getSecurityLevel(securityScore);

    return (
        <div className="space-y-6">
            {/* Security Score Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        Security Score
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Overall Security Rating</span>
                            <Badge className={`${securityLevel.bg} ${securityLevel.color}`}>
                                {securityLevel.level}
                            </Badge>
                        </div>
                        <Progress value={securityScore} className="h-3" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Security Score: {securityScore}/100</span>
                            <span>{securityFeatures.length} features detected</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security Features Grid */}
            <Card>
                <CardHeader>
                    <CardTitle>Security Features</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        {securityFeatures.map((feature) => {
                            const Icon = feature.icon;
                            const levelColor = feature.level === 'High' ? 'bg-green-100 text-green-800' :
                                feature.level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800';

                            return (
                                <div key={feature.id} className="p-4 border rounded-lg space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Icon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium text-sm">{feature.name}</h4>
                                                <Badge variant="outline" className={`text-xs ${levelColor}`}>
                                                    {feature.level}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className="text-xs font-medium mb-2">Key Benefits:</h5>
                                        <div className="flex flex-wrap gap-1">
                                            {feature.benefits.map((benefit, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {benefit}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Security Best Practices */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        Security Best Practices
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <h4 className="font-medium text-blue-900 text-sm mb-1">Enable BitLocker</h4>
                                <p className="text-xs text-blue-700">
                                    Use full disk encryption to protect your data if the device is lost or stolen.
                                </p>
                            </div>

                            <div className="p-3 bg-green-50 rounded-lg">
                                <h4 className="font-medium text-green-900 text-sm mb-1">Use Biometric Login</h4>
                                <p className="text-xs text-green-700">
                                    Set up fingerprint or facial recognition for faster, more secure access.
                                </p>
                            </div>

                            <div className="p-3 bg-purple-50 rounded-lg">
                                <h4 className="font-medium text-purple-900 text-sm mb-1">Regular Updates</h4>
                                <p className="text-xs text-purple-700">
                                    Keep your operating system and security software up to date.
                                </p>
                            </div>

                            <div className="p-3 bg-red-50 rounded-lg">
                                <h4 className="font-medium text-red-900 text-sm mb-1">Strong Passwords</h4>
                                <p className="text-xs text-red-700">
                                    Use complex passwords and enable two-factor authentication.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security Warranty */}
            <Card className="border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Security Assurance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Your laptop includes comprehensive security features designed to protect your data and privacy.
                        </p>

                        <div className="grid gap-2 text-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Hardware-backed security chip</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Secure boot technology</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Data encryption capabilities</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Biometric authentication support</span>
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-800">
                                <strong>Peace of Mind:</strong> All security features are covered under warranty
                                and include free security updates for the warranty period.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SecurityFeatures;