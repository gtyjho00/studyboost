@@ .. @@
 import React from 'react';
-import { BookOpen, Target, Trophy, Users, ArrowRight, Star, Zap, Brain } from 'lucide-react';
+import { BookOpen, Target, Trophy, Users, ArrowRight, Star, Zap, Brain, Crown } from 'lucide-react';
 import { Link } from 'react-router-dom';
 import { useAuth } from '../contexts/AuthContext';
@@ .. @@
               <Link
                 to="/dashboard"
                 className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center"
               >
                 Continuar Estudando
                 <ArrowRight className="ml-2 w-5 h-5" />
               </Link>
+              <Link
+                to="/pricing"
+                className="bg-white hover:bg-gray-50 text-indigo-600 font-semibold py-4 px-8 rounded-lg border-2 border-indigo-600 transition-all duration-200 transform hover:scale-105 flex items-center"
+              >
+                <Crown className="mr-2 w-5 h-5" />
+                Ver Planos Premium
+              </Link>
             </div>
           ) : (
             <div className="flex flex-col sm:flex-row gap-4">
@@ .. @@
               <Link
                 to="/signup"
                 className="bg-white hover:bg-gray-50 text-indigo-600 font-semibold py-4 px-8 rounded-lg border-2 border-indigo-600 transition-all duration-200 transform hover:scale-105"
               >
                 Criar Conta Grátis
               </Link>
+              <Link
+                to="/pricing"
+                className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center"
+              >
+                <Crown className="mr-2 w-5 h-5" />
+                Ver Planos
+              </Link>
             </div>
           )}
         </div>