import React from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/ui/PageTransition';
import ClanDashboard from '../features/community/ClanDashboard';
import SocialFeed from '../features/community/SocialFeed';

const CommunityHub: React.FC = () => {
    return (
        <PageTransition className="max-w-7xl mx-auto p-6 md:p-10">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Main Content: Clan Hub */}
                <div className="flex-1 lg:w-2/3">
                    <ClanDashboard />
                </div>

                {/* Sidebar: Social Feed */}
                <div className="w-full lg:w-96">
                    <SocialFeed />
                </div>
            </div>
        </PageTransition>
    );
};

export default CommunityHub;
