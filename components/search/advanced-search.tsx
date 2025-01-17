import React, { useCallback, useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from 'lodash';  // Changed to use full lodash import
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchResult {
  id: string;
  type: 'user' | 'post' | 'group';
  title: string;
  subtitle: string;
  image?: string;
}

export function AdvancedSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    type: 'all',
    date: 'any',
    category: 'all'
  });

  const handleSearch = useCallback(async () => {  // Removed unused parameter
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setResults([
        {
          id: '1',
          type: 'post',
          title: 'Sample Result',
          subtitle: 'Sample description'
        }
      ]);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) {
      const debouncedSearch = debounce(handleSearch, 300);
      debouncedSearch();
      return () => {
        debouncedSearch.cancel();
      };
    } else {
      setResults([]);
    }
  }, [query, handleSearch]);

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Vicharcha..."
          className="w-full pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setQuery('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Selected Filters */}
      <div className="flex flex-wrap gap-2">
        {selectedFilters.map(filter => (
          <Badge
            key={filter}
            variant="secondary"
            className="cursor-pointer"
            onClick={() => setSelectedFilters(prev => 
              prev.filter(f => f !== filter)
            )}
          >
            {filter}
            <X className="ml-1 h-3 w-3" />
          </Badge>
        ))}
      </div>

      <div className="flex gap-4">
        <Select
          value={filters.type}
          onValueChange={(value: string) => setFilters({ ...filters, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="posts">Posts</SelectItem>
            <SelectItem value="people">People</SelectItem>
            <SelectItem value="groups">Groups</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.date}
          onValueChange={(value) => setFilters({ ...filters, date: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.category}
          onValueChange={(value) => setFilters({ ...filters, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="tech">Technology</SelectItem>
            <SelectItem value="lifestyle">Lifestyle</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search Results */}
      {isLoading ? (
        <div className="flex justify-center p-4">
          <Spinner className="h-6 w-6" />
        </div>
      ) : (
        results.length > 0 && (
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {results.map(result => (
                <div
                  key={result.id}
                  className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer"
                >
                  {/* Result item content */}
                </div>
              ))}
            </div>
          </ScrollArea>
        )
      )}
    </div>
  );
}
