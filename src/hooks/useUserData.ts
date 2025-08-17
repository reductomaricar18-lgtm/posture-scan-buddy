import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';
import { useAuth } from '../contexts/AuthContext';

interface UserData {
  name: string;
  email: string;
  createdAt: string;
  lastScan?: string;
  totalScans?: number;
  averageScore?: number;
}

interface ScanData {
  id: string;
  userId: string;
  imageUrl: string;
  score: number;
  recommendations: string[];
  createdAt: string;
}

export function useUserData() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [scans, setScans] = useState<ScanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data
  const fetchUserData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user scans
  const fetchUserScans = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const scansQuery = query(
        collection(db, 'scans'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(scansQuery);
      const scansData: ScanData[] = [];
      
      querySnapshot.forEach((doc) => {
        scansData.push({ id: doc.id, ...doc.data() } as ScanData);
      });
      
      setScans(scansData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch scans');
    } finally {
      setLoading(false);
    }
  };

  // Update user data
  const updateUserData = async (updates: Partial<UserData>) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      await updateDoc(doc(db, 'users', currentUser.uid), updates);
      
      // Refresh user data
      await fetchUserData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add new scan
  const addScan = async (scanData: Omit<ScanData, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const newScan: Omit<ScanData, 'id'> = {
        ...scanData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
      };

      // Add scan to Firestore (you'll need to implement this)
      // const docRef = await addDoc(collection(db, 'scans'), newScan);
      
      // Refresh scans
      await fetchUserScans();
      
      // Update user stats
      await updateUserData({
        lastScan: newScan.createdAt,
        totalScans: (userData?.totalScans || 0) + 1,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add scan');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
      fetchUserScans();
    }
  }, [currentUser]);

  return {
    userData,
    scans,
    loading,
    error,
    fetchUserData,
    fetchUserScans,
    updateUserData,
    addScan,
  };
} 