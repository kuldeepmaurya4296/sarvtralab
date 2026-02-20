'use client';

import { Edit, Trash2, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface PlanCardGridProps {
    plans: any[];
    onView?: (plan: any) => void;
    onEdit: (plan: any) => void;
    onDelete: (plan: any) => void;
}

export function PlanCardGrid({ plans, onEdit, onDelete }: PlanCardGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
                <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <Card className={`relative h-full flex flex-col transition-all hover:shadow-md ${plan.popular ? 'border-primary ring-1 ring-primary/20' : ''}`}>
                        {plan.popular && (
                            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                                Most Popular
                            </Badge>
                        )}
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                                    <Badge variant={plan.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                                        {plan.status}
                                    </Badge>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">{plan.price}</div>
                                    <div className="text-sm text-muted-foreground">{plan.period}</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {plan.description}
                            </p>
                            <div className="space-y-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Features</span>
                                <ul className="space-y-1">
                                    {plan.features?.slice(0, 4).map((feature: string, i: number) => (
                                        <li key={i} className="text-sm flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                            <span className="truncate">{feature}</span>
                                        </li>
                                    ))}
                                    {plan.features?.length > 4 && (
                                        <li className="text-xs text-muted-foreground italic">
                                            +{plan.features.length - 4} more features
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => onEdit(plan)}>
                                <Edit className="h-4 w-4" /> Edit
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 gap-2 text-destructive hover:text-destructive" onClick={() => onDelete(plan)}>
                                <Trash2 className="h-4 w-4" /> Delete
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
