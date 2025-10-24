import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function About() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="bg-linear-to-br from-background via-background to-muted/30 dark:from-background dark:via-background dark:to-muted/10 py-8 md:py-16 flex-1">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                        <span className="bg-clip-text">
                            About CampusBazaar
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Your trusted marketplace for buying and selling within the KIST community
                    </p>
                </div>

                {/* Mission */}
                <Card className="mb-12">
                    <CardContent className="p-8">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-linear-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed text-center">
                            To create a safe, trusted, and convenient platform where KIST students can buy, sell, 
                            and exchange items within their college community. We believe in fostering connections, 
                            reducing waste, and helping students save money while building a stronger campus community.
                        </p>
                    </CardContent>
                </Card>

                {/* Features */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                                    <span className="text-xl">🔒</span>
                                </div>
                                <h3 className="text-xl font-bold text-foreground">Secure & Trusted</h3>
                            </div>
                            <p className="text-muted-foreground">
                                Only verified KIST students can access the platform, ensuring a safe and trusted environment for all transactions.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center">
                                    <span className="text-xl">💬</span>
                                </div>
                                <h3 className="text-xl font-bold text-foreground">Easy Communication</h3>
                            </div>
                            <p className="text-muted-foreground">
                                Built-in messaging system allows direct communication between buyers and sellers for smooth transactions.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-secondary/10 dark:bg-secondary/20 rounded-xl flex items-center justify-center">
                                    <span className="text-xl">🎓</span>
                                </div>
                                <h3 className="text-xl font-bold text-foreground">Student-Focused</h3>
                            </div>
                            <p className="text-muted-foreground">
                                Designed specifically for student needs - from textbooks to dorm essentials, everything students need.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-accent/10 dark:bg-accent/20 rounded-xl flex items-center justify-center">
                                    <span className="text-xl">💰</span>
                                </div>
                                <h3 className="text-xl font-bold text-foreground">Save Money</h3>
                            </div>
                            <p className="text-muted-foreground">
                                Get great deals on pre-owned items and sell your unused items to earn some extra cash.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Stats */}
                <Card className="mb-12">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold text-center text-foreground mb-8">
                            KIST Bazaar by the Numbers
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary mb-2">800+</div>
                                <div className="text-sm text-muted-foreground">Active Students</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">1,200+</div>
                                <div className="text-sm text-muted-foreground">Items Listed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">3,500+</div>
                                <div className="text-sm text-muted-foreground">Successful Sales</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">₹85K+</div>
                                <div className="text-sm text-muted-foreground">Money Saved</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact */}
                <Card>
                    <CardContent className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            Questions or Feedback?
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            We'd love to hear from you! Reach out to us for any questions, suggestions, or support.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button className="bg-primary hover:bg-primary/90">
                                📧 Contact Support
                            </Button>
                            <Button variant="outline">
                                💬 Join Community
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            </div>
        </div>
    );
}