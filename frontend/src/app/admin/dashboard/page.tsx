"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Trophy, Calendar, User, Store, Phone, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { api } from "@/src/services/api";
import { WinnerSession } from "@/src/types/api";

export default function Dashboard() {
  const [winners, setWinners] = useState<WinnerSession[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWinners = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        const response = await api.getWinners(token);
        
        setWinners(response.data);
        
      } catch (error: any) {
        if (error.message === "Unauthorized") {
           localStorage.removeItem("admin_token");
           router.push("/admin/login");
        } else {
           console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Navbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Trophy className="h-5 w-5 text-purple-600" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                Winners Dashboard
              </h1>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 hover:bg-red-50 gap-2 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-lg border-none overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-800">Recent Winners</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Overview of all prizes claimed</p>
              </div>
              <div className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-600 shadow-sm border border-gray-200">
                Total: {winners.length} records
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="w-[180px] font-semibold">
                      <div className="flex items-center gap-2"><Calendar className="h-3 w-3" /> Date</div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2"><User className="h-3 w-3" /> User</div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2"><Store className="h-3 w-3" /> Store</div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2"><Trophy className="h-3 w-3" /> Prize Won</div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2"><Trophy className="h-3 w-3" /> Phone</div>
                    </TableHead>
                    <TableHead className="font-semibold text-right">
                      <div className="flex items-center justify-end gap-2"><Phone className="h-3 w-3" /> Email</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {winners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                        No winners found yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    winners.map((s) => (
                      <TableRow key={s.id} className="hover:bg-purple-50/30 transition-colors cursor-default">
                        <TableCell className="text-gray-600 font-medium text-xs">
                          {new Date(s.spunAt).toLocaleDateString()} 
                          <span className="text-gray-400 ml-1">
                            {new Date(s.spunAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900">{s.user.name}</div>
                          <div className="text-xs text-gray-400">{s.user.email}</div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                            {s.user.storeName}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: s.prize.color || '#a855f7' }}
                            />
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                              {s.prize.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-gray-600 font-mono text-xs">
                          {s.user.phone}
                        </TableCell>
                        <TableCell className="text-right text-gray-600 font-mono text-xs">
                          {s.user.email}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}