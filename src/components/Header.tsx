@@ .. @@
 import { Menu, X, BookOpen, User, LogOut } from 'lucide-react';
 import { useAuth } from '../contexts/AuthContext';
 import { Link } from 'react-router-dom';
+import { SubscriptionStatus } from './SubscriptionStatus';

 export function Header() {
@@ .. @@
           <div className="hidden md:flex items-center space-x-8">
             <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors">Início</Link>
+            <Link to="/pricing" className="text-gray-700 hover:text-indigo-600 transition-colors">Planos</Link>
             {user ? (
               <>
                 <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors">Dashboard</Link>
@@ .. @@
             <div className="flex flex-col space-y-4">
               <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors">Início</Link>
+              <Link to="/pricing" className="text-gray-700 hover:text-indigo-600 transition-colors">Planos</Link>
               {user ? (
                 <>
                   <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors">Dashboard</Link>
@@ .. @@
         </div>
       )}
+      
+      {user && (
+        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
+          <SubscriptionStatus />
+        </div>
+      )}
     </header>
   );
 }