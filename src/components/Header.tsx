@@ .. @@
 import { useAuth } from '../contexts/AuthContext';
 import { supabase } from '../lib/supabase';
+import SubscriptionBadge from './SubscriptionBadge';
 
@@ .. @@
           <div className="flex items-center space-x-4">
             <span className="text-gray-700">Olá, {user.user_metadata?.name || 'Usuário'}!</span>
+            <SubscriptionBadge />
             <button
@@ .. @@