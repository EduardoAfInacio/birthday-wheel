"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Trophy, Calendar, User, Store, Phone, Loader2, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/card";
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

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  
  const ITEMS_PER_PAGE = 6; 

  const router = useRouter();

  useEffect(() => {
    const fetchWinners = async () => {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      try {
        const response = await api.getWinners(token, page, ITEMS_PER_PAGE);
        
        setWinners(response.data);
        setTotalPages(response.meta.lastPage);
        setTotalRecords(response.meta.total);
        
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
  }, [router, page]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading && page === 1 && winners.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
        <div className="bg-white/90 p-4 rounded-full shadow-xl">
            <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col">
      
      {/* Header */}
      <header className="w-full px-4 pt-4 pb-0">
        <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur rounded-2xl shadow-lg px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Trophy className="h-5 w-5 text-purple-600" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                Winners Dashboard
              </h1>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 hover:bg-red-50 gap-2 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="shadow-2xl border-none overflow-hidden bg-white/95 backdrop-blur h-full flex flex-col">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-800">Recent Winners</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Overview of all prizes claimed</p>
              </div>
              <div className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-600 shadow-sm border border-gray-200 self-start">
                Total: {totalRecords} records
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 relative flex-1">
            {loading && (
              <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
                <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
              </div>
            )}

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="w-[140px] font-semibold pl-4">
                      <div className="flex items-center gap-2"><Calendar className="h-3 w-3" /> Date</div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2"><User className="h-3 w-3" /> User</div>
                    </TableHead>
                    <TableHead className="font-semibold">
                      <div className="flex items-center gap-2"><Trophy className="h-3 w-3" /> Prize</div>
                    </TableHead>
                    {/* (hidden md:table-cell) */}
                    <TableHead className="font-semibold hidden md:table-cell">
                      <div className="flex items-center gap-2"><Store className="h-3 w-3" /> Store</div>
                    </TableHead>
                    <TableHead className="font-semibold hidden md:table-cell">
                      <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> Contact</div>
                    </TableHead>
                    <TableHead className="font-semibold text-right pr-4 hidden lg:table-cell">
                      <div className="flex items-center justify-end gap-2"><Mail className="h-3 w-3" /> Email</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {winners.length === 0 && !loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                        No winners found yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    winners.map((s) => (
                      <TableRow key={s.id} className="hover:bg-purple-50/30 transition-colors cursor-default">
                        {/* Date */}
                        <TableCell className="text-gray-600 font-medium text-xs pl-4 whitespace-nowrap">
                          {new Date(s.spunAt).toLocaleDateString()} 
                          <div className="text-gray-400 text-[10px]">
                            {new Date(s.spunAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </TableCell>
                        
                        {/* (Name + Email in mobile) */}
                        <TableCell>
                          <div className="font-medium text-gray-900 line-clamp-1">{s.user.name}</div>
                          <div className="text-xs text-gray-400 md:hidden line-clamp-1">{s.user.email}</div>
                        </TableCell>

                        {/* Prêmio */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full shrink-0" 
                              style={{ backgroundColor: s.prize.color || '#a855f7' }}
                            />
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 whitespace-nowrap">
                              {s.prize.name}
                            </span>
                          </div>
                        </TableCell>

                        {/*(Hidden Mobile) */}
                        <TableCell className="hidden md:table-cell">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
                            {s.user.storeName}
                          </span>
                        </TableCell>

                        {/*(Hidden Mobile) */}
                        <TableCell className="text-gray-600 font-mono text-xs hidden md:table-cell">
                          {s.user.phone}
                        </TableCell>

                        {/*(Hidden Tablet/Mobile) */}
                        <TableCell className="text-right text-gray-600 font-mono text-xs pr-4 hidden lg:table-cell">
                          {s.user.email}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>

          {/* Footer Fixo */}
          <CardFooter className="flex justify-between items-center bg-gray-50/50 p-4 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              Page {page} of {totalPages || 1}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={page <= 1 || loading}
                className="h-8 px-3 text-xs"
              >
                <ChevronLeft className="h-3 w-3 mr-1" />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={page >= totalPages || loading}
                className="h-8 px-3 text-xs"
              >
                Next
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}