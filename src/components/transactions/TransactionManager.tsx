import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, MapPin, Calendar, AlertTriangle, MessageCircle } from "lucide-react";

interface Transaction {
    id: string;
    listingId: string;
    buyerId: string;
    sellerId: string;
    amount: number;
    status: "pending" | "confirmed" | "completed" | "cancelled" | "disputed";
    createdAt: string;
    updatedAt: string;
    meetingLocation?: string;
    meetingTime?: string;
    notes?: string;
}

interface TransactionManagerProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}

// Mock transaction data - this would typically come from an API
const mockTransactions = [
    {
        id: "txn_001",
        listingId: "item_001",
        buyerId: "user_001",
        sellerId: "user_002",
        amount: 85000,
        status: "confirmed" as const,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        meetingLocation: "Library - Ground Floor",
        meetingTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        notes: "MacBook Pro 2021 - Cash payment"
    },
    {
        id: "txn_002",
        listingId: "item_002",
        buyerId: "user_003",
        sellerId: "user_001",
        amount: 2500,
        status: "pending" as const,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        meetingLocation: "Cafeteria",
        meetingTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Engineering Textbooks Set - UPI payment"
    }
];

export const TransactionManager: React.FC<TransactionManagerProps> = ({
    isOpen,
    onClose,
    userId
}) => {
    const [transactions] = useState<Transaction[]>(mockTransactions);
    const [activeTab, setActiveTab] = useState<"pending" | "completed" | "all">("pending");

    const getStatusColor = (status: string) => {
        switch (status) {
            case "initiated": return "text-yellow-600 bg-yellow-50";
            case "confirmed": return "text-blue-600 bg-blue-50";
            case "completed": return "text-green-600 bg-green-50";
            case "cancelled": return "text-red-600 bg-red-50";
            case "disputed": return "text-purple-600 bg-purple-50";
            default: return "text-gray-600 bg-gray-50";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed": return <CheckCircle className="h-4 w-4" />;
            case "disputed": return <AlertTriangle className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    const handleConfirmTransaction = (transactionId: string) => {
        console.log("Confirming transaction:", transactionId);
        // In real app: API call to confirm transaction
    };

    const handleCompleteTransaction = (transactionId: string) => {
        console.log("Completing transaction:", transactionId);
        // In real app: API call to complete transaction
    };

    const filteredTransactions = transactions.filter(txn => {
        switch (activeTab) {
            case "pending": return ["pending", "confirmed"].includes(txn.status);
            case "completed": return ["completed", "cancelled", "disputed"].includes(txn.status);
            default: return true;
        }
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-xl">My Transactions</CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        ×
                    </Button>
                </CardHeader>
                <CardContent>
                    {/* Tabs */}
                    <div className="flex border-b border-border mb-6">
                        {[
                            { id: "pending", label: "Pending", count: transactions.filter(t => ["pending", "confirmed"].includes(t.status)).length },
                            { id: "completed", label: "Completed", count: transactions.filter(t => ["completed", "cancelled", "disputed"].includes(t.status)).length },
                            { id: "all", label: "All", count: transactions.length }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === tab.id
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {tab.label}
                                <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Transactions List */}
                    <div className="space-y-4">
                        {filteredTransactions.length === 0 ? (
                            <div className="text-center py-8">
                                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Transactions</h3>
                                <p className="text-muted-foreground">
                                    {activeTab === "pending" ? "No pending transactions at the moment" : "No completed transactions yet"}
                                </p>
                            </div>
                        ) : (
                            filteredTransactions.map((transaction) => (
                                <Card key={transaction.id} className="border border-border">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            {/* Transaction Icon */}
                                            <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle className="h-8 w-8 text-blue-600" />
                                            </div>
                                            
                                            {/* Transaction Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h3 className="font-semibold truncate">Transaction #{transaction.id.slice(-6)}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {transaction.sellerId === userId ? 
                                                                `Selling to Buyer` : 
                                                                `Buying from Seller`
                                                            }
                                                        </p>
                                                        {transaction.notes && (
                                                            <p className="text-sm text-muted-foreground mt-1">{transaction.notes}</p>
                                                        )}
                                                    </div>
                                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                                        {getStatusIcon(transaction.status)}
                                                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                                    <div>
                                                        <span className="font-medium">Amount: </span>
                                                        <span className="text-green-600 font-semibold">₹{transaction.amount.toLocaleString()}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Listing: </span>
                                                        <span>{transaction.listingId}</span>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Created: </span>
                                                        <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                {/* Meeting Details */}
                                                {transaction.meetingLocation && (
                                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <MapPin className="h-4 w-4 text-blue-600" />
                                                            <span className="font-medium">Meeting:</span>
                                                            <span>{transaction.meetingLocation}</span>
                                                        </div>
                                                        {transaction.meetingTime && (
                                                            <div className="flex items-center gap-2 text-sm mt-1">
                                                                <Calendar className="h-4 w-4 text-blue-600" />
                                                                <span>{new Date(transaction.meetingTime).toLocaleString()}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Action Buttons */}
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {transaction.status === "pending" && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleConfirmTransaction(transaction.id)}
                                                            className="bg-blue-600 hover:bg-blue-700"
                                                        >
                                                            Confirm Transaction
                                                        </Button>
                                                    )}

                                                    {transaction.status === "confirmed" && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleCompleteTransaction(transaction.id)}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            Mark Complete
                                                        </Button>
                                                    )}

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="flex items-center gap-1"
                                                    >
                                                        <MessageCircle className="h-3 w-3" />
                                                        Message
                                                    </Button>

                                                    {["pending", "confirmed"].includes(transaction.status) && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                                        >
                                                            Report Issue
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};