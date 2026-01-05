import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'brilliant-clone-db';
const STORE_NAME = 'offline-progress';
const CONTENT_STORE = 'offline-content';

export interface OfflineProgress {
    problemId: string;
    userId: string;
    status: 'completed' | 'started';
    attempts: number;
    timestamp: number;
}

export class OfflineService {
    private db: Promise<IDBPDatabase>;

    constructor() {
        this.db = openDB(DB_NAME, 2, {
            upgrade(db, oldVersion) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'problemId' });
                }
                if (!db.objectStoreNames.contains(CONTENT_STORE)) {
                    db.createObjectStore(CONTENT_STORE, { keyPath: 'id' });
                }
            },
        });
    }

    async saveContent(id: string, data: any) {
        const db = await this.db;
        await db.put(CONTENT_STORE, { id, data, timestamp: Date.now() });
    }

    async getContent(id: string) {
        const db = await this.db;
        const entry = await db.get(CONTENT_STORE, id);
        return entry?.data;
    }

    async removeContent(id: string) {
        const db = await this.db;
        await db.delete(CONTENT_STORE, id);
    }

    async saveProgress(progress: OfflineProgress) {
        const db = await this.db;
        await db.put(STORE_NAME, progress);
    }

    async getProgress(problemId: string): Promise<OfflineProgress | undefined> {
        const db = await this.db;
        return db.get(STORE_NAME, problemId);
    }

    async getAllProgress(): Promise<OfflineProgress[]> {
        const db = await this.db;
        return db.getAll(STORE_NAME);
    }

    async clearProgress(problemId: string) {
        const db = await this.db;
        await db.delete(STORE_NAME, problemId);
    }

    async syncWithServer(userId: string) {
        const allProgress = await this.getAllProgress();
        const userProgress = allProgress.filter((p) => p.userId === userId);

        for (const progress of userProgress) {
            try {
                // Here we would call the actual API to sync
                // For now, we simulate a successful sync
                console.log(`Syncing progress for problem ${progress.problemId}`);
                // await api.saveProgress(progress);
                await this.clearProgress(progress.problemId);
            } catch (error) {
                console.error(`Failed to sync problem ${progress.problemId}`, error);
            }
        }
    }
}

export const offlineService = new OfflineService();
