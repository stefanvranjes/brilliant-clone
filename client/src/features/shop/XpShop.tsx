import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProgress } from '../../hooks/useProgress';
import { apiService } from '../../services/api.service';
import { ShopItem } from '../../mockData';
import { Button } from '../../components/ui/Button';
import { PageTransition } from '../../components/ui/PageTransition';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const ShopItemCard = ({ item, onPurchase, isPurchased, canAfford }: {
    item: ShopItem,
    onPurchase: (id: string) => void,
    isPurchased: boolean,
    canAfford: boolean
}) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`bg-white p-6 rounded-2xl border-2 transition-all ${isPurchased ? 'border-green-100 bg-green-50/10' : 'border-gray-100'
            }`}
    >
        <div className="text-4xl mb-4">{item.icon}</div>
        <h3 className="text-xl font-black text-gray-900 mb-2">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">{item.description}</p>

        <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1 font-black text-yellow-600">
                <span>⚡</span>
                <span>{item.price}</span>
            </div>
            <Button
                size="sm"
                disabled={isPurchased || !canAfford}
                variant={isPurchased ? 'secondary' : 'primary'}
                onClick={() => onPurchase(item.id)}
            >
                {isPurchased ? 'Unlocked' : 'Buy Now'}
            </Button>
        </div>
    </motion.div>
);

export const XpShop = () => {
    const { progress, loading: progressLoading, purchaseItem } = useProgress();
    const [items, setItems] = useState<ShopItem[]>([]);
    const [loadingItems, setLoadingItems] = useState(true);
    const [purchaseError, setPurchaseError] = useState<string | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await apiService.getShopItems();
                setItems(data);
            } catch (err) {
                console.error('Failed to fetch shop items', err);
            } finally {
                setLoadingItems(false);
            }
        };
        fetchItems();
    }, []);

    const handlePurchase = async (itemId: string) => {
        setPurchaseError(null);
        try {
            await purchaseItem(itemId);
        } catch (err: any) {
            setPurchaseError(err.message || 'Purchase failed');
        }
    };

    if (progressLoading || loadingItems) return <LoadingSpinner />;
    if (!progress) return <div>Error loading profile</div>;

    return (
        <PageTransition className="max-w-6xl mx-auto p-6">
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">XP Reward Shop</h1>
                    <p className="text-gray-600 text-lg">Spend your hard-earned XP on upgrades and themes.</p>
                </div>
                <div className="bg-yellow-50 px-6 py-4 rounded-2xl border-2 border-yellow-100 flex items-center gap-4">
                    <div className="text-3xl">⚡</div>
                    <div>
                        <div className="text-xs font-black uppercase tracking-widest text-yellow-700 opacity-60">Balance</div>
                        <div className="text-2xl font-black text-yellow-800">{progress.xpBalance} XP</div>
                    </div>
                </div>
            </header>

            {purchaseError && (
                <div className="mb-8 p-4 bg-red-50 border-2 border-red-100 text-red-600 rounded-xl font-bold">
                    ⚠️ {purchaseError}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map(item => (
                    <ShopItemCard
                        key={item.id}
                        item={item}
                        isPurchased={progress.purchasedItemIds?.includes(item.id)}
                        canAfford={progress.xpBalance >= item.price}
                        onPurchase={handlePurchase}
                    />
                ))}
            </div>
        </PageTransition>
    );
};
