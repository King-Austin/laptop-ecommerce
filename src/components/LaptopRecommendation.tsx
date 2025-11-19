import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
    Lightbulb,
    Gamepad2,
    Briefcase,
    Palette,
    Code,
    GraduationCap,
    ArrowRight,
    Star,
    TrendingUp
} from 'lucide-react';
import { Product, products, priceRanges } from '@/data/products';

interface UserPreferences {
    usage: string;
    budget: number;
    portability: string;
    performance: string;
    brand: string;
    screenSize: string;
}

interface LaptopRecommendationProps {
    onRecommendationsReady: (laptops: Product[]) => void;
}

const LaptopRecommendation: React.FC<LaptopRecommendationProps> = ({ onRecommendationsReady }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [preferences, setPreferences] = useState<UserPreferences>({
        usage: '',
        budget: 1000000,
        portability: '',
        performance: '',
        brand: '',
        screenSize: ''
    });

    const usageOptions = [
        { id: 'gaming', label: 'Gaming & Entertainment', icon: Gamepad2, description: 'High-end graphics and performance' },
        { id: 'business', label: 'Business & Productivity', icon: Briefcase, description: 'Reliable and professional features' },
        { id: 'creative', label: 'Creative Work', icon: Palette, description: 'Design, video editing, and content creation' },
        { id: 'programming', label: 'Programming & Development', icon: Code, description: 'Coding, software development, and testing' },
        { id: 'student', label: 'Student & General Use', icon: GraduationCap, description: 'Note-taking, research, and light tasks' },
        { id: 'casual', label: 'Casual Use', icon: Lightbulb, description: 'Web browsing, streaming, and basic tasks' }
    ];

    const steps = [
        {
            title: 'What will you primarily use this laptop for?',
            component: (
                <div className="grid gap-3">
                    {usageOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                            <Card
                                key={option.id}
                                className={`cursor-pointer transition-colors ${preferences.usage === option.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'}`}
                                onClick={() => setPreferences(prev => ({ ...prev, usage: option.id }))}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <Icon className="w-6 h-6 text-primary" />
                                        <div>
                                            <div className="font-medium">{option.label}</div>
                                            <div className="text-sm text-muted-foreground">{option.description}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )
        },
        {
            title: 'What\'s your budget range?',
            component: (
                <div className="space-y-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                            {new Intl.NumberFormat('en-NG', {
                                style: 'currency',
                                currency: 'NGN',
                                minimumFractionDigits: 0,
                            }).format(preferences.budget)}
                        </div>
                        <div className="text-sm text-muted-foreground">Maximum budget</div>
                    </div>
                    <Slider
                        value={[preferences.budget]}
                        onValueChange={([value]) => setPreferences(prev => ({ ...prev, budget: value }))}
                        max={5000000}
                        min={200000}
                        step={100000}
                        className="w-full"
                    />
                    <div className="grid gap-2">
                        {priceRanges.map((range) => (
                            <Button
                                key={range.id}
                                variant={preferences.budget >= range.min && preferences.budget <= range.max ? 'default' : 'outline'}
                                onClick={() => setPreferences(prev => ({ ...prev, budget: range.max === Infinity ? 3000000 : range.max }))}
                                className="justify-start"
                            >
                                {range.label}
                            </Button>
                        ))}
                    </div>
                </div>
            )
        },
        {
            title: 'How important is portability?',
            component: (
                <RadioGroup value={preferences.portability} onValueChange={(value) => setPreferences(prev => ({ ...prev, portability: value }))}>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2 p-3 rounded-lg border">
                            <RadioGroupItem value="high" id="portability-high" />
                            <Label htmlFor="portability-high" className="flex-1">
                                <div className="font-medium">Very Important</div>
                                <div className="text-sm text-muted-foreground">I need a lightweight laptop for travel</div>
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg border">
                            <RadioGroupItem value="medium" id="portability-medium" />
                            <Label htmlFor="portability-medium" className="flex-1">
                                <div className="font-medium">Somewhat Important</div>
                                <div className="text-sm text-muted-foreground">I occasionally carry it around</div>
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg border">
                            <RadioGroupItem value="low" id="portability-low" />
                            <Label htmlFor="portability-low" className="flex-1">
                                <div className="font-medium">Not Important</div>
                                <div className="text-sm text-muted-foreground">It will mostly stay in one place</div>
                            </Label>
                        </div>
                    </div>
                </RadioGroup>
            )
        },
        {
            title: 'How much performance do you need?',
            component: (
                <RadioGroup value={preferences.performance} onValueChange={(value) => setPreferences(prev => ({ ...prev, performance: value }))}>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2 p-3 rounded-lg border">
                            <RadioGroupItem value="high" id="performance-high" />
                            <Label htmlFor="performance-high" className="flex-1">
                                <div className="font-medium">High Performance</div>
                                <div className="text-sm text-muted-foreground">Gaming, video editing, 3D rendering</div>
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg border">
                            <RadioGroupItem value="medium" id="performance-medium" />
                            <Label htmlFor="performance-medium" className="flex-1">
                                <div className="font-medium">Moderate Performance</div>
                                <div className="text-sm text-muted-foreground">Programming, design work, multitasking</div>
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg border">
                            <RadioGroupItem value="low" id="performance-low" />
                            <Label htmlFor="performance-low" className="flex-1">
                                <div className="font-medium">Basic Performance</div>
                                <div className="text-sm text-muted-foreground">Web browsing, documents, streaming</div>
                            </Label>
                        </div>
                    </div>
                </RadioGroup>
            )
        }
    ];

    const canProceed = () => {
        switch (currentStep) {
            case 0: return preferences.usage !== '';
            case 1: return preferences.budget > 0;
            case 2: return preferences.portability !== '';
            case 3: return preferences.performance !== '';
            default: return false;
        }
    };

    const generateRecommendations = () => {
        let scored = products.map(product => {
            let score = 0;

            // Budget scoring (40% weight)
            if (product.price <= preferences.budget) {
                const budgetRatio = product.price / preferences.budget;
                score += (1 - budgetRatio) * 40;
            } else {
                score -= 20; // Penalty for over budget
            }

            // Usage scoring (30% weight)
            const usageMatch = getUsageMatch(product, preferences.usage);
            score += usageMatch * 30;

            // Performance scoring (20% weight)
            const performanceMatch = getPerformanceMatch(product, preferences.performance);
            score += performanceMatch * 20;

            // Portability scoring (10% weight)
            const portabilityMatch = getPortabilityMatch(product, preferences.portability);
            score += portabilityMatch * 10;

            // Bonus for highly rated products
            score += (product.rating - 4) * 5;

            // Bonus for in-stock items
            if (product.inStock) score += 5;

            return { product, score };
        });

        // Sort by score and return top recommendations
        scored.sort((a, b) => b.score - a.score);
        const recommendations = scored.slice(0, 6).map(item => item.product);

        onRecommendationsReady(recommendations);
    };

    const getUsageMatch = (product: Product, usage: string): number => {
        const categoryMap: { [key: string]: string[] } = {
            gaming: ['gaming'],
            business: ['business', 'ultrabook'],
            creative: ['gaming', 'workstation', 'macbook'],
            programming: ['business', 'ultrabook', 'macbook'],
            student: ['ultrabook', 'budget', 'business'],
            casual: ['budget', 'ultrabook', 'chromebook']
        };

        const matchingCategories = categoryMap[usage] || [];
        return matchingCategories.includes(product.category) ? 1 : 0.3;
    };

    const getPerformanceMatch = (product: Product, performance: string): number => {
        const specs = product.specs || {};

        let performanceScore = 0;

        // CPU scoring
        if (specs.processor?.includes('i9') || specs.processor?.includes('Ryzen 9') || specs.processor?.includes('M3')) {
            performanceScore += 0.4;
        } else if (specs.processor?.includes('i7') || specs.processor?.includes('Ryzen 7') || specs.processor?.includes('M2')) {
            performanceScore += 0.3;
        } else if (specs.processor?.includes('i5') || specs.processor?.includes('Ryzen 5') || specs.processor?.includes('M1')) {
            performanceScore += 0.2;
        } else {
            performanceScore += 0.1;
        }

        // RAM scoring
        if (specs.ram?.includes('32GB') || specs.ram?.includes('64GB')) {
            performanceScore += 0.3;
        } else if (specs.ram?.includes('16GB')) {
            performanceScore += 0.2;
        } else if (specs.ram?.includes('8GB')) {
            performanceScore += 0.1;
        }

        // GPU scoring
        if (specs.gpu?.includes('RTX 4080') || specs.gpu?.includes('RTX 4070')) {
            performanceScore += 0.3;
        } else if (specs.gpu?.includes('RTX') || specs.gpu?.includes('GTX')) {
            performanceScore += 0.2;
        } else {
            performanceScore += 0.1;
        }

        // Match with user preference
        if (performance === 'high') return performanceScore;
        if (performance === 'medium') return Math.min(performanceScore + 0.2, 1);
        return Math.min(performanceScore + 0.4, 1); // Basic performance needs
    };

    const getPortabilityMatch = (product: Product, portability: string): number => {
        const screenSize = parseFloat(product.specs?.screenSize || '15');

        if (portability === 'high') {
            return screenSize <= 14 ? 1 : 0.3;
        } else if (portability === 'medium') {
            return screenSize <= 16 ? 0.8 : 0.6;
        } else {
            return 1; // Size doesn't matter
        }
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            generateRecommendations();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    Laptop Recommendation Wizard
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    Step {currentStep + 1} of {steps.length}
                    <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-4">{steps[currentStep].title}</h3>
                    {steps[currentStep].component}
                </div>

                <Separator />

                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                    >
                        Previous
                    </Button>

                    <Button
                        onClick={nextStep}
                        disabled={!canProceed()}
                        className="min-w-[120px]"
                    >
                        {currentStep === steps.length - 1 ? (
                            <>
                                Get Results
                                <Star className="w-4 h-4 ml-2" />
                            </>
                        ) : (
                            <>
                                Next
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default LaptopRecommendation;