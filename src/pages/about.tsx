import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, MessageCircle, Users, Wallet } from "lucide-react";

export default function About() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="bg-background py-12 md:py-20 flex-1">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                            <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
                            About CampusBazaar
                        </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                            Your exclusive and trusted marketplace for buying and selling within the KIST community.
                        </p>
                    </div>

                    {/* Mission */}
                    <div className="bg-muted/50 rounded-xl p-8 md:p-12 mb-16 text-center">
                        <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                            To create a safe, trusted, and convenient platform for KIST students to buy, sell, and exchange items. We aim to foster connections, reduce waste, and build a stronger, more sustainable campus community.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        <FeatureCard
                            icon={<ShieldCheck className="h-6 w-6 text-primary" />}
                            title="Secure & Trusted"
                            description="Only verified KIST students can join, ensuring a safe environment for all transactions."
                        />
                        <FeatureCard
                            icon={<MessageCircle className="h-6 w-6 text-primary" />}
                            title="Easy Communication"
                            description="A built-in messaging system allows for direct and smooth communication between buyers and sellers."
                        />
                        <FeatureCard
                            icon={<Users className="h-6 w-6 text-primary" />}
                            title="Student-Focused"
                            description="Designed for student needs, from textbooks and lab coats to dorm essentials and gadgets."
                        />
                        <FeatureCard
                            icon={<Wallet className="h-6 w-6 text-primary" />}
                            title="Save & Earn"
                            description="Find great deals on pre-owned items and sell your unused belongings to earn extra cash."
                        />
                    </div>

                    {/* Stats */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-center text-foreground mb-8">
                            CampusBazaar by the Numbers
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                            <StatItem value="800+" label="Active Students" />
                            <StatItem value="1,200+" label="Items Listed" />
                            <StatItem value="3,500+" label="Successful Sales" />
                            <StatItem value="₹85K+" label="Money Saved by Students" />
                        </div>
                    </div>

                    {/* Contact */}
                    <Card className="bg-linear-to-r from-primary/90 to-secondary/90 text-primary-foreground">
                        <CardContent className="p-8 text-center">
                            <h2 className="text-2xl font-bold mb-4">
                                Questions or Feedback?
                            </h2>
                            <p className="opacity-90 mb-6 max-w-xl mx-auto">
                                We'd love to hear from you! Reach out for any questions, suggestions, or support.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button variant="secondary" size="lg">
                                    Contact Support
                                </Button>
                                <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                                    Join Community
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <Card className="text-center p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
);

const StatItem = ({ value, label }: { value: string, label: string }) => (
    <div className="bg-muted/30 p-6 rounded-lg text-center">
        <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
    </div>
);