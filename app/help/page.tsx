
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import PublicLayout from '@/components/layout/PublicLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supportCategories, supportArticles } from '@/data/support';
import * as Icons from 'lucide-react';

const IconComponent = ({ name, className }: { name: string; className?: string }) => {
    const Icon = (Icons as any)[name];
    if (!Icon) return null;
    return <Icon className={className} />;
};

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filteredArticles = supportArticles.filter(article => {
        const matchesCategory = selectedCategory ? article.categoryId === selectedCategory : true;
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.summary.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <PublicLayout>
            {/* Hero */}
            <section className="pt-32 pb-20 bg-primary/5">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold mb-6"
                    >
                        How can we help you?
                    </motion.h1>
                    <div className="max-w-2xl mx-auto relative">
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for answers..."
                            className="h-14 pl-12 rounded-full text-lg shadow-sm"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6" />
                    </div>
                </div>
            </section>

            {/* Support Categories */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {supportCategories.map((category, index) => (
                            <motion.button
                                key={category.id}
                                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`text-left p-6 rounded-2xl border transition-all ${selectedCategory === category.id
                                        ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                                        : 'bg-card hover:shadow-lg hover:border-primary/50'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${selectedCategory === category.id ? 'bg-white/20' : 'bg-primary/10'
                                    }`}>
                                    <IconComponent
                                        name={category.iconName}
                                        className={`w-6 h-6 ${selectedCategory === category.id ? 'text-white' : 'text-primary'}`}
                                    />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{category.title}</h3>
                                <p className={`text-sm ${selectedCategory === category.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                                    {category.description}
                                </p>
                            </motion.button>
                        ))}
                    </div>

                    {/* Articles List */}
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold mb-8">
                            {selectedCategory
                                ? `${supportCategories.find(c => c.id === selectedCategory)?.title} Articles`
                                : searchQuery ? 'Search Results' : 'Popular Articles'}
                        </h2>

                        <div className="space-y-4">
                            {filteredArticles.length > 0 ? filteredArticles.map((article, index) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors cursor-pointer group flex justify-between items-center"
                                >
                                    <div>
                                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm mt-1">{article.summary}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                </motion.div>
                            )) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>No articles found matching your criteria.</p>
                                    <Button variant="link" onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}>
                                        Clear filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Still stuck? */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
                    <p className="text-muted-foreground mb-8">Our support team is just a click away.</p>
                    <div className="flex justify-center gap-4">
                        <Button asChild>
                            <a href="/contact">Contact Support</a>
                        </Button>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
